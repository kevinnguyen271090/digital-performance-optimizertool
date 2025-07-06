import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Funnel,
  Plus,
  Settings,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface EmptyStateProps {
  type: 'chart' | 'data' | 'connection' | 'import';
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  variant?: 'default' | 'overlay';
  className?: string;
}

const getDefaultIcon = (type: string) => {
  switch (type) {
    case 'chart':
      return <BarChart3 className="w-12 h-12 text-gray-400" />;
    case 'data':
      return <TrendingUp className="w-12 h-12 text-gray-400" />;
    case 'connection':
      return <Settings className="w-12 h-12 text-gray-400" />;
    case 'import':
      return <FileSpreadsheet className="w-12 h-12 text-gray-400" />;
    default:
      return <AlertCircle className="w-12 h-12 text-gray-400" />;
  }
};

const getDefaultActionIcon = (type: string) => {
  switch (type) {
    case 'connection':
      return <Settings className="w-4 h-4" />;
    case 'import':
      return <FileSpreadsheet className="w-4 h-4" />;
    default:
      return <Plus className="w-4 h-4" />;
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  icon,
  actionLabel,
  actionIcon,
  onAction,
  variant = 'default',
  className = ''
}) => {
  const defaultIcon = getDefaultIcon(type);
  const defaultActionIcon = getDefaultActionIcon(type);

  if (variant === 'overlay') {
    return (
      <div className={`absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg ${className}`}>
        <div className="text-center p-6">
          {icon || defaultIcon}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
            {description}
          </p>
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="flex items-center gap-2"
            >
              {actionIcon || defaultActionIcon}
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon || defaultIcon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-sm">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="flex items-center gap-2"
          >
            {actionIcon || defaultActionIcon}
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Chart-specific empty states
export const ChartEmptyState: React.FC<{
  chartType: 'trend' | 'pie' | 'funnel' | 'bar';
  onConnect?: () => void;
  onImport?: () => void;
  className?: string;
}> = ({ chartType, onConnect, onImport, className }) => {
  const getChartIcon = () => {
    switch (chartType) {
      case 'trend':
        return <TrendingUp className="w-12 h-12 text-blue-400" />;
      case 'pie':
        return <PieChart className="w-12 h-12 text-green-400" />;
      case 'funnel':
        return <Funnel className="w-12 h-12 text-purple-400" />;
      case 'bar':
        return <BarChart3 className="w-12 h-12 text-orange-400" />;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'trend':
        return 'Chưa có dữ liệu trend';
      case 'pie':
        return 'Chưa có dữ liệu phân bổ';
      case 'funnel':
        return 'Chưa có dữ liệu funnel';
      case 'bar':
        return 'Chưa có dữ liệu so sánh';
    }
  };

  const getChartDescription = () => {
    switch (chartType) {
      case 'trend':
        return 'Kết nối platform hoặc nhập dữ liệu để xem xu hướng theo thời gian';
      case 'pie':
        return 'Kết nối platform hoặc nhập dữ liệu để xem phân bổ theo nguồn';
      case 'funnel':
        return 'Kết nối platform hoặc nhập dữ liệu để xem funnel chuyển đổi';
      case 'bar':
        return 'Kết nối platform hoặc nhập dữ liệu để so sánh hiệu suất';
    }
  };

  return (
    <EmptyState
      type="chart"
      title={getChartTitle()}
      description={getChartDescription()}
      icon={getChartIcon()}
      actionLabel="Kết nối platform"
      actionIcon={<Settings className="w-4 h-4" />}
      onAction={onConnect}
      className={className}
    />
  );
}; 