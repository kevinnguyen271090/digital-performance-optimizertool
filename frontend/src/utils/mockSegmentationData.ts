// Mock data cho Advanced Segmentation
// Đặt đúng chuẩn utils, dễ mở rộng, dễ test

// --- RFM Analysis ---
export interface RFMData {
  segment: string; // ví dụ: "VIP", "New", "Churned"
  recency: number | null; // ngày gần nhất mua hàng
  frequency: number | null; // số lần mua
  monetary: number | null; // tổng chi tiêu
  isOutlier?: boolean;
}

// --- Behavioral Segmentation ---
export interface BehavioralData {
  segment: string;
  action: string; // ví dụ: "login", "purchase", "share"
  count: number;
  week: number;
}

// --- Geographic Analysis ---
export interface GeographicData {
  region: string; // ví dụ: "Hanoi", "HCM", "Da Nang"
  users: number;
  revenue: number;
  isWarning?: boolean;
  customers?: number;
  ratio?: number;
}

// --- Device/Platform Analysis ---
export interface DeviceData {
  platform: string; // ví dụ: "iOS", "Android", "Web"
  users: number | null;
  avgSession: number | null;
  isOutlier?: boolean;
}

// Dữ liệu mẫu đa dạng
export const mockRFMData: RFMData[] = [
  { segment: 'VIP', recency: 2, frequency: 20, monetary: 5000 },
  { segment: 'Loyal', recency: 7, frequency: 15, monetary: 3000 },
  { segment: 'Potential', recency: 15, frequency: 5, monetary: 800 },
  { segment: 'Churned', recency: 60, frequency: 1, monetary: 100, isOutlier: true },
  { segment: 'New', recency: 1, frequency: 1, monetary: 200 },
  { segment: 'At Risk', recency: 30, frequency: 2, monetary: null }, // missing
];

export const mockBehavioralData: BehavioralData[] = [
  { segment: 'VIP', action: 'purchase', count: 50, week: 1 },
  { segment: 'VIP', action: 'login', count: 80, week: 1 },
  { segment: 'Loyal', action: 'purchase', count: 30, week: 1 },
  { segment: 'Potential', action: 'login', count: 40, week: 1 },
  { segment: 'Churned', action: 'login', count: 5, week: 1 },
  { segment: 'VIP', action: 'purchase', count: 60, week: 2 },
  { segment: 'Loyal', action: 'purchase', count: 35, week: 2 },
  { segment: 'Potential', action: 'login', count: 38, week: 2 },
  { segment: 'Churned', action: 'login', count: 2, week: 2 },
];

export const mockGeographicData: GeographicData[] = [
  { region: 'Hanoi', users: 500, revenue: 2000 },
  { region: 'HCM', users: 700, revenue: 3500 },
  { region: 'Da Nang', users: 200, revenue: 800 },
  { region: 'Can Tho', users: 50, revenue: null }, // missing
  { region: 'Hai Phong', users: 80, revenue: 300, isOutlier: true },
];

export const mockDeviceData: DeviceData[] = [
  { platform: 'iOS', users: 400, avgSession: 5.2 },
  { platform: 'Android', users: 600, avgSession: 4.8 },
  { platform: 'Web', users: 300, avgSession: 6.1 },
  { platform: 'Tablet', users: 50, avgSession: null }, // missing
  { platform: 'Other', users: 10, avgSession: 2.0, isOutlier: true },
]; 