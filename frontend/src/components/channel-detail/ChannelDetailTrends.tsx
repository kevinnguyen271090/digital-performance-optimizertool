import React from 'react';
import TrendChart from '../TrendChart';

interface ChannelDetailTrendsProps {
  trends: {
    impressions: any[];
    revenue: any[];
  };
}

const ChannelDetailTrends: React.FC<ChannelDetailTrendsProps> = ({
  trends
}) => {
  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-2 sm:p-4 sm:overflow-x-auto md:overflow-visible">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">Impressions & Clicks</h3>
          <div className="w-full min-w-0">
            <TrendChart 
              data={trends.impressions} 
              title="Impressions"
              channels={[{ name: "Impressions", color: "#1877F2", dataKey: "value", visible: true }]}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-2 sm:p-4 sm:overflow-x-auto md:overflow-visible">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">Revenue & Spend</h3>
          <div className="w-full min-w-0">
            <TrendChart 
              data={trends.revenue} 
              title="Revenue"
              channels={[{ name: "Revenue", color: "#FFA726", dataKey: "value", visible: true }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailTrends; 