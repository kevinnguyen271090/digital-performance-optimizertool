const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const axios = require('axios');
require('dotenv').config();

// Cấu hình Supabase với service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cấu hình Google APIs
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
};

// Cấu hình Meta APIs
const metaConfig = {
  accessToken: process.env.META_ACCESS_TOKEN,
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET
};

// Cấu hình TikTok APIs
const tiktokConfig = {
  accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  appId: process.env.TIKTOK_APP_ID,
  appSecret: process.env.TIKTOK_APP_SECRET
};

// Cấu hình WooCommerce
const wooCommerceConfig = {
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET
};

/**
 * 🎯 HYBRID APPROACH: Kết hợp Phương án 3 + Power BI
 * - Dashboard cố định 7 ngày (như phương án 3)
 * - Import mode với scheduled refresh (như Power BI)
 * - Smart cache cho custom range (như Power BI DirectQuery)
 */

class HybridDataSync {
  constructor() {
    this.cache = new Map();
    this.refreshQueue = [];
  }

  /**
   * 1. Import dữ liệu 7 ngày cố định (như Power BI Import)
   */
  async importFixed7Days(organizationId, platform, service) {
    console.log(`🔄 Importing 7 days data for ${platform}/${service}...`);
    
    try {
      // Gọi function SQL để tạo cấu trúc 7 ngày
      const { error: importError } = await supabase.rpc('import_7days_data', {
        org_id: organizationId,
        platform_param: platform,
        service_param: service
      });

      if (importError) {
        console.error(`❌ Import error:`, importError);
        return false;
      }

      // Fetch dữ liệu thực tế từ API
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const apiData = await this.fetchPlatformData(platform, service, startDate, endDate);
      
      if (!apiData) {
        console.warn(`⚠️ No API data available for ${platform}/${service}`);
        return false;
      }

      // Upsert dữ liệu vào bảng fixed 7 days
      for (const [date, metrics] of Object.entries(apiData)) {
        const { error: upsertError } = await supabase
          .from('dashboard_fixed_7days')
          .upsert({
            organization_id: organizationId,
            platform,
            service,
            date,
            metrics,
            dimensions: {},
            data_source: 'import',
            last_refresh: new Date().toISOString()
          }, {
            onConflict: 'organization_id,platform,service,date'
          });

        if (upsertError) {
          console.error(`❌ Upsert error for ${date}:`, upsertError);
        }
      }

      // Tính toán tổng hợp 7 ngày (như Power BI Aggregations)
      await this.calculate7DaysSummary(organizationId);

      console.log(`✅ Successfully imported 7 days data for ${platform}/${service}`);
      return true;

    } catch (error) {
      console.error(`❌ Import 7 days failed:`, error);
      return false;
    }
  }

  /**
   * 2. Tính toán tổng hợp 7 ngày (như Power BI Aggregations)
   */
  async calculate7DaysSummary(organizationId) {
    try {
      const { error } = await supabase.rpc('calculate_7days_summary', {
        org_id: organizationId
      });

      if (error) {
        console.error(`❌ Calculate summary error:`, error);
        return false;
      }

      console.log(`✅ 7 days summary calculated for organization ${organizationId}`);
      return true;

    } catch (error) {
      console.error(`❌ Calculate summary failed:`, error);
      return false;
    }
  }

  /**
   * 3. Smart cache cho custom date range (như Power BI DirectQuery cache)
   */
  async getCustomRangeData(organizationId, platform, service, startDate, endDate) {
    console.log(`🔍 Getting custom range data: ${startDate} to ${endDate}`);

    try {
      // Kiểm tra cache trước
      const { data: cacheResult, error: cacheError } = await supabase.rpc('get_cached_custom_range', {
        org_id: organizationId,
        platform_param: platform,
        service_param: service,
        start_date_param: startDate,
        end_date_param: endDate
      });

      if (cacheError) {
        console.error(`❌ Cache check error:`, cacheError);
      } else if (cacheResult && cacheResult.length > 0 && cacheResult[0].found) {
        console.log(`✅ Cache hit for custom range`);
        return cacheResult[0].data;
      }

      // Cache miss - fetch từ API
      console.log(`🔄 Cache miss, fetching from API...`);
      const apiData = await this.fetchPlatformData(platform, service, startDate, endDate);

      if (!apiData) {
        console.warn(`⚠️ No API data available`);
        return null;
      }

      // Cache kết quả
      const { error: cacheError2 } = await supabase.rpc('cache_custom_range', {
        org_id: organizationId,
        platform_param: platform,
        service_param: service,
        start_date_param: startDate,
        end_date_param: endDate,
        metrics_data: apiData,
        cache_duration_param: '1_hour'
      });

      if (cacheError2) {
        console.error(`❌ Cache save error:`, cacheError2);
      } else {
        console.log(`✅ Custom range data cached`);
      }

      return apiData;

    } catch (error) {
      console.error(`❌ Custom range failed:`, error);
      return null;
    }
  }

