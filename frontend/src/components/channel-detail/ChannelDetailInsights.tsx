import React from 'react';
import { CheckCircle, AlertCircle, XCircle, ShoppingCart } from 'lucide-react';

interface ChannelDetailInsightsProps {
  insights: Array<{
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    description: string;
    impact: string;
  }>;
}

const ChannelDetailInsights: React.FC<ChannelDetailInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {insight.description}
                </p>
                {insight.impact && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <strong>Tác động:</strong> {insight.impact}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Chưa có insights nào</p>
          <p className="text-sm">Hệ thống sẽ phân tích và hiển thị insights khi có đủ dữ liệu</p>
        </div>
      )}
    </div>
  );
};

export default ChannelDetailInsights; 