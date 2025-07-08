import React, { useState, useMemo } from 'react';
import { TrendingUp, Info, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Area } from 'recharts';
import { mockPredictiveData, PredictiveDataPoint } from '@/utils/mockPredictiveData';
import Modal from '../../ui/modal';

const METRICS = [
  { key: 'revenue', label: 'Doanh thu', forecast: 'forecastRevenue' },
  { key: 'churn', label: 'Churn', forecast: 'forecastChurn' },
  { key: 'ltv', label: 'LTV', forecast: 'forecastLTV' },
];

const channels = Array.from(new Set(mockPredictiveData.map(d => d.channel)));
const segments = Array.from(new Set(mockPredictiveData.map(d => d.segment)));

const PredictiveAnalyticsModalContent: React.FC = () => {
  const [metric, setMetric] = useState('revenue');
  const [channel, setChannel] = useState(channels[0]);
  const [segment, setSegment] = useState(segments[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [range, setRange] = useState(12); // số tháng gần nhất

  // Lọc dữ liệu theo kênh, phân khúc, chỉ số, và range thời gian
  const chartData = useMemo(() => {
    const filtered = mockPredictiveData
      .filter(d => d.channel === channel && d.segment === segment)
      .slice(-range);
    return filtered.map(d => ({
      month: d.month,
      value: d[metric as keyof PredictiveDataPoint],
      forecast: d[(METRICS.find(m => m.key === metric)?.forecast || '') as keyof PredictiveDataPoint],
      confidence: d.confidence,
      trendLabel: d.trendLabel,
      isOutlier: d.trendLabel && d.trendLabel.includes('mạnh'),
      isMissing: d[metric as keyof PredictiveDataPoint] === null,
    }));
  }, [channel, segment, metric, range]);

  const metricLabel = METRICS.find(m => m.key === metric)?.label || '';

  // Tooltip chi tiết
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-900 p-3 rounded shadow text-xs min-w-[180px]">
          <div><b>Tháng:</b> {label}</div>
          <div><b>{metricLabel} thực tế:</b> {d.value ?? 'N/A'}</div>
          <div><b>{metricLabel} dự báo:</b> {d.forecast ?? 'N/A'}</div>
          <div><b>Confidence:</b> {d.confidence ? d.confidence + '%' : 'N/A'}</div>
          <div><b>Xu hướng:</b> {d.trendLabel}</div>
          {d.isOutlier && <div className="text-red-600 flex items-center gap-1"><AlertCircle className="inline w-4 h-4" /> Outlier</div>}
          {d.isMissing && <div className="text-yellow-600 flex items-center gap-1"><AlertCircle className="inline w-4 h-4" /> Missing data</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-2">
        <b>Predictive Analytics:</b> Dự báo doanh thu, churn, LTV... theo kênh, phân khúc, thời gian.<br/>
        <span className="block mt-1">Chọn chỉ số, kênh, phân khúc để xem xu hướng thực tế & dự báo. Biểu đồ thể hiện cả giá trị thực tế (solid), dự báo (dashed), confidence interval (vùng mờ), highlight outlier/missing data. Có thể lọc số tháng gần nhất.</span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6" /> Predictive Analytics
        </h3>
        <button
          type="button"
          className="ml-2 text-blue-600 hover:text-blue-800"
          onClick={() => setShowInfo(true)}
          aria-label="Giải thích Predictive Analytics"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      {/* Bộ lọc */}
      <form className="flex flex-wrap gap-2 mb-2 items-end">
        <div>
          <label className="block mb-1 text-xs font-medium">Chỉ số</label>
          <select className="border rounded px-2 py-1" value={metric} onChange={e => setMetric(e.target.value)}>
            {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium">Kênh</label>
          <select className="border rounded px-2 py-1" value={channel} onChange={e => setChannel(e.target.value)}>
            {channels.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium">Phân khúc</label>
          <select className="border rounded px-2 py-1" value={segment} onChange={e => setSegment(e.target.value)}>
            {segments.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-medium">Số tháng gần nhất</label>
          <input type="number" min={6} max={30} value={range} onChange={e => setRange(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
        </div>
      </form>
      {/* Biểu đồ Predictive */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Confidence interval (area) */}
            <Area type="monotone" dataKey="forecast" stroke={"#f59e42"} fill="#f59e42" fillOpacity={0.15} isAnimationActive={false} />
            {/* Outlier dot */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              name={metricLabel + ' thực tế'}
              dot={props => {
                const d = props.payload;
                if (d.isOutlier) return React.createElement('circle', { ...props, r: 6, fill: '#ef4444' });
                if (d.isMissing) return React.createElement('circle', { ...props, r: 6, fill: '#facc15' });
                return React.createElement('circle', { ...props, r: 3, fill: '#2563eb' });
              }}
            />
            <Line type="monotone" dataKey="forecast" stroke="#f59e42" name={metricLabel + ' dự báo'} strokeDasharray="6 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Bảng số liệu chi tiết */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Tháng</th>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Giá trị thực tế</th>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Dự báo</th>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Confidence</th>
              <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">Xu hướng</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d, idx) => (
              <tr key={d.month} className={d.isOutlier ? 'bg-red-50 dark:bg-red-900/30' : d.isMissing ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''}>
                <td className="border px-2 py-1 font-medium">{d.month}</td>
                <td className="border px-2 py-1 text-center">{d.value ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.forecast ?? <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.confidence ? d.confidence + '%' : <span className="text-yellow-600">N/A</span>}</td>
                <td className="border px-2 py-1 text-center">{d.trendLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal giải thích Predictive Analytics */}
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="Giải thích Predictive Analytics">
        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <b>Predictive Analytics là gì?</b><br/>
            <span className="italic">Ý nghĩa:</span> Sử dụng dữ liệu lịch sử và mô hình dự đoán để dự báo các chỉ số tương lai như doanh thu, churn (rời bỏ), giá trị vòng đời khách hàng (LTV)...<br/>
            <span className="italic">Ví dụ:</span> Dự đoán doanh thu tháng tới dựa trên xu hướng các tháng trước, dự đoán tỷ lệ khách hàng rời bỏ, hoặc giá trị LTV của nhóm khách hàng mới.
          </div>
          <div>
            <b>Ứng dụng:</b><br/>
            - Lập kế hoạch tài chính, marketing.<br/>
            - Phát hiện sớm nguy cơ mất khách hàng.<br/>
            - Tối ưu hóa chiến dịch dựa trên dự báo.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PredictiveAnalyticsModalContent; 