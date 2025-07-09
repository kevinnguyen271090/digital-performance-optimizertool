import React, { useState } from 'react';
import AttributionAnalysisTabs from './AttributionAnalysisTabs';
import Modal from '../../ui/modal';
import { Info } from 'lucide-react';

const AttributionAnalysisModalContent: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold">Attribution Analysis</h3>
        <button
          type="button"
          className="ml-2 text-blue-600 hover:text-blue-800"
          onClick={() => setShowInfo(true)}
          aria-label="Giải thích Attribution Analysis"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      <div className="mb-2 text-sm text-black bg-blue-50 rounded p-2">
        <b>Attribution Analysis:</b> Phân tích phân bổ chuyển đổi giúp xác định vai trò, đóng góp của từng kênh marketing trong hành trình khách hàng. So sánh các mô hình attribution để tối ưu ngân sách, chiến lược đa kênh.
      </div>
      <AttributionAnalysisTabs />
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="Giải thích Attribution Analysis">
        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <b>Attribution Analysis là gì?</b><br/>
            <span className="italic">Ý nghĩa:</span> Phân tích attribution giúp doanh nghiệp hiểu rõ kênh nào thực sự tạo ra chuyển đổi, tránh dồn ngân sách vào kênh kém hiệu quả.<br/>
            <span className="italic">Ví dụ:</span> Một khách hàng có thể đi qua Google → Facebook → Email trước khi mua hàng. Attribution analysis giúp xác định kênh nào đóng vai trò lớn nhất trong chuyển đổi.
          </div>
          <div>
            <b>Ứng dụng:</b><br/>
            - Tối ưu phân bổ ngân sách marketing đa kênh.<br/>
            - Đánh giá hiệu quả từng kênh/touchpoint.<br/>
            - So sánh các mô hình attribution (last click, first click, linear, v.v.) để chọn mô hình phù hợp mục tiêu kinh doanh.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttributionAnalysisModalContent; 