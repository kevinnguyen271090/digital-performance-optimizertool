import React from 'react';
import TrendChart from '../TrendChart';

interface ChannelDetailChartsProps {
  channel: string;
  trends: any;
}

const chartConfigs = [
  { key: 'customerLifetimeValue', title: 'Customer Lifetime Value (CLV)', color: '#8B5CF6' },
  { key: 'churnRate', title: 'Churn Rate (%)', color: '#F87171' },
  { key: 'newCustomerRate', title: 'New Customer Rate (%)', color: '#34D399' },
  { key: 'avgTimeToConvert', title: 'Avg. Time to Convert (days)', color: '#F59E42' },
  { key: 'avgOrderValue', title: 'Average Order Value', color: '#60A5FA' },
  { key: 'cartAbandonmentRate', title: 'Cart Abandonment Rate (%)', color: '#FBBF24' },
  { key: 'engagementRate', title: 'Engagement Rate (%)', color: '#10B981' },
  { key: 'bounceRate', title: 'Bounce Rate (%)', color: '#F472B6' },
  { key: 'avgSessionDuration', title: 'Avg. Session Duration (min)', color: '#6366F1' },
  { key: 'uniqueVisitors', title: 'Unique Visitors', color: '#3B82F6' },
  { key: 'returnVisitors', title: 'Return Visitors', color: '#A3E635' },
];

const ChannelDetailCharts: React.FC<ChannelDetailChartsProps> = ({
  channel,
  trends
}) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartConfigs.map((cfg, idx) => (
          <div key={cfg.key} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {cfg.title}
            </h3>
            <TrendChart
              title={cfg.title}
              data={trends[cfg.key] || []}
              channels={[{ name: cfg.title, color: cfg.color, dataKey: 'value', visible: true }]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailCharts; 