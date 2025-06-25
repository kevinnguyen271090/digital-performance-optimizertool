import React from "react";
import DashboardKPIs from "./DashboardKPIs";
import DashboardGoals from "./DashboardGoals";
import DashboardActivity from "./DashboardActivity";
import { Goal } from "../../types/goals";
import { useTranslation } from 'react-i18next';

interface DashboardOverviewProps {
  kpis: Array<{
    title: string;
    value: string;
    change: number;
    status: "warning" | "normal" | "danger";
    icon: React.ReactNode;
  }>;
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenGoalModal: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = React.memo(({
  kpis,
  goals,
  onEditGoal,
  onDeleteGoal,
  onOpenGoalModal
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{t('dashboard.overview', 'Tổng quan KPI')}</h2>
      {/* Quick Stats */}
      <DashboardKPIs kpis={kpis} />

      {/* Goals Section */}
      <DashboardGoals
        goals={goals}
        onEditGoal={onEditGoal}
        onDeleteGoal={onDeleteGoal}
        onOpenGoalModal={onOpenGoalModal}
      />

      {/* Recent Activity */}
      <DashboardActivity />

      {kpis.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          {t('dashboard.no_kpi', 'Chưa có dữ liệu KPI')}
        </div>
      )}
    </div>
  );
});

export default DashboardOverview; 