// Mock data cho Cohort Analysis & Campaign Performance Prediction
// Đặt đúng chuẩn utils, dễ mở rộng, dễ test

// --- Cohort Analysis ---
export interface CohortRetentionData {
  cohort: string; // ví dụ: "2023-W01"
  week: number;
  retentionRate: number | null; // % giữ chân, có thể null (missing)
  isOutlier?: boolean;
}

export interface CohortRevenueData {
  cohort: string;
  week: number;
  revenue: number | null;
  isOutlier?: boolean;
}

export interface CohortBehaviorData {
  cohort: string;
  week: number;
  action: string; // ví dụ: "purchase", "login"
  count: number;
}

export interface CohortComparisonData {
  cohort: string;
  avgRevenue: number;
  avgRetention: number;
  avgActions: number;
}

// --- Predictive Analytics: Campaign Performance ---
export interface CampaignPerformancePoint {
  campaign: string;
  date: string; // yyyy-mm-dd
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  revenue: number | null;
  forecastImpressions: number | null;
  forecastClicks: number | null;
  forecastConversions: number | null;
  forecastRevenue: number | null;
  confidence: number; // %
  isOutlier?: boolean;
  isMissing?: boolean;
}

// Sinh dữ liệu mẫu đa dạng
export const mockCohortRetention: CohortRetentionData[] = [
  { cohort: '2023-W01', week: 1, retentionRate: 1 },
  { cohort: '2023-W01', week: 2, retentionRate: 0.65 },
  { cohort: '2023-W01', week: 3, retentionRate: 0.5 },
  { cohort: '2023-W01', week: 4, retentionRate: 0.4, isOutlier: true },
  { cohort: '2023-W02', week: 1, retentionRate: 1 },
  { cohort: '2023-W02', week: 2, retentionRate: 0.7 },
  { cohort: '2023-W02', week: 3, retentionRate: null }, // missing
  { cohort: '2023-W02', week: 4, retentionRate: 0.45 },
  { cohort: '2023-W03', week: 1, retentionRate: 1 },
  { cohort: '2023-W03', week: 2, retentionRate: 0.6 },
  { cohort: '2023-W03', week: 3, retentionRate: 0.55 },
  { cohort: '2023-W03', week: 4, retentionRate: 0.5 },
];

export const mockCohortRevenue: CohortRevenueData[] = [
  { cohort: '2023-W01', week: 1, revenue: 1000 },
  { cohort: '2023-W01', week: 2, revenue: 800 },
  { cohort: '2023-W01', week: 3, revenue: 600 },
  { cohort: '2023-W01', week: 4, revenue: 400, isOutlier: true },
  { cohort: '2023-W02', week: 1, revenue: 1200 },
  { cohort: '2023-W02', week: 2, revenue: 900 },
  { cohort: '2023-W02', week: 3, revenue: null }, // missing
  { cohort: '2023-W02', week: 4, revenue: 500 },
  { cohort: '2023-W03', week: 1, revenue: 1100 },
  { cohort: '2023-W03', week: 2, revenue: 950 },
  { cohort: '2023-W03', week: 3, revenue: 800 },
  { cohort: '2023-W03', week: 4, revenue: 700 },
];

export const mockCohortBehavior: CohortBehaviorData[] = [
  { cohort: '2023-W01', week: 1, action: 'purchase', count: 50 },
  { cohort: '2023-W01', week: 2, action: 'purchase', count: 30 },
  { cohort: '2023-W01', week: 3, action: 'login', count: 100 },
  { cohort: '2023-W02', week: 1, action: 'purchase', count: 60 },
  { cohort: '2023-W02', week: 2, action: 'login', count: 90 },
  { cohort: '2023-W03', week: 1, action: 'purchase', count: 55 },
  { cohort: '2023-W03', week: 2, action: 'login', count: 80 },
];

export const mockCohortComparison: CohortComparisonData[] = [
  { cohort: '2023-W01', avgRevenue: 700, avgRetention: 0.64, avgActions: 60 },
  { cohort: '2023-W02', avgRevenue: 900, avgRetention: 0.72, avgActions: 75 },
  { cohort: '2023-W03', avgRevenue: 900, avgRetention: 0.66, avgActions: 68 },
];

export const mockCampaignPerformance: CampaignPerformancePoint[] = [
  { campaign: 'Summer Sale', date: '2023-06-01', impressions: 10000, clicks: 800, conversions: 120, revenue: 3000, forecastImpressions: 11000, forecastClicks: 850, forecastConversions: 130, forecastRevenue: 3200, confidence: 80 },
  { campaign: 'Summer Sale', date: '2023-06-02', impressions: 9500, clicks: 780, conversions: 110, revenue: 2900, forecastImpressions: 10000, forecastClicks: 800, forecastConversions: 120, forecastRevenue: 3000, confidence: 78 },
  { campaign: 'Summer Sale', date: '2023-06-03', impressions: null, clicks: null, conversions: null, revenue: null, forecastImpressions: 9000, forecastClicks: 700, forecastConversions: 100, forecastRevenue: 2500, confidence: 70, isMissing: true },
  { campaign: 'Summer Sale', date: '2023-06-04', impressions: 12000, clicks: 900, conversions: 140, revenue: 3500, forecastImpressions: 12500, forecastClicks: 950, forecastConversions: 150, forecastRevenue: 3700, confidence: 85, isOutlier: true },
  { campaign: 'Back to School', date: '2023-06-01', impressions: 8000, clicks: 600, conversions: 90, revenue: 2000, forecastImpressions: 8500, forecastClicks: 650, forecastConversions: 100, forecastRevenue: 2200, confidence: 75 },
  { campaign: 'Back to School', date: '2023-06-02', impressions: 8200, clicks: 620, conversions: 95, revenue: 2100, forecastImpressions: 8700, forecastClicks: 670, forecastConversions: 105, forecastRevenue: 2300, confidence: 77 },
  { campaign: 'Back to School', date: '2023-06-03', impressions: 7800, clicks: 590, conversions: 85, revenue: 1900, forecastImpressions: 8000, forecastClicks: 600, forecastConversions: 90, forecastRevenue: 2000, confidence: 72 },
  { campaign: 'Back to School', date: '2023-06-04', impressions: 9000, clicks: 700, conversions: 110, revenue: 2500, forecastImpressions: 9500, forecastClicks: 750, forecastConversions: 120, forecastRevenue: 2700, confidence: 80, isOutlier: true },
]; 