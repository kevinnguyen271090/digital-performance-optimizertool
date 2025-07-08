import React from 'react';
import { 
  Facebook, Globe, TrendingUp, ShoppingCart, 
  BarChart2, Eye, Target, Percent, DollarSign, Users,
  Clock, Heart, Share2, MessageCircle, Award, TrendingUp as TrendingUpIcon,
  Users as UsersIcon, TrendingDown, CheckCircle, AlertCircle, XCircle, Activity
} from 'lucide-react';

// Channel configuration
export const CHANNEL_CONFIG = {
  meta: {
    name: 'Meta',
    icon: Facebook,
    color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    kpis: ['impressions', 'ctr', 'cpa', 'conversions', 'cpc', 'cpm', 'engagementRate']
  },
  google: {
    name: 'Google',
    icon: Globe,
    color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    kpis: ['sessions', 'pageViews', 'avgSessionDuration', 'bounceRate', 'uniqueVisitors', 'returnVisitors']
  },
  tiktok: {
    name: 'TikTok',
    icon: TrendingUp,
    color: 'text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800',
    kpis: ['totalViews', 'engagementRate', 'totalLikes', 'totalShares']
  },
  woocommerce: {
    name: 'WooCommerce',
    icon: ShoppingCart,
    color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    kpis: ['revenue', 'orders', 'avgOrderValue', 'cartAbandonmentRate']
  }
};

// Insight configuration
export const INSIGHT_CONFIG = {
  success: {
    icon: 'CheckCircle',
    color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    textColor: 'text-green-600'
  },
  warning: {
    icon: 'AlertCircle',
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    textColor: 'text-yellow-600'
  },
  error: {
    icon: 'XCircle',
    color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    textColor: 'text-red-600'
  },
  info: {
    icon: 'Activity',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    textColor: 'text-blue-600'
  }
};

// Helper functions
export const getChannelIcon = (channel: string) => {
  const config = CHANNEL_CONFIG[channel.toLowerCase() as keyof typeof CHANNEL_CONFIG];
  if (config) {
    const IconComponent = config.icon;
    return React.createElement(IconComponent, { className: "w-5 h-5" });
  }
  return React.createElement(BarChart2, { className: "w-5 h-5" });
};

export const getChannelColor = (channel: string) => {
  const config = CHANNEL_CONFIG[channel.toLowerCase() as keyof typeof CHANNEL_CONFIG];
  return config?.color || 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
};

export const getInsightIcon = (type: string) => {
  const config = INSIGHT_CONFIG[type as keyof typeof INSIGHT_CONFIG];
  if (config) {
    // Return icon component based on type
    switch (type) {
      case 'success':
        return React.createElement(CheckCircle, { className: "w-4 h-4 text-green-600" });
      case 'warning':
        return React.createElement(AlertCircle, { className: "w-4 h-4 text-yellow-600" });
      case 'error':
        return React.createElement(XCircle, { className: "w-4 h-4 text-red-600" });
      case 'info':
        return React.createElement(Activity, { className: "w-4 h-4 text-blue-600" });
      default:
        return React.createElement(Activity, { className: "w-4 h-4 text-gray-600" });
    }
  }
  return React.createElement(Activity, { className: "w-4 h-4 text-gray-600" });
};

export const getInsightColor = (type: string) => {
  const config = INSIGHT_CONFIG[type as keyof typeof INSIGHT_CONFIG];
  return config?.color || 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
};

// KPI generation functions
export const generateGlobalKPIs = (overview: any) => [
  {
    title: 'Customer Lifetime Value',
    value: overview.customerLifetimeValue ? `${overview.customerLifetimeValue.toLocaleString()}đ` : 'N/A',
    change: overview.customerLifetimeValueChange || 0,
    status: overview.customerLifetimeValueChange >= 0 ? 'normal' : 'warning',
    icon: React.createElement(Award, { className: "w-4 h-4" })
  },
  {
    title: 'Churn Rate',
    value: overview.churnRate ? `${overview.churnRate.toFixed(2)}%` : 'N/A',
    change: overview.churnRateChange || 0,
    status: overview.churnRateChange <= 0 ? 'normal' : 'warning',
    icon: React.createElement(TrendingDown, { className: "w-4 h-4" })
  },
  {
    title: 'New Customer Rate',
    value: overview.newCustomerRate ? `${overview.newCustomerRate.toFixed(2)}%` : 'N/A',
    change: overview.newCustomerRateChange || 0,
    status: overview.newCustomerRateChange >= 0 ? 'normal' : 'warning',
    icon: React.createElement(UsersIcon, { className: "w-4 h-4" })
  },
  {
    title: 'Avg Time to Convert',
    value: overview.avgTimeToConvert ? `${overview.avgTimeToConvert.toFixed(1)} ngày` : 'N/A',
    change: overview.avgTimeToConvertChange || 0,
    status: overview.avgTimeToConvertChange <= 0 ? 'normal' : 'warning',
    icon: React.createElement(Clock, { className: "w-4 h-4" })
  }
];

