-- Setup Retention Policy cho Digital Performance Optimizer
-- Chạy script này để thiết lập các function và policy quản lý dữ liệu

-- 1. Tạo function để xóa dữ liệu cũ tự động
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  -- Xóa dữ liệu analytics cũ hơn 90 ngày
  DELETE FROM analytics_data 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Xóa audit logs cũ hơn 1 năm
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '365 days';
  
  -- Log việc cleanup
  INSERT INTO audit_logs (organization_id, action, resource, details)
  VALUES (
    NULL, 
    'data_cleanup', 
    'analytics_data', 
    jsonb_build_object(
      'cleaned_at', NOW(),
      'policy', '90_days_analytics_365_days_audit'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Tạo function để tạo dữ liệu tổng hợp
CREATE OR REPLACE FUNCTION aggregate_analytics_data(
  platform_param text,
  service_param text,
  aggregation_type text DEFAULT 'monthly'
)
RETURNS void AS $$
BEGIN
  -- Tạo dữ liệu tổng hợp theo tháng
  IF aggregation_type = 'monthly' THEN
    INSERT INTO analytics_data_aggregated (
      organization_id,
      platform,
      service,
      metrics,
      dimensions,
      aggregation_period,
      period_start,
      period_end
    )
    SELECT 
      organization_id,
      platform,
      service,
      jsonb_build_object(
        'total_sessions', SUM((metrics->>'sessions')::numeric),
        'total_users', SUM((metrics->>'users')::numeric),
        'total_pageviews', SUM((metrics->>'pageviews')::numeric),
        'total_revenue', SUM((metrics->>'revenue')::numeric),
        'avg_bounce_rate', AVG((metrics->>'bounceRate')::numeric),
        'avg_session_duration', AVG((metrics->>'avgSessionDuration')::numeric)
      ) as metrics,
      dimensions,
      'monthly' as aggregation_period,
      DATE_TRUNC('month', created_at) as period_start,
      DATE_TRUNC('month', created_at) + INTERVAL '1 month' - INTERVAL '1 day' as period_end
    FROM analytics_data
    WHERE platform = platform_param 
      AND service = service_param
      AND created_at >= NOW() - INTERVAL '90 days'
    GROUP BY organization_id, platform, service, dimensions, DATE_TRUNC('month', created_at)
    ON CONFLICT (organization_id, platform, service, aggregation_period, period_start)
    DO UPDATE SET
      metrics = EXCLUDED.metrics,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Tạo bảng cho dữ liệu tổng hợp (nếu chưa có)
CREATE TABLE IF NOT EXISTS analytics_data_aggregated (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  service TEXT NOT NULL,
  metrics JSONB NOT NULL,
  dimensions JSONB,
  aggregation_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, platform, service, aggregation_period, period_start)
);

-- 4. Tạo index để tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_analytics_data_created_at ON analytics_data(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_data_platform_service ON analytics_data(platform, service);
CREATE INDEX IF NOT EXISTS idx_analytics_data_org_platform ON analytics_data(organization_id, platform);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_aggregated_period ON analytics_data_aggregated(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_analytics_aggregated_org_platform ON analytics_data_aggregated(organization_id, platform, service);

-- 5. Tạo function để kiểm tra dung lượng database
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
  table_name text,
  record_count bigint,
  estimated_size_mb numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'analytics_data'::text as table_name,
    COUNT(*) as record_count,
    ROUND(COUNT(*) * 1.0 / 1024, 2) as estimated_size_mb
  FROM analytics_data
  UNION ALL
  SELECT 
    'audit_logs'::text,
    COUNT(*),
    ROUND(COUNT(*) * 0.5 / 1024, 2)
  FROM audit_logs
  UNION ALL
  SELECT 
    'analytics_data_aggregated'::text,
    COUNT(*),
    ROUND(COUNT(*) * 0.8 / 1024, 2)
  FROM analytics_data_aggregated;
END;
$$ LANGUAGE plpgsql;

-- 6. Tạo function để backup dữ liệu cũ trước khi xóa
CREATE OR REPLACE FUNCTION backup_old_data_before_cleanup()
RETURNS void AS $$
BEGIN
  -- Tạo backup table cho dữ liệu cũ
  CREATE TABLE IF NOT EXISTS analytics_data_backup_90_days AS
  SELECT * FROM analytics_data 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Tạo backup cho audit logs cũ
  CREATE TABLE IF NOT EXISTS audit_logs_backup_1_year AS
  SELECT * FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '365 days';
  
  -- Log việc backup
  INSERT INTO audit_logs (organization_id, action, resource, details)
  VALUES (
    NULL, 
    'data_backup', 
    'analytics_data', 
    jsonb_build_object(
      'backup_created_at', NOW(),
      'backup_tables', ARRAY['analytics_data_backup_90_days', 'audit_logs_backup_1_year']
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Tạo cron job để tự động cleanup (nếu có pg_cron extension)
-- Chạy cleanup hàng tuần vào 2h sáng Chủ nhật
-- SELECT cron.schedule('weekly-cleanup', '0 2 * * 0', 'SELECT cleanup_old_analytics_data();');

-- 8. Tạo RLS policy cho bảng aggregated
ALTER TABLE analytics_data_aggregated ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view aggregated data for their organizations" ON analytics_data_aggregated
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- 9. Tạo view để dễ dàng truy vấn dữ liệu tổng hợp
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  organization_id,
  platform,
  service,
  aggregation_period,
  period_start,
  period_end,
  metrics,
  dimensions
FROM analytics_data_aggregated
ORDER BY period_start DESC;

-- 10. Tạo function để migrate dữ liệu cũ sang aggregated
CREATE OR REPLACE FUNCTION migrate_old_data_to_aggregated()
RETURNS void AS $$
BEGIN
  -- Migrate dữ liệu cũ hơn 90 ngày sang aggregated
  PERFORM aggregate_analytics_data('google', 'ga4', 'monthly');
  PERFORM aggregate_analytics_data('google', 'ads', 'monthly');
  PERFORM aggregate_analytics_data('google', 'search-console', 'monthly');
  PERFORM aggregate_analytics_data('google', 'merchant-center', 'monthly');
  PERFORM aggregate_analytics_data('meta', 'ads', 'monthly');
  PERFORM aggregate_analytics_data('tiktok', 'ads', 'monthly');
  PERFORM aggregate_analytics_data('woocommerce', 'store', 'monthly');
  
  -- Log migration
  INSERT INTO audit_logs (organization_id, action, resource, details)
  VALUES (
    NULL, 
    'data_migration', 
    'analytics_data', 
    jsonb_build_object(
      'migrated_at', NOW(),
      'migration_type', 'old_to_aggregated'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 11. Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analytics_data_updated_at
  BEFORE UPDATE ON analytics_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_aggregated_updated_at
  BEFORE UPDATE ON analytics_data_aggregated
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 12. Tạo function để kiểm tra health của database
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS TABLE (
  check_name text,
  status text,
  details text
) AS $$
BEGIN
  -- Kiểm tra số lượng bản ghi
  RETURN QUERY
  SELECT 
    'Record Count'::text,
    CASE 
      WHEN COUNT(*) < 1000 THEN 'OK'
      WHEN COUNT(*) < 10000 THEN 'WARNING'
      ELSE 'CRITICAL'
    END::text,
    'Total records: ' || COUNT(*)::text
  FROM analytics_data
  UNION ALL
  SELECT 
    'Old Data Check'::text,
    CASE 
      WHEN COUNT(*) = 0 THEN 'OK'
      ELSE 'WARNING'
    END::text,
    'Old records (>90 days): ' || COUNT(*)::text
  FROM analytics_data 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Thông báo hoàn thành
DO $$
BEGIN
  RAISE NOTICE '✅ Đã thiết lập retention policy thành công!';
  RAISE NOTICE '📋 Các function đã tạo:';
  RAISE NOTICE '   - cleanup_old_analytics_data()';
  RAISE NOTICE '   - aggregate_analytics_data()';
  RAISE NOTICE '   - get_database_stats()';
  RAISE NOTICE '   - backup_old_data_before_cleanup()';
  RAISE NOTICE '   - migrate_old_data_to_aggregated()';
  RAISE NOTICE '   - check_database_health()';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Sử dụng:';
  RAISE NOTICE '   - SELECT cleanup_old_analytics_data(); -- Xóa dữ liệu cũ';
  RAISE NOTICE '   - SELECT * FROM get_database_stats(); -- Xem thống kê';
  RAISE NOTICE '   - SELECT * FROM check_database_health(); -- Kiểm tra health';
END $$; 