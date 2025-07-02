import React, { useState } from 'react';
import TrendChart from './TrendChart';
import ChannelDetailHeader from './channel-detail/ChannelDetailHeader';
import ChannelDetailMetrics from './channel-detail/ChannelDetailMetrics';
import ChannelDetailTable from './channel-detail/ChannelDetailTable';
import ChannelDetailInsights from './channel-detail/ChannelDetailInsights';

interface ChannelDetailViewProps {
  channel: string;
  data: {
    overview: {
      impressions: number;
      impressionsChange: number;
      clicks: number;
      clicksChange: number;
      ctr: number;
      ctrChange: number;
      spend: number;
      spendChange: number;
      conversions: number;
      conversionsChange: number;
      cpa: number;
      cpaChange: number;
      revenue: number;
      revenueChange: number;
      roas: number;
      roasChange: number;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      metrics: {
        impressions: number;
        clicks: number;
        ctr: number;
        spend: number;
        conversions: number;
        cpa: number;
        revenue: number;
        roas: number;
      };
      change: number;
    }>;
    campaigns: Array<{
      id: string;
      name: string;
      status: string;
      metrics: {
        impressions: number;
        clicks: number;
        ctr: number;
        spend: number;
        conversions: number;
        cpa: number;
        revenue: number;
        roas: number;
      };
      change: number;
    }>;
    trends: {
      impressions: any[];
      clicks: any[];
      ctr: any[];
      spend: any[];
      conversions: any[];
      revenue: any[];
    };
    insights: Array<{
      type: 'success' | 'warning' | 'info' | 'error';
      title: string;
      description: string;
      impact: string;
    }>;
  };
  selectedAccounts: string[];
  onAccountFilterChange: (accountIds: string[]) => void;
}

const ChannelDetailView: React.FC<ChannelDetailViewProps> = ({
  channel,
  data,
  selectedAccounts,
  onAccountFilterChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'campaigns' | 'trends' | 'insights'>('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'overview' | 'accounts' | 'campaigns' | 'trends' | 'insights');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ChannelDetailMetrics overview={data.overview} />;
      
      case 'accounts':
        return <ChannelDetailTable data={data.accounts} type="accounts" />;
      
      case 'campaigns':
        return <ChannelDetailTable data={data.campaigns} type="campaigns" />;
      
      case 'trends':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-4">Impressions & Clicks</h3>
                <TrendChart 
                  data={data.trends.impressions} 
                  title="Impressions"
                  channels={[{ name: "Impressions", color: "#1877F2", dataKey: "value", visible: true }]}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-4">Revenue & Spend</h3>
                <TrendChart 
                  data={data.trends.revenue} 
                  title="Revenue"
                  channels={[{ name: "Revenue", color: "#FFA726", dataKey: "value", visible: true }]}
                />
              </div>
            </div>
          </div>
        );
      
      case 'insights':
        return <ChannelDetailInsights insights={data.insights} />;
      
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
