import { useMemo } from 'react';

export function useExecutiveMockData(filterData: any, connectedChannels: string[]) {
  return useMemo(() => {
    const rawChannels = [
      { id: 'facebook', name: 'Facebook Ads', revenue: 50000000, cost: 20000000, roas: 2.5, cpa: 40000, ctr: 5.2, conversion_rate: 2.1, leads: 2500, orders: 150 },
      { id: 'google', name: 'Google Ads', revenue: 40000000, cost: 15000000, roas: 2.7, cpa: 37500, ctr: 4.8, conversion_rate: 2.5, leads: 2000, orders: 120 },
      { id: 'tiktok', name: 'TikTok Ads', revenue: 20000000, cost: 8000000, roas: 2.0, cpa: 45000, ctr: 6.0, conversion_rate: 1.8, leads: 1500, orders: 90 }
    ];

    const rawFunnelData = [
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
    ];

    const rawCampaigns = [
      { id: 'fb_c1', channel: 'facebook', name: 'Facebook - C1', revenue: 25000000, cost: 10000000, roas: 2.5, cpa: 40000 },
      { id: 'fb_c2', channel: 'facebook', name: 'Facebook - C2', revenue: 25000000, cost: 10000000, roas: 2.5, cpa: 40000 },
      { id: 'gg_c1', channel: 'google', name: 'Google - C1', revenue: 20000000, cost: 7500000, roas: 2.7, cpa: 37500 },
      { id: 'gg_c2', channel: 'google', name: 'Google - C2', revenue: 20000000, cost: 7500000, roas: 2.7, cpa: 37500 },
      { id: 'tt_c1', channel: 'tiktok', name: 'TikTok - C1', revenue: 10000000, cost: 4000000, roas: 2.0, cpa: 45000 },
      { id: 'tt_c2', channel: 'tiktok', name: 'TikTok - C2', revenue: 10000000, cost: 4000000, roas: 2.0, cpa: 45000 }
    ];

    const rawAlerts = [
      { id: '1', channel: 'facebook', type: 'warning' as const, message: 'CPA tăng 15% so với tuần trước', severity: 'medium' as const },
      { id: '2', channel: 'google', type: 'success' as const, message: 'ROAS tăng 20% so với tuần trước', severity: 'low' as const },
      { id: '3', channel: 'tiktok', type: 'error' as const, message: 'CTR giảm 25% so với tuần trước', severity: 'high' as const }
    ];

    return {
      channels: filterData(rawChannels),
      funnelData: filterData(rawFunnelData),
      campaigns: filterData(rawCampaigns),
      alerts: rawAlerts.filter(alert => connectedChannels.includes(alert.channel))
    };
  }, [filterData, connectedChannels]);
} 