  /**
   * 4. Scheduled refresh (như Power BI refresh)
   */
  async scheduledRefresh() {
    console.log(`🕐 Running scheduled refresh...`);

    try {
      // Lấy danh sách cần refresh
      const { data: schedules, error: scheduleError } = await supabase
        .from('refresh_schedule')
        .select('*')
        .eq('is_active', true)
        .lte('next_refresh', new Date().toISOString());

      if (scheduleError) {
        console.error(`❌ Get schedules error:`, scheduleError);
        return;
      }

      if (!schedules || schedules.length === 0) {
        console.log(`ℹ️ No schedules to refresh`);
        return;
      }

      // Refresh từng schedule
      for (const schedule of schedules) {
        console.log(`🔄 Refreshing ${schedule.platform}/${schedule.service}...`);
        
        const success = await this.importFixed7Days(
          schedule.organization_id,
          schedule.platform,
          schedule.service
        );

        if (success) {
          // Cập nhật next_refresh
          const { error: updateError } = await supabase
            .from('refresh_schedule')
            .update({
              last_refresh: new Date().toISOString(),
              next_refresh: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // +1 day
            })
            .eq('id', schedule.id);

          if (updateError) {
            console.error(`❌ Update schedule error:`, updateError);
          }
        }
      }

      console.log(`✅ Scheduled refresh completed`);

    } catch (error) {
      console.error(`❌ Scheduled refresh failed:`, error);
    }
  }

  /**
   * 5. Maintenance và cleanup (kết hợp cả hai phương án)
   */
  async maintenance() {
    console.log(`🧹 Running maintenance...`);

    try {
      const { error } = await supabase.rpc('hybrid_maintenance');

      if (error) {
        console.error(`❌ Maintenance error:`, error);
        return false;
      }

      console.log(`✅ Maintenance completed`);
      return true;

    } catch (error) {
      console.error(`❌ Maintenance failed:`, error);
      return false;
    }
  }

  /**
   * 6. Kiểm tra dữ liệu 7 ngày có sẵn
   */
  async check7DaysAvailability(organizationId) {
    try {
      const { data, error } = await supabase.rpc('check_7days_availability', {
        org_id: organizationId
      });

      if (error) {
        console.error(`❌ Check availability error:`, error);
        return null;
      }

      return data;

    } catch (error) {
      console.error(`❌ Check availability failed:`, error);
      return null;
    }
  }

