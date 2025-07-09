import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RFMData } from '@/utils/mockSegmentationData';

interface RFMAnalysisProps {
  data: RFMData[];
}

const COLORS = ['#2563eb', '#f59e42', '#10b981'];

const RFMAnalysis: React.FC<RFMAnalysisProps> = ({ data }) => {
  return (
    <div>
      <div className="w-full h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
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
            <Bar dataKey="recency" name="Recency" fill={COLORS[0]} />
            <Bar dataKey="frequency" name="Frequency" fill={COLORS[1]} />
            <Bar dataKey="monetary" name="Monetary" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border text-xs md:text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Segment</th>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Recency</th>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Frequency</th>
              <th className="border px-2 py-1 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">Monetary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={d.segment} className={d.isOutlier ? 'bg-red-100 dark:bg-red-700/60' : d.monetary === null ? 'bg-yellow-100 dark:bg-yellow-700/60' : ''}>
                <td className="border px-2 py-1 font-medium text-gray-900 dark:text-white">{d.segment}</td>
                <td className="border px-2 py-1 text-center text-gray-900 dark:text-white">{d.recency ?? <span className="bg-yellow-100 dark:bg-yellow-700/60 text-black dark:text-white font-semibold px-1 rounded">N/A</span>}</td>
                <td className="border px-2 py-1 text-center text-gray-900 dark:text-white">{d.frequency ?? <span className="bg-yellow-100 dark:bg-yellow-700/60 text-black dark:text-white font-semibold px-1 rounded">N/A</span>}</td>
                <td className="border px-2 py-1 text-center text-gray-900 dark:text-white">{d.monetary ?? <span className="bg-yellow-100 dark:bg-yellow-700/60 text-black dark:text-white font-semibold px-1 rounded">N/A</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RFMAnalysis; 