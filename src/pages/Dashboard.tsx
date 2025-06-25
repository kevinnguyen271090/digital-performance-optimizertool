import { useOutletContext } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { BarChart2, Percent, DollarSign, TrendingUp } from "lucide-react";
import GoalModal from "../components/GoalModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardContent from "../components/dashboard/DashboardContent";
import DashboardDataTable from "../components/dashboard/DashboardDataTable";
import DashboardInsights from "../components/dashboard/DashboardInsights";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardState } from "../hooks/useDashboardState";
import { DashboardKPIs } from '../components';
import { useGoals } from '../hooks/useGoals';
import { buildCompareChannels, buildOverviewKPIData, buildExecutiveData } from '../utils/dashboardUtils';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface OutletContextType {
  session: Session | null;
}

// Component hiển thị insight/cảnh báo/gợi ý tối ưu
const DashboardInsightsSection = React.memo(({ platformData, selectedChannel }: { platformData: any, selectedChannel: string }) => {
  return <DashboardInsights platformData={platformData} selectedChannel={selectedChannel} />;
});

// Component bảng số liệu chi tiết
const DashboardDataTableSection = React.memo(({ platformData, selectedChannel }: { platformData: any, selectedChannel: string }) => {
  return <DashboardDataTable platformData={platformData} selectedChannel={selectedChannel} />;
});

const Dashboard: React.FC = () => {
  const { session } = useOutletContext<OutletContextType>();
  const { platformData, loading, hasConnectedPlatforms, connectedPlatforms } = useDashboardData(session);
  const { 
    currentView, 
    dateRangeString, 
    showGoalModal, 
    editingGoal,
    selectedAccounts,
    handleViewChange,
    handleToggleAccountSelector,
    handleDateRangeChange,
    handleEditGoal,
    handleDeleteGoal
  } = useDashboardState();
  const { 
    goals, 
    handleSaveGoal, 
    openGoalModal, 
    closeGoalModal 
  } = useGoals(session?.user?.id);
  const { t } = useTranslation();

  // Build data từ platformData - memoize expensive calculations
  const compareChannels = useMemo(() => buildCompareChannels(platformData), [platformData]);
  const overviewKPIData = useMemo(() => buildOverviewKPIData(platformData), [platformData]);
  const executiveData = useMemo(() => buildExecutiveData(platformData), [platformData]);

  // Thêm icons cho overview KPIs - memoize để tránh re-render
  const overviewKPIs = useMemo(() => overviewKPIData.map(kpi => ({
    ...kpi,
    icon: kpi.iconType === 'dollar' ? <DollarSign className="w-5 h-5" /> :
          kpi.iconType === 'chart' ? <BarChart2 className="w-5 h-5" /> :
          kpi.iconType === 'percent' ? <Percent className="w-5 h-5" /> :
          <TrendingUp className="w-5 h-5" />
  })), [overviewKPIData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!hasConnectedPlatforms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">{t('dashboard.no_platform', 'Chưa có kết nối nền tảng')}</h2>
          <p className="text-gray-500">{t('dashboard.please_connect', 'Vui lòng kết nối các nền tảng marketing trong phần Cài đặt')}</p>
        </div>
      </div>
    );
  }

  // Render nội dung theo tab đang chọn
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <>
            {/* Overview KPIs - Responsive grid */}
            <div className="w-full mb-6">
              <DashboardOverview 
                kpis={overviewKPIs}
                goals={goals}
                onEditGoal={handleEditGoal}
                onDeleteGoal={handleDeleteGoal}
                onOpenGoalModal={openGoalModal}
              />
            </div>

            {/* Box Insights & Gợi ý tối ưu - full width, ngay dưới KPI */}
            <div className="w-full mb-6">
              <DashboardInsightsSection 
                platformData={platformData}
                selectedChannel={'all'}
              />
            </div>

            {/* Main content area - Responsive layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              <div className="xl:col-span-2 w-full">
                <DashboardContent 
                  platformData={platformData}
                  currentView={currentView}
                  connectedPlatforms={connectedPlatforms}
                  hasConnectedPlatforms={hasConnectedPlatforms}
                  selectedAccounts={selectedAccounts}
                  onAccountSelectionChange={() => {}}
                  executiveData={executiveData}
                  channelDetailData={{}}
                  dateRangeString={dateRangeString}
                />
              </div>
              <div className="w-full space-y-6">
                <DashboardKPIs kpis={[]} compareChannels={compareChannels} />
              </div>
            </div>

            {/* Bottom section - Responsive grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
              <DashboardDataTableSection 
                platformData={platformData}
                selectedChannel={'all'}
              />
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm w-full">
                <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">{t('dashboard.goals_targets', 'Goals & Targets')}</h3>
                <div className="space-y-3 md:space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{goal.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('dashboard.target', 'Target')}: {goal.targetValue} {goal.unit}
                          </p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="font-bold text-gray-900 dark:text-white">{goal.currentValue || 0}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {goal.period}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {goals.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>{t('dashboard.no_goals', 'Chưa có mục tiêu nào được thiết lập')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'executive':
      case 'platforms':
      case 'channels':
        return (
          <div className="w-full">
            <DashboardContent 
              platformData={platformData}
              currentView={currentView}
              connectedPlatforms={connectedPlatforms}
              hasConnectedPlatforms={hasConnectedPlatforms}
              selectedAccounts={selectedAccounts}
              onAccountSelectionChange={() => {}}
              executiveData={executiveData}
              channelDetailData={{}}
              dateRangeString={dateRangeString}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <DashboardHeader 
        currentView={currentView}
        onViewChange={handleViewChange}
        onDateRangeChange={handleDateRangeChange}
        onToggleAccountSelector={handleToggleAccountSelector}
        dateRangeString={dateRangeString}
      />

      <div className="w-full px-2 md:px-6 lg:px-12 xl:px-24">
        {renderContent()}
      </div>

      <GoalModal
        isOpen={showGoalModal}
        onClose={closeGoalModal}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />
    </div>
  );
};

export default Dashboard; 
