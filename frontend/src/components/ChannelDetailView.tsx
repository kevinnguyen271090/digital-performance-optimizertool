import React, { useState } from 'react';
import ChannelDetailHeader from './channel-detail/ChannelDetailHeader';
import ChannelDetailMetrics from './channel-detail/ChannelDetailMetrics';
import ChannelDetailTable from './channel-detail/ChannelDetailTable';
import ChannelDetailInsights from './channel-detail/ChannelDetailInsights';
import ChannelDetailOverview from './channel-detail/ChannelDetailOverview';
import ChannelDetailCharts from './channel-detail/ChannelDetailCharts';
import ChannelDetailDemographics from './channel-detail/ChannelDetailDemographics';
import ChannelDetailFunnel from './channel-detail/ChannelDetailFunnel';
import ChannelDetailEngagement from './channel-detail/ChannelDetailEngagement';
import ChannelDetailPerformance from './channel-detail/ChannelDetailPerformance';
import ChannelDetailTrends from './channel-detail/ChannelDetailTrends';
import { ChannelDetailViewProps, ChannelTabType } from './channel-detail/types';

const ChannelDetailView: React.FC<ChannelDetailViewProps> = ({
  channel,
  data,
  selectedAccounts,
  onAccountFilterChange,
  isConnected = true
}) => {
  const [activeTab, setActiveTab] = useState<ChannelTabType>('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ChannelTabType);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ChannelDetailOverview channel={channel} data={data} isConnected={isConnected} />;
      
      case 'metrics':
        return <ChannelDetailMetrics overview={data.overview} />;
      
      case 'charts':
        return <ChannelDetailCharts channel={channel} trends={data.trends} />;
      
      case 'accounts':
        return <ChannelDetailTable data={data.accounts} type="accounts" />;
      
      case 'campaigns':
        return <ChannelDetailTable data={data.campaigns} type="campaigns" />;
      
      case 'trends':
        return <ChannelDetailTrends trends={data.trends} />;
      
      case 'insights':
        return <ChannelDetailInsights insights={data.insights} />;

      case 'demographics':
        return <ChannelDetailDemographics demographics={data.demographics} />;

      case 'funnel':
        return <ChannelDetailFunnel funnel={data.funnel} />;

      case 'engagement':
        return <ChannelDetailEngagement engagement={data.engagement} />;

      case 'performance':
        return <ChannelDetailPerformance performance={data.performance} />;
      
      default:
        return <ChannelDetailMetrics overview={data.overview} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border">
      <ChannelDetailHeader 
        channel={channel}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {renderTabContent()}
    </div>
  );
};

export default ChannelDetailView;
