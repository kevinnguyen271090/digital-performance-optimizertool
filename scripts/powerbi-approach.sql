-- Cấu trúc database theo mô hình Power BI
-- Import + Cache + Scheduled Refresh

-- 1. Bảng chính lưu dữ liệu import (như Power BI Dataset)
CREATE TABLE IF NOT EXISTS analytics_dataset (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  metrics JSONB NOT NULL,
  dimensions JSONB,
  data_source TEXT NOT NULL, -- 'import', 'api', 'cache'
  last_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, date)
);

-- 2. Bảng tổng hợp cho dashboard (như Power BI Aggregations)
CREATE TABLE IF NOT EXISTS dashboard_aggregations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  aggregation_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  platform TEXT,
  service TEXT,
  metrics JSONB NOT NULL,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, aggregation_type, period_start, platform, service)
);

-- 3. Bảng cache cho custom queries (như Power BI DirectQuery cache)
CREATE TABLE IF NOT EXISTS query_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  query_hash TEXT NOT NULL, -- Hash của query parameters
  query_params JSONB NOT NULL, -- Parameters của query
  result_data JSONB NOT NULL,
  cache_duration TEXT NOT NULL DEFAULT '1_hour',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, query_hash)
);

-- 4. Bảng refresh schedule (như Power BI refresh settings)
CREATE TABLE IF NOT EXISTS refresh_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  refresh_frequency TEXT NOT NULL DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  refresh_time TIME DEFAULT '02:00:00',
  last_refresh TIMESTAMP WITH TIME ZONE,
  next_refresh TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service)
);

