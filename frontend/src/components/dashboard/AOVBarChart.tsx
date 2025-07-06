import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface FunnelData {
  id: string;
  name: string;
  revenue: number;
  order: number;
}

interface AOVBarChartProps {
  data: FunnelData[];
}

const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AOVBarChart: React.FC<AOVBarChartProps> = ({ data }) => {
  // Tính AOV cho từng channel
  const chartData = useMemo(() => {
    return data.map((channel) => ({
      name: channel.name,
      aov: channel.order > 0 ? Math.round(channel.revenue / channel.order) : 0
    }));
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">AOV (Giá trị đơn hàng trung bình) theo kênh</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={v => `₫${v.toLocaleString('vi-VN')}`} />
          <Tooltip formatter={(value: any) => `₫${value.toLocaleString('vi-VN')}`} />
          <Bar dataKey="aov" name="AOV" fill={chartColors[0]} isAnimationActive={false}>
            <LabelList dataKey="aov" position="top" formatter={(value: any) => `₫${value.toLocaleString('vi-VN')}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AOVBarChart; 