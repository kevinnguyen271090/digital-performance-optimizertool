import React from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Tooltip } from 'react-tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number; // % change
  status: "normal" | "warning" | "danger";
  icon?: React.ReactNode;
  testId?: string;
}

const KPICard: React.FC<KPICardProps> = React.memo(({ title, value, change, status, icon, testId }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "danger":
        return {
          bg: "bg-white dark:bg-[#1F2937]",
          border: "border-red-200 dark:border-red-700",
          text: "text-red-600 dark:text-red-400",
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
          label: "Cần chú ý",
          badge: "bg-red-500 text-white"
        };
      case "warning":
        return {
          bg: "bg-white dark:bg-[#1F2937]",
          border: "border-yellow-200 dark:border-yellow-700",
          text: "text-yellow-600 dark:text-yellow-400",
          icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
          label: "Cảnh báo",
          badge: "bg-yellow-500 text-white"
        };
      default:
        return {
          bg: "bg-white dark:bg-[#1F2937]",
          border: "border-gray-200 dark:border-gray-700",
          text: "text-green-600 dark:text-green-400",
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          label: "Bình thường",
          badge: "bg-gradient-to-r from-gradientFrom to-gradientTo text-white"
        };
    }
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = () => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-500 dark:text-gray-400";
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className={`relative w-full rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${statusConfig.bg} ${statusConfig.border}`}
      style={{ minWidth: 200, maxWidth: 260 }}
      data-testid={testId}
    >
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-lg bg-accent/10 dark:bg-accent/20">
                <div className="text-accent">{icon}</div>
              </div>
            )}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.badge}`}
            title={status === "danger" ? "Chỉ số nguy hiểm, cần chú ý" : status === "warning" ? "Chỉ số cảnh báo" : "Chỉ số bình thường"}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          
          <div className={`flex items-center space-x-2 text-sm font-medium ${getChangeColor()}`}
            data-tooltip-id={`kpi-tooltip-${title}`}
            data-tooltip-content={`So với kỳ trước: ${change > 0 ? 'Tăng' : change < 0 ? 'Giảm' : 'Không đổi'} ${Math.abs(change)}%`}
          >
            {getTrendIcon()}
            <span className="font-semibold">{Math.abs(change)}%</span>
            <span className="text-xs opacity-75">so với kỳ trước</span>
          </div>
          
          <Tooltip 
            id={`kpi-tooltip-${title}`} 
            place="top" 
            className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg"
          />
        </div>
        
        {/* Hover effect indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gradientFrom to-gradientTo opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
      </div>
    </div>
  );
});

export default KPICard; 