import React, { useState } from 'react';
import { 
  Facebook, Globe, TrendingUp, ShoppingCart, 
  BarChart2, TrendingDown, Activity,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import TrendChart from './TrendChart';

interface ChannelData {
  channel: string;
  isConnected: boolean;
  metrics: {
    primary: {
      title: string;
      value: string | number;
      change: number;
      status: 'up' | 'down' | 'stable';
      icon: React.ReactNode;
    }[];
    secondary: {
      title: string;
      value: string | number;
      change: number;
      status: 'up' | 'down' | 'stable';
      icon: React.ReactNode;
    }[];
  };
  insights: {
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  charts: {
    title: string;
    data: any[];
    color: string;
  }[];
}

interface ChannelPerformanceTabsProps {
  channels: ChannelData[];
  isLoading?: boolean;
}

const ChannelPerformanceTabs: React.FC<ChannelPerformanceTabsProps> = ({
  channels,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState(0);

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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu kênh...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 p-4 min-w-max scroll-snap-x snap-x">
          {channels.map((channel, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-sm border-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-accent/50 snap-start
                ${activeTab === index
                  ? 'bg-accent text-white border-accent scale-105 shadow-lg border-b-4 border-b-yellow-400 relative'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-accent/10'}
                md:text-lg md:px-8 md:py-4 md:min-w-[200px]
              `}
              style={{
                boxShadow: activeTab === index ? '0 4px 16px 0 rgba(0,0,0,0.10)' : undefined,
              }}
            >
              {activeTab === index && (
                <span className="absolute left-2 top-2 animate-pulse text-yellow-300 text-xl">★</span>
              )}
              <span className="text-2xl md:text-3xl">{getChannelIcon(channel.channel)}</span>
              <span className="truncate max-w-[80px] md:max-w-[120px]">{channel.channel}</span>
              {!channel.isConnected && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Responsive: cuộn ngang, spacing lớn hơn trên mobile */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 768px) {
          .min-w-max > button { font-size: 1.1rem; padding: 0.75rem 1.5rem; min-width: 140px; margin-right: 0.5rem; }
        }
      `}</style>

      {/* Tab Content */}
      <div className="p-6 transition-all duration-300 animate-fade-in">
        {channels[activeTab] && (
          <div className="space-y-6">
            {/* Channel Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getChannelColor(channels[activeTab].channel)}`}>
                  {getChannelIcon(channels[activeTab].channel)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {channels[activeTab].channel} Performance
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {channels[activeTab].isConnected 
                      ? 'Dữ liệu được cập nhật lần cuối: ' + new Date().toLocaleString('vi-VN')
                      : 'Chưa kết nối - Kết nối để xem dữ liệu thực'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                  channels[activeTab].isConnected 
                    ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
                }`}>
                  {channels[activeTab].isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                </span>
              </div>
            </div>

            {!channels[activeTab].isConnected ? (
              /* Not Connected State */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getChannelIcon(channels[activeTab].channel)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa kết nối {channels[activeTab].channel}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Kết nối {channels[activeTab].channel} để xem dữ liệu thực và insights chi tiết.
                </p>
                <button className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition">
                  Kết nối ngay
                </button>
              </div>
            ) : (
              /* Connected State */
              <>
                {/* Primary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {channels[activeTab].metrics.primary.map((metric, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                          <div className="text-accent">
                            {metric.icon}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm ${
                          metric.status === 'up' ? 'text-green-600' : 
                          metric.status === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {metric.status === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                           metric.status === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                           <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>}
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {metric.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {channels[activeTab].metrics.secondary.map((metric, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-gray-500 dark:text-gray-400">
                          {metric.icon}
                        </div>
                        <div className={`text-xs ${
                          metric.status === 'up' ? 'text-green-600' : 
                          metric.status === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {metric.status === 'up' ? '+' : metric.status === 'down' ? '-' : ''}{Math.abs(metric.change)}%
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {metric.title}
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {channels[activeTab].charts.map((chart, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {chart.title}
                      </h3>
                      <TrendChart title={chart.title} data={chart.data} channels={[{ name: chart.title, color: '#4F46E5', dataKey: 'value', visible: true }]} />
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Insights & Khuyến Nghị
                  </h3>
                  {channels[activeTab].insights.map((insight, index) => (
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPerformanceTabs; 