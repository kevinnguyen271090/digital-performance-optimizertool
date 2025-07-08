import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CohortComparisonData } from '@/utils/mockCohortAndCampaignData';

interface CohortComparisonToolProps {
  data: CohortComparisonData[];
}

const COLORS = ["#2563eb", "#f59e42", "#10b981"];

const CohortComparisonTool: React.FC<CohortComparisonToolProps> = ({ data }) => {
  // Mỗi chỉ số là 1 line, trục X là cohort
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cohort" />
          <YAxis yAxisId="left" label={{ value: 'Doanh thu', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Retention/Actions', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="avgRevenue" name="Avg Revenue" stroke={COLORS[0]} />
          <Line yAxisId="right" type="monotone" dataKey="avgRetention" name="Avg Retention" stroke={COLORS[1]} />
          <Line yAxisId="right" type="monotone" dataKey="avgActions" name="Avg Actions" stroke={COLORS[2]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CohortComparisonTool; 