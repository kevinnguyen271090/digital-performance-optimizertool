import React, { useState } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CampaignPerformancePoint } from '@/utils/mockCohortAndCampaignData';

interface CampaignPerformancePredictionProps {
  data: CampaignPerformancePoint[];
  campaigns: string[];
}

const COLORS = {
  impressions: '#2563eb',
  clicks: '#10b981',
  conversions: '#f59e42',
  revenue: '#ef4444',
  forecast: '#fbbf24',
};

const CampaignPerformancePrediction: React.FC<CampaignPerformancePredictionProps> = ({ data, campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0] || '');
  const filtered = data.filter(d => d.campaign === selectedCampaign);
  return (
    <div>
      <div className="mb-2 flex gap-2 items-center">
        <label className="text-xs font-medium">Chọn campaign:</label>
        <select className="border rounded px-2 py-1" value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
          {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Forecast area (confidence) */}
            <Area type="monotone" dataKey="forecastRevenue" stroke={COLORS.forecast} fill={COLORS.forecast} fillOpacity={0.15} isAnimationActive={false} />
            <Line type="monotone" dataKey="impressions" name="Impressions" stroke={COLORS.impressions} dot={false} />
            <Line type="monotone" dataKey="clicks" name="Clicks" stroke={COLORS.clicks} dot={false} />
            <Line type="monotone" dataKey="conversions" name="Conversions" stroke={COLORS.conversions} dot={false} />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.revenue} dot={props => {
              const d = props.payload;
              if (d.isOutlier) return <circle {...props} r={6} fill="#ef4444" />;
              if (d.isMissing) return <circle {...props} r={6} fill="#facc15" />;
              return <circle {...props} r={3} fill={props.stroke} />;
            }} />
            <Line type="monotone" dataKey="forecastRevenue" name="Forecast Revenue" stroke={COLORS.forecast} strokeDasharray="6 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Bảng số liệu chi tiết */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100">Ngày</th>
              <th className="border px-2 py-1 bg-gray-100">Impressions</th>
              <th className="border px-2 py-1 bg-gray-100">Clicks</th>
              <th className="border px-2 py-1 bg-gray-100">Conversions</th>
              <th className="border px-2 py-1 bg-gray-100">Revenue</th>
              <th className="border px-2 py-1 bg-gray-100">Forecast Revenue</th>
              <th className="border px-2 py-1 bg-gray-100">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={d.date} className={d.isOutlier ? 'bg-red-50' : d.isMissing ? 'bg-yellow-50' : ''}>
                <td className="border px-2 py-1 font-medium">{d.date}</td>
                <td className="border px-2 py-1 text-center">{d.impressions ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.clicks ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.conversions ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.revenue ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.forecastRevenue ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignPerformancePrediction; 