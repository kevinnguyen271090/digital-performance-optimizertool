import React, { useState } from "react";
import { X, Download } from "lucide-react";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: any) => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ isOpen, onClose, onReportCreated }) => {
  const [timeRange, setTimeRange] = useState("last_week");
  const [includeKPI, setIncludeKPI] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Giả lập tạo report
    setTimeout(() => {
      const newReport = {
        id: `report-${Date.now()}`,
        name: `Báo cáo ${new Date().toLocaleDateString("vi-VN")}`,
        timeRange,
        includes: {
          kpi: includeKPI,
          charts: includeCharts,
          recommendations: includeRecommendations
        },
        createdAt: new Date().toISOString(),
        status: "completed"
      };
      
      // Lưu vào localStorage
      const reports = JSON.parse(localStorage.getItem("reports") || "[]");
      reports.unshift(newReport);
      localStorage.setItem("reports", JSON.stringify(reports));
      
      onReportCreated(newReport);
      setIsGenerating(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Tạo báo cáo mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Khoảng thời gian
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-accent"
            >
              <option value="last_week">Tuần trước</option>
              <option value="last_month">Tháng trước</option>
              <option value="last_quarter">Quý trước</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {/* Include Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bao gồm
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKPI}
                  onChange={(e) => setIncludeKPI(e.target.checked)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-700">KPI Overview</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-700">Trend Charts</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRecommendations}
                  onChange={(e) => setIncludeRecommendations(e.target.checked)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-700">AI Recommendations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Đang tạo..." : "Tạo PDF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReportModal; 