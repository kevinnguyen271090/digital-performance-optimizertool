import React from "react";
import { Link } from "react-router-dom";
import { Layers, TrendingUp as TrendingUpIcon } from "lucide-react";
import ExecutiveSummary from "../ExecutiveSummary";
import PlatformDashboard from "../PlatformDashboard";
import ChannelDetailView from "../ChannelDetailView";
import { PlatformConnection, DashboardView } from "../../types/dashboard";
import { useTranslation } from 'react-i18next';

interface DashboardContentProps {
  currentView: DashboardView;
  connectedPlatforms: PlatformConnection[];
  platformData: {[key: string]: any};
  hasConnectedPlatforms: boolean;
  selectedAccounts: {[key: string]: string[]};
  onAccountSelectionChange: (platform: string, accountIds: string[]) => void;
  executiveData: any;
  channelDetailData: any;
  dateRangeString: string;
}

const DashboardContent: React.FC<DashboardContentProps> = React.memo(({
  currentView,
  connectedPlatforms,
  platformData,
  hasConnectedPlatforms,
  selectedAccounts,
  onAccountSelectionChange,
  executiveData,
  channelDetailData,
  dateRangeString
}) => {
  const { t } = useTranslation();

  // Debugging logs to inspect incoming props
  console.log("DashboardContent Props:", { currentView, connectedPlatforms, platformData, hasConnectedPlatforms });

  switch (currentView) {
    case 'executive':
      return (
        <ExecutiveSummary 
          data={executiveData}
          dateRange={dateRangeString}
        />
      );

    case 'platforms':
      return (
        <div className="space-y-6">
          {hasConnectedPlatforms && connectedPlatforms.length > 0 ? (
            connectedPlatforms.map((platform) => {
              const dataForPlatform = platformData[platform.platform];
              // Only render if data for the platform exists
              if (!dataForPlatform || Object.keys(dataForPlatform).length === 0) {
                console.warn(`No data or empty data for platform: ${platform.platform}`);
                return (
                   <div key={platform.platform} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                     <h3 className="font-bold text-lg capitalize">{platform.platform}</h3>
                     <p className="text-gray-500 mt-2">{t('dashboard.no_data_platform', 'Không có dữ liệu để hiển thị cho nền tảng này.')}</p>
                   </div>
                )
              }
              return (
                <PlatformDashboard
                  key={platform.platform}
                  platform={platform.platform}
                  data={dataForPlatform}
                  isConnected={platform.status === 'connected'}
                  lastSync={platform.lastSync}
                />
              );
            })
          ) : (
            <div className="text-center py-12">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('dashboard.no_platform_connected', 'Chưa kết nối nền tảng nào')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('dashboard.connect_platforms', 'Kết nối các nền tảng để xem dữ liệu theo từng platform')}
              </p>
              <Link
                to="/settings"
                className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition"
              >
                {t('dashboard.connect_platform', 'Kết nối nền tảng')}
              </Link>
            </div>
          )}
        </div>
      );

    case 'channels':
      return (
        <div className="space-y-6">
          {hasConnectedPlatforms && connectedPlatforms.length > 0 ? (
             connectedPlatforms.map(p => {
              const channelData = platformData[p.platform];
              // Only render if there's data for that channel
              if (!channelData || Object.keys(channelData).length === 0) {
                 console.warn(`No data or empty data for channel view: ${p.platform}`);
                 return null;
              }

              return (
                  <ChannelDetailView
                      key={p.platform}
                      channel={p.platform} // Use the actual platform name
                      data={channelData} // Use the real data
                      selectedAccounts={selectedAccounts[p.platform] || []}
                      onAccountFilterChange={(accountIds) => onAccountSelectionChange(p.platform, accountIds)}
                  />
              );
          })
          ) : (
            <div className="text-center py-12">
              <TrendingUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('dashboard.no_channel_data', 'Chưa có dữ liệu kênh')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('dashboard.connect_platforms_channel', 'Kết nối các nền tảng để xem phân tích chi tiết từng kênh')}
              </p>
              <Link
                to="/settings"
                className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition"
              >
                {t('dashboard.connect_platform', 'Kết nối nền tảng')}
              </Link>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
});

export default DashboardContent; 