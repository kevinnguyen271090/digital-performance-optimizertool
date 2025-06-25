import React from 'react';
import { AlertCircle, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardInsightsProps {
  platformData: any;
  selectedChannel: string;
}

const DashboardInsights: React.FC<DashboardInsightsProps> = React.memo(({ platformData, selectedChannel }) => {
  const { t } = useTranslation();

  // Tạo insights dựa trên dữ liệu
  const generateInsights = () => {
    const insights = [];
    const channels = selectedChannel === 'all' ? Object.keys(platformData) : [selectedChannel];
    
    channels.forEach(channel => {
      const data = platformData[channel];
      if (!data) return;
      
      // Insight về ROAS
      if (data.roas < 2) {
        insights.push({
          type: 'warning',
          title: `ROAS thấp trên ${channel}`,
          message: `ROAS hiện tại ${data.roas?.toFixed(2)}x, cần tối ưu targeting hoặc landing page`,
          icon: <AlertTriangle className="w-4 h-4" />
        });
      }
      
      // Insight về CPA
      if (data.cpa > 500000) {
        insights.push({
          type: 'warning',
          title: `CPA cao trên ${channel}`,
          message: `CPA hiện tại ${data.cpa?.toLocaleString()} VNĐ, cần cải thiện conversion rate`,
          icon: <AlertTriangle className="w-4 h-4" />
        });
      }
      
      // Insight tích cực
      if (data.roas > 4) {
        insights.push({
          type: 'success',
          title: `Hiệu suất tốt trên ${channel}`,
          message: `ROAS ${data.roas?.toFixed(2)}x rất tốt, có thể tăng budget`,
          icon: <TrendingUp className="w-4 h-4" />
        });
      }
    });
    
    // Insight tổng quan
    const totalRevenue = Object.values(platformData).reduce((sum: number, d: any) => sum + (d.revenue || 0), 0);
    const totalSpend = Object.values(platformData).reduce((sum: number, d: any) => sum + (d.spend || 0), 0);
    const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    if (overallROAS > 3) {
      insights.push({
        type: 'success',
        title: 'Tổng thể hiệu suất tốt',
        message: `ROAS tổng thể ${overallROAS.toFixed(2)}x, chiến dịch đang hoạt động hiệu quả`,
        icon: <TrendingUp className="w-4 h-4" />
      });
    }
    
    return insights.slice(0, 5); // Giới hạn 5 insights
  };

  const insights = generateInsights();

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm w-full">
      <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900 dark:text-white">{t('dashboard.insights', 'Insights & Gợi ý tối ưu')}</h3>
      {insights.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {t('insight.no_data', 'Chưa có insights nào')}
        </div>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight, idx) => (
            <li key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{insight.message}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default DashboardInsights; 