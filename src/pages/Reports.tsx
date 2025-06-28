import React, { useState, useEffect } from "react";
import CreateReportModal from "../components/CreateReportModal";
import ReportCard from "../components/ReportCard";
import { Plus, FileText, Table, BarChart3 } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Load reports từ localStorage
    const savedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    setReports(savedReports);
    
    // Load dashboard data từ localStorage (nếu có)
    const savedDashboardData = localStorage.getItem("dashboardData");
    if (savedDashboardData) {
      setDashboardData(JSON.parse(savedDashboardData));
    }
  }, []);

  const handleReportCreated = (newReport: any) => {
    setReports([newReport, ...reports]);
  };

  const handleViewReport = (report: any) => {
    // Có thể mở modal preview hoặc chuyển trang
    alert(`Xem báo cáo: ${report.name}`);
  };

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const quickReportTemplates = [
    {
      id: "overview",
      name: "Báo cáo tổng quan",
      description: "Tổng hợp KPI và metrics chính",
      icon: BarChart3,
      type: "pdf"
    },
    {
      id: "platform",
      name: "Báo cáo theo nền tảng", 
      description: "Phân tích chi tiết từng nền tảng",
      icon: FileText,
      type: "excel"
    },
    {
      id: "custom",
      name: "Báo cáo tùy chỉnh",
      description: "Tạo báo cáo theo yêu cầu",
      icon: Table,
      type: "pdf"
    }
  ];

  const handleQuickReport = (template: any) => {
    // Tạo báo cáo nhanh với template
    const newReport = {
      id: `report-${Date.now()}`,
      name: template.name,
      type: template.type,
      timeRange: "last_month",
      includes: {
        kpi: true,
        charts: true,
        recommendations: true,
        dataTable: true
      },
      createdAt: new Date().toISOString(),
      status: "completed"
    };
    
    handleReportCreated(newReport);
    
    // Giả lập tạo báo cáo
    setTimeout(() => {
      alert(`Đã tạo ${template.name} thành công!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('reports.title', 'Báo cáo')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('reports.subtitle', 'Tạo và quản lý báo cáo tùy chỉnh')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('reports.templates', 'Mẫu báo cáo')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {quickReportTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleQuickReport(template)}
                        className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-accent group-hover:text-accent/80" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Create Custom Report Button */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-accent text-white px-4 py-3 rounded-lg font-medium hover:bg-accent/90 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Tạo báo cáo tùy chỉnh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report History */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('reports.report_history', 'Lịch sử báo cáo')}
                </h2>
              </div>
              <div className="p-6">
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('reports.no_reports', 'Chưa có báo cáo nào')}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {t('reports.create_first_report', 'Tạo báo cáo đầu tiên để bắt đầu')}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition"
                    >
                      Tạo báo cáo đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onView={handleViewReport}
                        onDelete={() => handleDeleteReport(report.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Report Modal */}
        <CreateReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReportCreated={handleReportCreated}
          dashboardData={dashboardData}
        />
      </div>
    </div>
  );
};

export default Reports; 