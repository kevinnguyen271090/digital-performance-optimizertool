import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardPlatformsProps } from '../../types/dashboard';

const DashboardPlatforms: React.FC<DashboardPlatformsProps> = React.memo(({ platformsData }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{t('dashboard.platforms', 'Nền tảng')}</h2>
      {platformsData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {t('dashboard.no_platform_data', 'Chưa có dữ liệu nền tảng')}
        </div>
      )}
    </div>
  );
});

export default DashboardPlatforms; 