import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieData[];
  title?: string;
  height?: number;
}

const COLORS = [
  '#6366f1', // Indigo
  '#22d3ee', // Cyan
  '#34d399', // Green
  '#fbbf24', // Yellow
  '#f87171', // Red
  '#a78bfa', // Purple
  '#f472b6', // Pink
  '#60a5fa', // Blue
];

const PieChart: React.FC<PieChartProps> = ({ data, title = 'Phân bổ nguồn', height = 320 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN')} />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart; 