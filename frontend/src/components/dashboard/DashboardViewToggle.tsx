import React from 'react';
import { Grid, TrendingUp, Layers, BarChart3, Target } from 'lucide-react';
import { DashboardView } from '../../types/dashboard';
import { useTranslation } from 'react-i18next';

interface DashboardViewToggleProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const DashboardViewToggle: React.FC<DashboardViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  const { t } = useTranslation();
  const views = [
    {
      id: 'overview' as DashboardView,
      label: t('dashboard.overview', 'Tổng quan'),
      icon: Grid
    },
    {
      id: 'executive' as DashboardView,
      label: t('dashboard.executive', 'Executive'),
      icon: BarChart3
    },
    {
      id: 'executive-detail' as DashboardView,
      label: t('dashboard.executive_detail', 'Executive Detail'),
      icon: Target
    },
    {
      id: 'platforms' as DashboardView,
      label: t('dashboard.platforms', 'Nền tảng'),
      icon: Layers
    },
    {
      id: 'channels' as DashboardView,
      label: t('dashboard.channels', 'Kênh'),
      icon: TrendingUp
    }
  ];

  return (
    <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg border p-1">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              currentView === view.id
                ? 'bg-accent text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DashboardViewToggle; 