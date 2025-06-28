import React, { useState } from "react";
import { X, Download, FileText, Table } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: any) => void;
  dashboardData?: any; // Dữ liệu từ dashboard
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ 
  isOpen, 
  onClose, 
  onReportCreated,
  dashboardData 
}) => {
  const { t } = useTranslation();
  const [reportName, setReportName] = useState("");
  const [timeRange, setTimeRange] = useState("last_week");
  const [reportType, setReportType] = useState("pdf"); // "pdf" hoặc "excel"
  const [includeKPI, setIncludeKPI] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeDataTable, setIncludeDataTable] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const generatePDFReport = async () => {
    // Sử dụng jsPDF để tạo PDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text(reportName || "Báo cáo Dashboard", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`, 20, 35);
    doc.text(`Khoảng thời gian: ${getTimeRangeLabel(timeRange)}`, 20, 45);
    
    let yPosition = 60;
    
    // KPI Section
    if (includeKPI && dashboardData) {
      doc.setFontSize(16);
      doc.text("KPI Tổng quan", 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      const kpis = [
        `Tổng doanh thu: ${formatCurrency(dashboardData.totalRevenue || 0)}`,
        `Tổng chi phí: ${formatCurrency(dashboardData.totalSpend || 0)}`,
        `ROAS: ${((dashboardData.totalRevenue || 0) / (dashboardData.totalSpend || 1)).toFixed(2)}`,
        `Tổng chuyển đổi: ${dashboardData.totalConversions || 0}`
      ];
      
      kpis.forEach(kpi => {
        doc.text(kpi, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }
    
    // Data Table
    if (includeDataTable && dashboardData?.platformData) {
      doc.setFontSize(16);
      doc.text("Dữ liệu theo nền tảng", 20, yPosition);
      yPosition += 15;
      
      const headers = ["Nền tảng", "Doanh thu", "Chi phí", "ROAS"];
      const data = Object.entries(dashboardData.platformData).map(([platform, data]: [string, any]) => [
        platform.charAt(0).toUpperCase() + platform.slice(1),
        formatCurrency(data.revenue || 0),
        formatCurrency(data.spend || 0),
        ((data.revenue || 0) / (data.spend || 1)).toFixed(2)
      ]);
      
      // Simple table
      doc.setFontSize(8);
      headers.forEach((header, i) => {
        doc.text(header, 25 + i * 40, yPosition);
      });
      yPosition += 8;
      
      data.forEach(row => {
        row.forEach((cell, i) => {
          doc.text(cell, 25 + i * 40, yPosition);
        });
        yPosition += 6;
      });
    }
    
    // Save PDF
    doc.save(`${reportName || 'bao-cao'}.pdf`);
  };

  const generateExcelReport = async () => {
    // Sử dụng xlsx để tạo Excel
    const XLSX = await import('xlsx');
    
    const workbook = XLSX.utils.book_new();
    
    // KPI Sheet
    if (includeKPI && dashboardData) {
      const kpiData = [
        ["KPI Tổng quan"],
        ["", ""],
        ["Tổng doanh thu", formatCurrency(dashboardData.totalRevenue || 0)],
        ["Tổng chi phí", formatCurrency(dashboardData.totalSpend || 0)],
        ["ROAS", ((dashboardData.totalRevenue || 0) / (dashboardData.totalSpend || 1)).toFixed(2)],
        ["Tổng chuyển đổi", dashboardData.totalConversions || 0]
      ];
      
      const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
      XLSX.utils.book_append_sheet(workbook, kpiSheet, "KPI");
    }
    
    // Platform Data Sheet
    if (includeDataTable && dashboardData?.platformData) {
      const headers = ["Nền tảng", "Doanh thu", "Chi phí", "Chuyển đổi", "ROAS", "CPA"];
      const data = Object.entries(dashboardData.platformData).map(([platform, data]: [string, any]) => [
        platform.charAt(0).toUpperCase() + platform.slice(1),
        data.revenue || 0,
        data.spend || 0,
        data.conversions || 0,
        ((data.revenue || 0) / (data.spend || 1)).toFixed(2),
        ((data.spend || 0) / (data.conversions || 1)).toFixed(0)
      ]);
      
      const platformSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      XLSX.utils.book_append_sheet(workbook, platformSheet, "Dữ liệu nền tảng");
    }
    
    // Save Excel
    XLSX.writeFile(workbook, `${reportName || 'bao-cao'}.xlsx`);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      if (reportType === "pdf") {
        await generatePDFReport();
      } else {
        await generateExcelReport();
      }
      
      const newReport = {
        id: `report-${Date.now()}`,
        name: reportName || `Báo cáo ${new Date().toLocaleDateString("vi-VN")}`,
        type: reportType,
        timeRange,
        includes: {
          kpi: includeKPI,
          charts: includeCharts,
          recommendations: includeRecommendations,
          dataTable: includeDataTable
        },
        createdAt: new Date().toISOString(),
        status: "completed"
      };
      
      // Lưu vào localStorage
      const reports = JSON.parse(localStorage.getItem("reports") || "[]");
      reports.unshift(newReport);
      localStorage.setItem("reports", JSON.stringify(reports));
      
      onReportCreated(newReport);
      onClose();
    } catch (error) {
      console.error("Lỗi tạo báo cáo:", error);
      alert("Có lỗi xảy ra khi tạo báo cáo. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "last_week": return "Tuần trước";
      case "last_month": return "Tháng trước";
      case "last_quarter": return "Quý trước";
      case "custom": return "Tùy chỉnh";
      default: return range;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {t('reports.create_report', 'Tạo báo cáo mới')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reports.report_name', 'Tên báo cáo')}
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-accent"
              placeholder={t('reports.report_name_placeholder', 'Nhập tên báo cáo')}
            />
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Định dạng báo cáo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportType("pdf")}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition ${
                  reportType === "pdf" 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setReportType("excel")}
                className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition ${
                  reportType === "excel" 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Table className="w-4 h-4" />
                <span className="text-sm">Excel</span>
              </button>
            </div>
          </div>

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
                  checked={includeDataTable}
                  onChange={(e) => setIncludeDataTable(e.target.checked)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-700">Bảng dữ liệu</span>
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
            <span>{isGenerating ? "Đang tạo..." : `Tạo ${reportType.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReportModal; 