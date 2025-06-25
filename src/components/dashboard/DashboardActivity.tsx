import React from "react";
import { useTranslation } from 'react-i18next';

const DashboardActivity: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.recent_activity', 'Hoạt động gần đây')}
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.meta_ads_roas', 'Meta Ads: ROAS tăng 15% so với tuần trước')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.tiktok_ads_cpa', 'TikTok Ads: CPA tăng 8% - cần tối ưu')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('dashboard.ga_traffic', 'Google Analytics: Traffic tăng 12%')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardActivity; 