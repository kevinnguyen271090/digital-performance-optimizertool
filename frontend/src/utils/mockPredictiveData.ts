// Mock data phức tạp cho Predictive Analytics
export interface PredictiveDataPoint {
  month: string;
  channel: string;
  segment: string;
  revenue: number | null;
  churn: number | null;
  ltv: number | null;
  forecastRevenue: number | null;
  forecastChurn: number | null;
  forecastLTV: number | null;
  confidence: number | null;
  trendLabel: string | null;
}

const channels = ['Google', 'Facebook', 'Email', 'Zalo', 'TikTok'];
const segments = ['VIP', 'Regular', 'New', 'Enterprise'];
const months = Array.from({ length: 30 }, (_, i) => {
  const y = 2021 + Math.floor(i / 12);
  const m = (i % 12) + 1;
  return `${y}-${m.toString().padStart(2, '0')}`;
});

function randomTrend(base: number, i: number, season = false) {
  let val = base + i * (Math.random() * 30 - 10);
  if (season) val += Math.sin(i / 6 * Math.PI) * 120;
  if (Math.random() < 0.07) val += Math.random() * 400; // outlier
  if (Math.random() < 0.04) return null; // missing data
  return Math.max(0, Math.round(val));
}

function getTrendLabel(values: (number|null)[], idx: number): string {
  if (idx < 2 || !values[idx] || !values[idx-1]) return 'ổn định';
  const diff = (values[idx] as number) - (values[idx-1] as number);
  if (diff > 100) return 'tăng mạnh';
  if (diff < -100) return 'giảm mạnh';
  if (diff > 20) return 'tăng';
  if (diff < -20) return 'giảm';
  return 'ổn định';
}

export const mockPredictiveData: PredictiveDataPoint[] = [];

months.forEach((month, i) => {
  // Kênh TikTok chỉ xuất hiện từ năm 2022
  const activeChannels = i < 12 ? channels.slice(0, 4) : channels;
  activeChannels.forEach(channel => {
    // Phân khúc Enterprise chỉ xuất hiện từ năm 2023
    const activeSegments = i < 24 ? segments.slice(0, 3) : segments;
    activeSegments.forEach(segment => {
      const revenue = randomTrend(1200 + 250 * segments.indexOf(segment), i, true);
      const churn = randomTrend(25 + 7 * segments.indexOf(segment), i, false);
      const ltv = revenue && churn ? Math.round(revenue / (churn || 1)) : null;
      // Dự báo: moving average 3 tháng gần nhất + random, confidence giảm dần về tương lai
      let forecastRevenue = null, forecastChurn = null, forecastLTV = null, confidence = null;
      if (i >= 3) {
        const prev = mockPredictiveData.filter(d => d.channel === channel && d.segment === segment).slice(-3);
        if (prev.length === 3) {
          forecastRevenue = Math.round(prev.map(d => d.revenue || 0).reduce((a, b) => a + b, 0) / 3 + Math.random() * 60);
          forecastChurn = Math.round(prev.map(d => d.churn || 0).reduce((a, b) => a + b, 0) / 3 + Math.random() * 3);
          forecastLTV = forecastRevenue && forecastChurn ? Math.round(forecastRevenue / (forecastChurn || 1)) : null;
          confidence = Math.round(90 - (i - 3) * 1.5 + Math.random() * 5); // confidence giảm dần
        }
      }
      // Trend label
      const prevData = mockPredictiveData.filter(d => d.channel === channel && d.segment === segment);
      const revenueArr = prevData.map(d => d.revenue).concat([revenue]);
      const trendLabel = getTrendLabel(revenueArr, revenueArr.length-1);
      mockPredictiveData.push({ month, channel, segment, revenue, churn, ltv, forecastRevenue, forecastChurn, forecastLTV, confidence, trendLabel });
    });
  });
}); 