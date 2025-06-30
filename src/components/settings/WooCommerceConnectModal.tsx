import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle, CheckCircle, RefreshCw } from 'lucide-react';
import WooCommerceGuideModal from './WooCommerceGuideModal';
import { supabase } from '../../utils/supabaseClient';

interface WooCommerceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credentials: { storeUrl: string; consumerKey: string; consumerSecret: string }) => void;
}

const WooCommerceConnectModal: React.FC<WooCommerceConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'form'>('idle');
  const [existingConnection, setExistingConnection] = useState<any>(null);

  const checkExistingConnection = useCallback(async () => {
    setStatus('checking');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setStatus('form');
        return;
      }

      const { data, error } = await supabase
        .from('connections')
        .select('credentials')
        .eq('user_id', session.user.id)
        .eq('platform', 'woocommerce')
        .single();

      if (data) {
        setExistingConnection(data);
        setStatus('connected');
      } else {
        if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
            throw error;
        }
        setStatus('form');
      }
    } catch (error) {
      console.error('Error checking WooCommerce connection:', error);
      setStatus('form'); // Default to form on error
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkExistingConnection();
    } else {
      // Reset state when closed
      setStatus('idle');
      setExistingConnection(null);
      setStoreUrl('');
      setConsumerKey('');
      setConsumerSecret('');
    }
  }, [isOpen, checkExistingConnection]);

  const handleConnect = useCallback(() => {
    if (storeUrl && consumerKey && consumerSecret) {
      onConnect({ storeUrl, consumerKey, consumerSecret });
      onClose();
    } else {
      alert('Vui lòng điền đầy đủ các trường.');
    }
  }, [storeUrl, consumerKey, consumerSecret, onConnect, onClose]);
  
  const handleReconnect = useCallback(() => {
    setExistingConnection(null);
    setStatus('form');
  }, []);

  const handleCloseGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  if (!isOpen) {
    return null;
  }

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đang kiểm tra...</h3>
          </div>
        );
      case 'connected':
        return (
            <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Đã kết nối WooCommerce
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Cửa hàng của bạn tại <span className="font-medium text-purple-500">{existingConnection?.credentials?.storeUrl}</span> đã được kết nối.
                </p>
                <div className="mt-6 flex flex-col space-y-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleReconnect}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Kết nối lại
                    </button>
                </div>
            </div>
        );
      case 'form':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect to WooCommerce</h2>
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm"
              >
                <HelpCircle size={16} className="mr-1" />
                Hướng dẫn
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store URL</label>
                <input
                  type="text"
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consumer Key</label>
                <input
                  type="password"
                  id="consumerKey"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consumer Secret</label>
                <input
                  type="password"
                  id="consumerSecret"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Chưa có API keys? 
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-purple-600 hover:underline ml-1"
                >
                  Xem hướng dẫn tạo keys
                </button>
              </p>
              <p className="mt-1">Đảm bảo cấp quyền Read/Write cho API key.</p>
            </div>
  
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Connect
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          {renderContent()}
        </div>
      </div>

      <WooCommerceGuideModal
        isOpen={showGuide}
        onClose={handleCloseGuide}
      />
    </>
  );
};

export default WooCommerceConnectModal;