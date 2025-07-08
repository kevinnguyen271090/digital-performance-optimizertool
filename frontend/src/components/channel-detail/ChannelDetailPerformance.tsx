import React from 'react';

interface ChannelDetailPerformanceProps {
  performance?: {
    topPerformingCampaigns: Array<{ name: string; metric: string; value: number }>;
    topPerformingAds: Array<{ name: string; metric: string; value: number }>;
    topPerformingAudiences: Array<{ name: string; metric: string; value: number }>;
    topPerformingCreatives: Array<{ name: string; metric: string; value: number }>;
  };
}

const ChannelDetailPerformance: React.FC<ChannelDetailPerformanceProps> = ({
  performance
}) => {
  if (!performance) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performance
        </h3>
        <div className="text-center py-8 text-gray-500">
          Performance data not available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Performance
      </h3>
      <div className="space-y-6">
        {/* Top Campaigns */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Top Performing Campaigns</h4>
          <div className="space-y-2">
            {performance.topPerformingCampaigns.map((campaign, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{campaign.name}</span>
                <span className="text-sm font-medium">{campaign.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Ads */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Top Performing Ads</h4>
          <div className="space-y-2">
            {performance.topPerformingAds.map((ad, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{ad.name}</span>
                <span className="text-sm font-medium">{ad.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Audiences */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Top Performing Audiences</h4>
          <div className="space-y-2">
            {performance.topPerformingAudiences.map((audience, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{audience.name}</span>
                <span className="text-sm font-medium">{audience.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creatives */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Top Performing Creatives</h4>
          <div className="space-y-2">
            {performance.topPerformingCreatives.map((creative, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{creative.name}</span>
                <span className="text-sm font-medium">{creative.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailPerformance; 