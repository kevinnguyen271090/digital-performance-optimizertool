import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface FunnelData {
  id: string;
  name: string;
  cost: number;
  lead: number;
  qualified_lead: number;
  order: number;
}

interface CostPerStageChartProps {
  data: FunnelData[];
}

const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const steps = [
  { key: 'cost_per_lead', label: 'Cost/Lead' },
  { key: 'cost_per_qualified', label: 'Cost/Qualified Lead' },
  { key: 'cost_per_order', label: 'Cost/Order' },
];

const CostPerStageChart: React.FC<CostPerStageChartProps> = ({ data }) => {
  // Tính cost per stage cho từng channel
  const chartData = useMemo(() => {
    return steps.map((step) => {
      const obj: any = { step: step.label };
      data.forEach((channel) => {
        const cost = channel.cost || 0;
        const lead = channel.lead || 0;
        const qualified = channel.qualified_lead || 0;
        const order = channel.order || 0;
        if (step.key === 'cost_per_lead') {
          obj[channel.name] = lead > 0 ? Math.round(cost / lead) : 0;
        } else if (step.key === 'cost_per_qualified') {
          obj[channel.name] = qualified > 0 ? Math.round(cost / qualified) : 0;
        } else if (step.key === 'cost_per_order') {
          obj[channel.name] = order > 0 ? Math.round(cost / order) : 0;
        }
      });
      return obj;
    });
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Chi phí cho từng giai đoạn funnel</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="step" />
          <YAxis tickFormatter={v => `₫${v.toLocaleString('vi-VN')}`} />
          <Tooltip formatter={(value: any) => `₫${value.toLocaleString('vi-VN')}`} />
          <Legend />
          {data.map((channel, idx) => (
            <Bar key={channel.id} dataKey={channel.name} name={channel.name} fill={chartColors[idx % chartColors.length]} isAnimationActive={false}>
              <LabelList dataKey={channel.name} position="top" formatter={(value: any) => `₫${value.toLocaleString('vi-VN')}`} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostPerStageChart; 