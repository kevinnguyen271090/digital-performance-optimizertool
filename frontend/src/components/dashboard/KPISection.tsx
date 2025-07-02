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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {kpi.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {kpi.title}
                </h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                kpi.status === 'normal' ? 'bg-green-100 text-green-800' :
                kpi.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {kpi.status === 'normal' ? 'Tốt' : kpi.status === 'warning' ? 'Cần cải thiện' : 'Kritisk'}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {kpi.value}
            </div>
            {typeof kpi.change === 'number' && (
              <div className={`text-sm ${
                kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% so với mục tiêu
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default KPISection; 