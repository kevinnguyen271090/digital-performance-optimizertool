import React, { useState } from 'react';
import { Download, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { H3 } from '../ui/typography';

interface DashboardDataTableProps {
  platformData: any;
  selectedChannel: string;
}

// Hàm xuất CSV
function exportTableToCSV(platformData: any, selectedChannel: string) {
  const channels = selectedChannel === 'all' ? Object.keys(platformData) : [selectedChannel];
  const header = ['Kênh', 'Doanh thu', 'Chi phí', 'Chuyển đổi', 'ROAS', 'CPA'];
  const rows = channels.map(ch => {
    const d = platformData[ch] || {};
    const roas = d.spend > 0 ? d.revenue / d.spend : 0;
    const cpa = d.conversions > 0 ? d.spend / d.conversions : 0;
    return [
      ch.charAt(0).toUpperCase() + ch.slice(1),
      d.revenue || 0,
      d.spend || 0,
      d.conversions || 0,
      roas.toFixed(2),
      cpa.toFixed(0)
    ];
  });
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dashboard_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

const DashboardDataTable: React.FC<DashboardDataTableProps> = React.memo(({ platformData, selectedChannel }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Lấy danh sách kênh cần hiển thị
  const channels = selectedChannel === 'all'
    ? Object.keys(platformData)
    : [selectedChannel];

  // Filter và sort data
  const filteredAndSortedData = channels
    .filter(ch => ch.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(ch => {
      const d = platformData[ch] || {};
      const roas = d.spend > 0 ? d.revenue / d.spend : 0;
      const cpa = d.conversions > 0 ? d.spend / d.conversions : 0;
      return {
        channel: ch,
        revenue: d.revenue || 0,
        spend: d.spend || 0,
        conversions: d.conversions || 0,
        roas,
        cpa
      };
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as number;
      const bValue = b[sortBy as keyof typeof b] as number;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? 
      <TrendingUp className="w-4 h-4 text-purple-500" /> : 
      <TrendingDown className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft overflow-hidden">
      {/* Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <H3 className="text-lg md:text-xl">Bảng số liệu chi tiết</H3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAndSortedData.length} kênh được hiển thị
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kênh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => exportTableToCSV(platformData, selectedChannel)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Modern Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              {[
                { key: 'channel', label: 'Kênh', sortable: false },
                { key: 'revenue', label: 'Doanh thu', sortable: true },
                { key: 'spend', label: 'Chi phí', sortable: true },
                { key: 'conversions', label: 'Chuyển đổi', sortable: true },
                { key: 'roas', label: 'ROAS', sortable: true },
                { key: 'cpa', label: 'CPA', sortable: true }
              ].map(({ key, label, sortable }) => (
                <th 
                  key={key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 ${
                    sortable ? 'cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors' : ''
                  }`}
                  onClick={() => sortable && handleSort(key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{label}</span>
                    {sortable && getSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {filteredAndSortedData.map((data, index) => (
              <tr 
                key={data.channel}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {data.channel.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.channel.charAt(0).toUpperCase() + data.channel.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {data.revenue.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {data.spend.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {data.conversions.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${
                    data.roas >= 4 ? 'text-green-600 dark:text-green-400' :
                    data.roas >= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {data.roas.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    {data.cpa.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Không tìm thấy dữ liệu
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi từ khóa tìm kiếm
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default DashboardDataTable; 