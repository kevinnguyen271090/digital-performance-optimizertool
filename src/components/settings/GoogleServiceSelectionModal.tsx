import React from 'react';
import { X } from 'lucide-react';
import { GoogleAnalyticsIcon, GoogleSearchConsoleIcon, GoogleAdsIcon } from './icons';

// Định nghĩa kiểu dữ liệu cho Dịch vụ Google
export type GoogleServiceType = 'ga4' | 'search-console' | 'google-ads';

export interface Service {
  id: GoogleServiceType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  scopes: string[];
}

export const googleServices: Service[] = [
  {
    id: 'ga4',
    name: 'Google Analytics',
    description: 'Theo dõi traffic và conversions.',
    icon: GoogleAnalyticsIcon,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  },
  {
    id: 'search-console',
    name: 'Google Search Console',
    description: 'Theo dõi hiệu suất SEO.',
    icon: GoogleSearchConsoleIcon,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Theo dõi các chiến dịch quảng cáo.',
    icon: GoogleAdsIcon,
    scopes: ['https://www.googleapis.com/auth/adwords'],
  },
];

interface GoogleServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: Service) => void;
}

const GoogleServiceSelectionModal: React.FC<GoogleServiceSelectionModalProps> = React.memo(({ 
  isOpen, 
  onClose, 
  onSelectService 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kết nối với dịch vụ Google
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Chọn dịch vụ bạn muốn kết nối. Bạn có thể kết nối nhiều tài khoản cho mỗi dịch vụ.
          </p>
          <div className="space-y-4">
            {googleServices.map((service) => (
              <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <service.icon className="w-10 h-10" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectService(service)} 
                  className="bg-accent text-white hover:bg-accent/90 px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  Kết nối
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default GoogleServiceSelectionModal; 