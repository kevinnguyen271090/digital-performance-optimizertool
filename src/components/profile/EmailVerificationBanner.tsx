import React from 'react';
import { Shield, Mail, AlertTriangle, CheckCircle } from 'lucide-react';

interface EmailVerificationBannerProps {
  emailVerified: boolean;
  email?: string;
  onResendVerification: () => Promise<boolean>;
  loading?: boolean;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  emailVerified,
  email,
  onResendVerification,
  loading = false
}) => {
  if (emailVerified) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
              Email đã được xác thực
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Tài khoản của bạn đã được xác thực và có thể sử dụng đầy đủ tính năng.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Email chưa được xác thực
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Vui lòng kiểm tra email <strong>{email}</strong> và xác thực tài khoản để sử dụng đầy đủ tính năng.
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onResendVerification}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{loading ? 'Đang gửi...' : 'Gửi lại email xác thực'}</span>
            </button>
            
            <button
              onClick={() => window.open('https://mail.google.com', '_blank')}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <Shield className="w-4 h-4" />
              <span>Mở Gmail</span>
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <h4 className="text-xs font-medium text-yellow-900 dark:text-yellow-100 mb-1">
              💡 Mẹo:
            </h4>
            <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• Kiểm tra thư mục Spam/Junk nếu không thấy email</li>
              <li>• Đảm bảo địa chỉ email chính xác</li>
              <li>• Email xác thực có hiệu lực trong 24 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner; 