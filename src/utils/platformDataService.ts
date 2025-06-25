import { supabase } from './supabaseClient';

export interface PlatformData {
  platform: string;
  data: any;
  lastUpdated: Date;
}

export interface DashboardMetrics {
  sessions?: number;
  ctr?: number;
  cpa?: number;
  roas?: number;
  revenue?: number;
  orders?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

// Lấy thông tin kết nối của người dùng
export const getUserConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'connected');

  if (error) {
    console.error('Error fetching user connections:', error);
    return [];
  }

  return data || [];
};

// Lấy dữ liệu từ Meta (Facebook/Instagram)
export const fetchMetaData = async (accessToken: string) => {
  if (typeof accessToken !== 'string' || !accessToken) {
    console.error('Error fetching Meta data: Invalid access token provided.');
    return null;
  }
  try {
    // Lấy thông tin tài khoản
    const accountResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${accessToken}`
    );
    const accountData = await accountResponse.json();

    if (!accountData.data || accountData.data.length === 0) {
      return null;
    }

    const adAccountId = accountData.data[0].id;

    // Lấy insights từ ad account
    const insightsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${adAccountId}/insights?fields=impressions,clicks,spend,actions&date_preset=last_30d&access_token=${accessToken}`
    );
    const insightsData = await insightsResponse.json();

    if (!insightsData.data || insightsData.data.length === 0) {
      return null;
    }

    const insights = insightsData.data[0];
    const conversions = insights.actions?.find((action: any) => action.action_type === 'purchase')?.value || 0;

    return {
      impressions: parseInt(insights.impressions) || 0,
      clicks: parseInt(insights.clicks) || 0,
      spend: parseFloat(insights.spend) || 0,
      conversions: parseInt(conversions) || 0,
      ctr: insights.clicks && insights.impressions ? (parseInt(insights.clicks) / parseInt(insights.impressions) * 100).toFixed(2) : 0,
      cpa: conversions > 0 ? (parseFloat(insights.spend) / parseInt(conversions)).toFixed(0) : 0,
    };
  } catch (error) {
    console.error('Error fetching Meta data:', error);
    return null;
  }
};

// Lấy dữ liệu từ Google Analytics
export const fetchGoogleData = async (accessToken: string, propertyId: string) => {
  if (typeof accessToken !== 'string' || !accessToken) {
    console.error('Error fetching Google data: Invalid access token provided.');
    return null;
  }
  try {
    // Nếu không có propertyId, không thể fetch
    if (!propertyId) {
        console.warn("Google Analytics fetch skipped: No Property ID provided.");
        return null;
    }

    // Sử dụng Google Analytics Data API v1
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'userEngagementDuration' },
            { name: 'transactions' },
            { name: 'totalRevenue' }
          ],
          dimensions: [{ name: 'date' }]
        })
      }
    );

    const data = await response.json();
    
    if (!data.rows || data.rows.length === 0) {
      return null;
    }

    // Tính tổng các metrics
    const totals = data.rows.reduce((acc: any, row: any) => {
      acc.sessions += parseInt(row.metricValues[0].value) || 0;
      acc.pageViews += parseInt(row.metricValues[1].value) || 0;
      acc.engagementTime += parseInt(row.metricValues[2].value) || 0;
      acc.transactions += parseInt(row.metricValues[3].value) || 0;
      acc.revenue += parseFloat(row.metricValues[4].value) || 0;
      return acc;
    }, { sessions: 0, pageViews: 0, engagementTime: 0, transactions: 0, revenue: 0 });

    return {
      sessions: totals.sessions,
      pageViews: totals.pageViews,
      engagementTime: totals.engagementTime,
      transactions: totals.transactions,
      revenue: totals.revenue,
      avgSessionDuration: totals.sessions > 0 ? (totals.engagementTime / totals.sessions / 1000 / 60).toFixed(1) : 0, // phút
    };
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return null;
  }
};

// Lấy dữ liệu từ TikTok
export const fetchTikTokData = async (authCode: string) => {
  try {
    // Đầu tiên cần exchange auth code để lấy access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.REACT_APP_TIKTOK_CLIENT_KEY || '',
        client_secret: process.env.REACT_APP_TIKTOK_CLIENT_SECRET || '',
        code: authCode,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/settings`
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return null;
    }

    // Lấy thông tin video và analytics
    const videoResponse = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=["id","title","cover_image_url","video_description","duration","height","width","share_url","comment_count","digg_count","play_count","share_count","download_count"]`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        }
      }
    );

    const videoData = await videoResponse.json();
    
    if (!videoData.data || videoData.data.length === 0) {
      return null;
    }

    // Tính tổng các metrics
    const totals = videoData.data.reduce((acc: any, video: any) => {
      acc.totalViews += parseInt(video.play_count) || 0;
      acc.totalLikes += parseInt(video.digg_count) || 0;
      acc.totalComments += parseInt(video.comment_count) || 0;
      acc.totalShares += parseInt(video.share_count) || 0;
      return acc;
    }, { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 });

    return {
      totalVideos: videoData.data.length,
      totalViews: totals.totalViews,
      totalLikes: totals.totalLikes,
      totalComments: totals.totalComments,
      totalShares: totals.totalShares,
      avgEngagementRate: totals.totalViews > 0 ? ((totals.totalLikes + totals.totalComments + totals.totalShares) / totals.totalViews * 100).toFixed(2) : 0,
    };
  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    return null;
  }
};

