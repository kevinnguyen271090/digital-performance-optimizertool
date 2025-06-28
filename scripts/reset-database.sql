-- Digital Performance Optimizer - Database Reset Script
-- ⚠️ CẢNH BÁO: Script này sẽ xóa TẤT CẢ dữ liệu trong database
-- Chỉ chạy khi bạn muốn reset hoàn toàn database

-- Disable triggers temporarily
SET session_replication_role = replica;

-- Drop all tables in correct dependency order
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analytics_data CASCADE;
DROP TABLE IF EXISTS imported_data CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_analytics_data() CASCADE;
DROP FUNCTION IF EXISTS log_api_error(VARCHAR, TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS check_system_health() CASCADE;
DROP FUNCTION IF EXISTS table_exists(text) CASCADE;

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Users can only access their organization data" ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Drop all indexes (except primary keys)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname NOT LIKE '%_pkey'
    ) LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname);
    END LOOP;
END $$;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Remove cron jobs
SELECT cron.unschedule('cleanup-old-data');
SELECT cron.unschedule('sync-google-analytics');
SELECT cron.unschedule('sync-meta-ads');
SELECT cron.unschedule('health-check');

RAISE NOTICE 'Database reset completed. All tables, functions, triggers, and policies have been removed.';
RAISE NOTICE 'Run setup-database.sql to recreate the database schema.'; 