export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  period: string;
  status: "on-track" | "behind" | "ahead" | "completed";
  trend?: number;
  description?: string;
  createdAt: string;
}

export interface GoalFormData {
  title: string;
  targetValue: string;
  unit: string;
  period: string;
  description: string;
}

export interface GoalUnit {
  value: string;
  label: string;
  icon: any;
}

export interface GoalPeriod {
  value: string;
  label: string;
} 