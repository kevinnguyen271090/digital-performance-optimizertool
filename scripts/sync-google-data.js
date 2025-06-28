const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Lấy thông tin từ .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hàm tạo dữ liệu mẫu cho Google Analytics 4
async function generateGoogleAnalyticsData() {
  return {
    sessions: Math.floor(Math.random() * 1000) + 500,
    users: Math.floor(Math.random() * 800) + 300,
    pageviews: Math.floor(Math.random() * 2500) + 1000,
    revenue: Math.floor(Math.random() * 10000) + 2000,
    bounceRate: Math.random() * 0.5 + 0.2,
    avgSessionDuration: Math.floor(Math.random() * 300) + 60,
    conversionRate: Math.random() * 0.1 + 0.02,
    goalCompletions: Math.floor(Math.random() * 50) + 10
  };
}

// Hàm tạo dữ liệu mẫu cho Google Ads
async function generateGoogleAdsData() {
  return {
    impressions: Math.floor(Math.random() * 100000) + 20000,
    clicks: Math.floor(Math.random() * 5000) + 1000,
    spend: Math.floor(Math.random() * 8000) + 2000,
    conversions: Math.floor(Math.random() * 200) + 50,
    ctr: Math.random() * 0.15 + 0.02,
    cpc: Math.random() * 3 + 0.5,
    conversionRate: Math.random() * 0.08 + 0.02,
    qualityScore: Math.floor(Math.random() * 10) + 1,
    avgPosition: Math.random() * 5 + 1,
    costPerConversion: Math.random() * 50 + 10
  };
}

// Hàm tạo dữ liệu mẫu cho Google Search Console
async function generateSearchConsoleData() {
  return {
    clicks: Math.floor(Math.random() * 5000) + 1000,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    ctr: Math.random() * 0.1 + 0.01,
    avgPosition: Math.random() * 20 + 1,
    avgCpc: Math.random() * 2 + 0.1,
    totalCost: Math.floor(Math.random() * 3000) + 500,
    organicClicks: Math.floor(Math.random() * 3000) + 500,
    organicImpressions: Math.floor(Math.random() * 30000) + 5000
  };
}

// Hàm tạo dữ liệu mẫu cho Google Merchant Center
async function generateMerchantCenterData() {
  return {
    productViews: Math.floor(Math.random() * 10000) + 2000,
    productClicks: Math.floor(Math.random() * 2000) + 500,
    conversions: Math.floor(Math.random() * 100) + 20,
    revenue: Math.floor(Math.random() * 15000) + 3000,
    ctr: Math.random() * 0.2 + 0.05,
    conversionRate: Math.random() * 0.1 + 0.02,
    avgOrderValue: Math.random() * 200 + 50,
    totalProducts: Math.floor(Math.random() * 500) + 100,
    activeProducts: Math.floor(Math.random() * 400) + 80
  };
}

// Hàm tạo dữ liệu mẫu cho Google Sheets
async function generateGoogleSheetsData() {
  return {
    totalRows: Math.floor(Math.random() * 1000) + 100,
    totalColumns: Math.floor(Math.random() * 20) + 5,
    lastModified: new Date().toISOString(),
    sheetCount: Math.floor(Math.random() * 10) + 1,
    dataSize: Math.floor(Math.random() * 5000) + 1000, // KB
    syncFrequency: 'daily',
    lastSync: new Date().toISOString()
  };
}

