import React from 'react';
import { Facebook, Globe, TrendingUp, ShoppingCart, BarChart2, Percent, DollarSign, Users, Eye, Target } from 'lucide-react';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import { chartData } from '../utils/mockData';

interface PlatformDashboardProps {
  platform: string;
  data: any;
  isConnected: boolean;
  lastSync?: Date;
}

const PlatformDashboard: React.FC<PlatformDashboardProps> = ({ platform, data, isConnected, lastSync }) => {
  const getPlatformIcon = () => {
    switch (platform) {
      case 'meta': return <Facebook className="w-6 h-6" />;
      case 'google': return <Globe className="w-6 h-6" />;
      case 'tiktok': return <TrendingUp className="w-6 h-6" />;
      case 'woocommerce': return <ShoppingCart className="w-6 h-6" />;
      default: return <BarChart2 className="w-6 h-6" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'meta': return 'Meta (Facebook/Instagram)';
      case 'google': return 'Google Analytics';
      case 'tiktok': return 'TikTok';
      case 'woocommerce': return 'WooCommerce';
      default: return platform;
    }
  };

  const getPlatformKPIs = () => {
    switch (platform) {
      case 'meta':
        return [
          {
            title: 'Impressions',
            value: data.impressions?.toLocaleString() || '0',
            change: 12,
            status: 'normal' as const,
            icon: <Eye />
          },
          {
            title: 'CTR',
            value: data.ctr ? `${data.ctr.toFixed(2)}%` : '2.5%',
            change: 8,
            status: 'normal' as const,
            icon: <Percent />
          },
          {
            title: 'CPA',
            value: data.cpa ? `${data.cpa.toLocaleString()}đ` : '40,000đ',
            change: -5,
            status: 'normal' as const,
            icon: <DollarSign />
          },
          {
            title: 'Conversions',
            value: data.conversions?.toLocaleString() || '0',
            change: 15,
            status: 'normal' as const,
            icon: <Target />
          }
        ];

      case 'google':
        return [
          {
            title: 'Sessions',
            value: data.sessions?.toLocaleString() || '0',
            change: 10,
            status: 'normal' as const,
            icon: <BarChart2 />
          },
          {
            title: 'Page Views',
            value: data.pageViews?.toLocaleString() || '0',
            change: 7,
            status: 'normal' as const,
            icon: <Eye />
          },
          {
            title: 'Avg Session Duration',
            value: data.avgSessionDuration ? `${data.avgSessionDuration} phút` : '2.5 phút',
            change: 12,
            status: 'normal' as const,
            icon: <Users />
          },
          {
            title: 'Transactions',
            value: data.transactions?.toLocaleString() || '0',
            change: 20,
            status: 'normal' as const,
            icon: <Target />
          }
        ];

      case 'tiktok':
        return [
          {
            title: 'Total Views',
            value: data.totalViews?.toLocaleString() || '0',
            change: 25,
            status: 'normal' as const,
            icon: <Eye />
          },
          {
            title: 'Engagement Rate',
            value: data.avgEngagementRate ? `${data.avgEngagementRate}%` : '2.5%',
            change: 18,
            status: 'normal' as const,
            icon: <Users />
          },
          {
            title: 'Total Likes',
            value: data.totalLikes?.toLocaleString() || '0',
            change: 30,
            status: 'normal' as const,
            icon: <TrendingUp />
          },
          {
            title: 'Total Videos',
            value: data.totalVideos?.toString() || '0',
            change: 5,
            status: 'normal' as const,
            icon: <BarChart2 />
          }
        ];

      case 'woocommerce':
        return [
          {
            title: 'Revenue',
            value: data.recentRevenue ? `${data.recentRevenue.toLocaleString()}đ` : '0đ',
            change: 15,
            status: 'normal' as const,
            icon: <DollarSign />
          },
          {
            title: 'Orders',
            value: data.recentOrdersCount?.toString() || '0',
            change: 12,
            status: 'normal' as const,
            icon: <Target />
          },
          {
            title: 'Avg Order Value',
            value: data.avgOrderValue ? `${data.avgOrderValue}đ` : '0đ',
            change: 8,
            status: 'normal' as const,
            icon: <ShoppingCart />
          },
          {
            title: 'Total Products',
            value: data.totalProducts?.toString() || '0',
            change: 3,
            status: 'normal' as const,
            icon: <BarChart2 />
          }
        ];

      default:
        return [];
    }
  };

  const getPlatformCharts = () => {
    switch (platform) {
      case 'meta':
        return [
          { title: 'Impressions (7 ngày)', data: chartData.sessions, color: '#1877F2' },
          { title: 'CTR (7 ngày)', data: chartData.ctr, color: '#42A5F5' },
          { title: 'CPA (7 ngày)', data: chartData.cpa, color: '#EF4444' },
          { title: 'Conversions (7 ngày)', data: chartData.roas, color: '#10B981' }
        ];

      case 'google':
        return [
          { title: 'Sessions (7 ngày)', data: chartData.sessions, color: '#4285F4' },
          { title: 'Page Views (7 ngày)', data: chartData.ctr, color: '#34A853' },
          { title: 'Session Duration (7 ngày)', data: chartData.cpa, color: '#FBBC05' },
          { title: 'Transactions (7 ngày)', data: chartData.roas, color: '#EA4335' }
        ];

      case 'tiktok':
        return [
          { title: 'Views (7 ngày)', data: chartData.sessions, color: '#FF0050' },
          { title: 'Engagement (7 ngày)', data: chartData.ctr, color: '#25F4EE' },
          { title: 'Likes (7 ngày)', data: chartData.cpa, color: '#FE2C55' },
          { title: 'Shares (7 ngày)', data: chartData.roas, color: '#161823' }
        ];

      case 'woocommerce':
        return [
          { title: 'Revenue (7 ngày)', data: chartData.sessions, color: '#7C3AED' },
          { title: 'Orders (7 ngày)', data: chartData.ctr, color: '#10B981' },
          { title: 'Avg Order Value (7 ngày)', data: chartData.cpa, color: '#F59E0B' },
          { title: 'Products (7 ngày)', data: chartData.roas, color: '#EF4444' }
        ];

      default:
        return [];
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            {getPlatformIcon()}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {getPlatformName()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Chưa kết nối nền tảng này
          </p>
          <button className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition">
            Kết nối ngay
          </button>
        </div>
      </div>
    );
  }

  const kpis = getPlatformKPIs();
  const charts = getPlatformCharts();

  return (
    <div className="w-full flex flex-col gap-4 md:gap-8 p-2 sm:p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-accent">
            {getPlatformIcon()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {getPlatformName()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dữ liệu được cập nhật lần cuối: {lastSync ? lastSync.toLocaleString() : 'Chưa có dữ liệu'}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              status={kpi.status}
              icon={kpi.icon}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {charts.map((chart, index) => (
            <TrendChart
              key={index}
              title={chart.title}
              data={chart.data}
              channels={[{ name: chart.title, color: '#4F46E5', dataKey: 'value', visible: true }]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard; 