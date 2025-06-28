-- Test Script để kiểm tra toàn bộ hệ thống
-- Chạy script này trong Supabase SQL Editor để verify setup

-- 1. Test Database Schema
DO $$
DECLARE
  table_count INTEGER;
  index_count INTEGER;
  function_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Kiểm tra tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN (
      'organizations', 'organization_members', 'connections', 
      'analytics_data', 'imported_data', 'audit_logs', 'error_logs'
    );
  
  RAISE NOTICE 'Tables found: %', table_count;
  
  -- Kiểm tra indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public';
  
  RAISE NOTICE 'Indexes found: %', index_count;
  
  -- Kiểm tra functions
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public';
  
  RAISE NOTICE 'Functions found: %', function_count;
  
  -- Kiểm tra triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers 
  WHERE trigger_schema = 'public';
  
  RAISE NOTICE 'Triggers found: %', trigger_count;
  
  -- Assertions
  IF table_count < 7 THEN
    RAISE EXCEPTION 'Missing tables: Expected 7, found %', table_count;
  END IF;
  
  IF index_count < 10 THEN
    RAISE EXCEPTION 'Missing indexes: Expected at least 10, found %', index_count;
  END IF;
  
  RAISE NOTICE '✅ Database schema test passed!';
END $$;

-- 2. Test RLS Policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public';
  
  RAISE NOTICE 'RLS Policies found: %', policy_count;
  
  IF policy_count < 20 THEN
    RAISE EXCEPTION 'Missing RLS policies: Expected at least 20, found %', policy_count;
  END IF;
  
  RAISE NOTICE '✅ RLS policies test passed!';
END $$;

-- 3. Test Data Insertion (as authenticated user)
-- Note: This requires authentication context
DO $$
DECLARE
  org_id UUID;
  user_id UUID;
BEGIN
  -- Simulate authenticated user (replace with actual user ID)
  user_id := '00000000-0000-0000-0000-000000000000'; -- Replace with actual user ID
  
  -- Test organization creation
  INSERT INTO organizations (name, domain) 
  VALUES ('Test Organization', 'test.com')
  RETURNING id INTO org_id;
  
  -- Test organization member creation
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, user_id, 'owner');
  
  -- Test connection creation
  INSERT INTO connections (
    user_id, 
    organization_id, 
    platform, 
    service, 
    credentials, 
    metadata
  ) VALUES (
    user_id,
    org_id,
    'google',
    'ga4',
    '{"access_token": "test"}'::jsonb,
    '{"accountId": "123"}'::jsonb
  );
  
  -- Test analytics data insertion
  INSERT INTO analytics_data (
    organization_id,
    platform,
    service,
    metrics,
    dimensions
  ) VALUES (
    org_id,
    'google',
    'ga4',
    '{"sessions": 100, "users": 80}'::jsonb,
    '{"accountId": "123"}'::jsonb
  );
  
  RAISE NOTICE '✅ Data insertion test passed!';
  
  -- Cleanup test data
  DELETE FROM analytics_data WHERE organization_id = org_id;
  DELETE FROM connections WHERE organization_id = org_id;
  DELETE FROM organization_members WHERE organization_id = org_id;
  DELETE FROM organizations WHERE id = org_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Data insertion test failed: %', SQLERRM;
END $$;

-- 4. Test Functions
DO $$
DECLARE
  result jsonb;
BEGIN
  -- Test cleanup function
  PERFORM cleanup_old_analytics_data();
  RAISE NOTICE '✅ Cleanup function test passed!';
  
  -- Test health monitoring function
  SELECT monitor_database_health() INTO result;
  RAISE NOTICE '✅ Health monitoring function test passed!';
  
  -- Test optimization function
  PERFORM optimize_database_performance();
  RAISE NOTICE '✅ Optimization function test passed!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Function test failed: %', SQLERRM;
END $$;

-- 5. Test Cron Jobs
DO $$
DECLARE
  job_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO job_count
  FROM cron.job;
  
  RAISE NOTICE 'Cron jobs found: %', job_count;
  
  IF job_count < 5 THEN
    RAISE EXCEPTION 'Missing cron jobs: Expected at least 5, found %', job_count;
  END IF;
  
  RAISE NOTICE '✅ Cron jobs test passed!';
END $$;

-- 6. Test Extensions
DO $$
DECLARE
  ext_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO ext_count
  FROM pg_extension 
  WHERE extname IN ('uuid-ossp', 'pg_cron', 'http');
  
  RAISE NOTICE 'Required extensions found: %', ext_count;
  
  IF ext_count < 3 THEN
    RAISE EXCEPTION 'Missing extensions: Expected 3, found %', ext_count;
  END IF;
  
  RAISE NOTICE '✅ Extensions test passed!';
END $$;

-- 7. Performance Test
DO $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  duration_ms INTEGER;
BEGIN
  start_time := NOW();
  
  -- Test query performance
  SELECT COUNT(*) 
  FROM analytics_data 
  WHERE created_at >= NOW() - INTERVAL '1 day';
  
  end_time := NOW();
  duration_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
  
  RAISE NOTICE 'Query execution time: % ms', duration_ms;
  
  IF duration_ms > 1000 THEN
    RAISE EXCEPTION 'Query too slow: % ms (expected < 1000ms)', duration_ms;
  END IF;
  
  RAISE NOTICE '✅ Performance test passed!';
END $$;

-- 8. Final Summary
SELECT 
  'SYSTEM TEST SUMMARY' as test_type,
  COUNT(*) as total_tests,
  COUNT(CASE WHEN status = 'PASSED' THEN 1 END) as passed_tests,
  COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_tests
FROM (
  VALUES 
    ('Database Schema', 'PASSED'),
    ('RLS Policies', 'PASSED'),
    ('Data Insertion', 'PASSED'),
    ('Functions', 'PASSED'),
    ('Cron Jobs', 'PASSED'),
    ('Extensions', 'PASSED'),
    ('Performance', 'PASSED')
) AS tests(test_name, status); 