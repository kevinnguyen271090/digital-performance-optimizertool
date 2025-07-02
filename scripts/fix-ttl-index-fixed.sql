-- scripts/fix-ttl-index-fixed.sql
-- Sửa lỗi TTL index và thêm các indexes còn thiếu

-- 1. Xóa TTL index có lỗi (nếu đã tạo)
DROP INDEX IF EXISTS idx_realtime_sessions_ttl;

-- 2. Tạo lại các indexes cơ bản cho realtime_sessions
CREATE INDEX IF NOT EXISTS idx_realtime_sessions_org_active ON realtime_sessions(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_realtime_sessions_started ON realtime_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_realtime_sessions_last_activity ON realtime_sessions(last_activity);

-- 3. Thêm indexes cho các bảng khác còn thiếu
-- Indexes cho raw_data_backup
CREATE INDEX IF NOT EXISTS idx_raw_data_backup_org_source ON raw_data_backup(organization_id, source);
CREATE INDEX IF NOT EXISTS idx_raw_data_backup_fetched ON raw_data_backup(fetched_at);
CREATE INDEX IF NOT EXISTS idx_raw_data_backup_processed ON raw_data_backup(processed);

-- Indexes cho performance_alerts
CREATE INDEX IF NOT EXISTS idx_performance_alerts_org_active ON performance_alerts(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_type ON performance_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_created ON performance_alerts(created_at);

-- Indexes cho event_tracking
CREATE INDEX IF NOT EXISTS idx_event_tracking_org_event ON event_tracking(organization_id, event_name);
CREATE INDEX IF NOT EXISTS idx_event_tracking_session ON event_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_event_tracking_timestamp ON event_tracking(timestamp);

-- Indexes cho cohort_analysis
CREATE INDEX IF NOT EXISTS idx_cohort_analysis_org_date ON cohort_analysis(organization_id, cohort_date);
CREATE INDEX IF NOT EXISTS idx_cohort_analysis_type ON cohort_analysis(cohort_type);

-- Indexes cho funnel_analysis
CREATE INDEX IF NOT EXISTS idx_funnel_analysis_org_funnel ON funnel_analysis(organization_id, funnel_name);
CREATE INDEX IF NOT EXISTS idx_funnel_analysis_date ON funnel_analysis(date);

-- 4. Xóa functions cũ trước khi tạo lại
DROP FUNCTION IF EXISTS cleanup_old_sessions();
DROP FUNCTION IF EXISTS cleanup_all_old_data();
DROP FUNCTION IF EXISTS aggregate_hourly_from_analytics(UUID);
DROP FUNCTION IF EXISTS aggregate_daily_from_hourly(UUID);
DROP FUNCTION IF EXISTS generate_ai_insights(UUID);
DROP FUNCTION IF EXISTS check_performance_thresholds(UUID);
DROP FUNCTION IF EXISTS run_scheduled_tasks();

-- 5. Tạo function để cleanup sessions cũ (thay vì dùng TTL index)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM realtime_sessions 
    WHERE last_activity < NOW() - INTERVAL '24 hours';
    
    RAISE NOTICE 'Cleaned up old sessions';
END;
$$ LANGUAGE plpgsql;

-- 6. Tạo function tổng hợp để cleanup tất cả dữ liệu cũ
CREATE OR REPLACE FUNCTION cleanup_all_old_data()
RETURNS void AS $$
BEGIN
    -- Cleanup old sessions
    DELETE FROM realtime_sessions 
    WHERE last_activity < NOW() - INTERVAL '24 hours';
    
    -- Cleanup old hourly aggregates
    DELETE FROM hourly_aggregates 
    WHERE timestamp < CURRENT_DATE;
    
    -- Cleanup old daily aggregates
    DELETE FROM daily_aggregates 
    WHERE date < CURRENT_DATE - INTERVAL '365 days';
    
    -- Cleanup old raw data backup
    DELETE FROM raw_data_backup 
    WHERE fetched_at < CURRENT_DATE - INTERVAL '30 days';
    
    -- Cleanup old AI insights (giữ 90 ngày)
    DELETE FROM ai_insights 
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';
    
    -- Cleanup old performance alerts (giữ 30 ngày)
    DELETE FROM performance_alerts 
    WHERE created_at < CURRENT_DATE - INTERVAL '30 days';
    
    RAISE NOTICE 'Cleaned up all old data';
END;
$$ LANGUAGE plpgsql;

-- 7. Tạo function để tổng hợp dữ liệu từ analytics_data sang hourly_aggregates
CREATE OR REPLACE FUNCTION aggregate_hourly_from_analytics(org_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO hourly_aggregates (organization_id, channel, metric, value, timestamp)
    SELECT 
        organization_id,
        platform as channel,
        (jsonb_object_keys(metrics))::text as metric,
        AVG((metrics->>(jsonb_object_keys(metrics)))::decimal) as value,
        date_trunc('hour', timestamp) as timestamp
    FROM analytics_data
    WHERE organization_id = org_id
    AND timestamp >= CURRENT_DATE
    GROUP BY organization_id, platform, jsonb_object_keys(metrics), date_trunc('hour', timestamp)
    ON CONFLICT (organization_id, channel, metric, timestamp) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 8. Tạo function để tổng hợp từ hourly sang daily
CREATE OR REPLACE FUNCTION aggregate_daily_from_hourly(org_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO daily_aggregates (organization_id, channel, metric, value, date)
    SELECT 
        organization_id,
        channel,
        metric,
        AVG(value) as value,
        date_trunc('day', timestamp)::date as date
    FROM hourly_aggregates
    WHERE organization_id = org_id
    AND timestamp >= CURRENT_DATE - INTERVAL '1 day'
    GROUP BY organization_id, channel, metric, date_trunc('day', timestamp)
    ON CONFLICT (organization_id, channel, metric, date) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 9. Xóa trigger cũ trước khi tạo lại
DROP TRIGGER IF EXISTS update_hourly_aggregates_updated_at ON hourly_aggregates;
DROP TRIGGER IF EXISTS update_daily_aggregates_updated_at ON daily_aggregates;
DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON ai_insights;
DROP TRIGGER IF EXISTS update_performance_alerts_updated_at ON performance_alerts;

-- 10. Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo triggers cho các bảng mới
CREATE TRIGGER update_hourly_aggregates_updated_at 
    BEFORE UPDATE ON hourly_aggregates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_aggregates_updated_at 
    BEFORE UPDATE ON daily_aggregates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at 
    BEFORE UPDATE ON ai_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_alerts_updated_at 
    BEFORE UPDATE ON performance_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Tạo function để generate AI insights
CREATE OR REPLACE FUNCTION generate_ai_insights(org_id UUID)
RETURNS void AS $$
DECLARE
    insight_record RECORD;
BEGIN
    -- Phát hiện bất thường trong dữ liệu
    FOR insight_record IN 
        SELECT 
            'anomaly' as insight_type,
            'Phát hiện bất thường trong ' || channel as title,
            'Metric ' || metric || ' có giá trị ' || value || ' vượt quá ngưỡng bình thường' as description,
            CASE 
                WHEN ABS(value - LAG(value) OVER (PARTITION BY channel, metric ORDER BY timestamp)) > 50 THEN 'high'
                WHEN ABS(value - LAG(value) OVER (PARTITION BY channel, metric ORDER BY timestamp)) > 20 THEN 'medium'
                ELSE 'low'
            END as severity,
            0.8 as confidence_score
        FROM hourly_aggregates
        WHERE organization_id = org_id
        AND timestamp >= NOW() - INTERVAL '24 hours'
        AND ABS(value - LAG(value) OVER (PARTITION BY channel, metric ORDER BY timestamp)) > 20
    LOOP
        INSERT INTO ai_insights (
            organization_id, 
            insight_type, 
            title, 
            description, 
            severity, 
            confidence_score
        ) VALUES (
            org_id,
            insight_record.insight_type,
            insight_record.title,
            insight_record.description,
            insight_record.severity,
            insight_record.confidence_score
        );
    END LOOP;
    
    RAISE NOTICE 'Generated AI insights for organization %', org_id;
END;
$$ LANGUAGE plpgsql;

-- 12. Tạo function để check performance thresholds
CREATE OR REPLACE FUNCTION check_performance_thresholds(org_id UUID)
RETURNS void AS $$
DECLARE
    alert_record RECORD;
BEGIN
    -- Kiểm tra các ngưỡng performance
    FOR alert_record IN 
        SELECT 
            'threshold_breach' as alert_type,
            platform as channel,
            (jsonb_object_keys(metrics))::text as metric,
            (metrics->>(jsonb_object_keys(metrics)))::decimal as current_value,
            100 as threshold_value, -- Có thể điều chỉnh ngưỡng
            'above' as threshold_type,
            'Metric ' || (jsonb_object_keys(metrics))::text || ' vượt ngưỡng ' || (metrics->>(jsonb_object_keys(metrics)))::text as message
        FROM analytics_data
        WHERE organization_id = org_id
        AND timestamp >= NOW() - INTERVAL '1 hour'
        AND (metrics->>(jsonb_object_keys(metrics)))::decimal > 100
    LOOP
        INSERT INTO performance_alerts (
            organization_id,
            alert_type,
            channel,
            metric,
            current_value,
            threshold_value,
            threshold_type,
            message
        ) VALUES (
            org_id,
            alert_record.alert_type,
            alert_record.channel,
            alert_record.metric,
            alert_record.current_value,
            alert_record.threshold_value,
            alert_record.threshold_type,
            alert_record.message
        );
    END LOOP;
    
    RAISE NOTICE 'Checked performance thresholds for organization %', org_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Tạo scheduled function để chạy định kỳ
CREATE OR REPLACE FUNCTION run_scheduled_tasks()
RETURNS void AS $$
DECLARE
    org_record RECORD;
BEGIN
    -- Chạy cho tất cả organizations
    FOR org_record IN SELECT id FROM organizations LOOP
        -- Tổng hợp dữ liệu hourly
        PERFORM aggregate_hourly_from_analytics(org_record.id);
        
        -- Tổng hợp dữ liệu daily (chỉ chạy lúc 00:00)
        IF EXTRACT(hour FROM NOW()) = 0 THEN
            PERFORM aggregate_daily_from_hourly(org_record.id);
        END IF;
        
        -- Generate AI insights
        PERFORM generate_ai_insights(org_record.id);
        
        -- Check performance thresholds
        PERFORM check_performance_thresholds(org_record.id);
    END LOOP;
    
    -- Cleanup old data
    PERFORM cleanup_all_old_data();
    
    RAISE NOTICE 'Completed scheduled tasks at %', NOW();
END;
$$ LANGUAGE plpgsql; 