import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementDataPoint {
  date: string;
  like: number;
  share: number;
  comment: number;
  ctr: number;
  engagementRate: number;
}

interface EngagementChartProps {
  data: EngagementDataPoint[];
  height?: number;
}

const COLORS = {
  like: '#6366f1',
  share: '#22d3ee',
  comment: '#34d399',
  ctr: '#fbbf24',
  engagementRate: '#f87171',
};

const EngagementChart: React.FC<EngagementChartProps> = ({ data, height = 320 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Biểu đồ tương tác (Engagement)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="like" stroke={COLORS.like} name="Like" />
          <Line type="monotone" dataKey="share" stroke={COLORS.share} name="Share" />
          <Line type="monotone" dataKey="comment" stroke={COLORS.comment} name="Comment" />
          <Line type="monotone" dataKey="ctr" stroke={COLORS.ctr} name="CTR (%)" dot={false} />
          <Line type="monotone" dataKey="engagementRate" stroke={COLORS.engagementRate} name="Engagement Rate (%)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementChart; 