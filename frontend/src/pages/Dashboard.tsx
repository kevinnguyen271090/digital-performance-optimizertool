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
import { buildCompareChannels, buildOverviewKPIData, buildExecutiveData, buildAdditionalKPIs } from '../utils/dashboardUtils';
import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import KPISection from '../components/dashboard/KPISection';
import InsightsSection from '../components/dashboard/InsightsSection';
import MainContentSection from '../components/dashboard/MainContentSection';
import GoalsSection from '../components/dashboard/GoalsSection';
import { zeroExecutiveData, zeroPlatformData, zeroConnectedPlatforms, mockData, channelsArrayToPlatformData } from "../utils/mockData";
import FunnelChart from '../components/dashboard/FunnelChart';
import PieChart from '../components/dashboard/PieChart';
import EngagementChart from '../components/dashboard/EngagementChart';
import CPCChart from '../components/dashboard/CPCChart';
import CPMChart from '../components/dashboard/CPMChart';

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
  const { data: rawPlatformData, loading, dataSource } = useDashboardData();
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

  // Nếu dùng mockData, chuyển đổi mảng channels thành object platformData
  const platformData = React.useMemo(() => {
    if (!rawPlatformData) return {};
    // Nếu là mảng channels (mock), convert sang object
    if (Array.isArray(rawPlatformData.channels)) {
      return channelsArrayToPlatformData(rawPlatformData.channels);
    }
    // Nếu đã là object đúng dạng, trả về luôn
    return rawPlatformData;
  }, [rawPlatformData]);

  // Build data từ platformData - memoize expensive calculations
  const compareChannels = useMemo(() => buildCompareChannels(platformData), [platformData]);
  const overviewKPIData = useMemo(() => buildOverviewKPIData(platformData), [platformData]);
  const executiveData = useMemo(() => buildExecutiveData(platformData), [platformData]);

  // Dữ liệu funnel chuyển đổi tổng quan
  const funnelData = useMemo(() => {
    // Tính tổng từ các kênh đã kết nối
    const totalTraffic = Object.values(platformData).reduce((sum: number, channel: any) => 
      sum + (channel.traffic || channel.impressions || 0), 0);
    const totalLeads = Object.values(platformData).reduce((sum: number, channel: any) => 
      sum + (channel.leads || channel.conversions || 0), 0);
    const totalOrders = Object.values(platformData).reduce((sum: number, channel: any) => 
      sum + (channel.orders || 0), 0);
    const totalRevenue = Object.values(platformData).reduce((sum: number, channel: any) => 
      sum + (channel.revenue || 0), 0);
    
    return [
      { name: 'Traffic', value: totalTraffic },
      { name: 'Lead', value: totalLeads },
      { name: 'Order', value: totalOrders },
      { name: 'Revenue', value: totalRevenue },
    ];
  }, [platformData]);

  // Thêm icons cho overview KPIs - memoize để tránh re-render
  const overviewKPIs = useMemo(() => overviewKPIData.map(kpi => ({
    ...kpi,
    icon: kpi.iconType === 'dollar' ? <DollarSign className="w-5 h-5" /> :
          kpi.iconType === 'chart' ? <BarChart2 className="w-5 h-5" /> :
          kpi.iconType === 'percent' ? <Percent className="w-5 h-5" /> :
          <TrendingUp className="w-5 h-5" />
  })), [overviewKPIData]);

  // KPI bổ sung (CPC, CPM, Engagement Rate, CTR, Drop-off rate)
  const additionalKPIs = useMemo(() => buildAdditionalKPIs(platformData), [platformData]);

  // KPI nâng cao (CLV, Churn Rate, New Customer Rate, Average Time to Convert)
  const advancedKPIs = useMemo(() => {
    const kpis = [];
    // CLV
    if (platformData.totalRevenue && platformData.totalCustomers) {
      kpis.push({
        title: 'CLV',
        value: platformData.totalCustomers > 0 ? platformData.totalRevenue / platformData.totalCustomers : 0,
        unit: '₫',
        iconType: 'dollar',
      });
    }
    // Churn Rate
    if (platformData.churnedCustomers && platformData.startCustomers) {
      kpis.push({
        title: 'Churn Rate',
        value: platformData.startCustomers > 0 ? (platformData.churnedCustomers / platformData.startCustomers) * 100 : 0,
        unit: '%',
        iconType: 'percent',
      });
    }
    // New Customer Rate
    if (platformData.newCustomers && platformData.totalCustomers) {
      kpis.push({
        title: 'New Customer Rate',
        value: platformData.totalCustomers > 0 ? (platformData.newCustomers / platformData.totalCustomers) * 100 : 0,
        unit: '%',
        iconType: 'percent',
      });
    }
    // Average Time to Convert
    if (platformData.totalConversionTime && platformData.totalConversions) {
      kpis.push({
        title: 'Avg. Time to Convert',
        value: platformData.totalConversions > 0 ? platformData.totalConversionTime / platformData.totalConversions : 0,
        unit: 'ngày',
        iconType: 'chart',
      });
    }
    return kpis;
  }, [platformData]);

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

    // Thêm KPI bổ sung
    additionalKPIs.forEach(kpi => {
      kpis.push({
        title: kpi.title,
        value: kpi.unit === '%' ? `${kpi.value.toFixed(2)}%` : `₫${Math.round(kpi.value).toLocaleString('vi-VN')}`,
        change: undefined,
        status: 'normal',
        icon: kpi.iconType === 'dollar' ? <DollarSign className="w-5 h-5" /> : <Percent className="w-5 h-5" />
      });
    });

    // Thêm KPI nâng cao
    advancedKPIs.forEach(kpi => {
      kpis.push({
        title: kpi.title,
        value: kpi.unit === '%' ? `${kpi.value.toFixed(2)}%` : kpi.unit === '₫' ? `₫${Math.round(kpi.value).toLocaleString('vi-VN')}` : `${kpi.value.toFixed(1)} ${kpi.unit}`,
        change: undefined,
        status: 'normal',
        icon: kpi.iconType === 'dollar' ? <DollarSign className="w-5 h-5" /> : kpi.iconType === 'percent' ? <Percent className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />
      });
    });

    return kpis;
  }, [overviewKPIData, goals, additionalKPIs, advancedKPIs]);

  // Dữ liệu pie chart phân bổ nguồn
  const pieTrafficData = useMemo(() => {
    if (platformData && Object.keys(platformData).length > 0) {
      const data = [];
      if (platformData.meta) {
        data.push({ name: 'Meta Ads', value: platformData.meta.impressions || 0 });
      }
      if (platformData.google) {
        data.push({ name: 'Google Ads', value: platformData.google.impressions || 0 });
      }
      if (platformData.tiktok) {
        data.push({ name: 'TikTok Ads', value: platformData.tiktok.impressions || 0 });
      }
      // Nếu có ít nhất 1 giá trị > 0 thì trả về data thực
      if (data.some(item => item.value > 0)) return data;
    }
    // Fallback mock
    return mockData.dashboard.trafficBySource.map(item => ({ name: item.source, value: item.value }));
  }, [platformData]);
  
  const pieLeadData = useMemo(() => {
    if (platformData && Object.keys(platformData).length > 0) {
      const data = [];
      if (platformData.meta) {
        data.push({ name: 'Meta Ads', value: platformData.meta.conversions || 0 });
      }
      if (platformData.google) {
        data.push({ name: 'Google Ads', value: platformData.google.conversions || 0 });
      }
      if (platformData.tiktok) {
        data.push({ name: 'TikTok Ads', value: platformData.tiktok.conversions || 0 });
      }
      if (data.some(item => item.value > 0)) return data;
    }
    return mockData.dashboard.leadBySource.map(item => ({ name: item.source, value: item.value }));
  }, [platformData]);
  
  const pieRevenueData = useMemo(() => {
    if (platformData && Object.keys(platformData).length > 0) {
      const data = [];
      if (platformData.meta) {
        data.push({ name: 'Meta Ads', value: platformData.meta.revenue || 0 });
      }
      if (platformData.google) {
        data.push({ name: 'Google Ads', value: platformData.google.revenue || 0 });
      }
      if (platformData.tiktok) {
        data.push({ name: 'TikTok Ads', value: platformData.tiktok.revenue || 0 });
      }
      if (data.some(item => item.value > 0)) return data;
    }
    return mockData.dashboard.revenueBySource.map(item => ({ name: item.source, value: item.value }));
  }, [platformData]);
  const [pieType, setPieType] = useState<'traffic' | 'lead' | 'revenue'>('traffic');

  // Dữ liệu cho EngagementChart
  const engagementChartData = useMemo(() => {
    // Tạo mock data cho engagement timeline
    return [
      { date: '2024-01-01', like: 120, share: 45, comment: 23, ctr: 4.2, engagementRate: 2.5 },
      { date: '2024-01-02', like: 135, share: 52, comment: 28, ctr: 4.5, engagementRate: 2.8 },
      { date: '2024-01-03', like: 148, share: 58, comment: 31, ctr: 4.8, engagementRate: 3.1 },
      { date: '2024-01-04', like: 142, share: 55, comment: 29, ctr: 4.3, engagementRate: 2.9 },
      { date: '2024-01-05', like: 155, share: 62, comment: 34, ctr: 4.7, engagementRate: 3.2 },
    ];
  }, []);
  
  // Dữ liệu cho CPCChart
  const cpcChartData = useMemo(() => {
    // Tạo data từ các kênh
    const data = [];
    if (platformData.meta) {
      data.push({ label: 'Meta Ads', cpc: platformData.meta.cpa || 0 });
    }
    if (platformData.google) {
      data.push({ label: 'Google Ads', cpc: platformData.google.cpa || 0 });
    }
    if (platformData.tiktok) {
      data.push({ label: 'TikTok Ads', cpc: platformData.tiktok.cpa || 0 });
    }
    return data;
  }, [platformData]);
  
  // Dữ liệu cho CPMChart
  const cpmChartData = useMemo(() => {
    // Tính CPM từ spend và impressions
    const data = [];
    if (platformData.meta && platformData.meta.impressions) {
      const cpm = platformData.meta.impressions > 0 ? 
        (platformData.meta.spend / platformData.meta.impressions) * 1000 : 0;
      data.push({ label: 'Meta Ads', cpm });
    }
    if (platformData.google && platformData.google.impressions) {
      const cpm = platformData.google.impressions > 0 ? 
        (platformData.google.spend / platformData.google.impressions) * 1000 : 0;
      data.push({ label: 'Google Ads', cpm });
    }
    if (platformData.tiktok && platformData.tiktok.impressions) {
      const cpm = platformData.tiktok.impressions > 0 ? 
        (platformData.tiktok.spend / platformData.tiktok.impressions) * 1000 : 0;
      data.push({ label: 'TikTok Ads', cpm });
    }
    return data;
  }, [platformData]);

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

  // Xác định trạng thái kết nối platform
  const hasConnectedPlatforms = platformData && Object.keys(platformData).length > 0;
  const connectedPlatforms = useMemo(() => {
    return hasConnectedPlatforms ? Object.keys(platformData).map(p => ({ platform: p, status: 'connected', lastSync: new Date() })) : zeroConnectedPlatforms;
  }, [hasConnectedPlatforms, platformData]);

  // Memo hóa các callback để tránh re-render
  const handleAccountSelectionChange = useCallback(() => {}, []);
  const handleCloseKPIModal = useCallback(() => setShowKPIModal(false), []);
  const handleCloseGoalModal = useCallback(() => closeGoalModal(), [closeGoalModal]);

  // Memo hóa dateRange object
  const dateRangeObject = useMemo(() => {
    if (!dateRangeString) return undefined;
    const [start, end] = dateRangeString.split(' - ');
    return {
      from: new Date(start),
      to: new Date(end)
    };
  }, [dateRangeString]);

  // Memo hóa empty object để tránh tạo mới mỗi lần render
  const emptyChannelDetailData = useMemo(() => ({}), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

//  if (!hasConnectedPlatforms) {
//    return (
//      <div className="flex items-center justify-center min-h-screen">
//        <div className="text-center">
//          <h2 className="text-2xl font-bold text-gray-600 mb-4">{t('dashboard.no_platform', 'Chưa có kết nối nền tảng')}</h2>
//          <p className="text-gray-500 mb-6">{t('dashboard.please_connect', 'Vui lòng kết nối các nền tảng marketing trong phần Cài đặt')}</p>
//          <div className="space-y-4">
//            <button 
//              onClick={() => setShowKPIModal(true)}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//            >
//              <Plus className="w-4 h-4 inline mr-2" />
//              Nhập KPI thủ công
//            </button>
//            <p className="text-sm text-gray-400">Hoặc kết nối nền tảng để lấy dữ liệu tự động</p>
//          </div>
//        </div>
//      </div>
//    );
//  }

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

            {/* Funnel Chart tổng quan */}
            <FunnelChart data={funnelData} />

            {/* Pie Chart phân bổ nguồn */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <button className={`px-3 py-1 rounded ${pieType === 'traffic' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`} onClick={() => setPieType('traffic')}>Traffic</button>
                <button className={`px-3 py-1 rounded ${pieType === 'lead' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`} onClick={() => setPieType('lead')}>Lead</button>
                <button className={`px-3 py-1 rounded ${pieType === 'revenue' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`} onClick={() => setPieType('revenue')}>Doanh thu</button>
              </div>
              {pieType === 'traffic' && <PieChart data={pieTrafficData} title="Phân bổ nguồn traffic" />}
              {pieType === 'lead' && <PieChart data={pieLeadData} title="Phân bổ nguồn lead" />}
              {pieType === 'revenue' && <PieChart data={pieRevenueData} title="Phân bổ nguồn doanh thu" />}
            </div>

            {/* Engagement, CPC, CPM Charts */}
            <EngagementChart data={engagementChartData} />
            <CPCChart data={cpcChartData} />
            <CPMChart data={cpmChartData} />

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
              channelDetailData={emptyChannelDetailData}
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
        return (
          <div className="w-full">
            <DashboardContent 
              platformData={platformData}
              currentView={currentView}
              connectedPlatforms={connectedPlatforms}
              hasConnectedPlatforms={hasConnectedPlatforms}
              selectedAccounts={selectedAccounts}
              onAccountSelectionChange={handleAccountSelectionChange}
              executiveData={executiveData}
              channelDetailData={emptyChannelDetailData}
              dateRangeString={dateRangeString}
            />
          </div>
        );

      case 'channels':
        return (
          <div className="w-full">
            <DashboardContent 
              platformData={platformData}
              currentView={currentView}
              connectedPlatforms={connectedPlatforms}
              hasConnectedPlatforms={hasConnectedPlatforms}
              selectedAccounts={selectedAccounts}
              onAccountSelectionChange={handleAccountSelectionChange}
              executiveData={executiveData}
              channelDetailData={emptyChannelDetailData}
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
        onClose={handleCloseGoalModal}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      <KPIImportModal
        isOpen={showKPIModal}
        onClose={handleCloseKPIModal}
        onImport={handleImportKPI}
      />
    </div>
  );
};

export default Dashboard; 
