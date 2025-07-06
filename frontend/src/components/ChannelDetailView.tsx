import React, { useState } from 'react';
import { 
  Facebook, Globe, TrendingUp, ShoppingCart, 
  BarChart2, TrendingDown, Activity,
  AlertCircle, CheckCircle, XCircle, Eye, Target, Percent, DollarSign, Users
} from 'lucide-react';
import TrendChart from './TrendChart';
import KPICard from './KPICard';
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
  isConnected?: boolean;
}

const ChannelDetailView: React.FC<ChannelDetailViewProps> = ({
  channel,
  data,
  selectedAccounts,
  onAccountFilterChange,
  isConnected = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'charts' | 'accounts' | 'campaigns' | 'trends' | 'insights'>('overview');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'overview' | 'metrics' | 'charts' | 'accounts' | 'campaigns' | 'trends' | 'insights');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'meta':
        return <Facebook className="w-5 h-5" />;
      case 'google':
        return <Globe className="w-5 h-5" />;
      case 'tiktok':
        return <TrendingUp className="w-5 h-5" />;
      case 'woocommerce':
        return <ShoppingCart className="w-5 h-5" />;
      default:
        return <BarChart2 className="w-5 h-5" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'meta':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'google':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'tiktok':
        return 'text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800';
      case 'woocommerce':
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info':
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getChannelKPIs = () => {
    switch (channel.toLowerCase()) {
      case 'meta':
        return [
          {
            title: 'Impressions',
            value: data.overview.impressions?.toLocaleString() || '0',
            change: data.overview.impressionsChange,
            status: data.overview.impressionsChange >= 0 ? 'normal' : 'warning',
            icon: <Eye />
          },
          {
            title: 'CTR',
            value: `${data.overview.ctr?.toFixed(2)}%`,
            change: data.overview.ctrChange,
            status: data.overview.ctrChange >= 0 ? 'normal' : 'warning',
            icon: <Percent />
          },
          {
            title: 'CPA',
            value: `${data.overview.cpa?.toLocaleString()}đ`,
            change: data.overview.cpaChange,
            status: data.overview.cpaChange <= 0 ? 'normal' : 'warning',
            icon: <DollarSign />
          },
          {
            title: 'Conversions',
            value: data.overview.conversions?.toLocaleString() || '0',
            change: data.overview.conversionsChange,
            status: data.overview.conversionsChange >= 0 ? 'normal' : 'warning',
            icon: <Target />
          }
        ];

      case 'google':
        return [
          {
            title: 'Sessions',
            value: data.overview.impressions?.toLocaleString() || '0',
            change: data.overview.impressionsChange,
            status: data.overview.impressionsChange >= 0 ? 'normal' : 'warning',
            icon: <BarChart2 />
          },
          {
            title: 'Page Views',
            value: data.overview.clicks?.toLocaleString() || '0',
            change: data.overview.clicksChange,
            status: data.overview.clicksChange >= 0 ? 'normal' : 'warning',
            icon: <Eye />
          },
          {
            title: 'Avg Session Duration',
            value: `${data.overview.ctr?.toFixed(1)} phút`,
            change: data.overview.ctrChange,
            status: data.overview.ctrChange >= 0 ? 'normal' : 'warning',
            icon: <Users />
          },
          {
            title: 'Transactions',
            value: data.overview.conversions?.toLocaleString() || '0',
            change: data.overview.conversionsChange,
            status: data.overview.conversionsChange >= 0 ? 'normal' : 'warning',
            icon: <Target />
          }
        ];

      case 'tiktok':
        return [
          {
            title: 'Total Views',
            value: data.overview.impressions?.toLocaleString() || '0',
            change: data.overview.impressionsChange,
            status: data.overview.impressionsChange >= 0 ? 'normal' : 'warning',
            icon: <Eye />
          },
          {
            title: 'Engagement Rate',
            value: `${data.overview.ctr?.toFixed(2)}%`,
            change: data.overview.ctrChange,
            status: data.overview.ctrChange >= 0 ? 'normal' : 'warning',
            icon: <Users />
          },
          {
            title: 'Total Likes',
            value: data.overview.clicks?.toLocaleString() || '0',
            change: data.overview.clicksChange,
            status: data.overview.clicksChange >= 0 ? 'normal' : 'warning',
            icon: <TrendingUp />
          },
          {
            title: 'Total Videos',
            value: data.overview.conversions?.toString() || '0',
            change: data.overview.conversionsChange,
            status: data.overview.conversionsChange >= 0 ? 'normal' : 'warning',
            icon: <BarChart2 />
          }
        ];

      case 'woocommerce':
        return [
          {
            title: 'Revenue',
            value: `${data.overview.revenue?.toLocaleString()}đ`,
            change: data.overview.revenueChange,
            status: data.overview.revenueChange >= 0 ? 'normal' : 'warning',
            icon: <DollarSign />
          },
          {
            title: 'Orders',
            value: data.overview.conversions?.toString() || '0',
            change: data.overview.conversionsChange,
            status: data.overview.conversionsChange >= 0 ? 'normal' : 'warning',
            icon: <Target />
          },
          {
            title: 'Avg Order Value',
            value: `${data.overview.cpa?.toLocaleString()}đ`,
            change: data.overview.cpaChange,
            status: data.overview.cpaChange >= 0 ? 'normal' : 'warning',
            icon: <ShoppingCart />
          },
          {
            title: 'Total Products',
            value: data.overview.impressions?.toString() || '0',
            change: data.overview.impressionsChange,
            status: data.overview.impressionsChange >= 0 ? 'normal' : 'warning',
            icon: <BarChart2 />
          }
        ];

      default:
        return [];
    }
  };

  const getChannelCharts = () => {
    switch (channel.toLowerCase()) {
      case 'meta':
        return [
          { title: 'Impressions (7 ngày)', data: data.trends.impressions, color: '#1877F2' },
          { title: 'CTR (7 ngày)', data: data.trends.ctr, color: '#42A5F5' },
          { title: 'CPA (7 ngày)', data: data.trends.spend, color: '#EF4444' },
          { title: 'Conversions (7 ngày)', data: data.trends.conversions, color: '#10B981' }
        ];

      case 'google':
        return [
          { title: 'Sessions (7 ngày)', data: data.trends.impressions, color: '#4285F4' },
          { title: 'Page Views (7 ngày)', data: data.trends.clicks, color: '#34A853' },
          { title: 'Session Duration (7 ngày)', data: data.trends.ctr, color: '#FBBC05' },
          { title: 'Transactions (7 ngày)', data: data.trends.conversions, color: '#EA4335' }
        ];

      case 'tiktok':
        return [
          { title: 'Views (7 ngày)', data: data.trends.impressions, color: '#FF0050' },
          { title: 'Engagement (7 ngày)', data: data.trends.ctr, color: '#25F4EE' },
          { title: 'Likes (7 ngày)', data: data.trends.clicks, color: '#FE2C55' },
          { title: 'Shares (7 ngày)', data: data.trends.conversions, color: '#161823' }
        ];

      case 'woocommerce':
        return [
          { title: 'Revenue (7 ngày)', data: data.trends.revenue, color: '#7C3AED' },
          { title: 'Orders (7 ngày)', data: data.trends.conversions, color: '#10B981' },
          { title: 'Avg Order Value (7 ngày)', data: data.trends.spend, color: '#F59E0B' },
          { title: 'Total Products (7 ngày)', data: data.trends.impressions, color: '#6366F1' }
        ];

      default:
        return [];
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
            {/* Channel Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getChannelColor(channel)}`}>
                  {getChannelIcon(channel)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {channel} Performance
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isConnected 
                      ? 'Dữ liệu được cập nhật lần cuối: ' + new Date().toLocaleString('vi-VN')
                      : 'Chưa kết nối - Kết nối để xem dữ liệu thực'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                  isConnected 
                    ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
                }`}>
                  {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                </span>
              </div>
            </div>

            {!isConnected ? (
              /* Not Connected State */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getChannelIcon(channel)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa kết nối {channel}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Kết nối {channel} để xem dữ liệu thực và insights chi tiết.
                </p>
                <button className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition">
                  Kết nối ngay
                </button>
              </div>
            ) : (
              <>
                {/* Primary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {getChannelKPIs().map((kpi, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                          <div className="text-accent">
                            {kpi.icon}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm ${
                          kpi.status === 'normal' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpi.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{Math.abs(kpi.change)}%</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {kpi.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {kpi.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getChannelCharts().map((chart, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {chart.title}
                      </h3>
                      <TrendChart title={chart.title} data={chart.data} channels={[{ name: chart.title, color: chart.color, dataKey: 'value', visible: true }]} />
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Insights & Khuyến Nghị
                  </h3>
                  <div className="space-y-3">
                    {data.insights.map((insight, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      case 'metrics':
        return <ChannelDetailMetrics overview={data.overview} />;
      
      case 'charts':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getChannelCharts().map((chart, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {chart.title}
                  </h3>
                  <TrendChart title={chart.title} data={chart.data} channels={[{ name: chart.title, color: chart.color, dataKey: 'value', visible: true }]} />
                </div>
              ))}
            </div>
          </div>
        );
      
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
