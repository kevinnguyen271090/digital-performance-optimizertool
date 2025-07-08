import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TrendChart from '../TrendChart';
import { getChannelIcon, getChannelColor, generateChannelKPIs, generateGlobalKPIs, generateChannelCharts, getInsightIcon, getInsightColor } from './utils';
import { ChannelDetailData } from './types';

interface ChannelDetailOverviewProps {
  channel: string;
  data: ChannelDetailData;
  isConnected: boolean;
}

const ChannelDetailOverview: React.FC<ChannelDetailOverviewProps> = ({
  channel,
  data,
  isConnected
}) => {
  const channelKPIs = generateChannelKPIs(channel, data.overview);
  const globalKPIs = generateGlobalKPIs(data.overview);
  const charts = generateChannelCharts(channel, data.trends);

  if (!isConnected) {
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
                Chưa kết nối - Kết nối để xem dữ liệu thực
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800">
              Chưa kết nối
            </span>
          </div>
        </div>

        {/* Not Connected State */}
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
      </div>
    );
  }

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
              Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            Đã kết nối
          </span>
        </div>
      </div>

      {/* Channel KPIs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {channel} KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channelKPIs.map((kpi, index) => (
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
      </div>

      {/* Global KPIs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Global Business KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalKPIs.map((kpi, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-600 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="text-blue-600">
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {charts.slice(0, 4).map((chart, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {chart.title}
            </h3>
            <TrendChart 
              title={chart.title} 
              data={chart.data} 
              channels={[{ name: chart.title, color: chart.color, dataKey: 'value', visible: true }]} 
            />
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
    </div>
  );
};

export default ChannelDetailOverview; 