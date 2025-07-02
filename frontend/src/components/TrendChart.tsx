import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ChannelLine {
  name: string;
  color: string;
  dataKey: string;
  visible: boolean;
}

interface MultiLineChartProps {
  data: any[]; // [{date, meta:..., google:..., tiktok:..., ...}]
  channels: ChannelLine[];
  title: string;
}

const MultiLineTrendChart: React.FC<MultiLineChartProps> = ({ data, channels, title }) => {
  const [visibleChannels, setVisibleChannels] = useState<Set<string>>(
    new Set(channels.filter(c => c.visible !== false).map(c => c.dataKey))
  );

  const handleLegendClick = (o: any) => {
    const key = o.dataKey;
    setVisibleChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  return (
    <div className="w-full overflow-x-auto p-2 md:p-4">
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend onClick={handleLegendClick} />
            {channels.map(channel =>
              visibleChannels.has(channel.dataKey) && (
                <Line
                  key={channel.dataKey}
                  type="monotone"
                  dataKey={channel.dataKey}
                  stroke={channel.color}
                  strokeWidth={2}
                  dot={false}
                  name={channel.name}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiLineTrendChart; 