export const generateChannelKPIs = (channel: string, overview: any) => {
  const kpiConfigs = {
    meta: [
      { title: 'Impressions', key: 'impressions', icon: React.createElement(Eye, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'CTR', key: 'ctr', icon: React.createElement(Percent, { className: "w-4 h-4" }), format: (v: number) => `${v?.toFixed(2)}%` },
      { title: 'CPA', key: 'cpa', icon: React.createElement(DollarSign, { className: "w-4 h-4" }), format: (v: number) => `${v?.toLocaleString()}đ` },
      { title: 'Conversions', key: 'conversions', icon: React.createElement(Target, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'CPC', key: 'cpc', icon: React.createElement(DollarSign, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toLocaleString()}đ` : 'N/A' },
      { title: 'CPM', key: 'cpm', icon: React.createElement(DollarSign, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toLocaleString()}đ` : 'N/A' },
      { title: 'Engagement Rate', key: 'engagementRate', icon: React.createElement(Heart, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toFixed(2)}%` : 'N/A' }
    ],
    google: [
      { title: 'Sessions', key: 'impressions', icon: React.createElement(BarChart2, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'Page Views', key: 'pageViews', icon: React.createElement(Eye, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'Avg Session Duration', key: 'avgSessionDuration', icon: React.createElement(Clock, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toFixed(1)} phút` : 'N/A' },
      { title: 'Bounce Rate', key: 'bounceRate', icon: React.createElement(TrendingDown, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toFixed(2)}%` : 'N/A' },
      { title: 'Unique Visitors', key: 'uniqueVisitors', icon: React.createElement(Users, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'Return Visitors', key: 'returnVisitors', icon: React.createElement(Users, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' }
    ],
    tiktok: [
      { title: 'Total Views', key: 'impressions', icon: React.createElement(Eye, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'Engagement Rate', key: 'engagementRate', icon: React.createElement(Heart, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toFixed(2)}%` : 'N/A' },
      { title: 'Total Likes', key: 'clicks', icon: React.createElement(Heart, { className: "w-4 h-4" }), format: (v: number) => v?.toLocaleString() || '0' },
      { title: 'Total Shares', key: 'conversions', icon: React.createElement(Share2, { className: "w-4 h-4" }), format: (v: number) => v?.toString() || '0' }
    ],
    woocommerce: [
      { title: 'Revenue', key: 'revenue', icon: React.createElement(DollarSign, { className: "w-4 h-4" }), format: (v: number) => `${v?.toLocaleString()}đ` },
      { title: 'Orders', key: 'conversions', icon: React.createElement(Target, { className: "w-4 h-4" }), format: (v: number) => v?.toString() || '0' },
      { title: 'Avg Order Value', key: 'avgOrderValue', icon: React.createElement(ShoppingCart, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toLocaleString()}đ` : 'N/A' },
      { title: 'Cart Abandonment Rate', key: 'cartAbandonmentRate', icon: React.createElement(TrendingDown, { className: "w-4 h-4" }), format: (v: number) => v ? `${v.toFixed(2)}%` : 'N/A' }
    ]
  };

  const config = kpiConfigs[channel.toLowerCase() as keyof typeof kpiConfigs];
  if (!config) return [];

  return config.map(kpi => ({
    title: kpi.title,
    value: kpi.format(overview[kpi.key]),
    change: overview[`${kpi.key}Change`] || 0,
    status: kpi.key.includes('Rate') || kpi.key.includes('CPA') || kpi.key.includes('CPC') || kpi.key.includes('CPM') || kpi.key.includes('Bounce') || kpi.key.includes('Abandonment') || kpi.key.includes('Time')
      ? (overview[`${kpi.key}Change`] || 0) <= 0 ? 'normal' : 'warning'
      : (overview[`${kpi.key}Change`] || 0) >= 0 ? 'normal' : 'warning',
    icon: kpi.icon
  }));
};

// Chart generation functions
export const generateChannelCharts = (channel: string, trends: any) => {
  const chartConfigs = {
    meta: [
      { title: 'Impressions (7 ngày)', data: trends.impressions, color: '#1877F2' },
      { title: 'CTR (7 ngày)', data: trends.ctr, color: '#42A5F5' },
      { title: 'CPA (7 ngày)', data: trends.spend, color: '#EF4444' },
      { title: 'Conversions (7 ngày)', data: trends.conversions, color: '#10B981' },
      { title: 'CPC (7 ngày)', data: trends.cpc || [], color: '#F59E0B' },
      { title: 'CPM (7 ngày)', data: trends.cpm || [], color: '#8B5CF6' },
      { title: 'Engagement Rate (7 ngày)', data: trends.engagementRate || [], color: '#EC4899' }
    ],
    google: [
      { title: 'Sessions (7 ngày)', data: trends.impressions, color: '#4285F4' },
      { title: 'Page Views (7 ngày)', data: trends.pageViews || trends.clicks, color: '#34A853' },
      { title: 'Session Duration (7 ngày)', data: trends.avgSessionDuration || trends.ctr, color: '#FBBC05' },
      { title: 'Bounce Rate (7 ngày)', data: trends.bounceRate || [], color: '#EA4335' },
      { title: 'Unique Visitors (7 ngày)', data: trends.uniqueVisitors || [], color: '#FF6B6B' },
      { title: 'Return Visitors (7 ngày)', data: trends.returnVisitors || [], color: '#4ECDC4' }
    ],
    tiktok: [
      { title: 'Views (7 ngày)', data: trends.impressions, color: '#FF0050' },
      { title: 'Engagement (7 ngày)', data: trends.engagementRate || trends.ctr, color: '#25F4EE' },
      { title: 'Likes (7 ngày)', data: trends.clicks, color: '#FE2C55' },
      { title: 'Shares (7 ngày)', data: trends.conversions, color: '#161823' }
    ],
    woocommerce: [
      { title: 'Revenue (7 ngày)', data: trends.revenue, color: '#7C3AED' },
      { title: 'Orders (7 ngày)', data: trends.conversions, color: '#10B981' },
      { title: 'Avg Order Value (7 ngày)', data: trends.avgOrderValue || trends.spend, color: '#F59E0B' },
      { title: 'Cart Abandonment Rate (7 ngày)', data: trends.cartAbandonmentRate || [], color: '#EF4444' }
    ]
  };

  const config = chartConfigs[channel.toLowerCase() as keyof typeof chartConfigs];
  return config || [];
}; 