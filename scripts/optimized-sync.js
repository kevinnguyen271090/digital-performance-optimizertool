const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cấu hình tối ưu cho MVP
const MVP_CONFIG = {
  // Chỉ lưu 7 ngày gần nhất
  retentionDays: 7,
  
  // Cập nhật dashboard summary hàng ngày
  updateFrequency: 'daily',
  
  // Cache cho custom date range
  cacheDuration: {
    '1_day': '1_hour',
    '7_days': '6_hours', 
    '30_days': '24_hours',
    'custom': '1_hour'
  },
  
  // Tần suất đồng bộ theo nền tảng
  syncFrequency: {
    'google': 'daily',     // Google Analytics, Ads
    'meta': 'daily',       // Facebook, Instagram
    'tiktok': 'daily',     // TikTok Ads
    'woocommerce': 'daily' // WooCommerce
  }
};

// Hàm tạo dữ liệu mẫu cho 7 ngày gần nhất
async function generateWeeklyData() {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 800) + 300,
      pageviews: Math.floor(Math.random() * 2500) + 1000,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      conversions: Math.floor(Math.random() * 50) + 10,
      bounceRate: Math.random() * 0.5 + 0.2,
      avgSessionDuration: Math.floor(Math.random() * 300) + 60
    });
  }
  
  return data;
}

