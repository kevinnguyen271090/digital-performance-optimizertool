import React, { useState } from "react";
import { X, Download, FileText, Table, Sparkles, BarChart3, TrendingUp } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { H3, Lead } from "./ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50">
        {/* Modern Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <H3 className="text-xl">Tạo báo cáo mới</H3>
              <Lead className="text-sm opacity-75">Tùy chỉnh và xuất báo cáo chi tiết</Lead>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modern Content */}
        <div className="p-6 space-y-6">
          {/* Report Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tên báo cáo
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Nhập tên báo cáo..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Khoảng thời gian
            </label>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_week">Tuần trước</SelectItem>
                <SelectItem value="last_month">Tháng trước</SelectItem>
                <SelectItem value="last_quarter">Quý trước</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Định dạng báo cáo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setReportType("pdf")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  reportType === "pdf"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">PDF</span>
                </div>
              </button>
              <button
                onClick={() => setReportType("excel")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  reportType === "excel"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Table className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Excel</span>
                </div>
              </button>
            </div>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nội dung báo cáo
            </label>
            <div className="space-y-2">
              {[
                { key: 'kpi', label: 'KPI Tổng quan', icon: BarChart3, checked: includeKPI, setter: setIncludeKPI },
                { key: 'charts', label: 'Biểu đồ', icon: TrendingUp, checked: includeCharts, setter: setIncludeCharts },
                { key: 'recommendations', label: 'Khuyến nghị', icon: Sparkles, checked: includeRecommendations, setter: setIncludeRecommendations },
                { key: 'dataTable', label: 'Bảng dữ liệu', icon: Table, checked: includeDataTable, setter: setIncludeDataTable }
              ].map(({ key, label, icon: Icon, checked, setter }) => (
                <label key={key} className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setter(e.target.checked)}
                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tạo báo cáo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReportModal; 