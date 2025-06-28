-- Setup Cron Jobs cho ETL và Cleanup
-- Chạy script này trong Supabase SQL Editor

-- Enable pg_cron extension (nếu chưa enable)
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Enable http extension cho gọi Edge Functions
CREATE EXTENSION IF NOT EXISTS "http";

-- Schedule Google Analytics sync (mỗi 15 phút)
SELECT cron.schedule(
  'sync-google-analytics',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/fetch-google-analytics',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- Schedule Meta Ads sync (mỗi 30 phút)
SELECT cron.schedule(
  'sync-meta-ads',
  '*/30 * * * *', -- Every 30 minutes
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/fetch-meta-ads',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- Schedule daily cleanup (2:00 AM mỗi ngày)
SELECT cron.schedule(
  'daily-cleanup',
  '0 2 * * *', -- 2:00 AM daily
  'SELECT cleanup_old_analytics_data();'
);

-- Schedule weekly data aggregation (Chủ nhật 3:00 AM)
SELECT cron.schedule(
  'weekly-aggregation',
  '0 3 * * 0', -- Sunday 3:00 AM
  'SELECT aggregate_weekly_data();'
);

-- Kiểm tra cron jobs đã tạo
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active
FROM cron.job; 