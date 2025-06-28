const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cấu hình retention policy
const RETENTION_POLICY = {
  'google': {
    'ga4': { raw: 90, aggregated: 730 }, // 90 ngày raw, 2 năm aggregated
    'ads': { raw: 60, aggregated: 365 }, // 60 ngày raw, 1 năm aggregated
    'search-console': { raw: 90, aggregated: 730 },
    'merchant-center': { raw: 60, aggregated: 365 },
    'sheets': { raw: 30, aggregated: 365 }
  },
  'meta': {
    'ads': { raw: 60, aggregated: 365 }
  },
  'tiktok': {
    'ads': { raw: 60, aggregated: 365 }
  },
  'woocommerce': {
    'store': { raw: 90, aggregated: 730 }
  }
};

// Hàm xóa dữ liệu cũ
async function cleanupOldData() {
  console.log('🧹 Bắt đầu dọn dẹp dữ liệu cũ...');
  
  try {
    // Xóa dữ liệu raw cũ hơn 90 ngày
    const { data: deletedRaw, error: rawError } = await supabase
      .from('analytics_data')
      .delete()
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (rawError) {
      console.error('❌ Lỗi xóa dữ liệu raw:', rawError);
    } else {
      console.log(`✅ Đã xóa ${deletedRaw?.length || 0} bản ghi raw cũ`);
    }

    // Xóa audit logs cũ hơn 1 năm
    const { data: deletedAudit, error: auditError } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    if (auditError) {
      console.error('❌ Lỗi xóa audit logs:', auditError);
    } else {
      console.log(`✅ Đã xóa ${deletedAudit?.length || 0} audit logs cũ`);
    }

    console.log('✅ Hoàn thành dọn dẹp dữ liệu cũ!');
    
  } catch (error) {
    console.error('❌ Lỗi dọn dẹp:', error);
  }
}

// Hàm tạo dữ liệu tổng hợp
async function createAggregatedData() {
  console.log('📊 Tạo dữ liệu tổng hợp...');
  
  try {
    // Tạo dữ liệu tổng hợp theo tháng cho Google Analytics
    const { data: gaData, error: gaError } = await supabase
      .rpc('aggregate_analytics_data', {
        platform_param: 'google',
        service_param: 'ga4',
        aggregation_type: 'monthly'
      });

    if (gaError) {
      console.error('❌ Lỗi tạo dữ liệu tổng hợp GA:', gaError);
    } else {
      console.log('✅ Đã tạo dữ liệu tổng hợp Google Analytics');
    }

    // Tạo dữ liệu tổng hợp cho Google Ads
    const { data: adsData, error: adsError } = await supabase
      .rpc('aggregate_analytics_data', {
        platform_param: 'google',
        service_param: 'ads',
        aggregation_type: 'monthly'
      });

    if (adsError) {
      console.error('❌ Lỗi tạo dữ liệu tổng hợp Ads:', adsError);
    } else {
      console.log('✅ Đã tạo dữ liệu tổng hợp Google Ads');
    }

  } catch (error) {
    console.error('❌ Lỗi tạo dữ liệu tổng hợp:', error);
  }
}

// Hàm kiểm tra dung lượng database
async function checkDatabaseSize() {
  console.log('📏 Kiểm tra dung lượng database...');
  
  try {
    // Đếm số bản ghi trong analytics_data
    const { count: analyticsCount, error: analyticsError } = await supabase
      .from('analytics_data')
      .select('*', { count: 'exact', head: true });

    if (analyticsError) {
      console.error('❌ Lỗi đếm analytics_data:', analyticsError);
    } else {
      console.log(`📊 Số bản ghi analytics_data: ${analyticsCount}`);
    }

    // Đếm số bản ghi trong audit_logs
    const { count: auditCount, error: auditError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true });

    if (auditError) {
      console.error('❌ Lỗi đếm audit_logs:', auditError);
    } else {
      console.log(`📊 Số bản ghi audit_logs: ${auditCount}`);
    }

    // Ước tính dung lượng (giả định mỗi bản ghi ~1KB)
    const estimatedSizeMB = ((analyticsCount || 0) + (auditCount || 0)) / 1024;
    console.log(`💾 Dung lượng ước tính: ${estimatedSizeMB.toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Lỗi kiểm tra dung lượng:', error);
  }
}

// Hàm tối ưu hóa database
async function optimizeDatabase() {
  console.log('⚡ Tối ưu hóa database...');
  
  try {
    // Vacuum database (nếu có quyền)
    const { error: vacuumError } = await supabase
      .rpc('vacuum_analytics_tables');

    if (vacuumError) {
      console.log('⚠️  Không thể vacuum database (cần quyền admin)');
    } else {
      console.log('✅ Đã vacuum database');
    }

    // Tạo index cho các cột thường query
    const { error: indexError } = await supabase
      .rpc('create_analytics_indexes');

    if (indexError) {
      console.log('⚠️  Không thể tạo index (cần quyền admin)');
    } else {
      console.log('✅ Đã tạo index cho analytics tables');
    }

  } catch (error) {
    console.error('❌ Lỗi tối ưu hóa:', error);
  }
}

// Hàm chính
async function main() {
  console.log('🚀 Bắt đầu quản lý retention policy...\n');
  
  await checkDatabaseSize();
  console.log('');
  
  await cleanupOldData();
  console.log('');
  
  await createAggregatedData();
  console.log('');
  
  await optimizeDatabase();
  console.log('');
  
  await checkDatabaseSize();
  
  console.log('\n🎉 Hoàn thành quản lý retention policy!');
  console.log('💡 Chạy script này hàng tuần để duy trì hiệu suất database');
}

// Chạy script
main().catch(console.error); 