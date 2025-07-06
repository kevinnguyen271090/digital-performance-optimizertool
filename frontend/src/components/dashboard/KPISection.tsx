import React from 'react';
import { Plus } from 'lucide-react';

interface KPISectionProps {
  kpiData: any[];
  onAddGoal: () => void;
  onImportExcel: () => void;
}

const KPISection: React.FC<KPISectionProps> = ({ kpiData, onAddGoal, onImportExcel }) => {
  return (
    <>
      {/* Header với nút thêm KPI */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tổng quan KPI
        </h1>
        <div className="flex space-x-3">
          <button 
            onClick={onAddGoal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm KPI thủ công
          </button>
          <button 
            onClick={onImportExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Import từ Excel
          </button>
        </div>
      </div>

      {/* KPI Cards - Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          let status = kpi.status;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105 p-4 flex flex-col items-center relative"
            >
              <div className="absolute top-2 right-2">
                {status === 'normal' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Tốt</span>}
                {status === 'warning' && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Cảnh báo</span>}
                {status === 'danger' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Chưa đạt</span>}
              </div>
              <div title={kpi.description || kpi.title} className="text-3xl mb-2 cursor-help">{kpi.icon}</div>
              <div className="text-lg font-bold">{kpi.value}</div>
              <div className="text-gray-500 text-sm">{kpi.title}</div>
              {typeof kpi.change === 'number' && (
                <div className="w-full mt-2">
                  <div className="h-2 rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded ${status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, kpi.change))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default KPISection; 