// Hàm đồng bộ dữ liệu 7 ngày cho Google Analytics
async function syncGoogleAnalyticsWeekly(organizationId) {
  console.log('🔄 Đồng bộ Google Analytics (7 ngày)...');
  
  try {
    const weeklyData = await generateWeeklyData();
    
    // Insert dữ liệu cho từng ngày
    for (const dayData of weeklyData) {
      const { error } = await supabase
        .from('analytics_data_7days')
        .upsert([{
          organization_id: organizationId,
          platform: 'google',
          service: 'ga4',
          date: dayData.date,
          metrics: {
            sessions: dayData.sessions,
            users: dayData.users,
            pageviews: dayData.pageviews,
            revenue: dayData.revenue,
            conversions: dayData.conversions,
            bounceRate: dayData.bounceRate,
            avgSessionDuration: dayData.avgSessionDuration
          },
          dimensions: {
            accountId: 'GA4_ACCOUNT_ID',
            propertyId: 'GA4_PROPERTY_ID'
          }
        }], {
          onConflict: 'organization_id,platform,service,date'
        });

      if (error) {
        console.error(`❌ Lỗi insert ngày ${dayData.date}:`, error);
      }
    }
    
    console.log('✅ Đã đồng bộ Google Analytics 7 ngày');
    return true;
  } catch (error) {
    console.error('❌ Lỗi đồng bộ Google Analytics:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu 7 ngày cho Google Ads
async function syncGoogleAdsWeekly(organizationId) {
  console.log('🔄 Đồng bộ Google Ads (7 ngày)...');
  
  try {
    const weeklyData = await generateWeeklyData();
    
    for (const dayData of weeklyData) {
      const { error } = await supabase
        .from('analytics_data_7days')
        .upsert([{
          organization_id: organizationId,
          platform: 'google',
          service: 'ads',
          date: dayData.date,
          metrics: {
            impressions: Math.floor(Math.random() * 100000) + 20000,
            clicks: Math.floor(Math.random() * 5000) + 1000,
            spend: Math.floor(Math.random() * 8000) + 2000,
            conversions: dayData.conversions,
            ctr: Math.random() * 0.15 + 0.02,
            cpc: Math.random() * 3 + 0.5,
            conversionRate: Math.random() * 0.08 + 0.02
          },
          dimensions: {
            accountId: 'GOOGLE_ADS_ACCOUNT_ID',
            campaignId: 'GOOGLE_ADS_CAMPAIGN_ID'
          }
        }], {
          onConflict: 'organization_id,platform,service,date'
        });

      if (error) {
        console.error(`❌ Lỗi insert ngày ${dayData.date}:`, error);
      }
    }
    
    console.log('✅ Đã đồng bộ Google Ads 7 ngày');
    return true;
  } catch (error) {
    console.error('❌ Lỗi đồng bộ Google Ads:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu 7 ngày cho Meta Ads
async function syncMetaAdsWeekly(organizationId) {
  console.log('🔄 Đồng bộ Meta Ads (7 ngày)...');
  
  try {
    const weeklyData = await generateWeeklyData();
    
    for (const dayData of weeklyData) {
      const { error } = await supabase
        .from('analytics_data_7days')
        .upsert([{
          organization_id: organizationId,
          platform: 'meta',
          service: 'ads',
          date: dayData.date,
          metrics: {
            impressions: Math.floor(Math.random() * 50000) + 10000,
            clicks: Math.floor(Math.random() * 2000) + 500,
            spend: Math.floor(Math.random() * 5000) + 1000,
            conversions: dayData.conversions,
            ctr: Math.random() * 0.1 + 0.01,
            cpc: Math.random() * 5 + 1,
            conversionRate: Math.random() * 0.05 + 0.01
          },
          dimensions: {
            accountId: 'META_ACCOUNT_ID',
            campaignId: 'META_CAMPAIGN_ID'
          }
        }], {
          onConflict: 'organization_id,platform,service,date'
        });

      if (error) {
        console.error(`❌ Lỗi insert ngày ${dayData.date}:`, error);
      }
    }
    
    console.log('✅ Đã đồng bộ Meta Ads 7 ngày');
    return true;
  } catch (error) {
    console.error('❌ Lỗi đồng bộ Meta Ads:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu 7 ngày cho WooCommerce
async function syncWooCommerceWeekly(organizationId) {
  console.log('🔄 Đồng bộ WooCommerce (7 ngày)...');
  
  try {
    const weeklyData = await generateWeeklyData();
    
    for (const dayData of weeklyData) {
      const { error } = await supabase
        .from('analytics_data_7days')
        .upsert([{
          organization_id: organizationId,
          platform: 'woocommerce',
          service: 'store',
          date: dayData.date,
          metrics: {
            orders: Math.floor(Math.random() * 200) + 50,
            revenue: dayData.revenue,
            customers: Math.floor(Math.random() * 100) + 20,
            avgOrderValue: Math.random() * 500 + 100,
            conversions: dayData.conversions
          },
          dimensions: {
            storeId: 'WOOCOMMERCE_STORE_ID'
          }
        }], {
          onConflict: 'organization_id,platform,service,date'
        });

      if (error) {
        console.error(`❌ Lỗi insert ngày ${dayData.date}:`, error);
      }
    }
    
    console.log('✅ Đã đồng bộ WooCommerce 7 ngày');
    return true;
  } catch (error) {
    console.error('❌ Lỗi đồng bộ WooCommerce:', error);
    return false;
  }
}

// Hàm cập nhật dashboard summary
async function updateDashboardSummary(organizationId) {
  console.log('📊 Cập nhật dashboard summary...');
  
  try {
    // Gọi function SQL để cập nhật
    const { error } = await supabase
      .rpc('update_dashboard_summary');

    if (error) {
      console.error('❌ Lỗi cập nhật dashboard summary:', error);
      return false;
    }
    
    console.log('✅ Đã cập nhật dashboard summary');
    return true;
  } catch (error) {
    console.error('❌ Lỗi cập nhật dashboard summary:', error);
    return false;
  }
}

// Hàm kiểm tra cache cho custom date range
async function checkCustomCache(organizationId, platform, service, startDate, endDate) {
  try {
    const { data, error } = await supabase
      .rpc('get_cached_data', {
        org_id: organizationId,
        platform_param: platform,
        service_param: service,
        start_date_param: startDate,
        end_date_param: endDate
      });

    if (error) {
      console.error('❌ Lỗi kiểm tra cache:', error);
      return null;
    }

    if (data && data.length > 0 && data[0].found) {
      console.log('✅ Tìm thấy dữ liệu trong cache');
      return data[0].data;
    }

    return null;
  } catch (error) {
    console.error('❌ Lỗi kiểm tra cache:', error);
    return null;
  }
}

// Hàm lưu cache cho custom date range
async function saveCustomCache(organizationId, platform, service, startDate, endDate, metrics, cacheDuration = '1_hour') {
  try {
    const { error } = await supabase
      .rpc('save_custom_cache', {
        org_id: organizationId,
        platform_param: platform,
        service_param: service,
        start_date_param: startDate,
        end_date_param: endDate,
        metrics_data: metrics,
        cache_duration_param: cacheDuration
      });

    if (error) {
      console.error('❌ Lỗi lưu cache:', error);
      return false;
    }

    console.log('✅ Đã lưu dữ liệu vào cache');
    return true;
  } catch (error) {
    console.error('❌ Lỗi lưu cache:', error);
    return false;
  }
}

// Hàm chính
async function main() {
  console.log('🚀 Bắt đầu đồng bộ dữ liệu tối ưu cho MVP...\n');
  
  // Lấy organization_id
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .limit(1);

  if (orgError) {
    console.error('❌ Lỗi lấy organization:', orgError);
    return;
  }

  let organizationId;

  if (!orgs || orgs.length === 0) {
    console.log('⚠️  Chưa có organization nào. Tạo organization mới...');
    
    const { data: newOrg, error: createError } = await supabase
      .from('organizations')
      .insert([{
        name: 'My Organization',
        domain: 'example.com',
        plan: 'free'
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Lỗi tạo organization:', createError);
      return;
    }
    
    console.log('✅ Đã tạo organization:', newOrg.id);
    organizationId = newOrg.id;
  } else {
    organizationId = orgs[0].id;
    console.log('✅ Sử dụng organization hiện có:', organizationId);
  }

  // Đồng bộ dữ liệu 7 ngày cho từng nền tảng
  const results = {
    googleAnalytics: await syncGoogleAnalyticsWeekly(organizationId),
    googleAds: await syncGoogleAdsWeekly(organizationId),
    metaAds: await syncMetaAdsWeekly(organizationId),
    wooCommerce: await syncWooCommerceWeekly(organizationId)
  };

  // Cập nhật dashboard summary
  await updateDashboardSummary(organizationId);

  // Log kết quả
  console.log('\n📊 Kết quả đồng bộ:');
  console.log(`✅ Google Analytics: ${results.googleAnalytics ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Google Ads: ${results.googleAds ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Meta Ads: ${results.metaAds ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ WooCommerce: ${results.wooCommerce ? 'Thành công' : 'Thất bại'}`);

  // Kiểm tra dung lượng
  const { count: analyticsCount } = await supabase
    .from('analytics_data_7days')
    .select('*', { count: 'exact', head: true });

  const { count: summaryCount } = await supabase
    .from('dashboard_summary')
    .select('*', { count: 'exact', head: true });

  console.log('\n💾 Thống kê dung lượng:');
  console.log(`📊 Raw data (7 ngày): ${analyticsCount} bản ghi`);
  console.log(`📊 Dashboard summary: ${summaryCount} bản ghi`);
  console.log(`💾 Dung lượng ước tính: ${((analyticsCount + summaryCount) / 1024).toFixed(2)} MB`);

  console.log('\n🎉 Hoàn thành đồng bộ dữ liệu tối ưu!');
  console.log('💡 Chi phí rất thấp, trải nghiệm người dùng tốt!');
}

// Chạy script
main().catch(console.error); 