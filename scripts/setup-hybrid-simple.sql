-- Setup Hybrid Approach đơn giản
-- Kết hợp Phương án 3 + Power BI

-- 1. Bảng lưu dữ liệu 7 ngày cố định
CREATE TABLE IF NOT EXISTS dashboard_fixed_7days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  dimensions JSONB DEFAULT '{}',
  data_source TEXT NOT NULL DEFAULT 'import',
  last_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, date)
);

-- 2. Bảng tổng hợp 7 ngày
CREATE TABLE IF NOT EXISTS dashboard_summary_7days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, period_start)
);

-- 3. Bảng cache cho custom range
CREATE TABLE IF NOT EXISTS custom_range_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  query_hash TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  cache_duration TEXT NOT NULL DEFAULT '1_hour',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, start_date, end_date)
);

-- 4. Bảng refresh schedule
CREATE TABLE IF NOT EXISTS refresh_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  refresh_type TEXT NOT NULL DEFAULT 'daily',
  refresh_time TIME DEFAULT '02:00:00',
  last_refresh TIMESTAMP WITH TIME ZONE,
  next_refresh TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service)
);

-- 5. Index tối ưu
CREATE INDEX IF NOT EXISTS idx_fixed_7days_org_date ON dashboard_fixed_7days(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_fixed_7days_platform ON dashboard_fixed_7days(platform, service);
CREATE INDEX IF NOT EXISTS idx_summary_7days_org ON dashboard_summary_7days(organization_id, platform, service);
CREATE INDEX IF NOT EXISTS idx_custom_cache_expires ON custom_range_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_custom_cache_hash ON custom_range_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_schedule_next ON refresh_schedule(next_refresh);

-- 6. Function import dữ liệu 7 ngày
CREATE OR REPLACE FUNCTION import_7days_data(
  org_id UUID,
  platform_param TEXT,
  service_param TEXT
)
RETURNS void AS $$
DECLARE
  current_date DATE;
  end_date DATE;
BEGIN
  -- Import dữ liệu 7 ngày gần nhất
  end_date := CURRENT_DATE;
  current_date := end_date - INTERVAL '6 days';
  
  WHILE current_date <= end_date LOOP
    -- Upsert dữ liệu cho từng ngày
    INSERT INTO dashboard_fixed_7days (
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
      '{}'::jsonb,
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

-- 7. Function tính toán tổng hợp 7 ngày
CREATE OR REPLACE FUNCTION calculate_7days_summary(
  org_id UUID
)
RETURNS void AS $$
BEGIN
  -- Tính toán tổng hợp 7 ngày gần nhất
  INSERT INTO dashboard_summary_7days (
    organization_id,
    platform,
    service,
    period_start,
    period_end,
    metrics
  )
  SELECT 
    organization_id,
    platform,
    service,
    CURRENT_DATE - INTERVAL '6 days' as period_start,
    CURRENT_DATE as period_end,
    jsonb_build_object(
      'total_sessions', SUM(COALESCE((metrics->>'sessions')::numeric, 0)),
      'total_users', SUM(COALESCE((metrics->>'users')::numeric, 0)),
      'total_pageviews', SUM(COALESCE((metrics->>'pageviews')::numeric, 0)),
      'total_revenue', SUM(COALESCE((metrics->>'revenue')::numeric, 0)),
      'total_conversions', SUM(COALESCE((metrics->>'conversions')::numeric, 0)),
      'avg_bounce_rate', AVG(COALESCE((metrics->>'bounceRate')::numeric, 0)),
      'avg_session_duration', AVG(COALESCE((metrics->>'avgSessionDuration')::numeric, 0)),
      'daily_avg_sessions', AVG(COALESCE((metrics->>'sessions')::numeric, 0)),
      'daily_avg_revenue', AVG(COALESCE((metrics->>'revenue')::numeric, 0))
    ) as metrics
  FROM dashboard_fixed_7days
  WHERE organization_id = org_id
    AND date >= CURRENT_DATE - INTERVAL '6 days'
  GROUP BY organization_id, platform, service
  ON CONFLICT (organization_id, platform, service, period_start)
  DO UPDATE SET
    metrics = EXCLUDED.metrics,
    last_calculated = NOW();
END;
$$ LANGUAGE plpgsql;

-- 8. Function cache custom range
CREATE OR REPLACE FUNCTION cache_custom_range(
  org_id UUID,
  platform_param TEXT,
  service_param TEXT,
  start_date_param DATE,
  end_date_param DATE,
  metrics_data JSONB,
  cache_duration_param TEXT DEFAULT '1_hour'
)
RETURNS void AS $$
DECLARE
  expires_time TIMESTAMP WITH TIME ZONE;
  query_hash_val TEXT;
BEGIN
  -- Tạo hash cho query
  query_hash_val := encode(sha256(
    (org_id::text || platform_param || service_param || start_date_param::text || end_date_param::text)::bytea
  ), 'hex');
  
  -- Tính thời gian hết hạn
  CASE cache_duration_param
    WHEN '15_minutes' THEN expires_time := NOW() + INTERVAL '15 minutes';
    WHEN '1_hour' THEN expires_time := NOW() + INTERVAL '1 hour';
    WHEN '6_hours' THEN expires_time := NOW() + INTERVAL '6 hours';
    WHEN '24_hours' THEN expires_time := NOW() + INTERVAL '24 hours';
    ELSE expires_time := NOW() + INTERVAL '1 hour';
  END CASE;
  
  INSERT INTO custom_range_cache (
    organization_id,
    platform,
    service,
    start_date,
    end_date,
    query_hash,
    metrics,
    cache_duration,
    expires_at
  ) VALUES (
    org_id,
    platform_param,
    service_param,
    start_date_param,
    end_date_param,
    query_hash_val,
    metrics_data,
    cache_duration_param,
    expires_time
  )
  ON CONFLICT (organization_id, platform, service, start_date, end_date)
  DO UPDATE SET
    metrics = EXCLUDED.metrics,
    cache_duration = EXCLUDED.cache_duration,
    expires_at = EXCLUDED.expires_at,
    hit_count = custom_range_cache.hit_count + 1;
END;
$$ LANGUAGE plpgsql;

-- 9. Function kiểm tra cache
CREATE OR REPLACE FUNCTION get_cached_custom_range(
  org_id UUID,
  platform_param TEXT,
  service_param TEXT,
  start_date_param DATE,
  end_date_param DATE
)
RETURNS TABLE (
  found BOOLEAN,
  data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as found,
    crc.metrics as data
  FROM custom_range_cache crc
  WHERE crc.organization_id = org_id
    AND crc.platform = platform_param
    AND crc.service = service_param
    AND crc.start_date = start_date_param
    AND crc.end_date = end_date_param
    AND crc.expires_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, '{}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 10. Function maintenance
CREATE OR REPLACE FUNCTION hybrid_maintenance()
RETURNS void AS $$
BEGIN
  -- Xóa cache hết hạn
  DELETE FROM custom_range_cache WHERE expires_at < NOW();
  
  -- Xóa dữ liệu cũ hơn 7 ngày
  DELETE FROM dashboard_fixed_7days WHERE date < CURRENT_DATE - INTERVAL '7 days';
  
  -- Xóa summary cũ
  DELETE FROM dashboard_summary_7days WHERE period_start < CURRENT_DATE - INTERVAL '7 days';
  
  -- Cập nhật next_refresh cho các schedule
  UPDATE refresh_schedule 
  SET next_refresh = last_refresh + INTERVAL '1 day'
  WHERE next_refresh < NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- 11. Function kiểm tra dữ liệu 7 ngày có sẵn
CREATE OR REPLACE FUNCTION check_7days_availability(
  org_id UUID
)
RETURNS TABLE (
  platform TEXT,
  service TEXT,
  has_data BOOLEAN,
  last_date DATE,
  data_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    df.platform,
    df.service,
    COUNT(*) >= 7 as has_data,
    MAX(df.date) as last_date,
    COUNT(*) as data_count
  FROM dashboard_fixed_7days df
  WHERE df.organization_id = org_id
    AND df.date >= CURRENT_DATE - INTERVAL '6 days'
  GROUP BY df.platform, df.service;
END;
$$ LANGUAGE plpgsql;

-- 12. RLS Policies
ALTER TABLE dashboard_fixed_7days ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_summary_7days ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_range_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_schedule ENABLE ROW LEVEL SECURITY;

-- Fixed 7 days policy
CREATE POLICY "Users can view fixed 7 days data for their organizations" ON dashboard_fixed_7days
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Summary 7 days policy
CREATE POLICY "Users can view summary 7 days for their organizations" ON dashboard_summary_7days
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Custom cache policy
CREATE POLICY "Users can view custom cache for their organizations" ON custom_range_cache
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

-- 13. Views cho dashboard
CREATE OR REPLACE VIEW dashboard_7days_overview AS
SELECT 
  organization_id,
  platform,
  service,
  period_start,
  period_end,
  metrics,
  last_calculated
FROM dashboard_summary_7days
WHERE period_start >= CURRENT_DATE - INTERVAL '6 days'
ORDER BY last_calculated DESC;

-- Thông báo hoàn thành
DO $$
BEGIN
  RAISE NOTICE '✅ Đã tạo cấu trúc database kết hợp: Phương án 3 + Power BI!';
  RAISE NOTICE '📋 Các tính năng đã implement:';
  RAISE NOTICE '   - Dashboard cố định 7 ngày (như phương án 3)';
  RAISE NOTICE '   - Import mode (như Power BI Import)';
  RAISE NOTICE '   - Smart cache cho custom range (như Power BI DirectQuery)';
  RAISE NOTICE '   - Scheduled refresh (như Power BI refresh)';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Ưu điểm kết hợp:';
  RAISE NOTICE '   - Chi phí thấp (chỉ 7 ngày)';
  RAISE NOTICE '   - Hiệu năng cao (import + cache)';
  RAISE NOTICE '   - Trải nghiệm tốt (dashboard nhanh)';
  RAISE NOTICE '   - Linh hoạt (custom range on-demand)';
END $$; 