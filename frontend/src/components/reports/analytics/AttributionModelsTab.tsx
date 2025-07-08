import React, { useMemo } from 'react';
import { mockAttributionJourneys, calculateAttribution, AttributionModel } from '@/utils';

const MODELS: AttributionModel[] = [
  'Last Click',
  'First Click',
  'Linear',
  'Time Decay',
  'Position-based (U-shaped)'
];

const AttributionModelsTab: React.FC = () => {
  // Tính phân bổ cho từng mô hình
  const data = useMemo(() => {
    const allResults: Record<string, Record<string, number>> = {};
    MODELS.forEach(model => {
      allResults[model] = calculateAttribution(mockAttributionJourneys, model);
    });
    // Lấy tất cả các kênh xuất hiện
    const allChannels = Array.from(new Set(
      Object.values(allResults).flatMap(result => Object.keys(result))
    ));
    return { allResults, allChannels };
  }, []);

  return (
    <div>
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-2">
        <b>Attribution Models Comparison:</b> So sánh kết quả phân bổ chuyển đổi của từng mô hình attribution cho từng kênh.<br/>
        <span className="block mt-1">Bảng so sánh số chuyển đổi được phân bổ cho từng kênh theo từng mô hình. Đối chiếu sự khác biệt giữa các mô hình để chọn mô hình phù hợp với mục tiêu kinh doanh.</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Kênh</th>
              {MODELS.map(model => (
                <th key={model} className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">{model}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.allChannels.map(channel => (
              <tr key={channel}>
                <td className="border px-2 py-1 font-medium">{channel}</td>
                {MODELS.map(model => (
                  <td key={model} className="border px-2 py-1 text-center">
                    {data.allResults[model][channel]?.toFixed(2) || '0'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributionModelsTab; 