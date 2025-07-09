import React, { useState } from 'react';
import RFMAnalysis from './RFMAnalysis';
import BehavioralSegmentation from './BehavioralSegmentation';
import GeographicAnalysis from './GeographicAnalysis';
import DevicePlatformAnalysis from './DevicePlatformAnalysis';
import { useSegmentationData } from '@/hooks/useSegmentationData';

const TABS = [
  { key: 'rfm', label: 'RFM Analysis' },
  { key: 'behavioral', label: 'Behavioral Segmentation' },
  { key: 'geographic', label: 'Geographic Analysis' },
  { key: 'device', label: 'Device/Platform Analysis' },
];

const SegmentationModalContent: React.FC = () => {
  const { rfm, behavioral, geographic, device } = useSegmentationData();
  const [tab, setTab] = useState('rfm');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Hướng dẫn & Ý nghĩa</h3>
        <ul className="list-disc pl-6 text-gray-700 text-sm mb-4">
          <li><b>RFM Analysis</b>: Phân tích nhóm khách hàng theo Recency, Frequency, Monetary để xác định nhóm trung thành, tiềm năng, rủi ro...</li>
          <li><b>Behavioral Segmentation</b>: Phân khúc theo hành vi (mua, xem, click, v.v.), giúp tối ưu chiến dịch cá nhân hóa.</li>
          <li><b>Geographic Analysis</b>: Phân tích theo vùng miền, quốc gia, xác định thị trường tiềm năng, tối ưu ngân sách.</li>
          <li><b>Device/Platform Analysis</b>: Phân tích theo thiết bị, nền tảng, giúp tối ưu trải nghiệm và phân bổ nguồn lực.</li>
        </ul>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 border-b mb-4">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-4 py-2 font-medium rounded-t transition-colors duration-150 focus:outline-none ${tab === t.key ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'bg-gray-50 text-gray-600 hover:bg-blue-50'}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-2">
          {tab === 'rfm' && <RFMAnalysis data={rfm} />}
          {tab === 'behavioral' && <BehavioralSegmentation data={behavioral} />}
          {tab === 'geographic' && <GeographicAnalysis data={geographic} />}
          {tab === 'device' && <DevicePlatformAnalysis data={device} />}
        </div>
      </div>
    </div>
  );
};

export default SegmentationModalContent; 