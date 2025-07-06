import React from 'react';
import DashboardInsights from './DashboardInsights';

interface InsightsSectionProps {
  platformData: any;
  selectedChannel: string;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ platformData, selectedChannel }) => {
  // Giả sử insights lấy từ platformData hoặc props, tuỳ logic thực tế
  const insights = platformData?.insights || [];

  if (!insights || insights.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center py-12">
          <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <p className="text-gray-400 text-lg">Chưa có insight nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight: any, idx: number) => (
        <div
          key={idx}
          className={`p-4 rounded-lg shadow ${insight.priority === 'high' ? 'border-l-4 border-yellow-500 bg-yellow-50' : 'bg-white dark:bg-gray-800'}`}
          title={insight.description || insight.title}
        >
          <div className="flex items-center">
            {insight.priority === 'high' && <span className="mr-2 text-yellow-500">⚡</span>}
            <span className="font-semibold">{insight.title}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">{insight.description}</div>
        </div>
      ))}
    </div>
  );
};

export default InsightsSection; 