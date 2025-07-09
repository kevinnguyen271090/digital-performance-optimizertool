import React from 'react';
import { Facebook, Globe, TrendingUp, ShoppingCart, BarChart2 } from 'lucide-react';

interface ChannelDetailHeaderProps {
  channel: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ChannelDetailHeader: React.FC<ChannelDetailHeaderProps> = ({
  channel,
  activeTab,
  onTabChange
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'meta':
        return <Facebook className="w-4 h-4" />;
      case 'google':
        return <Globe className="w-4 h-4" />;
      case 'tiktok':
        return <TrendingUp className="w-4 h-4" />;
      case 'woocommerce':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <BarChart2 className="w-4 h-4" />;
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

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'metrics', label: 'Chỉ số', icon: '📈' },
    { id: 'charts', label: 'Biểu đồ', icon: '📉' },
    { id: 'accounts', label: 'Tài khoản', icon: '👥' },
    { id: 'campaigns', label: 'Chiến dịch', icon: '🎯' },
    { id: 'trends', label: 'Xu hướng', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'demographics', label: 'Nhân khẩu', icon: '👤' },
    { id: 'funnel', label: 'Funnel', icon: '🔄' },
    { id: 'engagement', label: 'Tương tác', icon: '❤️' },
    { id: 'performance', label: 'Hiệu suất', icon: '🏆' }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${getChannelColor(channel)}`}>
              {getChannelIcon(channel)}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {channel} Channel Detail
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Chi tiết hiệu suất và phân tích {channel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-2 sm:px-4 md:px-6">
        <nav className="flex space-x-4 sm:space-x-6 md:space-x-8 overflow-x-auto md:overflow-visible md:flex-wrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-xs sm:text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ChannelDetailHeader; 