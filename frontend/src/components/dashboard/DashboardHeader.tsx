import React from "react";
import { Grid, Layers, User, FileText } from "lucide-react";
import DateRangePicker from "../DateRangePicker";
import { DashboardView } from "../../types/dashboard";
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white tracking-tight leading-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base font-medium">
            {t('dashboard.subtitle', 'Tổng quan hiệu suất marketing đa nền tảng')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-0">
          {/* Tab chuyển view */}
          <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg border p-1">
            <button
              onClick={() => onViewChange('overview')}
              className={`flex items-center px-3 py-1.5 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                currentView === 'overview'
                  ? 'bg-accent text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Tổng quan"
            >
              <Grid className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Tổng quan</span>
            </button>
            <button
              onClick={() => onViewChange('executive')}
              className={`flex items-center px-3 py-1.5 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                currentView === 'executive'
                  ? 'bg-accent text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Executive"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Executive</span>
            </button>
            <button
              onClick={() => onViewChange('channels')}
              className={`flex items-center px-3 py-1.5 rounded-md font-medium text-xs md:text-sm transition-all duration-200 ${
                currentView === 'channels'
                  ? 'bg-accent text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Kênh"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Kênh</span>
            </button>
          </div>
          
          {/* Nút tạo báo cáo */}
          {onCreateReport && (
            <button
              onClick={onCreateReport}
              className="flex items-center space-x-2 bg-accent text-white px-3 py-2 rounded-lg font-medium hover:bg-accent/90 transition shadow-sm"
              title="Tạo báo cáo"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Tạo báo cáo</span>
            </button>
          )}
          
          {/* Filter ngày */}
          <DateRangePicker 
            onDateRangeChange={onDateRangeChange}
            defaultRange="last30days"
          />
          {/* Nút tài khoản chỉ icon */}
          <button
            onClick={onToggleAccountSelector}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm text-gray-700 dark:text-white"
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