// Hàm chuyển đổi dữ liệu thật sang format compareChannels cho DashboardKPIs
export function buildCompareChannels(platformData: any) {
  const result = [];
  if (platformData.google) {
    result.push({
      name: 'Google Ads',
      kpis: [
        { title: 'Doanh thu', value: platformData.google.revenue || 0, change: 0, status: 'normal' as const },
        { title: 'CPA', value: platformData.google.cpa || 0, change: 0, status: 'normal' as const },
        { title: 'ROAS', value: platformData.google.roas || 0, change: 0, status: 'normal' as const },
        { title: 'Chi phí', value: platformData.google.spend || 0, change: 0, status: 'normal' as const },
      ],
    });
  }
  if (platformData.meta) {
    result.push({
      name: 'Meta Ads',
      kpis: [
        { title: 'Doanh thu', value: platformData.meta.revenue || 0, change: 0, status: 'normal' as const },
        { title: 'CPA', value: platformData.meta.cpa || 0, change: 0, status: 'normal' as const },
        { title: 'ROAS', value: platformData.meta.roas || 0, change: 0, status: 'normal' as const },
        { title: 'Chi phí', value: platformData.meta.spend || 0, change: 0, status: 'normal' as const },
      ],
    });
  }
  if (platformData.tiktok) {
    result.push({
      name: 'TikTok Ads',
      kpis: [
        { title: 'Doanh thu', value: platformData.tiktok.revenue || 0, change: 0, status: 'normal' as const },
        { title: 'CPA', value: platformData.tiktok.cpa || 0, change: 0, status: 'normal' as const },
        { title: 'ROAS', value: platformData.tiktok.roas || 0, change: 0, status: 'normal' as const },
        { title: 'Chi phí', value: platformData.tiktok.spend || 0, change: 0, status: 'normal' as const },
      ],
    });
  }
  return result;
}

// Hàm build KPI tổng quan từ platformData (không bao gồm JSX)
export function buildOverviewKPIData(platformData: any) {
  // Tổng hợp doanh thu, chuyển đổi, chi phí từ tất cả các kênh
  const totalRevenue = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.revenue || 0), 0);
  const totalConversions = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.conversions || 0), 0);
  const totalSpend = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.spend || 0), 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  return [
    {
      title: "Tổng doanh thu",
      value: totalRevenue,
      change: 0,
      status: "normal" as const,
      iconType: "dollar"
    },
    {
      title: "ROAS",
      value: roas,
      change: 0,
      status: "normal" as const,
      iconType: "chart"
    },
    {
      title: "CPA",
      value: cpa,
      change: 0,
      status: "normal" as const,
      iconType: "percent"
    },
    {
      title: "Chuyển đổi",
      value: totalConversions,
      change: 0,
      status: "normal" as const,
      iconType: "trend"
    }
  ];
}

// Hàm build executiveData từ platformData
export function buildExecutiveData(platformData: any) {
  const totalRevenue = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.revenue || 0), 0);
  const totalConversions = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.conversions || 0), 0);
  const totalSpend = (Object.values(platformData) as any[]).reduce((sum, k) => sum + (k.spend || 0), 0);
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  return {
    totalRevenue,
    revenueChange: 0,
    totalConversions,
    conversionChange: 0,
    totalSpend,
    spendChange: 0,
    roas,
    roasChange: 0,
    cpa,
    topPerformingChannel: '',
    topPerformingChannelValue: '',
    criticalAlerts: [],
    keyInsights: []
  };
}

// Hàm tổng hợp các KPI bổ sung: CPC, CPM, Engagement Rate, CTR, Drop-off rate
export function buildAdditionalKPIs(platformData: any) {
  const kpis = [];
  // CPC
  if (platformData.clicks && platformData.spend) {
    kpis.push({
      title: 'CPC',
      value: platformData.clicks > 0 ? platformData.spend / platformData.clicks : 0,
      unit: '₫',
      iconType: 'dollar',
    });
  }
  // CPM
  if (platformData.impressions && platformData.spend) {
    kpis.push({
      title: 'CPM',
      value: platformData.impressions > 0 ? (platformData.spend / platformData.impressions) * 1000 : 0,
      unit: '₫',
      iconType: 'dollar',
    });
  }
  // Engagement Rate
  if (platformData.engagements && platformData.impressions) {
    kpis.push({
      title: 'Engagement Rate',
      value: platformData.impressions > 0 ? (platformData.engagements / platformData.impressions) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  // CTR
  if (platformData.clicks && platformData.impressions) {
    kpis.push({
      title: 'CTR',
      value: platformData.impressions > 0 ? (platformData.clicks / platformData.impressions) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  // Drop-off rate giữa các bước funnel
  if (platformData.traffic && platformData.lead) {
    kpis.push({
      title: 'Drop-off Traffic → Lead',
      value: platformData.traffic > 0 ? (1 - platformData.lead / platformData.traffic) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  if (platformData.lead && platformData.qualifiedLead) {
    kpis.push({
      title: 'Drop-off Lead → Qualified Lead',
      value: platformData.lead > 0 ? (1 - platformData.qualifiedLead / platformData.lead) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  if (platformData.qualifiedLead && platformData.order) {
    kpis.push({
      title: 'Drop-off Qualified Lead → Order',
      value: platformData.qualifiedLead > 0 ? (1 - platformData.order / platformData.qualifiedLead) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  if (platformData.order && platformData.revenue) {
    kpis.push({
      title: 'Drop-off Order → Revenue',
      value: platformData.order > 0 ? (1 - platformData.revenue / platformData.order) * 100 : 0,
      unit: '%',
      iconType: 'percent',
    });
  }
  return kpis;
} 