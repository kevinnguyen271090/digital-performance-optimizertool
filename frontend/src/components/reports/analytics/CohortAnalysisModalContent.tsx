import React, { useState } from 'react';
import { Users, Info } from 'lucide-react';
import Modal from '../../ui/modal';
import { useCohortAnalysisData } from '@/hooks/useCohortAnalysisData';
import CohortRetentionChart from './CohortRetentionChart';
import CohortRevenueAnalysis from './CohortRevenueAnalysis';
import CohortBehaviorPatterns from './CohortBehaviorPatterns';
import CohortComparisonTool from './CohortComparisonTool';

const COHORT_TABS = [
  { key: 'Retention', label: 'Retention' },
  { key: 'Revenue', label: 'Revenue' },
  { key: 'Behavior', label: 'Behavior Patterns' },
  { key: 'Comparison', label: 'Comparison' },
];

const CohortAnalysisModalContent: React.FC = () => {
  const [cohortType, setCohortType] = useState('Retention');
  const [showInfo, setShowInfo] = useState(false);
  const { retention, revenue, behavior, comparison } = useCohortAnalysisData();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> Cohort Analysis
        </h3>
        <button
          type="button"
          className="ml-2 text-blue-600 hover:text-blue-800"
          onClick={() => setShowInfo(true)}
          aria-label="Giải thích Cohort Analysis"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      {/* Tabs chọn loại phân tích */}
      <div className="flex gap-2 mb-4">
        {COHORT_TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-2 py-1 rounded ${cohortType === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setCohortType(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Chart hiển thị theo loại */}
      <div className="mb-4">
        {cohortType === 'Retention' && <CohortRetentionChart data={retention} />}
        {cohortType === 'Revenue' && <CohortRevenueAnalysis data={revenue} />}
        {cohortType === 'Behavior' && <CohortBehaviorPatterns data={behavior} />}
        {cohortType === 'Comparison' && <CohortComparisonTool data={comparison} />}
      </div>
      {/* Modal giải thích Cohort Analysis */}
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="Giải thích Cohort Analysis">
        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <b>Cohort Analysis là gì?</b><br/>
            <span className="italic">Ý nghĩa:</span> Phân tích cohort giúp theo dõi hành vi, tỷ lệ giữ chân (retention) hoặc doanh thu của nhóm khách hàng cùng đặc điểm (ví dụ: cùng đăng ký trong 1 tuần) qua thời gian.<br/>
            <span className="italic">Ví dụ:</span> Nhóm khách hàng đăng ký tuần 1, sau 4 tuần còn lại bao nhiêu % vẫn sử dụng dịch vụ? Hoặc nhóm mua hàng tháng 1, sau 3 tháng còn tạo ra bao nhiêu doanh thu?
          </div>
          <div>
            <b>Ứng dụng:</b><br/>
            - Đo lường hiệu quả giữ chân khách hàng (retention).<br/>
            - Phân tích giá trị vòng đời khách hàng (LTV).<br/>
            - Đánh giá tác động của chiến dịch marketing theo từng nhóm cohort.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CohortAnalysisModalContent; 