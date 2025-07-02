import React from 'react';
import { Plus } from 'lucide-react';

interface GoalsSectionProps {
  goals: any[];
  onAddGoal: () => void;
  t: any;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onAddGoal, t }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
          {t('dashboard.goals_targets', 'Goals & Targets')}
        </h3>
        <button 
          onClick={onAddGoal}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Thêm
        </button>
      </div>
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
  );
};

export default GoalsSection; 