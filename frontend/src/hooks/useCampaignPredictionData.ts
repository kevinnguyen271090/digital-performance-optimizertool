import { useMemo } from 'react';
import {
  mockCampaignPerformance,
  CampaignPerformancePoint,
} from '@/utils/mockCohortAndCampaignData';

interface UseCampaignPredictionDataProps {
  campaign?: string;
  fromDate?: string;
  toDate?: string;
}

export function useCampaignPredictionData({ campaign, fromDate, toDate }: UseCampaignPredictionDataProps = {}) {
  // Lọc dữ liệu theo campaign và khoảng ngày
  const data = useMemo<CampaignPerformancePoint[]>(() => {
    return mockCampaignPerformance.filter(d =>
      (!campaign || d.campaign === campaign) &&
      (!fromDate || d.date >= fromDate) &&
      (!toDate || d.date <= toDate)
    );
  }, [campaign, fromDate, toDate]);

  // Lấy danh sách campaign duy nhất
  const campaigns = useMemo(() => Array.from(new Set(mockCampaignPerformance.map(d => d.campaign))), []);

  return { data, campaigns };
} 