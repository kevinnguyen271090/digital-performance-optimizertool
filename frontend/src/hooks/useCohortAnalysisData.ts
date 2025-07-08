import { useMemo } from 'react';
import {
  mockCohortRetention,
  mockCohortRevenue,
  mockCohortBehavior,
  mockCohortComparison,
  CohortRetentionData,
  CohortRevenueData,
  CohortBehaviorData,
  CohortComparisonData,
} from '@/utils/mockCohortAndCampaignData';

interface UseCohortAnalysisDataProps {
  cohort?: string;
  week?: number;
  action?: string;
}

export function useCohortAnalysisData({ cohort, week, action }: UseCohortAnalysisDataProps = {}) {
  // Lọc retention
  const retention = useMemo<CohortRetentionData[]>(() => {
    return mockCohortRetention.filter(d =>
      (!cohort || d.cohort === cohort) && (!week || d.week === week)
    );
  }, [cohort, week]);

  // Lọc revenue
  const revenue = useMemo<CohortRevenueData[]>(() => {
    return mockCohortRevenue.filter(d =>
      (!cohort || d.cohort === cohort) && (!week || d.week === week)
    );
  }, [cohort, week]);

  // Lọc behavior
  const behavior = useMemo<CohortBehaviorData[]>(() => {
    return mockCohortBehavior.filter(d =>
      (!cohort || d.cohort === cohort) && (!week || d.week === week) && (!action || d.action === action)
    );
  }, [cohort, week, action]);

  // Comparison luôn trả về toàn bộ
  const comparison = useMemo<CohortComparisonData[]>(() => mockCohortComparison, []);

  return { retention, revenue, behavior, comparison };
} 