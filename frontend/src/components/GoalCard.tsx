import React from "react";
import { Target, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from "lucide-react";

interface GoalCardProps {
  id?: string;
  title?: string;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  period?: string;
  status?: "on-track" | "behind" | "ahead" | "completed";
  trend?: number; // % change
  goal?: any; // Thêm prop goal để tương thích với Dashboard
  onEdit?: () => void;
  onDelete?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = React.memo(({
  title,
  currentValue,
  targetValue,
  unit,
  period,
  status,
  trend,
  goal,
  onEdit,
  onDelete
}) => {
  // Sử dụng goal prop nếu có, nếu không thì dùng các props riêng lẻ
  const goalData = goal || {
    title,
    currentValue,
    targetValue,
    unit,
    period,
    status,
    trend
  };

  const progress = Math.min((goalData.currentValue / goalData.targetValue) * 100, 100);
  const isCompleted = goalData.currentValue >= goalData.targetValue;

  const getStatusColor = () => {
    switch (goalData.status) {
      case "completed":
        return "border-green-200 dark:border-green-700 bg-white dark:bg-[#1F2937]";
      case "ahead":
        return "border-green-200 dark:border-green-700 bg-white dark:bg-[#1F2937]";
      case "on-track":
        return "border-accent dark:border-accent bg-white dark:bg-[#1F2937]";
      case "behind":
        return "border-red-200 dark:border-red-700 bg-white dark:bg-[#1F2937]";
      default:
        return "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937]";
    }
  };

  const getStatusIcon = () => {
    switch (goalData.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "ahead":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "on-track":
        return <Target className="w-5 h-5 text-accent" />;
      case "behind":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (goalData.status) {
      case "completed":
        return "Hoàn thành";
      case "ahead":
        return "Vượt mục tiêu";
      case "on-track":
        return "Đúng tiến độ";
      case "behind":
        return "Chậm tiến độ";
      default:
        return "Chưa bắt đầu";
    }
  };

  const getStatusBadge = () => {
    switch (goalData.status) {
      case "completed":
      case "ahead":
        return "bg-gradient-to-r from-gradientFrom to-gradientTo text-white";
      case "on-track":
        return "bg-accent text-white";
      case "behind":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getProgressColor = () => {
    if (isCompleted) return "bg-gradient-to-r from-gradientFrom to-gradientTo";
    if (progress >= 80) return "bg-accent";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{goalData.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{goalData.period}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
            {getStatusText()}
          </span>
          {(onEdit || onDelete) && (
            <div className="flex space-x-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 text-gray-400 hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Tiến độ</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hiện tại</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {goalData.currentValue?.toLocaleString()} {goalData.unit}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mục tiêu</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {goalData.targetValue?.toLocaleString()} {goalData.unit}
          </p>
        </div>
      </div>

      {/* Trend */}
      {goalData.trend !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {goalData.trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              goalData.trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {goalData.trend > 0 ? "+" : ""}{goalData.trend}% so với tuần trước
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default GoalCard; 