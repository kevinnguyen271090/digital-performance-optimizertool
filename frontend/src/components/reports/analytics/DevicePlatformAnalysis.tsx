import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DeviceData } from '@/utils/mockSegmentationData';

interface DevicePlatformAnalysisProps {
  data: DeviceData[];
}

const COLORS = ['#2563eb', '#f59e42'];

const DevicePlatformAnalysis: React.FC<DevicePlatformAnalysisProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip contentStyle={{ background: '#222', color: '#fff', borderRadius: 8, border: '1px solid #22d3ee' }} />
          <Legend wrapperStyle={{
            padding: 8,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #a21caf22, #ec489922)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 2px 8px #0002',
          }} />
          <Bar dataKey="users" name="Users" fill={COLORS[0]} />
          <Bar dataKey="avgSession" name="Avg Session" fill={COLORS[1]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-max w-full border text-xs md:text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Thiết bị/Nền tảng</th>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Khách hàng</th>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={d.device} className={d.isWarning ? 'bg-red-100 dark:bg-red-700/60' : ''}>
                <td className="border px-2 py-1 font-medium text-gray-900 dark:text-white">{d.device}</td>
                <td className="border px-2 py-1 text-gray-900 dark:text-white">{d.customers}</td>
                <td className="border px-2 py-1 text-gray-900 dark:text-white">{d.ratio}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevicePlatformAnalysis; 