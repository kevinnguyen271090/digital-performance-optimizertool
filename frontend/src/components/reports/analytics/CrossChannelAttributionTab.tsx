import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { mockAttributionJourneys, calculateAttribution, AttributionModel } from '@/utils';

const MODELS: AttributionModel[] = [
  'Last Click',
  'First Click',
  'Linear',
  'Time Decay',
  'Position-based (U-shaped)'
];

const CrossChannelAttributionTab: React.FC = () => {
  const [model, setModel] = useState<AttributionModel>('Last Click');

  // Tổng hợp doanh thu từ journey (giả sử mỗi conversion = 1 revenue)
  const data = useMemo(() => {
    const result = calculateAttribution(mockAttributionJourneys, model);
    return Object.entries(result).map(([channel, value]) => ({ channel, revenue: Number(value.toFixed(2)) }));
  }, [model]);

  return (
    <div>
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-2">
        <b>Cross-channel Revenue Attribution:</b> Phân bổ doanh thu cho từng kênh dựa trên hành trình đa kênh của khách hàng. (Mỗi conversion = 1 revenue)<br/>
        <span className="block mt-1">Chọn mô hình attribution để xem doanh thu được phân bổ cho từng kênh. So sánh hiệu quả đóng góp doanh thu giữa các kênh để tối ưu phân bổ ngân sách marketing.</span>
      </div>
      <form className="mb-2">
        <label className="block mb-2 text-sm font-medium">Chọn mô hình Attribution:</label>
        <select className="border rounded px-2 py-1 mb-2 w-full text-black placeholder:text-black bg-white" value={model} onChange={e => setModel(e.target.value as AttributionModel)}>
          {MODELS.map(m => <option key={m}>{m}</option>)}
        </select>
      </form>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrossChannelAttributionTab; 