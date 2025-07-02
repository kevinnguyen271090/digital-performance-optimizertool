import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardExecutiveProps } from '../../types/dashboard';

const DashboardExecutive: React.FC<DashboardExecutiveProps> = React.memo(({ executiveData }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{t('dashboard.executive', 'Báo cáo cấp quản lý')}</h2>
      {executiveData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {t('dashboard.no_executive_data', 'Chưa có dữ liệu báo cáo cấp quản lý')}
        </div>
      )}
    </div>
  );
});

export default DashboardExecutive; 