// Lấy dữ liệu từ WooCommerce
export const fetchWooCommerceData = async (credentials: { storeUrl: string; consumerKey: string; consumerSecret: string }) => {
  const { storeUrl, consumerKey, consumerSecret } = credentials;

  // Basic validation
  if (!storeUrl || !consumerKey || !consumerSecret) {
    console.error("WooCommerce credentials missing");
    return null;
  }

  const fetchData = async (endpoint: string) => {
    const url = `${storeUrl.replace(/\/$/, "")}/wp-json/wc/v3/${endpoint}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`WooCommerce API error for ${endpoint}: ${response.status} ${response.statusText}`);
        // Log the body to see the HTML error page
        const errorBody = await response.text();
        console.error("WooCommerce error body:", errorBody);
        return null;
      }
      // Check if the content is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        console.error(`WooCommerce response for ${endpoint} is not JSON.`);
        const textResponse = await response.text();
        console.error("WooCommerce non-JSON response:", textResponse);
        return null;
      }
    } catch (networkError) {
      console.error(`Network error fetching WooCommerce endpoint ${endpoint}:`, networkError);
      return null;
    }
  };

  try {
    const ordersData = await fetchData('orders?status=completed');
    const productsData = await fetchData('products');

    if (!Array.isArray(ordersData)) {
      console.error('Fetched orders data is not an array:', ordersData);
      return null;
    }
     if (!Array.isArray(productsData)) {
      console.error('Fetched products data is not an array:', productsData);
    }


    // Tính toán metrics
    const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
    const totalOrders = ordersData.length;
    const totalProducts = Array.isArray(productsData) ? productsData.length : 0;

    // Tính metrics cho 30 ngày gần nhất
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrders = ordersData.filter((order: any) => 
      new Date(order.date_created) >= thirtyDaysAgo
    );

    const recentRevenue = recentOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
    const recentOrdersCount = recentOrders.length;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      recentRevenue,
      recentOrdersCount,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0,
    };
  } catch (error) {
    console.error('Error processing WooCommerce data:', error);
    return null;
  }
};

// Tổng hợp dữ liệu từ tất cả các nền tảng
export const fetchAllPlatformData = async (userId: string): Promise<any> => {
  console.log(`Fetching all platform data for user ${userId}`);
  const connections = await getUserConnections(userId);
  console.log(`Found ${connections.length} connections for user ${userId}`);

  const platformDataPromises = connections.map(async (connection) => {
    let data = null;
    console.log(`Fetching data for platform: ${connection.platform}`);

    try {
      const tokenObject = connection.credentials && typeof connection.credentials === 'object'
        ? (connection.credentials as any)
        : null;
      switch (connection.platform) {
        case 'google':
          // Duyệt qua từng account đã chọn trong metadata
          if (tokenObject && connection.metadata?.selected_accounts?.length) {
            data = [];
            for (const acc of connection.metadata.selected_accounts) {
              if (acc.type === 'google-ads' && tokenObject.access_token && acc.accountId) {
                // fetchGoogleAdsData là hàm giả lập, thay bằng hàm thực tế của bạn
                const adsData = await fetchGoogleData(tokenObject.access_token, acc.accountId);
                data.push({ type: 'google-ads', accountId: acc.accountId, data: adsData });
              }
              if (acc.type === 'ga4' && tokenObject.access_token && acc.propertyId) {
                // fetchGoogleAnalyticsData là hàm giả lập, thay bằng hàm thực tế của bạn
                const ga4Data = await fetchGoogleData(tokenObject.access_token, acc.propertyId);
                data.push({ type: 'ga4', propertyId: acc.propertyId, data: ga4Data });
              }
            }
          } else {
            console.warn('Google connection is missing access_token or selected_accounts', {
                hasToken: !!tokenObject?.access_token,
                hasSelectedAccounts: !!connection.metadata?.selected_accounts?.length
            });
          }
          break;

        case 'meta':
          if (tokenObject && tokenObject.access_token) {
             data = await fetchMetaData(tokenObject.access_token);
          } else {
            console.warn('Meta connection is missing access_token string.', connection.access_token);
          }
          break;

        case 'tiktok':
          // Assuming auth_code is stored in access_token field for TikTok
          if (tokenObject && tokenObject.auth_code) {
            data = await fetchTikTokData(tokenObject.auth_code);
          } else {
             console.warn('TikTok connection is missing auth_code.');
          }
          break;

        case 'woocommerce':
          if (connection.metadata?.credentials) {
            data = await fetchWooCommerceData(connection.metadata.credentials);
          } else {
            console.warn('WooCommerce connection is missing credentials.');
          }
          break;
          
        default:
          console.warn(`Unknown platform: ${connection.platform}`);
      }
    } catch (e) {
      console.error(`Failed to fetch data for ${connection.platform}:`, e);
    }
    
    if (data === null) {
        console.log(`No data returned for ${connection.platform}`);
    }

    return {
      platform: connection.platform,
      data: data,
    };
  });

  const allData = await Promise.all(platformDataPromises) as { platform: string, data: any }[];
  const platformDataMap = allData.reduce((acc, current) => {
    if (current.data) {
      acc[current.platform] = current.data;
    }
    return acc;
  }, {} as { [key: string]: any });

  console.log("Returning platform data:", platformDataMap);
  return platformDataMap;
}; 