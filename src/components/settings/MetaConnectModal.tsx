import React from 'react';
import Login, { SuccessResponse, FailResponse } from '@greatsumini/react-facebook-login';

interface MetaConnectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (response: SuccessResponse) => void;
  onFail: (error: FailResponse) => void;
  appId: string;
}

const MetaConnectModal: React.FC<MetaConnectModalProps> = ({ open, onClose, onSuccess, onFail, appId }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-xl">×</span>
        </button>
        <h2 className="text-lg font-semibold mb-4">Kết nối với Meta (Facebook, Instagram, WhatsApp)</h2>
        <Login
          appId={appId}
          autoLoad={false}
          onSuccess={onSuccess}
          onFail={onFail}
          useRedirect={false}
          scope="public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,whatsapp_business_management,ads_management"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Đăng nhập với Facebook
        </Login>
      </div>
    </div>
  );
};

export default MetaConnectModal; 