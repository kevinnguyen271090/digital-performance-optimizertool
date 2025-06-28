const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Lấy thông tin từ .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Dùng service role key để bypass RLS (lấy trong Supabase Dashboard > Settings > API)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env');
  console.log('💡 Lấy Service Role Key tại: https://supabase.com/dashboard/project/avthknpemnrjpcuhbyjb/settings/api');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncGoogleAnalyticsData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Google Analytics...');
  
  try {
    // Dữ liệu mẫu - thay bằng dữ liệu thật từ Google Analytics API
    const analyticsData = {
      sessions: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 800) + 300,
      pageviews: Math.floor(Math.random() * 2500) + 1000,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      bounceRate: Math.random() * 0.5 + 0.2,
      avgSessionDuration: Math.floor(Math.random() * 300) + 60
    };

    // Lấy organization_id đầu tiên (hoặc thay bằng ID cụ thể)
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

      // Tạo organization member cho user hiện tại (nếu có)
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.user) {
          await supabase
            .from('organization_members')
            .insert([{
              organization_id: organizationId,
              user_id: user.user.id,
              role: 'owner'
            }]);
          console.log('✅ Đã tạo organization member cho user:', user.user.id);
        }
      } catch (memberError) {
        console.log('⚠️  Không thể tạo organization member (có thể chưa đăng nhập):', memberError.message);
      }
    } else {
      organizationId = orgs[0].id;
      console.log('✅ Sử dụng organization hiện có:', organizationId);
    }

    // Insert vào bảng analytics_data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'ga4',
        metrics: analyticsData,
        dimensions: { 
          accountId: '123456789',
          propertyId: 'GA4_PROPERTY_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert analytics data:', error);
    } else {
      console.log('✅ Đã insert analytics data thành công:', data[0].id);
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert([{
        organization_id: organizationId,
        action: 'google_analytics_sync',
        resource: 'analytics_data',
        details: {
          processedCount: 1,
          errorCount: 0,
          timestamp: new Date().toISOString()
        }
      }]);

    console.log('✅ Đồng bộ Google Analytics hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncMetaAdsData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Meta Ads...');
  
  try {
    // Dữ liệu mẫu Meta Ads
    const metaData = {
      impressions: Math.floor(Math.random() * 50000) + 10000,
      clicks: Math.floor(Math.random() * 2000) + 500,
      spend: Math.floor(Math.random() * 5000) + 1000,
      conversions: Math.floor(Math.random() * 100) + 20,
      ctr: Math.random() * 0.1 + 0.01,
      cpc: Math.random() * 5 + 1
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua Meta Ads sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert Meta Ads data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'meta',
        service: 'ads',
        metrics: metaData,
        dimensions: { 
          accountId: 'META_ACCOUNT_ID',
          campaignId: 'CAMPAIGN_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert Meta Ads data:', error);
    } else {
      console.log('✅ Đã insert Meta Ads data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ Meta Ads hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncTikTokAdsData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu TikTok Ads...');
  try {
    // Dữ liệu mẫu TikTok Ads
    const tiktokData = {
      impressions: Math.floor(Math.random() * 30000) + 5000,
      clicks: Math.floor(Math.random() * 1000) + 200,
      spend: Math.floor(Math.random() * 3000) + 500,
      conversions: Math.floor(Math.random() * 50) + 10,
      ctr: Math.random() * 0.1 + 0.01,
      cpc: Math.random() * 4 + 1
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua TikTok Ads sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert TikTok Ads data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'tiktok',
        service: 'ads',
        metrics: tiktokData,
        dimensions: {
          accountId: 'TIKTOK_ACCOUNT_ID',
          campaignId: 'TIKTOK_CAMPAIGN_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert TikTok Ads data:', error);
    } else {
      console.log('✅ Đã insert TikTok Ads data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ TikTok Ads hoàn thành!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncWooCommerceData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu WooCommerce...');
  try {
    // Dữ liệu mẫu WooCommerce
    const wooData = {
      orders: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 20000) + 5000,
      customers: Math.floor(Math.random() * 100) + 20,
      avgOrderValue: Math.random() * 500 + 100
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua WooCommerce sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert WooCommerce data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'woocommerce',
        service: 'store',
        metrics: wooData,
        dimensions: {
          storeId: 'WOOCOMMERCE_STORE_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert WooCommerce data:', error);
    } else {
      console.log('✅ Đã insert WooCommerce data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ WooCommerce hoàn thành!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncGoogleAdsData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Google Ads...');
  
  try {
    // Dữ liệu mẫu Google Ads
    const googleAdsData = {
      impressions: Math.floor(Math.random() * 100000) + 20000,
      clicks: Math.floor(Math.random() * 5000) + 1000,
      spend: Math.floor(Math.random() * 8000) + 2000,
      conversions: Math.floor(Math.random() * 200) + 50,
      ctr: Math.random() * 0.15 + 0.02,
      cpc: Math.random() * 3 + 0.5,
      conversionRate: Math.random() * 0.08 + 0.02,
      qualityScore: Math.floor(Math.random() * 10) + 1
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua Google Ads sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert Google Ads data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'ads',
        metrics: googleAdsData,
        dimensions: { 
          accountId: 'GOOGLE_ADS_ACCOUNT_ID',
          campaignId: 'GOOGLE_ADS_CAMPAIGN_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert Google Ads data:', error);
    } else {
      console.log('✅ Đã insert Google Ads data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ Google Ads hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncGoogleSearchConsoleData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Google Search Console...');
  
  try {
    // Dữ liệu mẫu Google Search Console
    const searchConsoleData = {
      clicks: Math.floor(Math.random() * 5000) + 1000,
      impressions: Math.floor(Math.random() * 50000) + 10000,
      ctr: Math.random() * 0.1 + 0.01,
      avgPosition: Math.random() * 20 + 1,
      avgCpc: Math.random() * 2 + 0.1,
      totalCost: Math.floor(Math.random() * 3000) + 500
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua Google Search Console sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert Google Search Console data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'search-console',
        metrics: searchConsoleData,
        dimensions: { 
          siteUrl: 'https://example.com',
          searchType: 'web'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert Google Search Console data:', error);
    } else {
      console.log('✅ Đã insert Google Search Console data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ Google Search Console hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncGoogleMerchantCenterData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Google Merchant Center...');
  
  try {
    // Dữ liệu mẫu Google Merchant Center
    const merchantCenterData = {
      productViews: Math.floor(Math.random() * 10000) + 2000,
      productClicks: Math.floor(Math.random() * 2000) + 500,
      conversions: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 15000) + 3000,
      ctr: Math.random() * 0.2 + 0.05,
      conversionRate: Math.random() * 0.1 + 0.02,
      avgOrderValue: Math.random() * 200 + 50
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua Google Merchant Center sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert Google Merchant Center data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'merchant-center',
        metrics: merchantCenterData,
        dimensions: { 
          accountId: 'MERCHANT_CENTER_ACCOUNT_ID',
          feedId: 'PRODUCT_FEED_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert Google Merchant Center data:', error);
    } else {
      console.log('✅ Đã insert Google Merchant Center data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ Google Merchant Center hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function syncGoogleSheetsData() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu Google Sheets...');
  
  try {
    // Dữ liệu mẫu Google Sheets (có thể là dữ liệu tùy chỉnh từ khách hàng)
    const sheetsData = {
      totalRows: Math.floor(Math.random() * 1000) + 100,
      totalColumns: Math.floor(Math.random() * 20) + 5,
      lastModified: new Date().toISOString(),
      sheetCount: Math.floor(Math.random() * 10) + 1,
      dataSize: Math.floor(Math.random() * 5000) + 1000 // KB
    };

    // Lấy organization_id
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (!orgs || orgs.length === 0) {
      console.log('⚠️  Chưa có organization. Bỏ qua Google Sheets sync.');
      return;
    }

    const organizationId = orgs[0].id;

    // Insert Google Sheets data
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'sheets',
        metrics: sheetsData,
        dimensions: { 
          fileId: 'GOOGLE_SHEETS_FILE_ID',
          fileName: 'Customer Data Sheet'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi insert Google Sheets data:', error);
    } else {
      console.log('✅ Đã insert Google Sheets data thành công:', data[0].id);
    }

    console.log('✅ Đồng bộ Google Sheets hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

async function main() {
  console.log('🚀 Bắt đầu đồng bộ dữ liệu...\n');
  
  // Google Services
  await syncGoogleAnalyticsData();
  console.log('');
  await syncGoogleAdsData();
  console.log('');
  await syncGoogleSearchConsoleData();
  console.log('');
  await syncGoogleMerchantCenterData();
  console.log('');
  await syncGoogleSheetsData();
  console.log('');
  
  // Other Platforms
  await syncMetaAdsData();
  console.log('');
  await syncTikTokAdsData();
  console.log('');
  await syncWooCommerceData();
  
  console.log('\n🎉 Hoàn thành đồng bộ dữ liệu!');
  console.log('📊 Kiểm tra dữ liệu tại: https://supabase.com/dashboard/project/avthknpemnrjpcuhbyjb/editor');
}

// Chạy script
main().catch(console.error); 