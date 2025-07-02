import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Target, 
  BarChart2, ArrowUpRight, ArrowDownRight, Minus, Filter,
  Download, Share2, RefreshCw, AlertCircle
} from 'lucide-react';
import TrendChart from './TrendChart';

interface ExecutiveMetrics {
  totalRevenue: number;
  totalSpend: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  roas: number;
  cpa: number;
  ctr: number;
  conversionRate: number;
  avgOrderValue: number;
}

interface ChannelPerformance {
  channel: string;
  revenue: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
  ctr: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
  status: 'performing' | 'underperforming' | 'critical';
}

interface ExecutiveDashboardProps {
  metrics: ExecutiveMetrics;
  channels: ChannelPerformance[];
  dateRange: string;
  isLoading?: boolean;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  metrics,
  channels,
  dateRange,
  isLoading = false
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'performing': return 'text-green-600 bg-green-50 border-green-200';
      case 'underperforming': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với Date Range và Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Digital Marketing Performance
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {dateRange} • Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition">
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Executive Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Tổng Doanh Thu
            </h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(metrics.totalRevenue)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              +12.5% so với kỳ trước
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              ROAS
            </h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {metrics.roas.toFixed(2)}x
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              +8.3% so với kỳ trước
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
              Tổng Chuyển Đổi
            </h3>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatNumber(metrics.totalConversions)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
              +15.2% so với kỳ trước
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
              CPA
            </h3>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatCurrency(metrics.cpa)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
              -5.1% so với kỳ trước
            </p>
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Hiệu Suất Theo Kênh
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Đang hiển thị {channels.length} kênh</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kênh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Doanh Thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Chi Phí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ROAS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  CPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Conv. Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {channels.map((channel, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {channel.channel.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {channel.channel}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(channel.impressions)} impressions
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(channel.revenue)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {getTrendIcon(channel.trend)}
                      <span className="ml-1">+12.5%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(channel.spend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {channel.roas.toFixed(2)}x
                    </div>
                    <div className="text-sm text-gray-500">
                      {channel.roas > 3 ? 'Tốt' : channel.roas > 2 ? 'Trung bình' : 'Cần cải thiện'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(channel.cpa)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {channel.ctr.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {channel.conversionRate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(channel.status)}`}>
                      {channel.status === 'performing' ? 'Tốt' : 
                       channel.status === 'underperforming' ? 'Cần cải thiện' : 'Kritisk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Xu Hướng Doanh Thu
          </h3>
          <TrendChart title="Doanh thu theo ngày" data={[
            { date: '2024-01-01', value: 10000000 },
            { date: '2024-01-02', value: 12000000 },
            { date: '2024-01-03', value: 15000000 },
            { date: '2024-01-04', value: 20000000 },
            { date: '2024-01-05', value: 25000000 },
          ]} channels={[{ name: 'Doanh thu', color: '#10B981', dataKey: 'value', visible: true }]} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phân Bổ Chi Phí Theo Kênh
          </h3>
          <div className="space-y-4">
            {channels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {channel.channel}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${(channel.spend / Math.max(...channels.map(c => c.spend))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-20 text-right">
                    {formatCurrency(channel.spend)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cảnh Báo & Khuyến Nghị
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                CPA TikTok đang cao hơn 25% so với mục tiêu
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Khuyến nghị: Tối ưu hóa targeting và creative để giảm chi phí
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                Facebook Ads đang overperforming
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Khuyến nghị: Tăng budget cho Facebook Ads để tận dụng hiệu suất tốt
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Google Ads CTR thấp hơn 15% so với benchmark
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Khuyến nghị: A/B test ad copy và keywords để cải thiện CTR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard; 