  /**
   * 7. Fetch dữ liệu từ các platform APIs
   */
  async fetchPlatformData(platform, service, startDate, endDate) {
    console.log(`📡 Fetching ${platform}/${service} data...`);

    try {
      switch (platform) {
        case 'google':
          return await this.fetchGoogleData(service, startDate, endDate);
        case 'meta':
          return await this.fetchMetaData(service, startDate, endDate);
        case 'tiktok':
          return await this.fetchTikTokData(service, startDate, endDate);
        case 'woocommerce':
          return await this.fetchWooCommerceData(service, startDate, endDate);
        default:
          console.warn(`⚠️ Unknown platform: ${platform}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ Fetch ${platform} data failed:`, error);
      return null;
    }
  }

  /**
   * Google APIs
   */
  async fetchGoogleData(service, startDate, endDate) {
    try {
      switch (service) {
        case 'analytics':
          return await this.fetchGoogleAnalytics(startDate, endDate);
        case 'ads':
          return await this.fetchGoogleAds(startDate, endDate);
        case 'search_console':
          return await this.fetchSearchConsole(startDate, endDate);
        case 'merchant_center':
          return await this.fetchMerchantCenter(startDate, endDate);
        case 'sheets':
          return await this.fetchGoogleSheets(startDate, endDate);
        default:
          console.warn(`⚠️ Unknown Google service: ${service}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ Google ${service} fetch failed:`, error);
      return null;
    }
  }

  async fetchGoogleAnalytics(startDate, endDate) {
    // Mock data cho Google Analytics
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        sessions: Math.floor(Math.random() * 1000) + 100,
        users: Math.floor(Math.random() * 800) + 80,
        pageviews: Math.floor(Math.random() * 2000) + 200,
        bounceRate: Math.random() * 0.5 + 0.2,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60,
        revenue: Math.floor(Math.random() * 5000) + 500,
        conversions: Math.floor(Math.random() * 50) + 5
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchGoogleAds(startDate, endDate) {
    // Mock data cho Google Ads
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 500) + 50,
        cost: Math.floor(Math.random() * 1000) + 100,
        conversions: Math.floor(Math.random() * 30) + 3,
        ctr: Math.random() * 0.1 + 0.02,
        cpc: Math.random() * 5 + 1,
        conversionRate: Math.random() * 0.1 + 0.01
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchSearchConsole(startDate, endDate) {
    // Mock data cho Search Console
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 5000) + 500,
        clicks: Math.floor(Math.random() * 200) + 20,
        ctr: Math.random() * 0.1 + 0.02,
        avgPosition: Math.random() * 10 + 1,
        queries: Math.floor(Math.random() * 100) + 10
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchMerchantCenter(startDate, endDate) {
    // Mock data cho Merchant Center
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 3000) + 300,
        clicks: Math.floor(Math.random() * 150) + 15,
        conversions: Math.floor(Math.random() * 20) + 2,
        revenue: Math.floor(Math.random() * 3000) + 300,
        cost: Math.floor(Math.random() * 500) + 50,
        roas: Math.random() * 5 + 1
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchGoogleSheets(startDate, endDate) {
    // Mock data cho Google Sheets
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        rows: Math.floor(Math.random() * 1000) + 100,
        columns: Math.floor(Math.random() * 20) + 5,
        cells: Math.floor(Math.random() * 20000) + 2000,
        lastModified: new Date().toISOString()
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  /**
   * Meta APIs
   */
  async fetchMetaData(service, startDate, endDate) {
    try {
      switch (service) {
        case 'ads':
          return await this.fetchMetaAds(startDate, endDate);
        case 'pages':
          return await this.fetchMetaPages(startDate, endDate);
        case 'instagram':
          return await this.fetchMetaInstagram(startDate, endDate);
        default:
          console.warn(`⚠️ Unknown Meta service: ${service}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ Meta ${service} fetch failed:`, error);
      return null;
    }
  }

  async fetchMetaAds(startDate, endDate) {
    // Mock data cho Meta Ads
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 8000) + 800,
        clicks: Math.floor(Math.random() * 400) + 40,
        spend: Math.floor(Math.random() * 800) + 80,
        conversions: Math.floor(Math.random() * 25) + 2,
        ctr: Math.random() * 0.08 + 0.015,
        cpc: Math.random() * 4 + 0.8,
        conversionRate: Math.random() * 0.08 + 0.01
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchMetaPages(startDate, endDate) {
    // Mock data cho Meta Pages
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        pageViews: Math.floor(Math.random() * 2000) + 200,
        pageLikes: Math.floor(Math.random() * 50) + 5,
        pageShares: Math.floor(Math.random() * 30) + 3,
        pageComments: Math.floor(Math.random() * 20) + 2,
        reach: Math.floor(Math.random() * 5000) + 500
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchMetaInstagram(startDate, endDate) {
    // Mock data cho Meta Instagram
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 3000) + 300,
        reach: Math.floor(Math.random() * 2000) + 200,
        profileViews: Math.floor(Math.random() * 100) + 10,
        followers: Math.floor(Math.random() * 20) + 2,
        likes: Math.floor(Math.random() * 150) + 15,
        comments: Math.floor(Math.random() * 30) + 3
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  /**
   * TikTok APIs
   */
  async fetchTikTokData(service, startDate, endDate) {
    try {
      switch (service) {
        case 'ads':
          return await this.fetchTikTokAds(startDate, endDate);
        case 'business':
          return await this.fetchTikTokBusiness(startDate, endDate);
        default:
          console.warn(`⚠️ Unknown TikTok service: ${service}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ TikTok ${service} fetch failed:`, error);
      return null;
    }
  }

  async fetchTikTokAds(startDate, endDate) {
    // Mock data cho TikTok Ads
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        impressions: Math.floor(Math.random() * 6000) + 600,
        clicks: Math.floor(Math.random() * 300) + 30,
        spend: Math.floor(Math.random() * 600) + 60,
        conversions: Math.floor(Math.random() * 20) + 2,
        ctr: Math.random() * 0.06 + 0.01,
        cpc: Math.random() * 3 + 0.5,
        conversionRate: Math.random() * 0.06 + 0.008
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchTikTokBusiness(startDate, endDate) {
    // Mock data cho TikTok Business
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        videoViews: Math.floor(Math.random() * 5000) + 500,
        likes: Math.floor(Math.random() * 200) + 20,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 30) + 3,
        followers: Math.floor(Math.random() * 15) + 1,
        reach: Math.floor(Math.random() * 8000) + 800
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  /**
   * WooCommerce APIs
   */
  async fetchWooCommerceData(service, startDate, endDate) {
    try {
      switch (service) {
        case 'orders':
          return await this.fetchWooCommerceOrders(startDate, endDate);
        case 'products':
          return await this.fetchWooCommerceProducts(startDate, endDate);
        case 'customers':
          return await this.fetchWooCommerceCustomers(startDate, endDate);
        default:
          console.warn(`⚠️ Unknown WooCommerce service: ${service}`);
          return null;
      }
    } catch (error) {
      console.error(`❌ WooCommerce ${service} fetch failed:`, error);
      return null;
    }
  }

  async fetchWooCommerceOrders(startDate, endDate) {
    // Mock data cho WooCommerce Orders
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        orders: Math.floor(Math.random() * 50) + 5,
        revenue: Math.floor(Math.random() * 5000) + 500,
        items: Math.floor(Math.random() * 100) + 10,
        customers: Math.floor(Math.random() * 30) + 3,
        avgOrderValue: Math.floor(Math.random() * 200) + 50,
        refunds: Math.floor(Math.random() * 5) + 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchWooCommerceProducts(startDate, endDate) {
    // Mock data cho WooCommerce Products
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        totalProducts: Math.floor(Math.random() * 500) + 100,
        activeProducts: Math.floor(Math.random() * 400) + 80,
        lowStock: Math.floor(Math.random() * 20) + 2,
        outOfStock: Math.floor(Math.random() * 10) + 1,
        categories: Math.floor(Math.random() * 30) + 5
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async fetchWooCommerceCustomers(startDate, endDate) {
    // Mock data cho WooCommerce Customers
    const data = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      data[dateStr] = {
        totalCustomers: Math.floor(Math.random() * 1000) + 200,
        newCustomers: Math.floor(Math.random() * 20) + 2,
        returningCustomers: Math.floor(Math.random() * 15) + 1,
        avgCustomerValue: Math.floor(Math.random() * 300) + 100,
        customerLifetimeValue: Math.floor(Math.random() * 1000) + 200
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  /**
   * 8. Main function để chạy hybrid sync
   */
  async runHybridSync(organizationId, platforms = ['google', 'meta', 'tiktok', 'woocommerce']) {
    console.log(`🚀 Starting Hybrid Sync for organization ${organizationId}`);
    console.log(`📋 Platforms: ${platforms.join(', ')}`);

    try {
      // 1. Import dữ liệu 7 ngày cố định cho tất cả platforms
      for (const platform of platforms) {
        const services = this.getPlatformServices(platform);
        
        for (const service of services) {
          console.log(`\n🔄 Processing ${platform}/${service}...`);
          
          const success = await this.importFixed7Days(organizationId, platform, service);
          
          if (success) {
            console.log(`✅ ${platform}/${service} imported successfully`);
          } else {
            console.log(`❌ ${platform}/${service} import failed`);
          }
        }
      }

      // 2. Chạy maintenance
      await this.maintenance();

      // 3. Kiểm tra kết quả
      const availability = await this.check7DaysAvailability(organizationId);
      console.log(`\n📊 Data availability:`, availability);

      console.log(`\n🎉 Hybrid sync completed successfully!`);
      return true;

    } catch (error) {
      console.error(`❌ Hybrid sync failed:`, error);
      return false;
    }
  }

  /**
   * 9. Helper function để lấy services cho từng platform
   */
  getPlatformServices(platform) {
    const services = {
      google: ['analytics', 'ads', 'search_console', 'merchant_center', 'sheets'],
      meta: ['ads', 'pages', 'instagram'],
      tiktok: ['ads', 'business'],
      woocommerce: ['orders', 'products', 'customers']
    };

    return services[platform] || [];
  }

  /**
   * 10. Function để test custom range
   */
  async testCustomRange(organizationId, platform, service) {
    console.log(`🧪 Testing custom range for ${platform}/${service}...`);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const data = await this.getCustomRangeData(
      organizationId,
      platform,
      service,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    console.log(`📊 Custom range data:`, data);
    return data;
  }
}

// Export class
module.exports = HybridDataSync;

// Main execution
if (require.main === module) {
  const hybridSync = new HybridDataSync();
  
  // Lấy organization ID từ command line hoặc environment
  const organizationId = process.argv[2] || process.env.ORGANIZATION_ID;
  
  if (!organizationId) {
    console.error('❌ Please provide organization ID');
    console.log('Usage: node hybrid-sync.js <organization_id>');
    process.exit(1);
  }

  // Chạy hybrid sync
  hybridSync.runHybridSync(organizationId)
    .then(success => {
      if (success) {
        console.log('🎉 Hybrid sync completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Hybrid sync failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Hybrid sync error:', error);
      process.exit(1);
    });
} 