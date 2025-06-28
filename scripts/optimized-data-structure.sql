-- Cấu trúc database tối ưu cho MVP
-- Kết hợp dashboard cố định + on-demand API fetch

-- 1. Bảng lưu dữ liệu tổng hợp cho dashboard cố định (7 ngày)
CREATE TABLE IF NOT EXISTS dashboard_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  period_type TEXT NOT NULL DEFAULT '7_days', -- '7_days', '30_days', 'custom'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics JSONB NOT NULL, -- Tổng hợp: total_sessions, total_revenue, etc.
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, period_type, period_start)
);

-- 2. Bảng cache cho custom date range
CREATE TABLE IF NOT EXISTS custom_range_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  metrics JSONB NOT NULL,
  cache_duration TEXT NOT NULL DEFAULT '1_hour', -- '1_hour', '6_hours', '24_hours'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, start_date, end_date)
);

-- 3. Bảng lưu raw data cho 7 ngày gần nhất (tối ưu)
CREATE TABLE IF NOT EXISTS analytics_data_7days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  metrics JSONB NOT NULL,
  dimensions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, date)
);

-- 4. Index tối ưu
CREATE INDEX IF NOT EXISTS idx_dashboard_summary_org_period ON dashboard_summary(organization_id, period_type, period_start);
CREATE INDEX IF NOT EXISTS idx_custom_cache_org_dates ON custom_range_cache(organization_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_custom_cache_expires ON custom_range_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_analytics_7days_org_date ON analytics_data_7days(organization_id, date);

-- 5. Function tự động cập nhật dashboard summary hàng ngày
CREATE OR REPLACE FUNCTION update_dashboard_summary()
RETURNS void AS $$
BEGIN
  -- Cập nhật tổng hợp 7 ngày gần nhất
  INSERT INTO dashboard_summary (
    organization_id,
    platform,
    service,
    period_type,
    period_start,
    period_end,
    metrics
  )
  SELECT 
    organization_id,
    platform,
    service,
    '7_days' as period_type,
    CURRENT_DATE - INTERVAL '6 days' as period_start,
    CURRENT_DATE as period_end,
    jsonb_build_object(
      'total_sessions', SUM((metrics->>'sessions')::numeric),
      'total_users', SUM((metrics->>'users')::numeric),
      'total_pageviews', SUM((metrics->>'pageviews')::numeric),
      'total_revenue', SUM((metrics->>'revenue')::numeric),
      'total_conversions', SUM((metrics->>'conversions')::numeric),
      'avg_bounce_rate', AVG((metrics->>'bounceRate')::numeric),
      'avg_session_duration', AVG((metrics->>'avgSessionDuration')::numeric)
    ) as metrics
  FROM analytics_data_7days
  WHERE date >= CURRENT_DATE - INTERVAL '6 days'
  GROUP BY organization_id, platform, service
  ON CONFLICT (organization_id, platform, service, period_type, period_start)
  DO UPDATE SET
    metrics = EXCLUDED.metrics,
    last_updated = NOW();
    
  -- Xóa cache cũ
  DELETE FROM custom_range_cache WHERE expires_at < NOW();
  
  -- Xóa dữ liệu cũ hơn 7 ngày
  DELETE FROM analytics_data_7days WHERE date < CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 6. Function kiểm tra cache
CREATE OR REPLACE FUNCTION get_cached_data(
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
  
  -- Nếu không tìm thấy
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, '{}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Function lưu cache
CREATE OR REPLACE FUNCTION save_custom_cache(
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
BEGIN
  -- Tính thời gian hết hạn
  CASE cache_duration_param
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
    metrics,
    cache_duration,
    expires_at
  ) VALUES (
    org_id,
    platform_param,
    service_param,
    start_date_param,
    end_date_param,
    metrics_data,
    cache_duration_param,
    expires_time
  )
  ON CONFLICT (organization_id, platform, service, start_date, end_date)
  DO UPDATE SET
    metrics = EXCLUDED.metrics,
    cache_duration = EXCLUDED.cache_duration,
    expires_at = EXCLUDED.expires_at;
END;
$$ LANGUAGE plpgsql;

-- 8. RLS Policies
ALTER TABLE dashboard_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_range_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data_7days ENABLE ROW LEVEL SECURITY;

-- Dashboard summary policy
CREATE POLICY "Users can view dashboard summary for their organizations" ON dashboard_summary
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

-- Analytics data policy
CREATE POLICY "Users can view analytics data for their organizations" ON analytics_data_7days
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- 9. Cron job để cập nhật hàng ngày (2h sáng)
-- SELECT cron.schedule('daily-dashboard-update', '0 2 * * *', 'SELECT update_dashboard_summary();');

-- 10. View để dễ truy vấn dashboard
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT 
  organization_id,
  platform,
  service,
  period_type,
  period_start,
  period_end,
  metrics,
  last_updated
FROM dashboard_summary
WHERE period_type = '7_days'
ORDER BY last_updated DESC;

-- Thông báo hoàn thành
DO $$
BEGIN
  RAISE NOTICE '✅ Đã tạo cấu trúc database tối ưu cho MVP!';
  RAISE NOTICE '📋 Các bảng đã tạo:';
  RAISE NOTICE '   - dashboard_summary (dữ liệu tổng hợp 7 ngày)';
  RAISE NOTICE '   - custom_range_cache (cache cho date range tùy chỉnh)';
  RAISE NOTICE '   - analytics_data_7days (raw data 7 ngày)';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Chi phí ước tính:';
  RAISE NOTICE '   - 10 khách × 4 nền tảng × 4 dịch vụ × 7 ngày = 1,120 bản ghi';
  RAISE NOTICE '   - Dung lượng: ~1.1MB (rất tiết kiệm!)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Trải nghiệm người dùng:';
  RAISE NOTICE '   - Dashboard cố định: Load nhanh (<1s)';
  RAISE NOTICE '   - Custom range: Cache thông minh, API on-demand';
END $$; 