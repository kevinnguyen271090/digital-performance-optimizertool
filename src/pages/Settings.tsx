import React, { useMemo } from 'react';
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
    saveConnection
  } = useSettings(session);

  // Google OAuth hook
  const { accessToken, profile, login: triggerGoogleLogin } = useGoogleAccountConnect('https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/webmasters.readonly');

  // Memoize platforms để tránh re-render không cần thiết
  const memoizedPlatforms = useMemo(() => platforms, [platforms]);

  // Handler functions for different platforms
  const handleWooCommerceSuccess = async (credentials: { storeUrl: string; consumerKey: string; consumerSecret: string }) => {
    const success = await saveConnection('woocommerce', credentials);
    if (success) {
      handleModalClose();
    }
  };

  const handleMetaSuccess = async (response: any) => {
    const success = await saveConnection('meta', { access_token: response.accessToken }, undefined, { profile: response });
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

            {isLoadingConnections ? (
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
            )}
          </div>
        </div>

        {/* Modals */}
        <GoogleServiceSelectionModal
          isOpen={showGoogleServiceSelectionModal}
          onClose={handleModalClose}
          onSelectService={handleGoogleServiceSelect}
        />

        {showGoogleAccountSelectorModal && selectedGoogleService && (
          <GoogleAccountSelector
            isOpen={showGoogleAccountSelectorModal}
            onClose={handleModalClose}
            onConfirm={handleGoogleAccountsSelected}
            userEmail={profile?.email || 'user@example.com'}
            service={selectedGoogleService}
            accessToken={accessToken}
            profile={profile}
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
          appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
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
