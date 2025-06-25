import { useState } from 'react';
import { PlatformAccounts } from '../types/dashboard';

export const useAccountSelection = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<{[platform: string]: string[]}>({});
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  // Mock platform accounts data
  const platformAccounts: PlatformAccounts[] = [
    {
      platform: 'Meta',
      accounts: [
        { id: '1', name: 'Facebook Business', type: 'Business Account', isActive: true, lastSync: new Date() },
        { id: '2', name: 'Instagram Business', type: 'Business Account', isActive: true, lastSync: new Date() },
        { id: '3', name: 'Meta Ads Manager', type: 'Ads Account', isActive: true, lastSync: new Date() }
      ]
    },
    {
      platform: 'Google',
      accounts: [
        { id: '4', name: 'Google Analytics', type: 'Analytics Account', isActive: true, lastSync: new Date() },
        { id: '5', name: 'Google Ads', type: 'Ads Account', isActive: true, lastSync: new Date() },
        { id: '6', name: 'Search Console', type: 'Search Console', isActive: true, lastSync: new Date() }
      ]
    },
    {
      platform: 'TikTok',
      accounts: [
        { id: '7', name: 'TikTok Ads', type: 'Ads Account', isActive: true, lastSync: new Date() }
      ]
    },
    {
      platform: 'WooCommerce',
      accounts: [
        { id: '8', name: 'Main Store', type: 'E-commerce', isActive: true, lastSync: new Date() }
      ]
    }
  ];

  const handleAccountSelectionChange = (platform: string, accountIds: string[]) => {
    setSelectedAccounts(prev => ({
      ...prev,
      [platform]: accountIds
    }));
  };

  const toggleAccountSelector = () => {
    setShowAccountSelector(!showAccountSelector);
  };

  return {
    selectedAccounts,
    showAccountSelector,
    platformAccounts,
    handleAccountSelectionChange,
    toggleAccountSelector
  };
}; 