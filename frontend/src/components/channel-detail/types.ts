// Types cho ChannelDetailView
export interface ChannelOverview {
  impressions: number;
  impressionsChange: number;
  clicks: number;
  clicksChange: number;
  ctr: number;
  ctrChange: number;
  spend: number;
  spendChange: number;
  conversions: number;
  conversionsChange: number;
  cpa: number;
  cpaChange: number;
  revenue: number;
  revenueChange: number;
  roas: number;
  roasChange: number;
  cpc?: number;
  cpcChange?: number;
  cpm?: number;
  cpmChange?: number;
  engagementRate?: number;
  engagementRateChange?: number;
  avgSessionDuration?: number;
  avgSessionDurationChange?: number;
  bounceRate?: number;
  bounceRateChange?: number;
  pageViews?: number;
  pageViewsChange?: number;
  uniqueVisitors?: number;
  uniqueVisitorsChange?: number;
  returnVisitors?: number;
  returnVisitorsChange?: number;
  avgOrderValue?: number;
  avgOrderValueChange?: number;
  cartAbandonmentRate?: number;
  cartAbandonmentRateChange?: number;
  customerLifetimeValue?: number;
  customerLifetimeValueChange?: number;
  churnRate?: number;
  churnRateChange?: number;
  newCustomerRate?: number;
  newCustomerRateChange?: number;
  avgTimeToConvert?: number;
  avgTimeToConvertChange?: number;
}

export interface ChannelMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface ChannelAccount {
  id: string;
  name: string;
  type: string;
  metrics: ChannelMetrics;
  change: number;
}

export interface ChannelCampaign {
  id: string;
  name: string;
  status: string;
  metrics: ChannelMetrics;
  change: number;
}

export interface ChannelTrends {
  impressions: any[];
  clicks: any[];
  ctr: any[];
  spend: any[];
  conversions: any[];
  revenue: any[];
  cpc?: any[];
  cpm?: any[];
  engagementRate?: any[];
  avgSessionDuration?: any[];
  bounceRate?: any[];
  pageViews?: any[];
  uniqueVisitors?: any[];
  returnVisitors?: any[];
  avgOrderValue?: any[];
  cartAbandonmentRate?: any[];
  customerLifetimeValue?: any[];
  churnRate?: any[];
  newCustomerRate?: any[];
  avgTimeToConvert?: any[];
}

export interface ChannelInsight {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  impact?: string;
}

export interface ChannelDemographics {
  ageGroups: Array<{ age: string; percentage: number }>;
  genders: Array<{ gender: string; percentage: number }>;
  locations: Array<{ location: string; percentage: number }>;
  devices: Array<{ device: string; percentage: number }>;
}

export interface ChannelFunnel {
  traffic: number;
  leads: number;
  qualifiedLeads: number;
  orders: number;
  revenue: number;
}

export interface ChannelEngagement {
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  clicks: number;
}

export interface ChannelPerformance {
  topPerformingCampaigns: Array<{ name: string; metric: string; value: number }>;
  topPerformingAds: Array<{ name: string; metric: string; value: number }>;
  topPerformingAudiences: Array<{ name: string; metric: string; value: number }>;
  topPerformingCreatives: Array<{ name: string; metric: string; value: number }>;
}

export interface ChannelDetailData {
  overview: ChannelOverview;
  accounts: ChannelAccount[];
  campaigns: ChannelCampaign[];
  trends: ChannelTrends;
  insights: ChannelInsight[];
  demographics?: ChannelDemographics;
  funnel?: ChannelFunnel;
  engagement?: ChannelEngagement;
  performance?: ChannelPerformance;
}

export interface ChannelDetailViewProps {
  channel: string;
  data: ChannelDetailData;
  selectedAccounts?: string[];
  onAccountFilterChange?: (accounts: string[]) => void;
  isConnected?: boolean;
}

export type ChannelTabType = 'overview' | 'metrics' | 'charts' | 'accounts' | 'campaigns' | 'trends' | 'insights' | 'demographics' | 'funnel' | 'engagement' | 'performance';

export interface KPICard {
  title: string;
  value: string;
  change: number;
  status: 'normal' | 'warning' | 'danger';
  icon: React.ReactNode;
}

export interface ChartConfig {
  title: string;
  data: any[];
  color: string;
} 