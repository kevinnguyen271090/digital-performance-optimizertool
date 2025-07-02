import React from 'react';
import { Platform } from './types';
import { ChevronRight } from 'lucide-react';

interface PlatformButtonProps {
  platform: Platform;
  onClick: () => void;
}

const PlatformButton: React.FC<PlatformButtonProps> = React.memo(({ platform, onClick }) => {
  const getStatusBadge = () => {
    let text = '';
    let style = '';

    switch (platform.status) {
      case 'connected':
        text = 'Đã kết nối';
        style = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 font-semibold';
        break;
      case 'coming_soon':
        text = 'Sắp ra mắt';
        style = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        break;
      default:
        text = 'Kết nối';
        style = 'bg-white text-gray-900 dark:bg-gray-300 dark:text-gray-900 font-semibold';
    }
    
    return (
      <span className={`px-3 py-1 text-xs rounded-full ${style}`}>
        {text}
      </span>
    );
  };

  const isClickable = platform.status === 'available' || platform.status === 'connected';

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`w-full p-3 md:p-4 rounded-xl flex items-center transition-colors text-left
                  ${isClickable 
                    ? 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700' 
                    : 'bg-gray-50 dark:bg-gray-800'
                  } 
                  disabled:cursor-not-allowed`}
    >
      <div className={`p-2 md:p-3 rounded-lg ${platform.color} text-white flex-shrink-0`}>
        {platform.icon}
      </div>
      <div className="ml-3 md:ml-4 flex-grow min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{platform.name}</h4>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{platform.description}</p>
      </div>
      <div className="ml-2 md:ml-4 flex items-center space-x-2 md:space-x-3 flex-shrink-0">
        {getStatusBadge()}
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
      </div>
    </button>
  );
});

export default PlatformButton; 