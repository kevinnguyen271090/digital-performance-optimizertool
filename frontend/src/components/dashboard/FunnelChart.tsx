import React from 'react';
import { ResponsiveContainer, ComposedChart, Polygon, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

interface FunnelStep {
  name: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  height?: number;
  revenue?: number;
}

const COLORS = [
  '#6366f1', // Indigo
  '#22d3ee', // Cyan
  '#34d399', // Green
];

// Hàm tạo polygon cho từng tầng phễu
function getFunnelPolygons(data: FunnelStep[], width: number, height: number) {
  const n = data.length;
  const max = data[0]?.value || 1;
  const minWidth = width * 0.2;
  const polygons = [];
  for (let i = 0; i < n; i++) {
    const topW = i === 0 ? width : Math.max(minWidth, width * (data[i].value / max));
    const botW = i === n - 1 ? minWidth : Math.max(minWidth, width * (data[i + 1].value / max));
    const y0 = (height / n) * i;
    const y1 = (height / n) * (i + 1);
    polygons.push({
      points: [
        [(width - topW) / 2, y0],
        [(width + topW) / 2, y0],
        [(width + botW) / 2, y1],
        [(width - botW) / 2, y1],
      ],
      value: data[i].value,
      name: data[i].name,
      color: COLORS[i % COLORS.length],
      yMid: (y0 + y1) / 2,
    });
  }
  return polygons;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, height = 320, revenue }) => {
  // Chỉ lấy các bước traffic, lead, order (không lấy revenue)
  const funnelSteps = data.filter(step => step.name.toLowerCase() !== 'revenue');
  const width = 320;
  const polygons = getFunnelPolygons(funnelSteps, width, height - 40);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full mb-6">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">Phễu chuyển đổi tổng quan</h3>
      <ResponsiveContainer width="100%" height={height}>
        <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
          {polygons.map((poly, idx) => (
            <g key={poly.name}>
              <polygon
                points={poly.points.map(p => p.join(",")).join(" ")}
                fill={poly.color}
                fillOpacity={0.85 - idx * 0.1}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={width / 2}
                y={poly.yMid + 8}
                textAnchor="middle"
                fontWeight="bold"
                fontSize={18}
                fill="#fff"
                style={{ textShadow: '0 1px 4px #0008' }}
              >
                {poly.value.toLocaleString('vi-VN')}
              </text>
              <text
                x={width / 2}
                y={poly.yMid - 12}
                textAnchor="middle"
                fontSize={14}
                fill="#fff"
                style={{ textShadow: '0 1px 4px #0008' }}
              >
                {poly.name}
              </text>
            </g>
          ))}
        </svg>
      </ResponsiveContainer>
      {typeof revenue === 'number' && (
        <div className="mt-4 flex justify-center">
          <div className="bg-yellow-500 text-white rounded-lg px-6 py-2 font-bold text-lg shadow">
            Doanh thu: {revenue.toLocaleString('vi-VN')}
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelChart; 