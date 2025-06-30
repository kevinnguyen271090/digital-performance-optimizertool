import { useOutletContext } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { BarChart2, Percent, DollarSign, TrendingUp, Plus, Target } from "lucide-react";
import GoalModal from "../components/GoalModal";
import KPIImportModal from "../components/KPIImportModal";
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
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KPISection from '../components/dashboard/KPISection';
import InsightsSection from '../components/dashboard/InsightsSection';
import MainContentSection from '../components/dashboard/MainContentSection';
import GoalsSection from '../components/dashboard/GoalsSection';

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
  const [showKPIModal, setShowKPIModal] = useState(false);

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

  // Tạo KPI data từ dữ liệu thực và goals
  const kpiData = useMemo(() => {
    const kpis = [];
    
    // Thêm KPI từ dữ liệu thực (platformData)
    if (overviewKPIData.length > 0) {
      kpis.push(...overviewKPIData.map(kpi => ({
        title: kpi.title,
        value: typeof kpi.value === 'number' ? 
          (kpi.title.includes('Doanh thu') || kpi.title.includes('Chi phí') || kpi.title.includes('CPA') ? 
            `₫${kpi.value.toLocaleString('vi-VN')}` : 
            kpi.title.includes('ROAS') ? 
              `${kpi.value.toFixed(2)}x` : 
              kpi.value.toLocaleString('vi-VN')
          ) : kpi.value.toString(),
        change: kpi.change,
        status: kpi.status,
        icon: kpi.iconType === 'dollar' ? <DollarSign className="w-5 h-5" /> :
              kpi.iconType === 'chart' ? <BarChart2 className="w-5 h-5" /> :
              kpi.iconType === 'percent' ? <Percent className="w-5 h-5" /> :
              <TrendingUp className="w-5 h-5" />
      })));
    }

    // Thêm KPI từ goals nếu có
    goals.forEach(goal => {
      const currentValue = goal.currentValue || 0;
      const targetValue = goal.targetValue;
      const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
      
      kpis.push({
        title: goal.title,
        value: `${currentValue.toLocaleString('vi-VN')} / ${targetValue.toLocaleString('vi-VN')} ${goal.unit}`,
        change: progress,
        status: progress >= 100 ? 'normal' : progress >= 80 ? 'warning' : 'danger',
        icon: <Target className="w-5 h-5" />
      });
    });

    return kpis;
  }, [overviewKPIData, goals]);

  // Xử lý import KPI từ Excel
  const handleImportKPI = async (importedKPIs: any[]) => {
    try {
      // Lưu từng KPI vào database thông qua useGoals hook
      for (const kpi of importedKPIs) {
        const goal = {
          id: `goal-${Date.now()}-${Math.random()}`,
          title: kpi.title,
          targetValue: kpi.targetValue,
          currentValue: kpi.currentValue,
          unit: kpi.unit,
          period: kpi.period,
          description: kpi.description,
          status: "on-track" as const,
          createdAt: new Date().toISOString()
        };
        
        await handleSaveGoal(goal);
      }
      
      // Hiển thị thông báo thành công
      alert(`Đã import thành công ${importedKPIs.length} KPI!`);
    } catch (error) {
      console.error('Lỗi import KPI:', error);
      alert('Có lỗi xảy ra khi import KPI. Vui lòng thử lại.');
    }
  };

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
          <p className="text-gray-500 mb-6">{t('dashboard.please_connect', 'Vui lòng kết nối các nền tảng marketing trong phần Cài đặt')}</p>
          <div className="space-y-4">
            <button 
              onClick={() => setShowKPIModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nhập KPI thủ công
            </button>
            <p className="text-sm text-gray-400">Hoặc kết nối nền tảng để lấy dữ liệu tự động</p>
          </div>
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
            <KPISection
              kpiData={kpiData}
              onAddGoal={openGoalModal}
              onImportExcel={() => setShowKPIModal(true)}
            />

            <InsightsSection 
              platformData={platformData}
              selectedChannel={'all'}
            />

            <MainContentSection
              platformData={platformData}
              currentView={currentView as any}
              connectedPlatforms={connectedPlatforms}
              hasConnectedPlatforms={hasConnectedPlatforms}
              selectedAccounts={selectedAccounts}
              executiveData={executiveData}
              channelDetailData={{}}
              dateRangeString={dateRangeString}
              kpiData={kpiData}
              compareChannels={compareChannels}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <DashboardDataTableSection 
                platformData={platformData}
                selectedChannel={'all'}
              />
              <GoalsSection
                goals={goals}
                onAddGoal={openGoalModal}
                t={t}
              />
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

      <KPIImportModal
        isOpen={showKPIModal}
        onClose={() => setShowKPIModal(false)}
        onImport={handleImportKPI}
      />
    </div>
  );
};

export default Dashboard; 
