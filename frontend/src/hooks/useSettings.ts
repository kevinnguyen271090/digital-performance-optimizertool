import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Platform } from '../components/settings/types';
import { platformsData } from '../components/settings/platformData';
import { GoogleServiceType } from '../components/settings/GoogleServiceSelectionModal';
import { getOrganizationIdByUser } from '../utils/organization';

export const useSettings = (session: Session | null) => {
  const [platforms, setPlatforms] = useState<Platform[]>(
    platformsData.flatMap(category => category.platforms)
  );
  
  const [showGoogleServiceSelectionModal, setShowGoogleServiceSelectionModal] = useState(false);
  const [showGoogleAccountSelectorModal, setShowGoogleAccountSelectorModal] = useState(false);
  const [selectedGoogleService, setSelectedGoogleService] = useState<any>(null);
  
  const [showWooModal, setShowWooModal] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);

  const fetchConnectionStatuses = useCallback(async () => {
    if (!session?.user) return;
    setIsLoadingConnections(true);
    try {
      const { data, error } = await supabase.from('connections').select('platform, status, service, account_details, last_connected, last_sync');
      if (error) throw error;

      setPlatforms(prevPlatforms => prevPlatforms.map(p => ({
        ...p,
        status: data.find(conn => conn.platform === p.id)?.status as 'connected' | 'expired' | 'error' || p.status,
      })));

    } catch (error) {
      console.error('Error fetching connection statuses:', error);
    } finally {
      setIsLoadingConnections(false);
    }
  }, [session]);

  useEffect(() => {
    fetchConnectionStatuses();
  }, [fetchConnectionStatuses]);

  const handleModalClose = () => {
    setShowGoogleServiceSelectionModal(false);
    setShowGoogleAccountSelectorModal(false);
    setShowWooModal(false);
    setShowMetaModal(false);
    setSelectedGoogleService(null);
  };

  const saveConnection = useCallback(async (platform: string, connectionData: any, service?: GoogleServiceType, metadata?: any) => {
    if (!session?.user?.id) {
      alert("Lỗi: Không tìm thấy user session.");
      return false;
    }
    // Lấy organization_id của user
    const organization_id = await getOrganizationIdByUser(session.user.id);
    if (!organization_id) {
      alert('Không tìm thấy tổ chức của user.');
      return false;
    }
    try {
      const conflictKey = service ? 'user_id, platform, service' : 'user_id, platform';
      const upsertData: any = {
        user_id: session.user.id,
        organization_id,
        platform: platform,
        service: service,
        credentials: connectionData,
        status: 'connected',
        last_connected: new Date().toISOString(),
        account_identifier:
          platform === 'google' ? (connectionData.property_id || (metadata?.selected_accounts?.[0]?.propertyId)) :
          platform === 'woocommerce' ? connectionData.storeUrl :
          platform === 'meta' ? (connectionData.account_id || metadata?.profile?.id) :
          platform === 'tiktok' ? connectionData.account_id :
          undefined,
      };
      if (metadata) upsertData.metadata = metadata;
      const { error } = await supabase
        .from('connections')
        .insert(upsertData);
      if (error) {
        // Nếu là lỗi duplicate key, lấy user đã connect
        if (error.message.includes('duplicate key') || error.message.includes('violates unique constraint')) {
          const { data: existed } = await supabase
            .from('connections')
            .select('user_id')
            .eq('platform', upsertData.platform)
            .eq('account_identifier', upsertData.account_identifier)
            .limit(1)
            .single();
          let email = '';
          if (existed && existed.user_id) {
            const { data: user } = await supabase
              .from('auth.users')
              .select('email')
              .eq('id', existed.user_id)
              .limit(1)
              .single();
            email = user?.email || '';
          }
          alert(`Tài khoản này đã được user khác kết nối${email ? ' - ' + email : ''}!`);
        } else {
          alert(`Lưu kết nối ${platform} ${service || ''} thất bại: ${error.message}`);
        }
        return false;
      }
      alert(`Đã kết nối thành công với ${platform} ${service || ''}!`);
      await fetchConnectionStatuses();
      handleModalClose();
      return true;
    } catch (error: any) {
      alert(`Lưu kết nối ${platform} ${service || ''} thất bại: ${error.message}`);
      return false;
    }
  }, [session, fetchConnectionStatuses]);

  const handleGoogleAccountsSelected = useCallback(async (accounts: any[], profile?: any, scopes?: string[]) => {
    if (!selectedGoogleService) return;
    // Chuẩn hóa dữ liệu account cho metadata
    const selected_accounts = accounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      propertyId: a.propertyId,
      accountId: a.accountId
    }));
    const metadata = {
      ...(profile ? { profile } : {}),
      ...(scopes ? { scopes } : {}),
      selected_accounts
    };
    
    const success = await saveConnection(
      'google', 
      { access_token: 'stored_in_metadata' }, 
      selectedGoogleService.id, 
      metadata
    );
    
    if (success) {
      setSelectedGoogleService(null);
    }
  }, [selectedGoogleService, saveConnection]);

  const handleGoogleServiceSelect = (service: any) => {
    setSelectedGoogleService(service);
    setShowGoogleServiceSelectionModal(false);
    setShowGoogleAccountSelectorModal(true);
  };

  const handleConnect = (platform: Platform) => {
    switch (platform.id) {
      case 'google':
        setShowGoogleServiceSelectionModal(true);
        break;
      case 'meta':
        setShowMetaModal(true);
        break;
      case 'woocommerce':
        setShowWooModal(true);
        break;
      case 'google-sheets':
        setShowGoogleSheetsModal(true);
        break;
      default:
        console.log('Platform not implemented:', platform.id);
    }
  };

  return {
    platforms,
    isLoadingConnections,
    showGoogleServiceSelectionModal,
    showGoogleAccountSelectorModal,
    showWooModal,
    showMetaModal,
    showGoogleSheetsModal,
    selectedGoogleService,
    handleModalClose,
    handleConnect,
    handleGoogleServiceSelect,
    handleGoogleAccountsSelected,
    saveConnection,
    fetchConnectionStatuses
  };
}; 