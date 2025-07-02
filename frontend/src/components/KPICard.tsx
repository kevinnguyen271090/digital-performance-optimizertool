import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  const getStatusColor = () => {
    switch (status) {
      case "danger":
        return "bg-danger/10 text-danger border-danger/20 animate-pulse";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse-slow";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success animate-bounce" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-danger animate-bounce" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = () => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-danger";
    return "text-gray-500";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group relative w-full"
      style={{ minWidth: 200, maxWidth: 260 }}
      data-testid={testId}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-accent">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}
          title={status === "danger" ? "Chỉ số nguy hiểm, cần chú ý" : status === "warning" ? "Chỉ số cảnh báo" : "Chỉ số bình thường"}
        >
          {status === "danger" ? "Cần chú ý" : status === "warning" ? "Cảnh báo" : "Bình thường"}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}
            data-tooltip-id={`kpi-tooltip-${title}`}
            data-tooltip-content={`So với kỳ trước: ${change > 0 ? 'Tăng' : change < 0 ? 'Giảm' : 'Không đổi'} ${Math.abs(change)}%`}
          >
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
            <span>so với kỳ trước</span>
          </div>
          <Tooltip id={`kpi-tooltip-${title}`} place="top" />
        </div>
      </div>
    </div>
  );
});

export default KPICard; 