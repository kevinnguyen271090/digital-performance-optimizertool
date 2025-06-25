import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChannelDetailTableProps {
  data: Array<{
    id: string;
    name: string;
    type?: string;
    status?: string;
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      spend: number;
      conversions: number;
      cpa: number;
      revenue: number;
      roas: number;
    };
    change: number;
  }>;
  type: 'accounts' | 'campaigns';
}

const ChannelDetailTable: React.FC<ChannelDetailTableProps> = ({ data, type }) => {
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const sortData = (data: any[], key: string, order: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const aValue = a.metrics?.[key] || a[key] || 0;
      const bValue = b.metrics?.[key] || b[key] || 0;
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const sortedData = sortData(data, sortBy, sortOrder);

  const columns = [
    { key: 'name', label: type === 'accounts' ? 'Tài khoản' : 'Chiến dịch', sortable: false },
    { key: 'impressions', label: 'Impressions', sortable: true },
    { key: 'clicks', label: 'Clicks', sortable: true },
    { key: 'ctr', label: 'CTR', sortable: true },
    { key: 'spend', label: 'Chi phí', sortable: true },
    { key: 'conversions', label: 'Chuyển đổi', sortable: true },
    { key: 'cpa', label: 'CPA', sortable: true },
    { key: 'revenue', label: 'Doanh thu', sortable: true },
    { key: 'roas', label: 'ROAS', sortable: true }
  ];

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig = {
      active: { text: 'Hoạt động', class: 'bg-green-100 text-green-800' },
      paused: { text: 'Tạm dừng', class: 'bg-yellow-100 text-yellow-800' },
      completed: { text: 'Hoàn thành', class: 'bg-blue-100 text-blue-800' },
      draft: { text: 'Nháp', class: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortBy === column.key && (
                      sortOrder === 'asc' ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    {type === 'campaigns' && item.status && (
                      <div className="mt-1">
                        {getStatusBadge(item.status)}
                      </div>
                    )}
                    {type === 'accounts' && item.type && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(item.metrics.impressions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(item.metrics.clicks)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.metrics.ctr.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(item.metrics.spend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(item.metrics.conversions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(item.metrics.cpa)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(item.metrics.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.metrics.roas.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChannelDetailTable; 