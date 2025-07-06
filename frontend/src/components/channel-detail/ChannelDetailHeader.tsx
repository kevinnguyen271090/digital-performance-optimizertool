import React from 'react';
import { BarChart2, Users, Target, TrendingUp, ShoppingCart, Activity, PieChart } from 'lucide-react';

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
        return '🔵';
      case 'google':
        return '🟢';
      case 'tiktok':
        return '🟣';
      case 'woocommerce':
        return '🟠';
      default:
        return '⚫';
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
    { key: 'overview', label: 'Tổng quan', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'metrics', label: 'Chỉ số', icon: <Activity className="w-4 h-4" /> },
    { key: 'charts', label: 'Biểu đồ', icon: <PieChart className="w-4 h-4" /> },
    { key: 'accounts', label: 'Tài khoản', icon: <Users className="w-4 h-4" /> },
    { key: 'campaigns', label: 'Chiến dịch', icon: <Target className="w-4 h-4" /> },
    { key: 'trends', label: 'Xu hướng', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'insights', label: 'Insights', icon: <ShoppingCart className="w-4 h-4" /> }
  ];

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${getChannelColor(channel)}`}>
            <span className="text-2xl">{getChannelIcon(channel)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {channel} - Chi tiết kênh
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phân tích chi tiết hiệu suất và insights
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Responsive scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChannelDetailHeader; 