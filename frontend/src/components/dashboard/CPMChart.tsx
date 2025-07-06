import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CPMDataPoint {
  label: string; // ngày hoặc tên kênh
  cpm: number;
}

interface CPMChartProps {
  data: CPMDataPoint[];
  height?: number;
}

const CPMChart: React.FC<CPMChartProps> = ({ data, height = 320 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Biểu đồ CPM</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₫${Math.round(value).toLocaleString('vi-VN')}`} />
          <Legend />
          <Line type="monotone" dataKey="cpm" stroke="#22d3ee" name="CPM (₫)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CPMChart; 