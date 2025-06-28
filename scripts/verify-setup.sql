-- Digital Performance Optimizer - Verify Database Setup
-- Chạy script này để kiểm tra kết quả setup

-- Kiểm tra extensions
SELECT 
  'Extensions' as check_type,
  extname as name,
  CASE WHEN extname IN ('uuid-ossp', 'pg_cron') THEN '✅ Required' ELSE '⚠️ Optional' END as status
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pg_cron');

-- Kiểm tra các bảng cần thiết
SELECT 
  'Tables' as check_type,
  table_name as name,
  CASE 
    WHEN table_name IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs') 
    THEN '✅ Required' 
    ELSE '⚠️ Optional' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs')
ORDER BY table_name;

-- Tổng kết
SELECT 
  'Summary' as check_type,
  'Database Status' as name,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs')) = 7
    THEN '✅ All tables created successfully'
    ELSE '❌ Missing some tables'
  END as status; 