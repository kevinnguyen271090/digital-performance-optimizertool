import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp as TrendingUpIcon } from "lucide-react";
import ChannelSubTabs from "./ChannelSubTabs";
import ChannelDetailView from "../ChannelDetailView";
import { ExecutiveDashboard } from "./ExecutiveDashboard";
import { PlatformConnection, DashboardView } from "../../types/dashboard";
import { useTranslation } from 'react-i18next';
import { zeroExecutiveData, zeroPlatformData, zeroConnectedPlatforms, createChannelDetailData } from "../../utils/mockData";
// import { useDashboardData } from "../hooks/useDashboardData";

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

const channelLabelMap: Record<string, string> = {
  meta: 'Meta',
  google: 'Google',
  tiktok: 'TikTok',
  woocommerce: 'WooCommerce'
};

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

  // Memo hóa dateRange object để tránh tạo mới mỗi lần render
  const dateRange = useMemo(() => {
    if (!dateRangeString) return undefined;
    const [start, end] = dateRangeString.split(' - ');
    return {
      from: new Date(start),
      to: new Date(end)
    };
  }, [dateRangeString]);

  // Nếu user chưa connect platform, dùng mock data = 0
  const dataToShow = hasConnectedPlatforms ? platformData : zeroPlatformData;
  const platformsToShow = hasConnectedPlatforms ? connectedPlatforms : zeroConnectedPlatforms;

  // Danh sách kênh đã kết nối
  const channelTabs = useMemo(() =>
    platformsToShow.map(p => ({
      key: p.platform,
      label: channelLabelMap[p.platform] || p.platform.charAt(0).toUpperCase() + p.platform.slice(1)
    })),
    [platformsToShow]
  );

  // State: kênh đang active
  const [activeChannel, setActiveChannel] = useState(channelTabs[0]?.key || '');

  React.useEffect(() => {
    if (channelTabs.length > 0 && !channelTabs.find(tab => tab.key === activeChannel)) {
      setActiveChannel(channelTabs[0].key);
    }
  }, [channelTabs, activeChannel]);

  switch (currentView) {
    case 'executive':
      return (
        <ExecutiveDashboard 
          data={executiveData}
          dateRange={dateRange}
        />
      );

    case 'executive-detail':
      return (
        <ExecutiveDashboard 
          data={executiveData}
          dateRange={dateRange}
        />
      );

    case 'channels':
      return (
        <div className="space-y-6">
          {channelTabs.length > 0 ? (
            <>
              <ChannelSubTabs
                channels={channelTabs}
                activeChannel={activeChannel}
                onChange={setActiveChannel}
              />
              {(() => {
                const p = platformsToShow.find(p => p.platform === activeChannel);
                if (!p) return null;
                const channelData = (dataToShow as any)[p.platform];
                if (!channelData || Object.keys(channelData).length === 0) return null;
                const channelDetailData = createChannelDetailData(p.platform, channelData);
                return (
                  <ChannelDetailView
                    key={p.platform}
                    channel={p.platform}
                    data={channelDetailData}
                    selectedAccounts={selectedAccounts[p.platform] || []}
                    onAccountFilterChange={(accountIds) => onAccountSelectionChange(p.platform, accountIds)}
                    isConnected={p.status === 'connected'}
                  />
                );
              })()}
            </>
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