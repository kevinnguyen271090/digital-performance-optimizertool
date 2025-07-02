import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Play, Heart } from "lucide-react";

// Đảm bảo interface này khớp với mockRecommendations.ts và cách dùng trong Recommendations.tsx
interface RecommendationCardProps {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  category: string;
  priority: "high" | "medium" | "low";
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onFeedback?: (feedback: string) => void;
  onDemoAction?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  title,
  description,
  impact,
  effort,
  category,
  priority,
  isExpanded = false,
  onToggleExpand,
  onFeedback,
  onDemoAction
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [improvement, setImprovement] = useState("");

  useEffect(() => {
    // Load favorite state từ localStorage
    const favorites = JSON.parse(localStorage.getItem("favoriteRecommendations") || "[]");
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Update localStorage
    let favorites = JSON.parse(localStorage.getItem("favoriteRecommendations") || "[]");
    if (newFavoriteState) {
      if (!favorites.includes(id)) {
        favorites.push(id);
      }
    } else {
      favorites = favorites.filter((favId: string) => favId !== id);
    }
    localStorage.setItem("favoriteRecommendations", JSON.stringify(favorites));
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "cao": return "text-success bg-success/10";
      case "trung bình": return "text-warning bg-warning/10";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case "thấp": return "text-success bg-success/10";
      case "trung bình": return "text-warning bg-warning/10";
      default: return "text-danger bg-danger/10";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={toggleFavorite}
              className={`p-1 rounded-full transition-colors ${
                isFavorite 
                  ? "text-danger hover:text-danger/80" 
                  : "text-gray-400 hover:text-danger"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded-full ${getImpactColor(impact)}`}>
              Tác động: {impact}
            </span>
            <span className={`px-2 py-1 rounded-full ${getEffortColor(effort)}`}>
              Nỗ lực: {effort}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {category}
            </span>
          </div>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Feedback Section */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Phản hồi của bạn
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Nhận xét
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent dark:bg-gray-700 dark:text-white"
                  placeholder="Chia sẻ suy nghĩ của bạn về recommendation này..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Cải thiện dự kiến (%)
                </label>
                <input
                  type="number"
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent dark:bg-gray-700 dark:text-white"
                  placeholder="Ví dụ: 15"
                />
              </div>
              <button
                onClick={() => onFeedback?.(feedback)}
                className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>

          {/* Demo Action */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Thử nghiệm
            </h4>
            <button
              onClick={onDemoAction}
              className="flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition"
            >
              <Play className="w-4 h-4" />
              <span>Chạy demo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard; 