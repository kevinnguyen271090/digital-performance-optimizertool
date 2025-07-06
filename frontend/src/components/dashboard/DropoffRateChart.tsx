import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface FunnelData {
  id: string;
  name: string;
  platform: number;
  lead: number;
  qualified_lead: number;
  order: number;
}

interface DropoffRateChartProps {
  data: FunnelData[];
}

const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const steps = [
  { key: 'platform_to_lead', label: 'Platform → Lead' },
  { key: 'lead_to_qualified', label: 'Lead → Qualified' },
  { key: 'qualified_to_order', label: 'Qualified → Order' },
];

const DropoffRateChart: React.FC<DropoffRateChartProps> = ({ data }) => {
  // Tính drop-off rate từng bước cho từng channel
  const chartData = useMemo(() => {
    return data.map((channel) => {
      const platform = channel.platform || 1;
      const lead = channel.lead || 0;
      const qualified = channel.qualified_lead || 0;
      const order = channel.order || 0;
      return {
        name: channel.name,
        platform_to_lead: platform > 0 ? Math.round((1 - lead / platform) * 1000) / 10 : 0,
        lead_to_qualified: lead > 0 ? Math.round((1 - qualified / lead) * 1000) / 10 : 0,
        qualified_to_order: qualified > 0 ? Math.round((1 - order / qualified) * 1000) / 10 : 0,
      };
    });
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Tỷ lệ rớt từng bước trong funnel</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={v => `${v}%`} />
          <Tooltip formatter={(value: any) => `${value}%`} />
          <Legend />
          {steps.map((step, idx) => (
            <Bar key={step.key} dataKey={step.key} name={step.label} fill={chartColors[idx % chartColors.length]} isAnimationActive={false}>
              <LabelList dataKey={step.key} position="top" formatter={(value: any) => `${value}%`} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DropoffRateChart; 