// Hàm đồng bộ dữ liệu Google Analytics
async function syncGoogleAnalytics(organizationId) {
  console.log('🔄 Đồng bộ Google Analytics...');
  
  try {
    const analyticsData = await generateGoogleAnalyticsData();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'ga4',
        metrics: analyticsData,
        dimensions: { 
          accountId: 'GA4_ACCOUNT_ID',
          propertyId: 'GA4_PROPERTY_ID',
          viewId: 'GA4_VIEW_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi Google Analytics:', error);
      return false;
    }
    
    console.log('✅ Google Analytics:', data[0].id);
    return true;
  } catch (error) {
    console.error('❌ Lỗi Google Analytics:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu Google Ads
async function syncGoogleAds(organizationId) {
  console.log('🔄 Đồng bộ Google Ads...');
  
  try {
    const adsData = await generateGoogleAdsData();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'ads',
        metrics: adsData,
        dimensions: { 
          accountId: 'GOOGLE_ADS_ACCOUNT_ID',
          campaignId: 'GOOGLE_ADS_CAMPAIGN_ID',
          adGroupId: 'GOOGLE_ADS_ADGROUP_ID'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi Google Ads:', error);
      return false;
    }
    
    console.log('✅ Google Ads:', data[0].id);
    return true;
  } catch (error) {
    console.error('❌ Lỗi Google Ads:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu Google Search Console
async function syncSearchConsole(organizationId) {
  console.log('🔄 Đồng bộ Google Search Console...');
  
  try {
    const searchData = await generateSearchConsoleData();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'search-console',
        metrics: searchData,
        dimensions: { 
          siteUrl: 'https://example.com',
          searchType: 'web',
          country: 'VN'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi Search Console:', error);
      return false;
    }
    
    console.log('✅ Search Console:', data[0].id);
    return true;
  } catch (error) {
    console.error('❌ Lỗi Search Console:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu Google Merchant Center
async function syncMerchantCenter(organizationId) {
  console.log('🔄 Đồng bộ Google Merchant Center...');
  
  try {
    const merchantData = await generateMerchantCenterData();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'merchant-center',
        metrics: merchantData,
        dimensions: { 
          accountId: 'MERCHANT_CENTER_ACCOUNT_ID',
          feedId: 'PRODUCT_FEED_ID',
          country: 'VN'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi Merchant Center:', error);
      return false;
    }
    
    console.log('✅ Merchant Center:', data[0].id);
    return true;
  } catch (error) {
    console.error('❌ Lỗi Merchant Center:', error);
    return false;
  }
}

// Hàm đồng bộ dữ liệu Google Sheets
async function syncGoogleSheets(organizationId) {
  console.log('🔄 Đồng bộ Google Sheets...');
  
  try {
    const sheetsData = await generateGoogleSheetsData();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert([{
        organization_id: organizationId,
        platform: 'google',
        service: 'sheets',
        metrics: sheetsData,
        dimensions: { 
          fileId: 'GOOGLE_SHEETS_FILE_ID',
          fileName: 'Customer Data Sheet',
          sheetName: 'Sheet1'
        }
      }])
      .select();

    if (error) {
      console.error('❌ Lỗi Google Sheets:', error);
      return false;
    }
    
    console.log('✅ Google Sheets:', data[0].id);
    return true;
  } catch (error) {
    console.error('❌ Lỗi Google Sheets:', error);
    return false;
  }
}

// Hàm chính
async function main() {
  console.log('🚀 Bắt đầu đồng bộ dữ liệu Google...\n');
  
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

  // Đồng bộ từng dịch vụ Google
  const results = {
    analytics: await syncGoogleAnalytics(organizationId),
    ads: await syncGoogleAds(organizationId),
    searchConsole: await syncSearchConsole(organizationId),
    merchantCenter: await syncMerchantCenter(organizationId),
    sheets: await syncGoogleSheets(organizationId)
  };

  // Log kết quả
  console.log('\n📊 Kết quả đồng bộ:');
  console.log(`✅ Google Analytics: ${results.analytics ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Google Ads: ${results.ads ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Search Console: ${results.searchConsole ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Merchant Center: ${results.merchantCenter ? 'Thành công' : 'Thất bại'}`);
  console.log(`✅ Google Sheets: ${results.sheets ? 'Thành công' : 'Thất bại'}`);

  // Log audit
  await supabase
    .from('audit_logs')
    .insert([{
      organization_id: organizationId,
      action: 'google_services_sync',
      resource: 'analytics_data',
      details: {
        services: Object.keys(results),
        successCount: Object.values(results).filter(Boolean).length,
        errorCount: Object.values(results).filter(r => !r).length,
        timestamp: new Date().toISOString()
      }
    }]);

  console.log('\n🎉 Hoàn thành đồng bộ dữ liệu Google!');
  console.log('📊 Kiểm tra dữ liệu tại: https://supabase.com/dashboard/project/avthknpemnrjpcuhbyjb/editor');
}

// Chạy script
main().catch(console.error); 