import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CPCDataPoint {
  label: string; // ngày hoặc tên kênh
  cpc: number;
}

interface CPCChartProps {
  data: CPCDataPoint[];
  height?: number;
}

const CPCChart: React.FC<CPCChartProps> = ({ data, height = 320 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Biểu đồ CPC</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₫${Math.round(value).toLocaleString('vi-VN')}`} />
          <Legend />
          <Line type="monotone" dataKey="cpc" stroke="#6366f1" name="CPC (₫)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CPCChart; 