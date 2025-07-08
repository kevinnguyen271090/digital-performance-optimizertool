// Mock data cho Dashboard - Tuân thủ Data Source Strategy
// Environment-based configuration và API contract consistency

// ✅ LOGIC CHÍNH: Chỉ hiển thị số liệu các kênh đã kết nối, kênh chưa kết nối giá trị mặc định là 0
// Danh sách kênh đã kết nối (connectedChannels)
export const CONNECTED_CHANNELS = ['facebook', 'google'];
export const DISCONNECTED_CHANNELS = ['tiktok', 'email'];

// Helper function để filter data theo connectedChannels
export const filterDataByConnectedChannels = <T extends { id: string }>(
  data: T[],
  connectedChannels: string[] = CONNECTED_CHANNELS
): T[] => {
  return data.map(item =>
    connectedChannels.includes(item.id)
      ? item
      : { ...item, ...Object.keys(item).reduce((acc, key) => {
          if (key !== 'id' && key !== 'name' && typeof item[key as keyof T] === 'number') {
            acc[key as keyof T] = 0 as any;
          }
          return acc;
        }, {} as Partial<T>)
      }
  );
};

// Helper function để kiểm tra có dữ liệu thật không
export const hasRealData = <T extends { id: string }>(
  data: T[],
  connectedChannels: string[] = CONNECTED_CHANNELS,
  numericFields: string[] = ['revenue', 'cost', 'roas', 'cpa', 'ctr', 'conversion_rate', 'leads', 'orders']
): boolean => {
  return data.some(item => 
    connectedChannels.includes(item.id) && 
    numericFields.some(field => {
      const value = item[field as keyof T];
      return typeof value === 'number' && value > 0;
    })
  );
};

