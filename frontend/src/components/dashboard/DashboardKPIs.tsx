import React from "react";
import KPICard from "../KPICard";
import { H3 } from "../ui/typography";

interface KPIData {
  title: string;
  value: string;
  change: number;
  status: "warning" | "normal" | "danger";
  icon: React.ReactNode;
}

interface CompareChannel {
  name: string;
  kpis: {
    title: string;
    value: any;
    change: number;
    status: "normal";
  }[];
}

interface DashboardKPIsProps {
  kpis: KPIData[];
  compareChannels?: CompareChannel[];
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ kpis, compareChannels }) => {
  return (
    <div className="space-y-6">
      {/* Modern Section Header */}
      <div className="flex items-center justify-between">
        <H3 className="text-xl md:text-2xl">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chỉ số hiệu suất
          </span>
        </H3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật real-time
        </div>
      </div>

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, index) => (
          <div 
            key={index} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <KPICard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              status={kpi.status}
              icon={kpi.icon}
              testId={`kpi-card-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {kpis.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Chưa có dữ liệu KPI
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Kết nối các nền tảng để xem chỉ số hiệu suất
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardKPIs; 