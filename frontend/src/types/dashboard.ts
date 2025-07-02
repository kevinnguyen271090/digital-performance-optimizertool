import { Session } from "@supabase/supabase-js";
import { DashboardMetrics } from "../utils/platformDataService";

export interface PlatformConnection {
  platform: string;
  status: string;
  lastSync?: Date;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  lastSync?: Date;
}

export interface PlatformAccounts {
  platform: string;
  accounts: Account[];
}

export type DashboardView = 'overview' | 'platforms' | 'channels' | 'executive';

export interface DashboardState {
  goals: any[];
  showGoalModal: boolean;
  editGoal: any;
  session: Session | null;
  realData: DashboardMetrics;
  loading: boolean;
  hasConnectedPlatforms: boolean;
  connectedPlatforms: PlatformConnection[];
  platformData: {[key: string]: any};
  currentView: DashboardView;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  dateRangeString: string;
  selectedAccounts: {[platform: string]: string[]};
  showAccountSelector: boolean;
}

export interface KPI {
  title: string;
  value: string | number;
  change: number;
  status: "normal" | "warning" | "danger";
  icon: React.ReactNode;
}

export interface ExecutiveData {
  totalRevenue: number;
  revenueChange: number;
  totalConversions: number;
  conversionChange: number;
  totalSpend: number;
  spendChange: number;
  roas: number;
  roasChange: number;
  topPerformingChannel: string;
  topPerformingChannelValue: string;
  criticalAlerts: Array<{
    type: 'warning' | 'success' | 'error';
    title: string;
    description: string;
  }>;
  keyInsights: Array<{
    title: string;
    value: string;
    change: number;
    status: 'up' | 'down';
  }>;
}

export interface ChannelDetailData {
  overview: {
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
  };
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      spend: number;
      conversions: number;
      cpa: number;
      revenue: number;
      roas: number;
    };
    change: number;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      spend: number;
      conversions: number;
      cpa: number;
      revenue: number;
      roas: number;
    };
    change: number;
  }>;
  trends: {
    impressions: any[];
    clicks: any[];
    ctr: any[];
    spend: any[];
    conversions: any[];
    cpa: any[];
    revenue: any[];
    roas: any[];
  };
}

export interface DashboardExecutiveProps {
  executiveData: ExecutiveData[];
}

export interface DashboardPlatformsProps {
  platformsData: any[];
} 