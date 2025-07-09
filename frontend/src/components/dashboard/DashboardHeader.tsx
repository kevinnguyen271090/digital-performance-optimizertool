import React from "react";
import { Grid, Layers, User, FileText, BarChart3, TrendingUp } from "lucide-react";
import DateRangePicker from "../DateRangePicker";
import { DashboardView } from "../../types/dashboard";
import { useTranslation } from 'react-i18next';
import { H1, Lead, GradientText } from "../ui/typography";

interface DashboardHeaderProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onToggleAccountSelector: () => void;
  onCreateReport?: () => void;
  dateRangeString: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({
  currentView,
  onViewChange,
  onDateRangeChange,
  onToggleAccountSelector,
  onCreateReport,
  dateRangeString
}) => {
  const { t, i18n } = useTranslation();

  const viewConfigs = {
    overview: {
      icon: Grid,
      label: 'Tổng quan'
    },
    executive: {
      icon: BarChart3,
      label: 'Executive'
    },
    channels: {
      icon: TrendingUp,
      label: 'Kênh'
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
        {/* Tiêu đề + subtitle */}
        <div className="flex flex-col md:flex-row md:items-end md:gap-4">
          <H1 className="dashboard-title text-2xl md:text-3xl lg:text-4xl font-bold leading-tight m-0 p-0">
            {t('dashboard.title')}
          </H1>
          <Lead className="dashboard-subtitle text-base md:text-lg opacity-70 md:ml-4 m-0 p-0">
            {t('dashboard.subtitle', 'Tổng quan hiệu suất marketing đa nền tảng')}
          </Lead>
        </div>
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-white dark:bg-[#1F2937] rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm h-10">
            {Object.entries(viewConfigs).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = currentView === key;
              return (
                <button
                  key={key}
                  onClick={() => onViewChange(key as DashboardView)}
                  className={`flex items-center px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-300 h-7 min-w-[80px] ${
                    isActive
                      ? 'bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow-sm scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={config.label}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{config.label}</span>
                </button>
              );
            })}
          </div>
          {/* Create Report Button */}
          {onCreateReport && (
            <button
              onClick={onCreateReport}
              className="flex items-center space-x-2 bg-gradient-to-r from-gradientFrom to-gradientTo text-white px-3 py-1.5 rounded-md font-semibold text-xs hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 h-7"
              title="Tạo báo cáo"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo báo cáo</span>
            </button>
          )}
          {/* Date Range Picker */}
          <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-10 flex items-center px-2">
            <DateRangePicker 
              onDateRangeChange={onDateRangeChange}
              defaultRange="last30days"
            />
          </div>
          {/* Account Selector */}
          <button
            onClick={onToggleAccountSelector}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 text-gray-700 dark:text-gray-200"
            title="Chọn tài khoản"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default DashboardHeader; 