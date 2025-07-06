import React from 'react';

interface FunnelData {
  id: string;
  name: string;
  platform: number;
  lead: number;
  qualified_lead: number;
  order: number;
}

interface OverlayFunnelChartProps {
  data: FunnelData[];
  height?: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const steps = [
  { key: 'platform', label: 'Platform' },
  { key: 'lead', label: 'Lead' },
  { key: 'qualified_lead', label: 'Qualified' },
  { key: 'order', label: 'Order' },
];

const OverlayFunnelChart: React.FC<OverlayFunnelChartProps> = ({ data, height = 320 }) => {
  const width = 320;
  const funnelWidth = width * 0.8;
  const funnelHeight = height * 0.8;
  const offsetX = (width - funnelWidth) / 2;
  const offsetY = 40;

  // Tính max cho bước đầu để scale các funnel
  const maxPlatform = Math.max(...data.map(c => c.platform || 1), 1);

  // Tạo polygon cho từng channel
  const getFunnelPoints = (channel: FunnelData) => {
    const values = [channel.platform, channel.lead, channel.qualified_lead, channel.order];
    return values.map((val, i) => {
      const w = funnelWidth * (val / maxPlatform);
      const y = offsetY + (funnelHeight / (steps.length - 1)) * i;
      return [
        [offsetX + (funnelWidth - w) / 2, y],
        [offsetX + (funnelWidth + w) / 2, y],
      ];
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Overlay Funnel Chart (So sánh hình dạng funnel các kênh)</h3>
      <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
        {data.map((channel, idx) => {
          const points = getFunnelPoints(channel);
          // Tạo polygon cho funnel
          const polygonPoints = [
            ...points.map(p => p[0]),
            ...points.slice().reverse().map(p => p[1])
          ].map(p => p.join(",")).join(" ");
          return (
            <g key={channel.id}>
              <polygon
                points={polygonPoints}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.18 + 0.18 * idx}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
              />
              {/* Label tên channel */}
              <text
                x={width - 10}
                y={offsetY + 18 + idx * 20}
                textAnchor="end"
                fontSize={14}
                fontWeight="bold"
                fill={COLORS[idx % COLORS.length]}
              >
                {channel.name}
              </text>
            </g>
          );
        })}
        {/* Label các step */}
        {steps.map((step, i) => (
          <text
            key={step.key}
            x={10}
            y={offsetY + (funnelHeight / (steps.length - 1)) * i + 6}
            fontSize={13}
            fill="#888"
          >
            {step.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default OverlayFunnelChart; 