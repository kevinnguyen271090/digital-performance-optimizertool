import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CohortRevenueData } from '@/utils/mockCohortAndCampaignData';

interface CohortRevenueAnalysisProps {
  data: CohortRevenueData[];
}

const CohortRevenueAnalysis: React.FC<CohortRevenueAnalysisProps> = ({ data }) => {
  const cohorts = Array.from(new Set(data.map(d => d.cohort)));
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);
  const chartData = weeks.map(week => {
    const row: any = { week };
    cohorts.forEach(cohort => {
      const found = data.find(d => d.cohort === cohort && d.week === week);
      row[cohort] = found?.revenue ?? null;
      row[`${cohort}_isOutlier`] = found?.isOutlier;
      row[`${cohort}_isMissing`] = found?.revenue === null;
    });
    return row;
  });
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip formatter={v => v === null ? 'N/A' : v} />
          <Legend />
          {cohorts.map((cohort, idx) => (
            <Area
              key={cohort}
              type="monotone"
              dataKey={cohort}
              name={cohort}
              stroke={["#2563eb", "#f59e42", "#10b981"][idx % 3]}
              fill={["#2563eb33", "#f59e4233", "#10b98133"][idx % 3]}
              connectNulls
              dot={(props) => {
                const d = props.payload;
                if (d[`${cohort}_isOutlier`]) return <circle {...props} r={6} fill="#ef4444" />;
                if (d[`${cohort}_isMissing`]) return <circle {...props} r={6} fill="#facc15" />;
                return <circle {...props} r={3} fill={props.stroke} />;
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CohortRevenueAnalysis; 