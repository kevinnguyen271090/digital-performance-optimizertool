import React, { useState, useEffect } from "react";
import CreateReportModal from "../components/CreateReportModal";
import ReportCard from "../components/ReportCard";
import { Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load reports từ localStorage
    const savedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    setReports(savedReports);
  }, []);

  const handleReportCreated = (newReport: any) => {
    setReports([newReport, ...reports]);
  };

  const handleViewReport = (report: any) => {
    // Có thể mở modal preview hoặc chuyển trang
    alert(`Xem báo cáo: ${report.name}`);
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
                  <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('reports.overview_template', 'Báo cáo tổng quan')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('reports.overview_description', 'Tổng hợp KPI và metrics chính')}
                    </p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('reports.platform_template', 'Báo cáo theo nền tảng')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('reports.platform_description', 'Phân tích chi tiết từng nền tảng')}
                    </p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('reports.custom_template', 'Báo cáo tùy chỉnh')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('reports.custom_description', 'Tạo báo cáo theo yêu cầu')}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('reports.create_report', 'Tạo báo cáo')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('reports.report_name', 'Tên báo cáo')}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('reports.report_name_placeholder', 'Nhập tên báo cáo')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('reports.report_description', 'Mô tả báo cáo')}
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('reports.report_description_placeholder', 'Mô tả nội dung báo cáo')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('reports.select_data', 'Chọn dữ liệu')}
                    </label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {t('metrics.impressions', 'Lượt hiển thị')}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {t('metrics.clicks', 'Lượt nhấp')}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {t('metrics.conversions', 'Chuyển đổi')}
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {t('metrics.revenue', 'Doanh thu')}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      {t('reports.preview', 'Xem trước')}
                    </button>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                      {t('reports.generate', 'Tạo báo cáo')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 