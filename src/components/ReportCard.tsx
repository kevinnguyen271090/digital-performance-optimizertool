import React, { useState } from "react";
import { Download, Share2, Eye, Calendar, FileText } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    name: string;
    timeRange: string;
    includes: {
      kpi: boolean;
      charts: boolean;
      recommendations: boolean;
    };
    createdAt: string;
    status: string;
  };
  onView: (report: any) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  const [isSharing, setIsSharing] = useState(false);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "last_week": return "Tuần trước";
      case "last_month": return "Tháng trước";
      case "last_quarter": return "Quý trước";
      case "custom": return "Tùy chỉnh";
      default: return range;
    }
  };

  const handleShare = () => {
    setIsSharing(true);
    const shareUrl = `${window.location.origin}/report/${report.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link đã được copy vào clipboard!");
      setIsSharing(false);
    });
  };

  const handleDownload = () => {
    // Giả lập download PDF
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${report.name}.pdf`;
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{getTimeRangeLabel(report.timeRange)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{new Date(report.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          report.status === "completed" ? "bg-success/10 text-success" : "bg-yellow-100 text-yellow-800"
        }`}>
          {report.status === "completed" ? "Hoàn thành" : "Đang tạo"}
        </span>
      </div>

      {/* Includes */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Bao gồm:</p>
        <div className="flex flex-wrap gap-2">
          {report.includes.kpi && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">KPI</span>
          )}
          {report.includes.charts && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">Charts</span>
          )}
          {report.includes.recommendations && (
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">Recommendations</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(report)}
          className="flex items-center space-x-1 px-3 py-2 text-accent hover:bg-accent/10 rounded-lg transition"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">Xem</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-2 text-success hover:bg-success/10 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Tải</span>
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center space-x-1 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">{isSharing ? "Đã copy" : "Chia sẻ"}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportCard; 