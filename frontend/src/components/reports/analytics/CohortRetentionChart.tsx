import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CohortRetentionData } from '@/utils/mockCohortAndCampaignData';

interface CohortRetentionChartProps {
  data: CohortRetentionData[];
}

const CohortRetentionChart: React.FC<CohortRetentionChartProps> = ({ data }) => {
  // Group by cohort
  const cohorts = Array.from(new Set(data.map(d => d.cohort)));
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);
  // Chuẩn hóa data cho Recharts
  const chartData = weeks.map(week => {
    const row: any = { week };
    cohorts.forEach(cohort => {
      const found = data.find(d => d.cohort === cohort && d.week === week);
      row[cohort] = found?.retentionRate ?? null;
      row[`${cohort}_isOutlier`] = found?.isOutlier;
      row[`${cohort}_isMissing`] = found?.retentionRate === null;
    });
    return row;
  });
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[0, 1]} tickFormatter={v => `${Math.round(v * 100)}%`} />
          <Tooltip formatter={v => v === null ? 'N/A' : `${Math.round(v * 100)}%`} />
          <Legend />
          {cohorts.map((cohort, idx) => (
            <Line
              key={cohort}
              type="monotone"
              dataKey={cohort}
              name={cohort}
              stroke={["#2563eb", "#f59e42", "#10b981"][idx % 3]}
              connectNulls
              dot={(props) => {
                const d = props.payload;
                if (d[`${cohort}_isOutlier`]) return <circle {...props} r={6} fill="#ef4444" />;
                if (d[`${cohort}_isMissing`]) return <circle {...props} r={6} fill="#facc15" />;
                return <circle {...props} r={3} fill={typeof props.stroke === 'string' ? props.stroke : '#2563eb'} />;
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CohortRetentionChart; 