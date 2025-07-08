import React from 'react';
import ChannelDetailCharts from './ChannelDetailCharts';
import { createChannelDetailData } from '../../utils/mockData';

const ChannelDetailDemo: React.FC = () => {
  // Tạo mock data cho Facebook
  const facebookData = {
    impressions: 120000,
    clicks: 9500,
    ctr: 7.9,
    cost: 35000000,
    conversions: 1200,
    cpa: 29000,
    revenue: 95000000,
    roas: 2.71,
    cpc: 3700,
    cpm: 110000,
    engagementRate: 4.2,
    avgSessionDuration: 3.1,
    bounceRate: 41.2,
    pageViews: 18000,
    uniqueVisitors: 9500,
    returnVisitors: 2100,
    avgOrderValue: 320000,
    cartAbandonmentRate: 62.5
  };

  const channelDetailData = createChannelDetailData('facebook', facebookData);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Channel Detail Charts Demo
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Facebook Channel - Advanced Metrics Charts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Demo các chart cho các chỉ số mới: CLV, Churn Rate, Engagement Rate, v.v.
            </p>
          </div>
          
          <ChannelDetailCharts 
            channel="facebook" 
            trends={channelDetailData.trends} 
          />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mock Data Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Impressions:</span> {facebookData.impressions.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">CTR:</span> {facebookData.ctr}%
            </div>
            <div>
              <span className="font-medium">CPA:</span> {facebookData.cpa.toLocaleString()}đ
            </div>
            <div>
              <span className="font-medium">ROAS:</span> {facebookData.roas}x
            </div>
            <div>
              <span className="font-medium">Engagement Rate:</span> {facebookData.engagementRate}%
            </div>
            <div>
              <span className="font-medium">Bounce Rate:</span> {facebookData.bounceRate}%
            </div>
            <div>
              <span className="font-medium">Avg Order Value:</span> {facebookData.avgOrderValue.toLocaleString()}đ
            </div>
            <div>
              <span className="font-medium">Cart Abandonment:</span> {facebookData.cartAbandonmentRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailDemo; 