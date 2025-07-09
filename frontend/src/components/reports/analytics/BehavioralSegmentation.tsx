import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BehavioralData } from '@/utils/mockSegmentationData';

interface BehavioralSegmentationProps {
  data: BehavioralData[];
}

const COLORS = ['#2563eb', '#f59e42', '#10b981', '#ef4444'];

const BehavioralSegmentation: React.FC<BehavioralSegmentationProps> = ({ data }) => {
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);
  const actions = Array.from(new Set(data.map(d => d.action)));
  const segments = Array.from(new Set(data.map(d => d.segment)));
  // Group data theo tuần, action, segment
  const chartData = weeks.map(week => {
    const row: any = { week };
    actions.forEach(action => {
      segments.forEach(segment => {
        const found = data.find(d => d.week === week && d.action === action && d.segment === segment);
        row[`${action}_${segment}`] = found?.count ?? 0;
      });
    });
    return row;
  });
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {actions.map((action, aIdx) => (
            segments.map((segment, sIdx) => (
              <Bar
                key={`${action}_${segment}`}
                dataKey={`${action}_${segment}`}
                name={`${action} (${segment})`}
                stackId={action}
                fill={COLORS[sIdx % COLORS.length]}
              />
            ))
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BehavioralSegmentation; 