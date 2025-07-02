import { Users, DollarSign, TrendingUp, Target } from "lucide-react";
import { GoalUnit, GoalPeriod } from "../types/goals";

export const GOAL_UNITS: GoalUnit[] = [
  { value: "sessions", label: "Sessions", icon: Users },
  { value: "revenue", label: "Doanh thu (VNĐ)", icon: DollarSign },
  { value: "orders", label: "Đơn hàng", icon: TrendingUp },
  { value: "ctr", label: "CTR (%)", icon: Target },
  { value: "cpa", label: "CPA (VNĐ)", icon: DollarSign },
  { value: "roas", label: "ROAS (x)", icon: TrendingUp }
];

export const GOAL_PERIODS: GoalPeriod[] = [
  { value: "weekly", label: "Hàng tuần" },
  { value: "monthly", label: "Hàng tháng" },
  { value: "quarterly", label: "Hàng quý" },
  { value: "yearly", label: "Hàng năm" }
];

export const DEFAULT_DATE_RANGE = {
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate: new Date()
};

export const DATE_RANGE_OPTIONS = {
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  last7Days: '7 ngày qua',
  last30Days: '30 ngày qua',
  last90Days: '90 ngày qua'
}; 