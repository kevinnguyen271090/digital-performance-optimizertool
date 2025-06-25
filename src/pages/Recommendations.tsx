import React, { useState, useEffect } from "react";
import RecommendationCard from "../components/RecommendationCard";
import { mockRecommendations } from "../utils/mockRecommendations";
import { RefreshCw, Heart, Filter } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Recommendations = () => {
  const { t } = useTranslation();
  const [recommendations] = useState(mockRecommendations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites từ localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteRecommendations") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const filteredRecommendations = showFavoritesOnly 
    ? recommendations.filter(rec => favorites.includes(rec.id))
    : recommendations;

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFeedback = (feedback: string) => {
    // Xử lý feedback
    console.log("Feedback received:", feedback);
    // Có thể gửi lên server hoặc lưu vào localStorage
  };

  const handleDemoAction = () => {
    // Xử lý demo action
    console.log("Demo action triggered");
    // Có thể mở modal demo hoặc chuyển hướng
  };

  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    // Giả lập refresh insights
    setTimeout(() => {
      setIsRefreshing(false);
      // Có thể load recommendations mới từ API
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('recommendations.title', 'Khuyến nghị')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('recommendations.subtitle', 'AI Insights và gợi ý tối ưu hiệu suất')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('recommendations.ai_insights', 'AI Insights')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {recommendation.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {recommendation.description}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              recommendation.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : recommendation.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {t(`recommendations.${recommendation.priority}`, recommendation.priority)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            {t('recommendations.implement', 'Thực hiện')}
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm">
                            {t('recommendations.dismiss', 'Bỏ qua')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recommendations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>{t('recommendations.no_recommendations', 'Chưa có khuyến nghị nào')}</p>
                      <p className="text-sm mt-2">{t('recommendations.analyzing_data', 'Đang phân tích dữ liệu...')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('recommendations.performance_alerts', 'Cảnh báo hiệu suất')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {recommendation.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {recommendation.description}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              recommendation.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : recommendation.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {t(`recommendations.${recommendation.priority}`, recommendation.priority)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            {t('recommendations.view_details', 'Xem chi tiết')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recommendations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>{t('recommendations.no_alerts', 'Không có cảnh báo nào')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations; 