import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Users, Settings } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  lastSync?: Date;
}

interface PlatformAccounts {
  platform: string;
  accounts: Account[];
}

interface AccountSelectorProps {
  platformAccounts: PlatformAccounts[];
  selectedAccounts: { [key: string]: string[] };
  onApply: (newSelectedAccounts: { [key: string]: string[] }) => void;
  onClose: () => void;
  onResetToDefault: () => void;
  isLoading?: boolean;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  platformAccounts,
  selectedAccounts,
  onApply,
  onClose,
  onResetToDefault,
  isLoading = false
}) => {
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);
  const [tempSelectedAccounts, setTempSelectedAccounts] = useState(selectedAccounts);

  useEffect(() => {
    setTempSelectedAccounts(selectedAccounts);
  }, [selectedAccounts]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta':
        return '🔵';
      case 'google':
        return '🟢';
      case 'tiktok':
        return '🟣';
      case 'woocommerce':
        return '🟠';
      default:
        return '⚫';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta':
        return 'Meta (Facebook & Instagram)';
      case 'google':
        return 'Google (Analytics, Ads, Search Console)';
      case 'tiktok':
        return 'TikTok Ads';
      case 'woocommerce':
        return 'WooCommerce';
      default:
        return platform;
    }
  };

  const handleAccountToggle = (platform: string, accountId: string) => {
    const currentSelected = tempSelectedAccounts[platform] || [];
    const newSelected = currentSelected.includes(accountId)
      ? currentSelected.filter(id => id !== accountId)
      : [...currentSelected, accountId];
    
    setTempSelectedAccounts(prev => ({
      ...prev,
      [platform]: newSelected
    }));
  };

  const handleSelectAll = (platform: string) => {
    const platformData = platformAccounts.find(p => p.platform === platform);
    if (platformData) {
      const allAccountIds = platformData.accounts.map(account => account.id);
      setTempSelectedAccounts(prev => ({
        ...prev,
        [platform]: allAccountIds
      }));
    }
  };

  const handleDeselectAll = (platform: string) => {
    setTempSelectedAccounts(prev => ({
      ...prev,
      [platform]: []
    }));
  };

  const handleApply = () => {
    onApply(tempSelectedAccounts);
    onClose();
  };

  const handleReset = () => {
    onResetToDefault();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải tài khoản...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chọn tài khoản hiển thị
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Chọn các tài khoản bạn muốn xem dữ liệu trong dashboard
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {platformAccounts.map((platformData) => (
          <div key={platformData.platform} className="p-4">
            <button
              onClick={() => setOpenPlatform(openPlatform === platformData.platform ? null : platformData.platform)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getPlatformIcon(platformData.platform)}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {getPlatformName(platformData.platform)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {platformData.accounts.length} tài khoản đã kết nối
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {tempSelectedAccounts[platformData.platform]?.length || 0} đã chọn
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                    openPlatform === platformData.platform ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </button>

            {openPlatform === platformData.platform && (
              <div className="mt-4 space-y-3">
                {/* Select All / Deselect All */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSelectAll(platformData.platform)}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={() => handleDeselectAll(platformData.platform)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>

                {/* Account List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {platformData.accounts.map((account) => (
                    <label
                      key={account.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <span className="relative">
                        <input
                          type="checkbox"
                          checked={tempSelectedAccounts[platformData.platform]?.includes(account.id) || false}
                          onChange={() => handleAccountToggle(platformData.platform, account.id)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500 appearance-none checked:bg-green-500 checked:border-green-500"
                        />
                        {tempSelectedAccounts[platformData.platform]?.includes(account.id) && (
                          <Check className="w-4 h-4 text-green-500 absolute left-0 top-0 pointer-events-none" />
                        )}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {account.name}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            account.isActive
                              ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                              : 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
                          }`}>
                            {account.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {account.type}
                          </span>
                          {account.lastSync && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              Cập nhật: {new Date(account.lastSync).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {platformData.accounts.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có tài khoản nào được kết nối</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with action buttons */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Mặc định
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelector;
