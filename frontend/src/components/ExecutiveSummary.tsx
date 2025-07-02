import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle } from 'lucide-react';
import KPICard from './KPICard';

interface ExecutiveSummaryProps {
  data: {
    totalRevenue: number;
    revenueChange: number;
    totalConversions: number;
    conversionChange: number;
    totalSpend: number;
    spendChange: number;
    roas: number;
    roasChange: number;
    topPerformingChannel: string;
    topPerformingChannelValue: string;
    criticalAlerts?: Array<{
      type: 'warning' | 'error' | 'success';
      title: string;
      description: string;
    }>;
    keyInsights?: Array<{
      title: string;
      value: string;
      change: number;
      status: 'up' | 'down' | 'stable';
    }>;
  };
  dateRange: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data, dateRange }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'success':
        return <AlertCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getKPICardStatus = (change: number, isPositive: boolean = true) => {
    if (isPositive) {
      return change >= 0 ? 'normal' : 'warning';
    } else {
      return change <= 0 ? 'normal' : 'warning';
    }
  };

  // Kiểm tra dữ liệu có tồn tại không
  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Executive Summary</h2>
            <p className="text-blue-100">Tổng quan hiệu suất marketing {dateRange}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <div className="text-blue-100">Tổng doanh thu</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Doanh thu"
          value={formatCurrency(data.totalRevenue)}
          change={data.revenueChange}
          status={getKPICardStatus(data.revenueChange)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <KPICard
          title="Chuyển đổi"
          value={data.totalConversions.toLocaleString()}
          change={data.conversionChange}
          status={getKPICardStatus(data.conversionChange)}
          icon={<Target className="w-5 h-5" />}
        />
        <KPICard
          title="Chi phí"
          value={formatCurrency(data.totalSpend)}
          change={data.spendChange}
          status={getKPICardStatus(data.spendChange, false)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <KPICard
          title="ROAS"
          value={`${data.roas.toFixed(2)}x`}
          change={data.roasChange}
          status={getKPICardStatus(data.roasChange)}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Channel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kênh hiệu quả nhất
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.topPerformingChannel}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.topPerformingChannelValue}
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Insights chính
          </h3>
          <div className="space-y-3">
            {data.keyInsights && data.keyInsights.length > 0 ? (
              data.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {insight.title}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {insight.value}
                    </span>
                    <div className={`flex items-center space-x-1 text-xs ${
                      insight.status === 'up' ? 'text-green-600' : 
                      insight.status === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {insight.status === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : insight.status === 'down' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span>{insight.change > 0 ? '+' : ''}{insight.change}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Chưa có insights
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {data.criticalAlerts && data.criticalAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cảnh báo quan trọng
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {data.criticalAlerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
