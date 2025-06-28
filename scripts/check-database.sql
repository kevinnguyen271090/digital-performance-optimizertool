-- Digital Performance Optimizer - Database Status Check
-- Chạy script này để kiểm tra trạng thái database

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

-- Kiểm tra RLS policies
SELECT 
  'RLS Policies' as check_type,
  schemaname || '.' || tablename as table_name,
  policyname as policy_name,
  CASE WHEN permissive = 'PERMISSIVE' THEN '✅ Active' ELSE '❌ Restrictive' END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs')
ORDER BY tablename, policyname;

-- Kiểm tra indexes
SELECT 
  'Indexes' as check_type,
  tablename as table_name,
  indexname as index_name,
  '✅ Active' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs')
ORDER BY tablename, indexname;

-- Kiểm tra functions
SELECT 
  'Functions' as check_type,
  proname as function_name,
  '✅ Active' as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND proname IN ('handle_new_user', 'cleanup_old_analytics_data', 'log_api_error')
ORDER BY proname;

-- Tổng kết
SELECT 
  'Summary' as check_type,
  'Database Status' as name,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('organizations', 'organization_members', 'connections', 'imported_data', 'analytics_data', 'audit_logs', 'error_logs')) = 7
    THEN '✅ All tables created successfully'
    ELSE '❌ Missing some tables'
  END as status; 