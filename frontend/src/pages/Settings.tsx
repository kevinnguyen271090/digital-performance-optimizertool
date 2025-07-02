import React, { useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Helmet } from 'react-helmet';
import { useOutletContext } from 'react-router-dom';
import PlatformButton from '../components/settings/PlatformButton';
import GoogleServiceSelectionModal from '../components/settings/GoogleServiceSelectionModal';
import GoogleAccountSelector from '../components/settings/GoogleAccountSelector';
import WooCommerceConnectModal from '../components/settings/WooCommerceConnectModal';
import MetaConnectModal from '../components/settings/MetaConnectModal';
import GoogleSheetsConnector from '../components/google-sheets/GoogleSheetsConnector';
import { useGoogleAccountConnect } from '../hooks/useGoogleAccountConnect';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import ConnectedAccountsTab from '../components/settings/ConnectedAccountsTab';
import { useOrganization } from '../hooks/useOrganization';

interface OutletContextType {
  session: Session | null;
}

const Settings: React.FC = React.memo(() => {
  const { session } = useOutletContext<OutletContextType>();
  const { t } = useTranslation();
  
  const {
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
    setSelectedGoogleService,
    setShowGoogleServiceSelectionModal,
    setShowGoogleAccountSelectorModal
  } = useSettings(session);

  // Google OAuth hook
  const { accessToken, profile, login: triggerGoogleLogin } = useGoogleAccountConnect('https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/webmasters.readonly');

  // Memoize platforms để tránh re-render không cần thiết
  const memoizedPlatforms = useMemo(() => platforms, [platforms]);

  const [activeTab, setActiveTab] = useState<'connect' | 'accounts'>('connect');

  const { organizations, fetchOrganizations } = useOrganization();
  React.useEffect(() => {
    if (session?.user?.id) {
      fetchOrganizations(session.user.id);
    }
  }, [session?.user?.id, fetchOrganizations]);

  // Handler functions for different platforms
  const handleWooCommerceSuccess = async (credentials: { storeUrl: string; consumerKey: string; consumerSecret: string }) => {
    const success = await saveConnection('woocommerce', credentials);
    if (success) {
      handleModalClose();
    }
  };

  const handleMetaSuccess = async (response: any) => {
    const connectionData = { access_token: response.accessToken, account_id: response.accountID };
    const success = await saveConnection('meta', connectionData, undefined, { profile: response });
    if (success) {
      handleModalClose();
    }
  };

  const handleMetaFail = (error: any) => {
    console.error('Meta connection failed:', error);
    alert('Kết nối Meta thất bại. Vui lòng thử lại.');
  };

  const handleGoogleSheetsSuccess = async (data: any) => {
    const success = await saveConnection('google-sheets', data);
    if (success) {
      handleModalClose();
    }
  };

  // Hàm mới: gọi xác thực Google trước khi mở modal chọn tài khoản
  const handleGoogleServiceSelectWithAuth = (service: any) => {
    triggerGoogleLogin();
    handleGoogleServiceSelect(service);
  };

  const userId = session?.user?.id || '';
  const organizationId = organizations.length > 0 ? organizations[0].organization_id : '';

  return (
    <>
      <Helmet>
        <title>Cài đặt - Digital Performance Optimizer</title>
        <meta name="description" content="Quản lý kết nối và cài đặt tài khoản" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('settings.title', 'Cài đặt')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {t('settings.subtitle', 'Quản lý kết nối nền tảng và cài đặt tài khoản')}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b">
              <button
                className={`px-4 py-2 font-semibold border-b-2 transition-all ${activeTab === 'connect' ? 'border-accent text-accent' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('connect')}
              >
                Kết nối nền tảng
              </button>
              <button
                className={`px-4 py-2 font-semibold border-b-2 transition-all ${activeTab === 'accounts' ? 'border-accent text-accent' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('accounts')}
              >
                Tài khoản đã kết nối
              </button>
            </div>

            {/* Tab content */}
            {activeTab === 'connect' ? (
              isLoadingConnections ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {memoizedPlatforms.map((platform) => (
                    <PlatformButton
                      key={platform.id}
                      platform={platform}
                      onClick={() => handleConnect(platform)}
                    />
                  ))}
                </div>
              )
            ) : (
              session?.user?.id && <ConnectedAccountsTab userId={session.user.id} />
            )}
          </div>
        </div>

        {/* Modals */}
        <GoogleServiceSelectionModal
          isOpen={showGoogleServiceSelectionModal}
          onClose={handleModalClose}
          onSelectService={handleGoogleServiceSelectWithAuth}
        />

        {showGoogleAccountSelectorModal && selectedGoogleService && (
          <GoogleAccountSelector
            isOpen={showGoogleAccountSelectorModal}
            onClose={handleModalClose}
            onConfirm={handleGoogleAccountsSelected}
            userEmail={profile?.email || session?.user?.email || 'user@example.com'}
            service={selectedGoogleService}
            accessToken={accessToken}
            profile={profile}
            userId={userId}
            organizationId={organizationId}
          />
        )}

        <WooCommerceConnectModal
          isOpen={showWooModal}
          onClose={handleModalClose}
          onConnect={handleWooCommerceSuccess}
        />

        <MetaConnectModal
          open={showMetaModal}
          onClose={handleModalClose}
          onSuccess={handleMetaSuccess}
          onFail={handleMetaFail}
          appId={import.meta.env.VITE_FACEBOOK_APP_ID || ''}
        />

        <GoogleSheetsConnector
          open={showGoogleSheetsModal}
          onClose={handleModalClose}
          onSuccess={handleGoogleSheetsSuccess}
        />
      </div>
    </>
  );
});

export default Settings;