// Helper function để tạo zero data cho kênh chưa kết nối
export const createZeroData = <T extends { id: string }>(
  template: T,
  connectedChannels: string[] = CONNECTED_CHANNELS
): T => {
  return {
    ...template,
    ...Object.keys(template).reduce((acc, key) => {
      if (key !== 'id' && key !== 'name' && typeof template[key as keyof T] === 'number') {
        acc[key as keyof T] = 0 as any;
      }
      return acc;
    }, {} as Partial<T>)
  };
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

// ✅ THÊM MỚI: Function để tạo data format cho ChannelDetailView
export function createChannelDetailData(channelName: string, channelData: any): any {
  // Tạo overview data
  const overview = {
    impressions: channelData.impressions || channelData.traffic || 0,
    impressionsChange: 12,
    clicks: channelData.clicks || 0,
    clicksChange: 8,
    ctr: channelData.ctr || 2.5,
    ctrChange: 5,
    spend: channelData.cost || 0,
    spendChange: -3,
    conversions: channelData.conversions || channelData.leads || 0,
    conversionsChange: 15,
    cpa: channelData.cpa || 40000,
    cpaChange: -5,
    revenue: channelData.revenue || 0,
    revenueChange: 20,
    roas: channelData.roas || 2.5,
    roasChange: 10,
    // Global KPIs
    customerLifetimeValue: 1500000,
    customerLifetimeValueChange: 8,
    churnRate: 2.5,
    churnRateChange: -1,
    newCustomerRate: 15.2,
    newCustomerRateChange: 5,
    avgTimeToConvert: 7.5,
    avgTimeToConvertChange: -2,
    // Channel-specific metrics
    cpc: channelData.cpc || 3500,
    cpcChange: -3,
    cpm: channelData.cpm || 120000,
    cpmChange: -5,
    engagementRate: channelData.engagementRate || 3.2,
    engagementRateChange: 8,
    avgSessionDuration: channelData.avgSessionDuration || 2.5,
    avgSessionDurationChange: 5,
    bounceRate: channelData.bounceRate || 45.2,
    bounceRateChange: -3,
    pageViews: channelData.pageViews || 15000,
    pageViewsChange: 12,
    uniqueVisitors: channelData.uniqueVisitors || 8000,
    uniqueVisitorsChange: 15,
    returnVisitors: channelData.returnVisitors || 2000,
    returnVisitorsChange: 8,
    avgOrderValue: channelData.avgOrderValue || 250000,
    avgOrderValueChange: 10,
    cartAbandonmentRate: channelData.cartAbandonmentRate || 65.5,
    cartAbandonmentRateChange: -2
  };

  // Tạo accounts data
  const accounts = [
    {
      id: `${channelName}_account_1`,
      name: `${channelName} Account 1`,
      type: 'primary',
      metrics: {
        impressions: overview.impressions * 0.6,
        clicks: overview.clicks * 0.6,
        ctr: overview.ctr,
        spend: overview.spend * 0.6,
        conversions: overview.conversions * 0.6,
        cpa: overview.cpa,
        revenue: overview.revenue * 0.6,
        roas: overview.roas
      },
      change: 8
    },
    {
      id: `${channelName}_account_2`,
      name: `${channelName} Account 2`,
      type: 'secondary',
      metrics: {
        impressions: overview.impressions * 0.4,
        clicks: overview.clicks * 0.4,
        ctr: overview.ctr,
        spend: overview.spend * 0.4,
        conversions: overview.conversions * 0.4,
        cpa: overview.cpa,
        revenue: overview.revenue * 0.4,
        roas: overview.roas
      },
      change: 12
    }
  ];

  // Tạo campaigns data
  const campaigns = [
    {
      id: `${channelName}_campaign_1`,
      name: `${channelName} Campaign 1`,
      status: 'active',
      metrics: {
        impressions: overview.impressions * 0.5,
        clicks: overview.clicks * 0.5,
        ctr: overview.ctr,
        spend: overview.spend * 0.5,
        conversions: overview.conversions * 0.5,
        cpa: overview.cpa,
        revenue: overview.revenue * 0.5,
        roas: overview.roas
      },
      change: 10
    },
    {
      id: `${channelName}_campaign_2`,
      name: `${channelName} Campaign 2`,
      status: 'active',
      metrics: {
        impressions: overview.impressions * 0.5,
        clicks: overview.clicks * 0.5,
        ctr: overview.ctr,
        spend: overview.spend * 0.5,
        conversions: overview.conversions * 0.5,
        cpa: overview.cpa,
        revenue: overview.revenue * 0.5,
        roas: overview.roas
      },
      change: 15
    }
  ];

  // Tạo trends data với các chỉ số mới
  const trends = {
    impressions: generateTrendData(overview.impressions / 7, 0.3),
    clicks: generateTrendData(overview.clicks / 7, 0.3),
    ctr: generateTrendData(overview.ctr, 0.2).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    spend: generateTrendData(overview.spend / 7, 0.3),
    conversions: generateTrendData(overview.conversions / 7, 0.3),
    revenue: generateTrendData(overview.revenue / 7, 0.3),
    cpc: generateTrendData(overview.cpc / 7, 0.2),
    cpm: generateTrendData(overview.cpm / 7, 0.2),
    engagementRate: generateTrendData(overview.engagementRate, 0.3).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    avgSessionDuration: generateTrendData(overview.avgSessionDuration, 0.3).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    bounceRate: generateTrendData(overview.bounceRate, 0.2).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    pageViews: generateTrendData(overview.pageViews / 7, 0.3),
    uniqueVisitors: generateTrendData(overview.uniqueVisitors / 7, 0.3),
    returnVisitors: generateTrendData(overview.returnVisitors / 7, 0.3),
    avgOrderValue: generateTrendData(overview.avgOrderValue, 0.2),
    cartAbandonmentRate: generateTrendData(overview.cartAbandonmentRate, 0.2).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    // Global KPIs trends
    customerLifetimeValue: generateTrendData(overview.customerLifetimeValue, 0.2),
    churnRate: generateTrendData(overview.churnRate, 0.2).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    newCustomerRate: generateTrendData(overview.newCustomerRate, 0.3).map(item => ({ ...item, value: Number(item.value.toFixed(1)) })),
    avgTimeToConvert: generateTrendData(overview.avgTimeToConvert, 0.2).map(item => ({ ...item, value: Number(item.value.toFixed(1)) }))
  };

  // Tạo insights data
  const insights = [
    {
      type: 'success' as const,
      title: 'Performance tốt',
      description: `${channelName} đang hoạt động tốt với ROAS ${overview.roas}x`,
      impact: 'Tăng 20% so với tuần trước'
    },
    {
      type: 'warning' as const,
      title: 'CPA cao',
      description: `CPA ${overview.cpa.toLocaleString()}đ cao hơn mục tiêu`,
      impact: 'Cần tối ưu chi phí'
    },
    {
      type: 'info' as const,
      title: 'Cơ hội tăng trưởng',
      description: 'Có thể tăng budget cho campaign hiệu quả',
      impact: 'Dự kiến tăng 15% revenue'
    }
  ];

  // Tạo demographics data
  const demographics = {
    ageGroups: [
      { age: '18-24', percentage: 25 },
      { age: '25-34', percentage: 35 },
      { age: '35-44', percentage: 20 },
      { age: '45-54', percentage: 15 },
      { age: '55+', percentage: 5 }
    ],
    genders: [
      { gender: 'Nam', percentage: 45 },
      { gender: 'Nữ', percentage: 55 }
    ],
    locations: [
      { location: 'TP.HCM', percentage: 40 },
      { location: 'Hà Nội', percentage: 25 },
      { location: 'Đà Nẵng', percentage: 15 },
      { location: 'Khác', percentage: 20 }
    ],
    devices: [
      { device: 'Mobile', percentage: 65 },
      { device: 'Desktop', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ]
  };

  // Tạo funnel data
  const funnel = {
    traffic: overview.impressions,
    leads: overview.conversions * 2,
    qualifiedLeads: overview.conversions * 1.5,
    orders: overview.conversions,
    revenue: overview.revenue
  };

  // Tạo engagement data
  const engagement = {
    likes: overview.clicks * 0.8,
    shares: overview.clicks * 0.3,
    comments: overview.clicks * 0.2,
    saves: overview.clicks * 0.1,
    clicks: overview.clicks
  };

  // Tạo performance data
  const performance = {
    topPerformingCampaigns: [
      { name: 'Campaign A', metric: 'Revenue', value: overview.revenue * 0.6 },
      { name: 'Campaign B', metric: 'Conversions', value: overview.conversions * 0.7 },
      { name: 'Campaign C', metric: 'CTR', value: overview.ctr * 1.2 }
    ],
    topPerformingAds: [
      { name: 'Ad 1', metric: 'Clicks', value: overview.clicks * 0.4 },
      { name: 'Ad 2', metric: 'Conversions', value: overview.conversions * 0.5 },
      { name: 'Ad 3', metric: 'CTR', value: overview.ctr * 1.1 }
    ],
    topPerformingAudiences: [
      { name: 'Audience A', metric: 'Engagement', value: overview.engagementRate * 1.3 },
      { name: 'Audience B', metric: 'Conversions', value: overview.conversions * 0.6 },
      { name: 'Audience C', metric: 'CTR', value: overview.ctr * 1.4 }
    ],
    topPerformingCreatives: [
      { name: 'Creative 1', metric: 'Clicks', value: overview.clicks * 0.3 },
      { name: 'Creative 2', metric: 'Engagement', value: overview.engagementRate * 1.2 },
      { name: 'Creative 3', metric: 'Conversions', value: overview.conversions * 0.4 }
    ]
  };

  return {
    overview,
    accounts,
    campaigns,
    trends,
    insights,
    demographics,
    funnel,
    engagement,
    performance
  };
}

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

// Dữ liệu mock = 0
export const ZERO_EXECUTIVE_DATA = {
  totalRevenue: 0,
  revenueChange: 0,
  totalConversions: 0,
  conversionChange: 0,
  totalSpend: 0,
  spendChange: 0,
  roas: 0,
  roasChange: 0,
  topPerformingChannel: "Chưa có",
  topPerformingChannelValue: "0",
  criticalAlerts: [],
  keyInsights: [],
};

export const ZERO_PLATFORM_DATA = {
  meta: {
    impressions: 0,
    ctr: 0,
    cpa: 0,
    conversions: 0,
  },
  google: {
    sessions: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    transactions: 0,
  },
  tiktok: {
    totalViews: 0,
    avgEngagementRate: 0,
    totalLikes: 0,
    totalVideos: 0,
  },
  woocommerce: {
    recentRevenue: 0,
    recentOrdersCount: 0,
    avgOrderValue: 0,
    totalProducts: 0,
  },
};

export const ZERO_CONNECTED_PLATFORMS = [
  { platform: 'meta', status: 'connected', lastSync: new Date() },
  { platform: 'google', status: 'connected', lastSync: new Date() },
  { platform: 'tiktok', status: 'connected', lastSync: new Date() },
  { platform: 'woocommerce', status: 'connected', lastSync: new Date() },
];

// Dữ liệu mock = 0 cho dashboard
export const zeroExecutiveData = {
  totalRevenue: 0,
  revenueChange: 0,
  totalConversions: 0,
  conversionChange: 0,
  totalSpend: 0,
  spendChange: 0,
  roas: 0,
  roasChange: 0,
  topPerformingChannel: "Chưa có",
  topPerformingChannelValue: "0",
  criticalAlerts: [],
  keyInsights: [],
};

export const zeroPlatformData = {
  meta: {
    impressions: 0,
    ctr: 0,
    cpa: 0,
    conversions: 0,
  },
  google: {
    sessions: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    transactions: 0,
  },
  tiktok: {
    totalViews: 0,
    avgEngagementRate: 0,
    totalLikes: 0,
    totalVideos: 0,
  },
  woocommerce: {
    recentRevenue: 0,
    recentOrdersCount: 0,
    avgOrderValue: 0,
    totalProducts: 0,
  },
};

export const zeroConnectedPlatforms = [
  { platform: 'meta', status: 'connected', lastSync: new Date() },
  { platform: 'google', status: 'connected', lastSync: new Date() },
  { platform: 'tiktok', status: 'connected', lastSync: new Date() },
  { platform: 'woocommerce', status: 'connected', lastSync: new Date() },
];

// Mock data structure for development and testing
export const mockData = {
  dashboard: {
    overview: {
      totalRevenue: 135000000,
      totalCost: 43000000,
      totalROAS: 3.14,
      totalLeads: 6000,
      totalOrders: 360,
      growthRate: 12.5
    },
    channels: [
      { id: 'facebook', name: 'Facebook Ads', revenue: 50000000, cost: 20000000, roas: 2.5, cpa: 40000, ctr: 5.2, conversion_rate: 2.1, leads: 2500, orders: 150 },
      { id: 'google', name: 'Google Ads', revenue: 40000000, cost: 15000000, roas: 2.7, cpa: 37500, ctr: 4.8, conversion_rate: 2.5, leads: 2000, orders: 120 },
      { id: 'tiktok', name: 'TikTok Ads', revenue: 20000000, cost: 8000000, roas: 2.0, cpa: 45000, ctr: 6.0, conversion_rate: 1.8, leads: 1500, orders: 90 },
      { id: 'email', name: 'Email Marketing', revenue: 25000000, cost: 0, roas: 0, cpa: 0, ctr: 0, conversion_rate: 0, leads: 0, orders: 0 }
    ],
    trends: [
      { date: '2024-01-01', revenue: 4500000, cost: 1500000, leads: 200, orders: 12, traffic: 12000, like: 120, share: 45, comment: 23, ctr: 4.2, engagementRate: 2.5, cpc: 3500, cpm: 120000 },
      { date: '2024-01-02', revenue: 4800000, cost: 1600000, leads: 220, orders: 14, traffic: 13500, like: 135, share: 52, comment: 28, ctr: 4.5, engagementRate: 2.8, cpc: 3400, cpm: 118000 },
      { date: '2024-01-03', revenue: 5200000, cost: 1700000, leads: 240, orders: 16, traffic: 14800, like: 148, share: 58, comment: 31, ctr: 4.8, engagementRate: 3.1, cpc: 3300, cpm: 115000 },
      { date: '2024-01-04', revenue: 4900000, cost: 1650000, leads: 230, orders: 15, traffic: 14200, like: 142, share: 55, comment: 29, ctr: 4.3, engagementRate: 2.9, cpc: 3450, cpm: 119000 },
      { date: '2024-01-05', revenue: 5100000, cost: 1750000, leads: 250, orders: 17, traffic: 15500, like: 155, share: 62, comment: 34, ctr: 4.7, engagementRate: 3.2, cpc: 3250, cpm: 113000 },
      { date: '2024-01-06', revenue: 5400000, cost: 1800000, leads: 260, orders: 18, traffic: 16000, like: 160, share: 65, comment: 36, ctr: 4.9, engagementRate: 3.4, cpc: 3200, cpm: 112000 },
      { date: '2024-01-07', revenue: 5800000, cost: 1900000, leads: 280, orders: 20, traffic: 17000, like: 170, share: 70, comment: 40, ctr: 5.0, engagementRate: 3.6, cpc: 3150, cpm: 110000 }
    ],
    // Pie chart mock
    trafficBySource: [
      { source: 'Facebook', value: 42000 },
      { source: 'Google', value: 35000 },
      { source: 'TikTok', value: 23000 },
      { source: 'Email', value: 8000 }
    ],
    leadBySource: [
      { source: 'Facebook', value: 2500 },
      { source: 'Google', value: 2000 },
      { source: 'TikTok', value: 1500 },
      { source: 'Email', value: 0 }
    ],
    revenueBySource: [
      { source: 'Facebook', value: 50000000 },
      { source: 'Google', value: 40000000 },
      { source: 'TikTok', value: 20000000 },
      { source: 'Email', value: 25000000 }
    ],
    // Engagement timeline mock
    engagementTimeline: [
      { date: '2024-01-01', like: 120, share: 45, comment: 23, ctr: 4.2, engagementRate: 2.5 },
      { date: '2024-01-02', like: 135, share: 52, comment: 28, ctr: 4.5, engagementRate: 2.8 },
      { date: '2024-01-03', like: 148, share: 58, comment: 31, ctr: 4.8, engagementRate: 3.1 },
      { date: '2024-01-04', like: 142, share: 55, comment: 29, ctr: 4.3, engagementRate: 2.9 },
      { date: '2024-01-05', like: 155, share: 62, comment: 34, ctr: 4.7, engagementRate: 3.2 },
      { date: '2024-01-06', like: 160, share: 65, comment: 36, ctr: 4.9, engagementRate: 3.4 },
      { date: '2024-01-07', like: 170, share: 70, comment: 40, ctr: 5.0, engagementRate: 3.6 }
    ],
    // CPC/CPM timeline mock
    cpcTimeline: [
      { date: '2024-01-01', cpc: 3500 },
      { date: '2024-01-02', cpc: 3400 },
      { date: '2024-01-03', cpc: 3300 },
      { date: '2024-01-04', cpc: 3450 },
      { date: '2024-01-05', cpc: 3250 },
      { date: '2024-01-06', cpc: 3200 },
      { date: '2024-01-07', cpc: 3150 }
    ],
    cpmTimeline: [
      { date: '2024-01-01', cpm: 120000 },
      { date: '2024-01-02', cpm: 118000 },
      { date: '2024-01-03', cpm: 115000 },
      { date: '2024-01-04', cpm: 119000 },
      { date: '2024-01-05', cpm: 113000 },
      { date: '2024-01-06', cpm: 112000 },
      { date: '2024-01-07', cpm: 110000 }
    ]
  },

  executive: {
    channels: [
      { id: 'facebook', name: 'Facebook Ads', revenue: 50000000, cost: 20000000, roas: 2.5, cpa: 40000, ctr: 5.2, conversion_rate: 2.1, leads: 2500, orders: 150 },
      { id: 'google', name: 'Google Ads', revenue: 40000000, cost: 15000000, roas: 2.7, cpa: 37500, ctr: 4.8, conversion_rate: 2.5, leads: 2000, orders: 120 },
      { id: 'tiktok', name: 'TikTok Ads', revenue: 20000000, cost: 8000000, roas: 2.0, cpa: 45000, ctr: 6.0, conversion_rate: 1.8, leads: 1500, orders: 90 },
      { id: 'email', name: 'Email Marketing', revenue: 25000000, cost: 0, roas: 0, cpa: 0, ctr: 0, conversion_rate: 0, leads: 0, orders: 0 }
    ],
    funnelData: [
      {
        id: 'facebook',
        name: 'Facebook Ads',
        platform: 100000,
        lead: 2500,
        qualified_lead: 750,
        order: 150,
        revenue: 75000000,
        conversion_rates: {
          platform_to_lead: 2.5,
          lead_to_qualified: 30.0,
          qualified_to_order: 20.0,
          order_to_revenue: 500000
        }
      },
      {
        id: 'google',
        name: 'Google Ads',
        platform: 80000,
        lead: 2000,
        qualified_lead: 600,
        order: 120,
        revenue: 60000000,
        conversion_rates: {
          platform_to_lead: 2.5,
          lead_to_qualified: 30.0,
          qualified_to_order: 20.0,
          order_to_revenue: 500000
        }
      },
      {
        id: 'tiktok',
        name: 'TikTok Ads',
        platform: 60000,
        lead: 1500,
        qualified_lead: 450,
        order: 90,
        revenue: 45000000,
        conversion_rates: {
          platform_to_lead: 2.5,
          lead_to_qualified: 30.0,
          qualified_to_order: 20.0,
          order_to_revenue: 500000
        }
      }
    ],
    campaigns: [
      { id: 'fb_c1', channel: 'facebook', name: 'Facebook - C1', revenue: 25000000, cost: 10000000, roas: 2.5, cpa: 40000 },
      { id: 'fb_c2', channel: 'facebook', name: 'Facebook - C2', revenue: 25000000, cost: 10000000, roas: 2.5, cpa: 40000 },
      { id: 'gg_c1', channel: 'google', name: 'Google - C1', revenue: 20000000, cost: 7500000, roas: 2.7, cpa: 37500 },
      { id: 'gg_c2', channel: 'google', name: 'Google - C2', revenue: 20000000, cost: 7500000, roas: 2.7, cpa: 37500 },
      { id: 'tt_c1', channel: 'tiktok', name: 'TikTok - C1', revenue: 10000000, cost: 4000000, roas: 2.0, cpa: 45000 },
      { id: 'tt_c2', channel: 'tiktok', name: 'TikTok - C2', revenue: 10000000, cost: 4000000, roas: 2.0, cpa: 45000 }
    ],
    alerts: [
      { id: '1', channel: 'facebook', type: 'warning' as const, message: 'CPA tăng 15% so với tuần trước', severity: 'medium' as const },
      { id: '2', channel: 'google', type: 'success' as const, message: 'ROAS tăng 20% so với tuần trước', severity: 'low' as const },
      { id: '3', channel: 'tiktok', type: 'error' as const, message: 'CTR giảm 25% so với tuần trước', severity: 'high' as const }
    ]
  },

  // Platform connection status
  connectedChannels: CONNECTED_CHANNELS,
  disconnectedChannels: DISCONNECTED_CHANNELS,

  // Settings for different environments
  settings: {
    development: {
      useMockData: true,
      showEmptyStates: true,
      enableDebugMode: true
    },
    production: {
      useMockData: false,
      showEmptyStates: true,
      enableDebugMode: false
    },
    test: {
      useMockData: true,
      showEmptyStates: true,
      enableDebugMode: true
    }
  }
};

// Helper function to get mock data based on environment
export const getMockData = (environment: 'development' | 'production' | 'test' = 'development') => {
  const settings = mockData.settings[environment] || mockData.settings.development;
  
  return {
    ...mockData,
    settings,
    // Filter data based on connected channels
    getFilteredData: (dataType: keyof typeof mockData) => {
      const data = mockData[dataType];
      if (Array.isArray(data)) {
        return filterDataByConnectedChannels(data as any[], CONNECTED_CHANNELS);
      }
      return data;
    },
    // Check if has real data
    hasRealData: (dataType: keyof typeof mockData) => {
      const data = mockData[dataType];
      if (Array.isArray(data)) {
        return (data as any[]).some(item => 
          CONNECTED_CHANNELS.includes(item.id) && 
          ['revenue', 'cost', 'roas', 'cpa', 'ctr', 'conversion_rate', 'leads', 'orders'].some(field => {
            const value = item[field];
            return typeof value === 'number' && value > 0;
          })
        );
      }
      return false;
    }
  };
};

// Export default for backward compatibility
export default mockData;

export function channelsArrayToPlatformData(channels: any[]): any {
  const map: any = {};
  channels.forEach((c) => {
    if (c.id === 'facebook') map.meta = c;
    else if (c.id === 'google') map.google = c;
    else if (c.id === 'tiktok') map.tiktok = c;
    else map[c.id] = c;
  });
  return map;
}

 