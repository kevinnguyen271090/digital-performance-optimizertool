import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';
import { ResponsiveSankey } from '@nivo/sankey';
import { mockAttributionJourneys, buildSankeyData } from '@/utils';
import Modal from '../../ui/modal';

const CustomerJourneyMapModalContent: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  // Chuẩn bị data cho Sankey chart
  const { nodes, links } = useMemo(() => buildSankeyData(mockAttributionJourneys), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Customer Journey Map
        </h3>
        <button
          type="button"
          className="ml-2 text-blue-600 hover:text-blue-800"
          onClick={() => setShowInfo(true)}
          aria-label="Giải thích Customer Journey Map"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      <div className="mb-4" style={{ height: 320 }}>
        <ResponsiveSankey
          data={{ nodes, links }}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeBorderWidth={1}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkContract={8}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={8}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
          animate={true}
          motionConfig="gentle"
        />
      </div>
      {/* Modal giải thích Customer Journey Map */}
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="Giải thích Customer Journey Map">
        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <b>Customer Journey Map là gì?</b><br/>
            <span className="italic">Ý nghĩa:</span> Minh họa trực quan hành trình khách hàng đi qua các kênh/điểm chạm (touchpoint) trước khi chuyển đổi.<br/>
            <span className="italic">Ví dụ:</span> Một khách hàng có thể đi từ Google → Facebook → Email trước khi mua hàng. Journey map giúp bạn thấy kênh nào thường xuất hiện ở đầu, giữa, cuối hành trình và mối liên hệ giữa các kênh.<br/>
          </div>
          <div>
            <b>Ứng dụng:</b><br/>
            - Hiểu rõ hành vi khách hàng đa kênh.<br/>
            - Tối ưu hóa chiến dịch marketing theo từng điểm chạm.<br/>
            - Phát hiện bottleneck hoặc cơ hội tăng trưởng trong hành trình khách hàng.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerJourneyMapModalContent; 