import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CohortBehaviorData } from '@/utils/mockCohortAndCampaignData';

interface CohortBehaviorPatternsProps {
  data: CohortBehaviorData[];
}

// Chuyển đổi data thành dạng stacked bar: mỗi tuần là 1 cột, mỗi action là 1 stack, mỗi cohort là 1 màu
const COLORS = ["#2563eb", "#f59e42", "#10b981", "#ef4444"];

const CohortBehaviorPatterns: React.FC<CohortBehaviorPatternsProps> = ({ data }) => {
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);
  const actions = Array.from(new Set(data.map(d => d.action)));
  const cohorts = Array.from(new Set(data.map(d => d.cohort)));
  // Group data theo tuần, action, cohort
  const chartData = weeks.map(week => {
    const row: any = { week };
    actions.forEach(action => {
      cohorts.forEach(cohort => {
        const found = data.find(d => d.week === week && d.action === action && d.cohort === cohort);
        row[`${action}_${cohort}`] = found?.count ?? 0;
      });
    });
    return row;
  });
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {actions.map((action, aIdx) => (
            cohorts.map((cohort, cIdx) => (
              <Bar
                key={`${action}_${cohort}`}
                dataKey={`${action}_${cohort}`}
                name={`${action} (${cohort})`}
                stackId={action}
                fill={COLORS[cIdx % COLORS.length]}
              />
            ))
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CohortBehaviorPatterns; 