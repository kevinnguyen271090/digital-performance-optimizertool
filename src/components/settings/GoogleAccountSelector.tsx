import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { Service } from './GoogleServiceSelectionModal';

interface GoogleAccount {
  id: string;
  name: string;
  isSelected: boolean;
  status: 'available';
}

interface GoogleAccountSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAccounts: GoogleAccount[]) => void;
  userEmail: string;
  service: Service | null;
  accessToken?: string | null;
  profile?: any;
}

const GoogleAccountSelector: React.FC<GoogleAccountSelectorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  service,
  accessToken,
  profile
}) => {
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async (tokenResponse: any) => {
    if (!service) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let accounts: GoogleAccount[] = [];
      
      switch (service.id) {
        case 'google-ads':
          // Fetch Google Ads accounts
          const adsResponse = await fetch('https://googleads.googleapis.com/v14/customers', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          if (adsResponse.ok) {
            const adsData = await adsResponse.json();
            accounts = adsData.results?.map((account: any) => ({
              id: account.customer.id,
              name: account.customer.descriptiveName,
              type: 'Google Ads'
            })) || [];
          }
          break;
          
        case 'ga4':
          // Fetch GA4 properties
          const gaResponse = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          if (gaResponse.ok) {
            const gaData = await gaResponse.json();
            accounts = gaData.properties?.map((property: any) => ({
              id: property.name.split('/').pop(),
              name: property.displayName,
              type: 'Google Analytics'
            })) || [];
          }
          break;
          
        case 'search-console':
          // Fetch Search Console sites
          const scResponse = await fetch('https://searchconsole.googleapis.com/v1/sites', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          if (scResponse.ok) {
            const scData = await scResponse.json();
            accounts = scData.siteEntry?.map((site: any) => ({
              id: site.siteId,
              name: site.siteId,
              type: 'Search Console'
            })) || [];
          }
          break;
      }
      
      setAccounts(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Không thể lấy danh sách tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (isOpen && service && accessToken) {
      setAccounts([]);
      setError(null);
      setLoading(true);
      fetchAccounts({ access_token: accessToken });
    }
  }, [isOpen, service, accessToken, fetchAccounts]);

  const handleAccountToggle = (accountId: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, isSelected: !account.isSelected }
          : account
      )
    );
  };

  const handleConfirm = () => {
    const selected = accounts.filter(account => account.isSelected);
    onConfirm(selected);
    onClose();
  };

  const getAccountIcon = () => {
    if (!service) return null;
    const IconComponent = service.icon;
    return <IconComponent />;
  };

  const getAccountTypeLabel = () => service?.name || '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chọn tài khoản {getAccountTypeLabel()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tài khoản Google: {userEmail}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Đang chờ xác thực và tải danh sách tài khoản...
                </p>
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Lỗi</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}
          {!loading && !error && (
            accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      account.isSelected
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleAccountToggle(account.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="relative">
                          <input
                            type="checkbox"
                            checked={account.isSelected}
                            onChange={(e) => { e.stopPropagation(); handleAccountToggle(account.id); }}
                            className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500 appearance-none checked:bg-green-500 checked:border-green-500"
                          />
                          {account.isSelected && (
                            <Check className="w-4 h-4 text-green-500 absolute left-0 top-0 pointer-events-none" />
                          )}
                        </span>
                        {getAccountIcon()}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{account.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Không tìm thấy tài khoản</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Tài khoản <span className="font-medium">{userEmail}</span> không có quyền truy cập vào bất kỳ tài khoản {getAccountTypeLabel()} nào.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Nếu bạn chưa có tài khoản Google Analytics, hãy <a href="https://analytics.google.com/analytics/web/#/provision/account/create" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">bấm vào đây để tạo tài khoản Google Analytics mới</a>.
                </p>
                <div className="mt-4 text-left max-w-xl mx-auto text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <b>Hướng dẫn tạo tài khoản Google Analytics:</b>
                  <ol className="list-decimal ml-5 mt-2 space-y-1">
                    <li>Nhấn vào link trên để mở trang tạo tài khoản Google Analytics.</li>
                    <li>Điền tên tài khoản, tên tài sản, múi giờ, đơn vị tiền tệ theo hướng dẫn.</li>
                    <li>Làm theo các bước để hoàn tất việc tạo tài khoản và thuộc tính GA4.</li>
                    <li>Sau khi tạo xong, hãy quay lại ứng dụng và thử lại thao tác kết nối.</li>
                  </ol>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
            Hủy
          </button>
          <button onClick={handleConfirm} disabled={!accounts.some(a => a.isSelected) || loading} className="ml-3 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAccountSelector;