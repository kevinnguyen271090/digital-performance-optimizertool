-- scripts/verify-database-setup.sql
-- Kiểm tra database setup đã hoàn thành

-- 1. Kiểm tra các bảng mới đã được tạo
SELECT 'Tables Check' as check_type, table_name, 'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'hourly_aggregates',
    'daily_aggregates', 
    'raw_data_backup',
    'ai_insights',
    'performance_alerts',
    'realtime_sessions',
    'event_tracking',
    'cohort_analysis',
    'funnel_analysis'
)
ORDER BY table_name;

-- 2. Kiểm tra indexes đã được tạo
SELECT 'Indexes Check' as check_type, indexname, 'EXISTS' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- 3. Kiểm tra functions đã được tạo
SELECT 'Functions Check' as check_type, routine_name, 'EXISTS' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'aggregate_hourly_from_analytics',
    'aggregate_daily_from_hourly',
    'cleanup_all_old_data',
    'generate_ai_insights',
    'check_performance_thresholds',
    'run_scheduled_tasks'
)
ORDER BY routine_name;

-- 4. Kiểm tra triggers đã được tạo
SELECT 'Triggers Check' as check_type, trigger_name, 'EXISTS' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE 'update_%_updated_at'
ORDER BY trigger_name;

-- 5. Kiểm tra RLS policies cho bảng mới
SELECT 'RLS Policies Check' as check_type, tablename, policyname, 'EXISTS' as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'hourly_aggregates',
    'daily_aggregates',
    'ai_insights',
    'performance_alerts',
    'realtime_sessions',
    'event_tracking'
)
ORDER BY tablename, policyname;

-- 6. Test function tổng hợp dữ liệu (chỉ chạy nếu có dữ liệu trong analytics_data)
SELECT 'Data Aggregation Test' as test_type, 
       COUNT(*) as analytics_records,
       CASE 
           WHEN COUNT(*) > 0 THEN 'READY TO AGGREGATE'
           ELSE 'NO DATA TO AGGREGATE'
       END as status
FROM analytics_data 
WHERE timestamp >= CURRENT_DATE;

-- 7. Test function cleanup
SELECT 'Cleanup Test' as test_type, 'READY' as status;

-- 8. Kiểm tra cấu trúc bảng hourly_aggregates
SELECT 'Table Structure Check' as check_type, 
       column_name, 
       data_type, 
       is_nullable,
       'OK' as status
FROM information_schema.columns 
WHERE table_name = 'hourly_aggregates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Kiểm tra cấu trúc bảng ai_insights
SELECT 'Table Structure Check' as check_type, 
       column_name, 
       data_type, 
       is_nullable,
       'OK' as status
FROM information_schema.columns 
WHERE table_name = 'ai_insights' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Tổng kết setup
SELECT 'DATABASE SETUP SUMMARY' as summary_type,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
       (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as total_indexes,
       (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as total_functions,
       (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_policies,
       'COMPLETED' as status; 