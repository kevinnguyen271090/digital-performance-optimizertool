import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { mockAttributionJourneys, calculateAttribution, AttributionModel } from '@/utils';

const MultiTouchAttributionTab: React.FC = () => {
  const [model, setModel] = useState<AttributionModel>('Last Click');

  const attributionData = useMemo(() => {
    const result = calculateAttribution(mockAttributionJourneys, model);
    return Object.entries(result).map(([channel, value]) => ({ channel, value: Number(value.toFixed(2)) }));
  }, [model]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-2">
        <b>Multi-touch Attribution:</b> Phân bổ chuyển đổi cho nhiều kênh trong hành trình khách hàng, giúp đánh giá chính xác vai trò của từng kênh marketing.<br/>
        <span className="block mt-1">Chọn mô hình attribution để xem số chuyển đổi được phân bổ cho từng kênh. So sánh sự khác biệt giữa các mô hình để tối ưu chiến lược marketing đa kênh.</span>
      </div>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={attributionData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2563eb" name="Phân bổ chuyển đổi" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <form onSubmit={handleSubmit} className="mb-2">
        <label className="block mb-2 text-sm font-medium">Chọn mô hình Attribution:</label>
        <select className="border rounded px-2 py-1 mb-2 w-full text-black placeholder:text-black bg-white" value={model} onChange={e => setModel(e.target.value as AttributionModel)}>
          <option>Last Click</option>
          <option>First Click</option>
          <option>Linear</option>
          <option>Time Decay</option>
          <option>Position-based (U-shaped)</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Phân tích</button>
      </form>
    </div>
  );
};

export default MultiTouchAttributionTab; 