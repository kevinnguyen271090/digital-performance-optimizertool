import React from 'react';
import { useTranslation } from 'react-i18next';

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
  // Lấy danh sách kênh cần hiển thị
  const channels = selectedChannel === 'all'
    ? Object.keys(platformData)
    : [selectedChannel];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 overflow-x-auto shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base md:text-lg">{t('dashboard.data_table', 'Bảng số liệu chi tiết')}</h3>
        <button
          className="px-3 py-1 bg-accent text-white rounded hover:bg-accent/90 text-sm transition"
          onClick={() => exportTableToCSV(platformData, selectedChannel)}
        >
          {t('dashboard.export_csv', 'Export CSV')}
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm md:text-base text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 font-bold">{t('dashboard.channel', 'Kênh')}</th>
              <th className="px-4 py-2 font-bold">{t('dashboard.revenue', 'Doanh thu')}</th>
              <th className="px-4 py-2 font-bold">{t('dashboard.spend', 'Chi phí')}</th>
              <th className="px-4 py-2 font-bold">{t('dashboard.conversions', 'Chuyển đổi')}</th>
              <th className="px-4 py-2 font-bold">{t('dashboard.roas', 'ROAS')}</th>
              <th className="px-4 py-2 font-bold">{t('dashboard.cpa', 'CPA')}</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => {
              const d = platformData[ch] || {};
              const roas = d.spend > 0 ? d.revenue / d.spend : 0;
              const cpa = d.conversions > 0 ? d.spend / d.conversions : 0;
              return (
                <tr key={ch} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">{ch.charAt(0).toUpperCase() + ch.slice(1)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{d.revenue?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{d.spend?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{d.conversions?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{roas.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{cpa.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default DashboardDataTable; 