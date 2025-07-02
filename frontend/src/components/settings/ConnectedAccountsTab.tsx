import React, { useEffect, useState } from 'react';
import { getUserConnections } from '../../utils/platformDataService';
import { Connection } from '../../types';
import { format } from 'date-fns';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';

interface ConnectedAccountsTabProps {
  userId: string;
}

const serviceLabel: Record<string, string> = {
  'ga4': 'Google Analytics',
  'google-ads': 'Google Ads',
  'search-console': 'Search Console',
  'merchant-center': 'Merchant Center',
  'meta': 'Meta',
  'woocommerce': 'WooCommerce',
  // ...bổ sung nếu có
};

const platformIcon: Record<string, React.ReactNode> = {
  'google': <img src="/google-icon.png" alt="Google" className="w-6 h-6" />,
  'meta': <img src="/meta-icon.png" alt="Meta" className="w-6 h-6" />,
  'woocommerce': <img src="/woo-icon.png" alt="Woo" className="w-6 h-6" />,
  // ...bổ sung nếu có
};

const ConnectedAccountsTab: React.FC<ConnectedAccountsTabProps> = ({ userId }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Connection | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      const data = await getUserConnections(userId);
      setConnections(data);
      setLoading(false);
    };
    fetchConnections();
  }, [userId]);

  const handleDisconnect = async (conn: Connection) => {
    if (!window.confirm('Bạn có chắc chắn muốn ngắt kết nối tài khoản này?')) return;
    // Gọi API xóa hoặc update status trên Supabase
    // ...
    setConnections(connections.filter(c => c.id !== conn.id));
  };

  const handleShowDetail = (conn: Connection) => {
    setSelected(conn);
    setShowDetail(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Tài khoản đã kết nối</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Chưa có tài khoản nào được kết nối.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">Dịch vụ</th>
                <th className="px-4 py-2 text-left">Tên tài khoản</th>
                <th className="px-4 py-2 text-left">Loại</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Ngày kết nối</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {connections.map(conn => (
                <tr key={conn.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 flex items-center space-x-2">
                    {platformIcon[conn.platform]}
                    <span>{serviceLabel[conn.service || conn.platform] || conn.platform}</span>
                  </td>
                  <td className="px-4 py-2">
                    {conn.metadata?.selected_accounts?.map((a: any) => a.name).join(', ') || conn.account_details?.name || '—'}
                  </td>
                  <td className="px-4 py-2">{conn.service || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${conn.status === 'connected' ? 'bg-green-100 text-green-800' : conn.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                      {conn.status === 'connected' ? 'Đang hoạt động' : conn.status === 'error' ? 'Lỗi' : 'Ngắt kết nối'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{conn.last_connected ? format(new Date(conn.last_connected), 'dd/MM/yyyy HH:mm') : '—'}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => handleShowDetail(conn)} className="text-blue-600 hover:underline flex items-center"><Pencil className="w-4 h-4 mr-1" />Chỉnh sửa</button>
                    <button onClick={() => handleDisconnect(conn)} className="text-red-600 hover:underline flex items-center"><Trash2 className="w-4 h-4 mr-1" />Ngắt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal chi tiết tài khoản */}
      {showDetail && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowDetail(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>
            <h3 className="text-lg font-bold mb-4">Chi tiết tài khoản</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto max-h-96">
              {JSON.stringify(selected, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountsTab; 