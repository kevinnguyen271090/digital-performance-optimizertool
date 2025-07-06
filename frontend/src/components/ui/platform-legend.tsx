import React from 'react';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { 
  Facebook, 
  Globe, 
  TrendingUp, 
  ShoppingCart,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  isConnected: boolean;
  lastSync?: Date;
}

interface PlatformLegendProps {
  platforms: Platform[];
  showTooltip?: boolean;
  className?: string;
}

const getPlatformIcon = (platformId: string) => {
  switch (platformId.toLowerCase()) {
    case 'facebook':
    case 'meta':
      return <Facebook className="w-4 h-4" />;
    case 'google':
      return <Globe className="w-4 h-4" />;
    case 'tiktok':
      return <TrendingUp className="w-4 h-4" />;
    case 'woocommerce':
      return <ShoppingCart className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
};

const getPlatformColor = (platformId: string) => {
  switch (platformId.toLowerCase()) {
    case 'facebook':
    case 'meta':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    case 'google':
      return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    case 'tiktok':
      return 'text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800';
    case 'woocommerce':
      return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

export const PlatformLegend: React.FC<PlatformLegendProps> = ({
  platforms,
  showTooltip = true,
  className = ''
}) => {
  const connectedPlatforms = platforms.filter(p => p.isConnected);
  const disconnectedPlatforms = platforms.filter(p => !p.isConnected);

  if (showTooltip) {
    return (
      <TooltipProvider>
        <div className={`flex flex-wrap gap-2 ${className}`}>
          {platforms.map((platform) => (
            <Tooltip key={platform.id}>
              <TooltipTrigger asChild>
                <Badge 
                  variant={platform.isConnected ? "default" : "secondary"}
                  className={`flex items-center gap-1 cursor-help ${getPlatformColor(platform.id)}`}
                >
                  {getPlatformIcon(platform.id)}
                  <span className="text-xs">{platform.name}</span>
                  {platform.isConnected ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-gray-400" />
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-gray-500">
                    {platform.isConnected ? (
                      <>
                        <div>✅ Đã kết nối</div>
                        {platform.lastSync && (
                          <div>Cập nhật: {new Date(platform.lastSync).toLocaleDateString('vi-VN')}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>❌ Chưa kết nối</div>
                        <div>Kết nối để xem dữ liệu thực</div>
                      </>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((platform) => (
        <Badge 
          key={platform.id}
          variant={platform.isConnected ? "default" : "secondary"}
          className={`flex items-center gap-1 ${getPlatformColor(platform.id)}`}
        >
          {getPlatformIcon(platform.id)}
          <span className="text-xs">{platform.name}</span>
          {platform.isConnected ? (
            <CheckCircle className="w-3 h-3 text-green-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-gray-400" />
          )}
        </Badge>
      ))}
    </div>
  );
};

// Component để hiển thị thông báo về platform chưa kết nối
export const DisconnectedPlatformsNotice: React.FC<{
  platforms: Platform[];
  onConnect?: () => void;
  className?: string;
}> = ({ platforms, onConnect, className = '' }) => {
  const disconnectedPlatforms = platforms.filter(p => !p.isConnected);
  
  if (disconnectedPlatforms.length === 0) return null;

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Chưa có dữ liệu từ {disconnectedPlatforms.length} platform
          </div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {disconnectedPlatforms.map(p => p.name).join(', ')} chưa được kết nối
          </div>
          {onConnect && (
            <button
              onClick={onConnect}
              className="text-xs text-yellow-800 dark:text-yellow-200 underline hover:no-underline mt-2"
            >
              Kết nối ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 