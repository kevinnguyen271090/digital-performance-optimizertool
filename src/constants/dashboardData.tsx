import React from "react";
import { BarChart2, Percent, DollarSign, TrendingUp } from "lucide-react";

export const MOCK_KPIS = [
  {
    title: "Tổng doanh thu",
    value: "150M VND",
    change: 12.5,
    status: "normal" as const,
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    title: "ROAS",
    value: "3.33x",
    change: 8.2,
    status: "normal" as const,
    icon: <BarChart2 className="w-5 h-5" />
  },
  {
    title: "CPA",
    value: "36K VND",
    change: -5.1,
    status: "warning" as const,
    icon: <Percent className="w-5 h-5" />
  },
  {
    title: "Chuyển đổi",
    value: "1,250",
    change: 15.3,
    status: "normal" as const,
    icon: <TrendingUp className="w-5 h-5" />
  }
];

export const MOCK_EXECUTIVE_DATA = {
  totalRevenue: 150000000,
  totalSpend: 45000000,
  totalConversions: 1250,
  roas: 3.33,
  cpa: 36000,
  ctr: 2.5,
  impressions: 500000,
  clicks: 12500
};

export const MOCK_CHANNEL_DETAIL_DATA = {
  impressions: 150000,
  clicks: 3750,
  ctr: 2.5,
  spend: 15000000,
  conversions: 375,
  cpa: 40000,
  roas: 2.67
};

export const MOCK_PLATFORM_DATA = {
  meta: {
    impressions: 150000,
    ctr: 2.5,
    cpa: 40000,
    conversions: 450
  },
  google: {
    sessions: 25000,
    pageViews: 45000,
    avgSessionDuration: 2.5,
    transactions: 1250
  },
  tiktok: {
    totalViews: 500000,
    avgEngagementRate: 2.5,
    totalLikes: 25000,
    totalVideos: 50
  }
};

export const MOCK_CONNECTED_PLATFORMS = [
  { platform: 'meta', status: 'connected', lastSync: new Date() },
  { platform: 'google', status: 'connected', lastSync: new Date() },
  { platform: 'tiktok', status: 'connected', lastSync: new Date() }
]; 