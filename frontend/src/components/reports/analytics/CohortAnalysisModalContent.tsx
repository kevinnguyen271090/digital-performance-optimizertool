import React, { useState, useMemo } from 'react';
import { Users, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { mockAttributionJourneys, AttributionJourney } from '@/utils/mockAttributionJourneys';
import Modal from '../../ui/modal';

// Sinh cohortWeek cho mỗi journey (giả lập)
function assignCohortWeeks(journeys: AttributionJourney[], numWeeks = 8): (AttributionJourney & { cohortWeek: number })[] {
  return journeys.map(j => ({ ...j, cohortWeek: Math.floor(Math.random() * numWeeks) + 1 }));
}

// Sinh dữ liệu retention: mỗi cohort, mỗi tuần còn lại bao nhiêu journey
function buildCohortRetention(journeys: (AttributionJourney & { cohortWeek: number })[], numWeeks = 8): Record<string, any>[] {
  const cohorts: Record<string, number[]> = {};
  journeys.forEach(j => {
    const cohort = `Week ${j.cohortWeek}`;
    if (!cohorts[cohort]) cohorts[cohort] = Array(numWeeks).fill(0);
    for (let w = j.cohortWeek - 1; w < numWeeks; w++) {
      cohorts[cohort][w] += 1;
    }
  });
  // Chuyển thành mảng cho chart
  const chart: Record<string, any>[] = [];
  for (let w = 0; w < numWeeks; w++) {
    const row: Record<string, any> = { week: `Week ${w + 1}` };
    Object.keys(cohorts).forEach(cohort => {
      row[cohort] = cohorts[cohort][w];
    });
    chart.push(row);
  }
  return chart;
}

// Sinh dữ liệu revenue: mỗi cohort, mỗi tuần tổng revenue (giả sử mỗi journey revenue=1)
function buildCohortRevenue(journeys: (AttributionJourney & { cohortWeek: number })[], numWeeks = 8): Record<string, any>[] {
  const cohorts: Record<string, number[]> = {};
  journeys.forEach(j => {
    const cohort = `Week ${j.cohortWeek}`;
    if (!cohorts[cohort]) cohorts[cohort] = Array(numWeeks).fill(0);
    for (let w = j.cohortWeek - 1; w < numWeeks; w++) {
      cohorts[cohort][w] += 1; // có thể thay bằng j.revenue nếu có
    }
  });
  // Chuyển thành mảng cho chart
  const chart: Record<string, any>[] = [];
  for (let w = 0; w < numWeeks; w++) {
    const row: Record<string, any> = { week: `Week ${w + 1}` };
    Object.keys(cohorts).forEach(cohort => {
      row[cohort] = cohorts[cohort][w];
    });
    chart.push(row);
  }
  return chart;
}

const CohortAnalysisModalContent: React.FC = () => {
  const [cohortType, setCohortType] = useState('Retention');
  const [showInfo, setShowInfo] = useState(false);
  const numWeeks = 8;

  // Gán cohortWeek cho journey (giả lập)
  const journeysWithCohort = useMemo(() => assignCohortWeeks(mockAttributionJourneys, numWeeks), []);

  // Sinh dữ liệu chart
  const chartData = useMemo(() => {
    if (cohortType === 'Retention') return buildCohortRetention(journeysWithCohort, numWeeks);
    return buildCohortRevenue(journeysWithCohort, numWeeks);
  }, [cohortType, journeysWithCohort]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Lấy danh sách cohort để vẽ nhiều line
  const cohortKeys = useMemo(() => {
    const keys = new Set<string>();
    chartData.forEach(row => {
      Object.keys(row).forEach(k => { if (k !== 'week') keys.add(k); });
    });
    return Array.from(keys);
  }, [chartData]);

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
      {/* Biểu đồ Cohort */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <button className={`px-2 py-1 rounded ${cohortType === 'Retention' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setCohortType('Retention')}>Retention</button>
          <button className={`px-2 py-1 rounded ${cohortType === 'Revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setCohortType('Revenue')}>Revenue</button>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {cohortKeys.map((cohort, idx) => (
              <Line key={cohort} type="monotone" dataKey={cohort} stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`} name={cohort} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium">Chọn loại Cohort:</label>
        <select className="border rounded px-2 py-1 mb-4 w-full" value={cohortType} onChange={e => setCohortType(e.target.value)}>
          <option value="Retention">Retention</option>
          <option value="Revenue">Revenue</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Phân tích</button>
      </form>
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