-- 5. Index tối ưu cho truy vấn nhanh
CREATE INDEX IF NOT EXISTS idx_dataset_org_date ON analytics_dataset(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_dataset_platform_service ON analytics_dataset(platform, service);
CREATE INDEX IF NOT EXISTS idx_dataset_refresh ON analytics_dataset(last_refresh);
CREATE INDEX IF NOT EXISTS idx_aggregations_org_type ON dashboard_aggregations(organization_id, aggregation_type);
CREATE INDEX IF NOT EXISTS idx_aggregations_period ON dashboard_aggregations(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_query_cache_expires ON query_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_query_cache_hash ON query_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_schedule_next ON refresh_schedule(next_refresh);

-- 6. Function import dữ liệu (như Power BI Import)
CREATE OR REPLACE FUNCTION import_analytics_data(
  org_id UUID,
  platform_param TEXT,
  service_param TEXT,
  start_date_param DATE,
  end_date_param DATE
)
RETURNS void AS $$
DECLARE
  current_date DATE;
BEGIN
  -- Import dữ liệu cho từng ngày
  current_date := start_date_param;
  
  WHILE current_date <= end_date_param LOOP
    -- Upsert dữ liệu (thay thế nếu đã tồn tại)
    INSERT INTO analytics_dataset (
      organization_id,
      platform,
      service,
      date,
      metrics,
      dimensions,
      data_source,
      last_refresh
    ) VALUES (
      org_id,
      platform_param,
      service_param,
      current_date,
      '{}'::jsonb, -- Sẽ được cập nhật bởi API call
      '{}'::jsonb,
      'import',
      NOW()
    )
    ON CONFLICT (organization_id, platform, service, date)
    DO UPDATE SET
      last_refresh = NOW(),
      data_source = 'import';
    
    current_date := current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Cập nhật lịch refresh
  INSERT INTO refresh_schedule (
    organization_id,
    platform,
    service,
    last_refresh,
    next_refresh
  ) VALUES (
    org_id,
    platform_param,
    service_param,
    NOW(),
    NOW() + INTERVAL '1 day'
  )
  ON CONFLICT (organization_id, platform, service)
  DO UPDATE SET
    last_refresh = NOW(),
    next_refresh = NOW() + INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- 7. Function tính toán aggregations (như Power BI Aggregations)
CREATE OR REPLACE FUNCTION calculate_aggregations(
  org_id UUID,
  aggregation_type_param TEXT DEFAULT 'daily'
)
RETURNS void AS $$
BEGIN
  -- Tính toán tổng hợp theo ngày
  IF aggregation_type_param = 'daily' THEN
    INSERT INTO dashboard_aggregations (
      organization_id,
      aggregation_type,
      period_start,
      period_end,
      platform,
      service,
      metrics
    )
    SELECT 
      organization_id,
      'daily' as aggregation_type,
      date as period_start,
      date as period_end,
      platform,
      service,
      jsonb_build_object(
        'total_sessions', COALESCE((metrics->>'sessions')::numeric, 0),
        'total_users', COALESCE((metrics->>'users')::numeric, 0),
        'total_pageviews', COALESCE((metrics->>'pageviews')::numeric, 0),
        'total_revenue', COALESCE((metrics->>'revenue')::numeric, 0),
        'total_conversions', COALESCE((metrics->>'conversions')::numeric, 0),
        'avg_bounce_rate', COALESCE((metrics->>'bounceRate')::numeric, 0),
        'avg_session_duration', COALESCE((metrics->>'avgSessionDuration')::numeric, 0)
      ) as metrics
    FROM analytics_dataset
    WHERE organization_id = org_id
      AND date >= CURRENT_DATE - INTERVAL '30 days'
    ON CONFLICT (organization_id, aggregation_type, period_start, platform, service)
    DO UPDATE SET
      metrics = EXCLUDED.metrics,
      last_calculated = NOW();
  END IF;
  
  -- Tính toán tổng hợp theo tuần
  IF aggregation_type_param = 'weekly' THEN
    INSERT INTO dashboard_aggregations (
      organization_id,
      aggregation_type,
      period_start,
      period_end,
      platform,
      service,
      metrics
    )
    SELECT 
      organization_id,
      'weekly' as aggregation_type,
      DATE_TRUNC('week', date) as period_start,
      DATE_TRUNC('week', date) + INTERVAL '6 days' as period_end,
      platform,
      service,
      jsonb_build_object(
        'total_sessions', SUM(COALESCE((metrics->>'sessions')::numeric, 0)),
        'total_users', SUM(COALESCE((metrics->>'users')::numeric, 0)),
        'total_pageviews', SUM(COALESCE((metrics->>'pageviews')::numeric, 0)),
        'total_revenue', SUM(COALESCE((metrics->>'revenue')::numeric, 0)),
        'total_conversions', SUM(COALESCE((metrics->>'conversions')::numeric, 0)),
        'avg_bounce_rate', AVG(COALESCE((metrics->>'bounceRate')::numeric, 0)),
        'avg_session_duration', AVG(COALESCE((metrics->>'avgSessionDuration')::numeric, 0))
      ) as metrics
    FROM analytics_dataset
    WHERE organization_id = org_id
      AND date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY organization_id, platform, service, DATE_TRUNC('week', date)
    ON CONFLICT (organization_id, aggregation_type, period_start, platform, service)
    DO UPDATE SET
      metrics = EXCLUDED.metrics,
      last_calculated = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Function cache query (như Power BI DirectQuery cache)
CREATE OR REPLACE FUNCTION cache_query_result(
  org_id UUID,
  query_hash_param TEXT,
  query_params_param JSONB,
  result_data_param JSONB,
  cache_duration_param TEXT DEFAULT '1_hour'
)
RETURNS void AS $$
DECLARE
  expires_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Tính thời gian hết hạn
  CASE cache_duration_param
    WHEN '15_minutes' THEN expires_time := NOW() + INTERVAL '15 minutes';
    WHEN '1_hour' THEN expires_time := NOW() + INTERVAL '1 hour';
    WHEN '6_hours' THEN expires_time := NOW() + INTERVAL '6 hours';
    WHEN '24_hours' THEN expires_time := NOW() + INTERVAL '24 hours';
    ELSE expires_time := NOW() + INTERVAL '1 hour';
  END CASE;
  
  INSERT INTO query_cache (
    organization_id,
    query_hash,
    query_params,
    result_data,
    cache_duration,
    expires_at
  ) VALUES (
    org_id,
    query_hash_param,
    query_params_param,
    result_data_param,
    cache_duration_param,
    expires_time
  )
  ON CONFLICT (organization_id, query_hash)
  DO UPDATE SET
    result_data = EXCLUDED.result_data,
    cache_duration = EXCLUDED.cache_duration,
    expires_at = EXCLUDED.expires_at,
    hit_count = query_cache.hit_count + 1;
END;
$$ LANGUAGE plpgsql;

-- 9. Function kiểm tra cache
CREATE OR REPLACE FUNCTION get_cached_query(
  org_id UUID,
  query_hash_param TEXT
)
RETURNS TABLE (
  found BOOLEAN,
  data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as found,
    qc.result_data as data
  FROM query_cache qc
  WHERE qc.organization_id = org_id
    AND qc.query_hash = query_hash_param
    AND qc.expires_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, '{}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 10. Function cleanup và maintenance (như Power BI maintenance)
CREATE OR REPLACE FUNCTION maintenance_cleanup()
RETURNS void AS $$
BEGIN
  -- Xóa cache hết hạn
  DELETE FROM query_cache WHERE expires_at < NOW();
  
  -- Xóa dữ liệu cũ hơn 90 ngày
  DELETE FROM analytics_dataset WHERE date < CURRENT_DATE - INTERVAL '90 days';
  
  -- Xóa aggregations cũ hơn 1 năm
  DELETE FROM dashboard_aggregations WHERE period_start < CURRENT_DATE - INTERVAL '1 year';
  
  -- Cập nhật next_refresh cho các schedule
  UPDATE refresh_schedule 
  SET next_refresh = last_refresh + INTERVAL '1 day'
  WHERE next_refresh < NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- 11. RLS Policies
ALTER TABLE analytics_dataset ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_schedule ENABLE ROW LEVEL SECURITY;

-- Analytics dataset policy
CREATE POLICY "Users can view analytics dataset for their organizations" ON analytics_dataset
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Dashboard aggregations policy
CREATE POLICY "Users can view aggregations for their organizations" ON dashboard_aggregations
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Query cache policy
CREATE POLICY "Users can view query cache for their organizations" ON query_cache
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Refresh schedule policy
CREATE POLICY "Users can view refresh schedule for their organizations" ON refresh_schedule
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- 12. Views cho dashboard
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT 
  organization_id,
  platform,
  service,
  aggregation_type,
  period_start,
  period_end,
  metrics,
  last_calculated
FROM dashboard_aggregations
WHERE aggregation_type = 'daily'
  AND period_start >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY period_start DESC;

-- 13. Cron jobs (sử dụng pg_cron)
-- SELECT cron.schedule('daily-refresh', '0 2 * * *', 'SELECT maintenance_cleanup();');
-- SELECT cron.schedule('hourly-aggregations', '0 * * * *', 'SELECT calculate_aggregations();');

-- Thông báo hoàn thành
DO $$
BEGIN
  RAISE NOTICE '✅ Đã tạo cấu trúc database theo mô hình Power BI!';
  RAISE NOTICE '📋 Các tính năng đã implement:';
  RAISE NOTICE '   - Import mode (như Power BI Import)';
  RAISE NOTICE '   - Aggregations (như Power BI Aggregations)';
  RAISE NOTICE '   - Query cache (như Power BI DirectQuery cache)';
  RAISE NOTICE '   - Scheduled refresh (như Power BI refresh)';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Ưu điểm:';
  RAISE NOTICE '   - Hiệu năng cao (dữ liệu trong DB)';
  RAISE NOTICE '   - Trải nghiệm mượt mà (không chờ API)';
  RAISE NOTICE '   - Chi phí hợp lý (cân bằng storage/performance)';
  RAISE NOTICE '   - Dễ scale (có thể nâng cấp dần)';
END $$; 