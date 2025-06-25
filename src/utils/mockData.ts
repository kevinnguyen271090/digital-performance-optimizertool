// Mock data cho Dashboard
export const kpiData = {
  sessions: {
    value: "12,847",
    change: 15.2,
    status: "normal" as const,
  },
  ctr: {
    value: "3.2%",
    change: -2.1,
    status: "warning" as const,
  },
  cpa: {
    value: "$45.20",
    change: 8.5,
    status: "danger" as const,
  },
  roas: {
    value: "4.8x",
    change: 12.3,
    status: "normal" as const,
  },
};

// Generate 7-day trend data
const generateTrendData = (baseValue: number, variance: number = 0.2) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    return {
      date: date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" }),
      value: Math.round(baseValue * randomFactor),
    };
  });
};

export const chartData = {
  sessions: generateTrendData(1800, 0.3),
  ctr: generateTrendData(3.2, 0.4).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
  cpa: generateTrendData(45, 0.25).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
  roas: generateTrendData(4.8, 0.3).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
};

// Mock data cho Goals
export const mockGoals = [
  {
    id: "goal-1",
    title: "Tăng doanh thu tháng này",
    currentValue: 85000000,
    targetValue: 100000000,
    unit: "revenue",
    period: "monthly",
    status: "on-track" as const,
    trend: 12.5,
    description: "Mục tiêu tăng doanh thu lên 100 triệu VNĐ trong tháng này",
    createdAt: new Date().toISOString()
  },
  {
    id: "goal-2", 
    title: "Giảm CPA xuống dưới 40k",
    currentValue: 45.2,
    targetValue: 40,
    unit: "cpa",
    period: "monthly",
    status: "behind" as const,
    trend: -5.2,
    description: "Tối ưu chi phí quảng cáo để giảm CPA",
    createdAt: new Date().toISOString()
  },
  {
    id: "goal-3",
    title: "Tăng CTR lên 4%",
    currentValue: 3.2,
    targetValue: 4,
    unit: "ctr", 
    period: "monthly",
    status: "ahead" as const,
    trend: 8.7,
    description: "Cải thiện click-through rate của quảng cáo",
    createdAt: new Date().toISOString()
  }
];

 