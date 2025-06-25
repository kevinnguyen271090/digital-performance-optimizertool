import React from "react";
import GoalCard from "../GoalCard";
import { Goal } from "../../types/goals";
import { useTranslation } from 'react-i18next';

interface DashboardGoalsProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenGoalModal: () => void;
}

const DashboardGoals: React.FC<DashboardGoalsProps> = React.memo(({
  goals,
  onEditGoal,
  onDeleteGoal,
  onOpenGoalModal
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.goals', 'Mục tiêu')}
          </h2>
          <button
            onClick={onOpenGoalModal}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Thêm mục tiêu</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => onEditGoal(goal)}
                onDelete={() => onDeleteGoal(goal.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('dashboard.no_goals', 'Chưa có mục tiêu nào được thiết lập')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tạo mục tiêu để theo dõi hiệu suất marketing
            </p>
            <button
              onClick={onOpenGoalModal}
              className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition"
            >
              Tạo mục tiêu đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default DashboardGoals; 