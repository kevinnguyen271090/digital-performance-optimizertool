import React from 'react';
import { LucideIcon, BarChart3, PieChart, TrendingUp, Target, Users, DollarSign } from 'lucide-react';
import { H3, Lead } from './typography';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  illustration?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  illustration 
}) => {
  const getActionClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-medium hover:shadow-strong';
      case 'secondary':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-medium hover:shadow-strong';
      case 'outline':
        return 'border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50';
      default:
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-medium hover:shadow-strong';
    }
  };

  return (
    <div className="text-center py-12 px-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-soft">
        {/* Icon or Illustration */}
        {illustration ? (
          <div className="mb-6">
            {illustration}
          </div>
        ) : Icon ? (
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-medium">
            <Icon className="w-10 h-10 text-white" />
          </div>
        ) : (
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-medium">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          <H3 className="text-xl md:text-2xl">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {title}
            </span>
          </H3>
          <Lead className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {description}
          </Lead>

        {/* Action Button */}
        {action && (
          <div className="pt-4">
            <button
              onClick={action.onClick}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${getActionClasses(action.variant)}`}
            >
              {action.label}
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

// Chart Empty State Component
interface ChartEmptyStateProps {
  chartType?: 'funnel' | 'pie' | 'bar' | 'line' | 'trend';
  onConnect?: () => void;
  className?: string;
}

export const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({ 
  chartType = 'bar', 
  onConnect, 
  className = '' 
}) => {
  const getChartConfig = () => {
    switch (chartType) {
      case 'funnel':
        return {
          icon: Target,
          title: 'Chưa có dữ liệu Funnel',
          description: 'Kết nối các nền tảng để xem phân tích funnel marketing của bạn.',
          gradient: 'from-orange-500 to-red-500'
        };
      case 'pie':
        return {
          icon: PieChart,
          title: 'Chưa có dữ liệu phân bổ',
          description: 'Kết nối các nền tảng để xem phân bổ doanh thu theo kênh.',
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'trend':
        return {
          icon: TrendingUp,
          title: 'Chưa có dữ liệu xu hướng',
          description: 'Kết nối các nền tảng để xem xu hướng hiệu suất theo thời gian.',
          gradient: 'from-green-500 to-emerald-500'
        };
      default:
        return {
          icon: BarChart3,
          title: 'Chưa có dữ liệu biểu đồ',
          description: 'Kết nối các nền tảng để xem biểu đồ phân tích hiệu suất.',
          gradient: 'from-blue-500 to-cyan-500'
        };
    }
  };

  const config = getChartConfig();
  const Icon = config.icon;

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        {/* Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-medium`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <H3 className="text-lg">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {config.title}
            </span>
          </H3>
          <Lead className="text-sm text-gray-600 dark:text-gray-400">
            {config.description}
          </Lead>
        </div>

        {/* Action Button */}
        {onConnect && (
          <div className="pt-4">
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95 text-sm"
            >
              Kết nối nền tảng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Predefined Empty States
export const EmptyStateNoData: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <EmptyState
    title="Chưa có dữ liệu"
    description="Kết nối các nền tảng marketing để bắt đầu theo dõi hiệu suất của bạn."
    action={onConnect ? {
      label: "Kết nối nền tảng",
      onClick: onConnect,
      variant: 'primary'
    } : undefined}
  />
);

export const EmptyStateNoCharts: React.FC<{ onCreateChart?: () => void }> = ({ onCreateChart }) => (
  <EmptyState
    title="Chưa có biểu đồ"
    description="Tạo biểu đồ đầu tiên để phân tích dữ liệu marketing của bạn."
    action={onCreateChart ? {
      label: "Tạo biểu đồ",
      onClick: onCreateChart,
      variant: 'secondary'
    } : undefined}
  />
);

export const EmptyStateNoReports: React.FC<{ onCreateReport?: () => void }> = ({ onCreateReport }) => (
  <EmptyState
    title="Chưa có báo cáo"
    description="Tạo báo cáo đầu tiên để chia sẻ kết quả với team của bạn."
    action={onCreateReport ? {
      label: "Tạo báo cáo",
      onClick: onCreateReport,
      variant: 'primary'
    } : undefined}
  />
);

export const EmptyStateSearch: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <EmptyState
    title="Không tìm thấy kết quả"
    description={`Không có kết quả nào cho "${searchTerm}". Thử từ khóa khác hoặc kiểm tra chính tả.`}
    action={{
      label: "Xóa tìm kiếm",
      onClick: () => window.location.reload(),
      variant: 'outline'
    }}
  />
);

// Specific Chart Empty States
export const FunnelEmptyState: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <ChartEmptyState chartType="funnel" onConnect={onConnect} />
);

export const PieEmptyState: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <ChartEmptyState chartType="pie" onConnect={onConnect} />
);

export const TrendEmptyState: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <ChartEmptyState chartType="trend" onConnect={onConnect} />
);

export const BarEmptyState: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <ChartEmptyState chartType="bar" onConnect={onConnect} />
);

export default EmptyState; 