# DATABASE IMPROVEMENTS PLAN

## 🎯 Mục tiêu
Mở rộng database từ 90% lên 95% hoàn thành, thêm các bảng cho data aggregation, AI insights và real-time analytics.

## 📋 Các vấn đề cần sửa

### **1. Thiếu bảng cho Data Aggregation (Ưu tiên cao)**

#### 1.1 Bảng Hourly Aggregates
```sql
-- scripts/setup-hourly-aggregates.sql
CREATE TABLE IF NOT EXISTS hourly_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'google_analytics', 'meta_ads', 'woocommerce'
    metric VARCHAR(100) NOT NULL, -- 'sessions', 'revenue', 'conversions'
    value DECIMAL(15,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes cho performance
CREATE INDEX idx_hourly_aggregates_org_time ON hourly_aggregates(organization_id, timestamp);
CREATE INDEX idx_hourly_aggregates_channel_metric ON hourly_aggregates(channel, metric);
CREATE INDEX idx_hourly_aggregates_timestamp ON hourly_aggregates(timestamp);

-- Partitioning theo thời gian (cho dữ liệu lớn)
CREATE TABLE hourly_aggregates_2024 PARTITION OF hourly_aggregates
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

#### 1.2 Bảng Daily Aggregates
```sql
-- scripts/setup-daily-aggregates.sql
CREATE TABLE IF NOT EXISTS daily_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_daily_aggregates_org_date ON daily_aggregates(organization_id, date);
CREATE INDEX idx_daily_aggregates_channel_metric ON daily_aggregates(channel, metric);
CREATE INDEX idx_daily_aggregates_date ON daily_aggregates(date);

-- Partitioning
CREATE TABLE daily_aggregates_2024 PARTITION OF daily_aggregates
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

#### 1.3 Bảng Raw Data Backup
```sql
-- scripts/setup-raw-data-backup.sql
CREATE TABLE IF NOT EXISTS raw_data_backup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- 'google_analytics', 'meta_ads', 'woocommerce'
    raw_data JSONB NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_raw_data_backup_org_source ON raw_data_backup(organization_id, source);
CREATE INDEX idx_raw_data_backup_fetched ON raw_data_backup(fetched_at);
CREATE INDEX idx_raw_data_backup_processed ON raw_data_backup(processed);
```

### **2. Thiếu bảng cho AI Insights (Ưu tiên cao)**

#### 2.1 Bảng AI Insights
```sql
-- scripts/setup-ai-insights.sql
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- 'anomaly', 'recommendation', 'trend', 'opportunity'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    confidence_score DECIMAL(3,2) DEFAULT 0.0, -- 0.00 to 1.00
    data_points JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    is_actionable BOOLEAN DEFAULT TRUE,
    is_read BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_insights_org_type ON ai_insights(organization_id, insight_type);
CREATE INDEX idx_ai_insights_severity ON ai_insights(severity);
CREATE INDEX idx_ai_insights_created ON ai_insights(created_at);
CREATE INDEX idx_ai_insights_unread ON ai_insights(organization_id, is_read) WHERE is_read = FALSE;
```

#### 2.2 Bảng Performance Alerts
```sql
-- scripts/setup-performance-alerts.sql
CREATE TABLE IF NOT EXISTS performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'threshold_breach', 'anomaly_detected', 'goal_at_risk'
    channel VARCHAR(50) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    threshold_value DECIMAL(15,2) NOT NULL,
    threshold_type VARCHAR(20) NOT NULL, -- 'above', 'below', 'percentage_change'
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_performance_alerts_org_active ON performance_alerts(organization_id, is_active);
CREATE INDEX idx_performance_alerts_type ON performance_alerts(alert_type);
CREATE INDEX idx_performance_alerts_created ON performance_alerts(created_at);
```

### **3. Thiếu bảng cho Real-time Analytics (Ưu tiên trung bình)**

#### 3.1 Bảng Real-time Sessions
```sql
-- scripts/setup-realtime-sessions.sql
CREATE TABLE IF NOT EXISTS realtime_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    page_url TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),
    os VARCHAR(50),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_realtime_sessions_org_active ON realtime_sessions(organization_id, is_active);
CREATE INDEX idx_realtime_sessions_started ON realtime_sessions(started_at);
CREATE INDEX idx_realtime_sessions_last_activity ON realtime_sessions(last_activity);

-- TTL index để tự động xóa sessions cũ
CREATE INDEX idx_realtime_sessions_ttl ON realtime_sessions(last_activity) 
WHERE last_activity < NOW() - INTERVAL '24 hours';
```

#### 3.2 Bảng Event Tracking
```sql
-- scripts/setup-event-tracking.sql
CREATE TABLE IF NOT EXISTS event_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    event_action VARCHAR(50),
    event_label VARCHAR(100),
    event_value DECIMAL(15,2),
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_event_tracking_org_event ON event_tracking(organization_id, event_name);
CREATE INDEX idx_event_tracking_session ON event_tracking(session_id);
CREATE INDEX idx_event_tracking_timestamp ON event_tracking(timestamp);
```

### **4. Thiếu bảng cho Data Sources Management (Ưu tiên cao)**

#### 4.1 Bảng Data Sources
```sql
-- scripts/setup-data-sources.sql
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'google_analytics', 'meta_ads', 'woocommerce', 'shopify'
    source_name VARCHAR(255) NOT NULL,
    connection_config JSONB NOT NULL, -- OAuth tokens, API keys, etc.
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency_minutes INTEGER DEFAULT 15,
    sync_status VARCHAR(20) DEFAULT 'idle', -- 'idle', 'running', 'failed', 'success'
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_data_sources_org_type ON data_sources(organization_id, source_type);
CREATE INDEX idx_data_sources_active ON data_sources(is_active);
CREATE INDEX idx_data_sources_sync_status ON data_sources(sync_status);
```

#### 4.2 Bảng Sync Logs
```sql
-- scripts/setup-sync-logs.sql
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'backfill'
    status VARCHAR(20) NOT NULL, -- 'started', 'completed', 'failed'
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_sync_logs_source_status ON sync_logs(data_source_id, status);
CREATE INDEX idx_sync_logs_started ON sync_logs(started_at);
```

### **5. Thiếu bảng cho Advanced Analytics (Ưu tiên trung bình)**

#### 5.1 Bảng Cohort Analysis
```sql
-- scripts/setup-cohort-analysis.sql
CREATE TABLE IF NOT EXISTS cohort_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    cohort_date DATE NOT NULL,
    cohort_type VARCHAR(50) NOT NULL, -- 'signup', 'first_purchase', 'first_visit'
    period_number INTEGER NOT NULL, -- 0, 1, 2, 3... (weeks/months)
    period_type VARCHAR(20) NOT NULL, -- 'week', 'month'
    cohort_size INTEGER NOT NULL,
    active_users INTEGER NOT NULL,
    retention_rate DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    revenue DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cohort_analysis_org_date ON cohort_analysis(organization_id, cohort_date);
CREATE INDEX idx_cohort_analysis_type ON cohort_analysis(cohort_type);
```

#### 5.2 Bảng Funnel Analysis
```sql
-- scripts/setup-funnel-analysis.sql
CREATE TABLE IF NOT EXISTS funnel_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    funnel_name VARCHAR(100) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    date DATE NOT NULL,
    visitors INTEGER NOT NULL,
    conversions INTEGER NOT NULL,
    conversion_rate DECIMAL(5,4) NOT NULL,
    drop_off_rate DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_funnel_analysis_org_funnel ON funnel_analysis(organization_id, funnel_name);
CREATE INDEX idx_funnel_analysis_date ON funnel_analysis(date);
```

### **6. RLS Policies cho bảng mới**

#### 6.1 Hourly Aggregates Policies
```sql
-- scripts/setup-hourly-aggregates-policies.sql
-- Users can view hourly aggregates for their organizations
CREATE POLICY "Users can view hourly aggregates for their organizations" ON hourly_aggregates
FOR SELECT USING (
    organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid()
    )
);

-- Only system can insert/update hourly aggregates
CREATE POLICY "System can manage hourly aggregates" ON hourly_aggregates
FOR ALL USING (auth.uid() IS NULL);
```

#### 6.2 AI Insights Policies
```sql
-- scripts/setup-ai-insights-policies.sql
-- Users can view AI insights for their organizations
CREATE POLICY "Users can view AI insights for their organizations" ON ai_insights
FOR SELECT USING (
    organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid()
    )
);

-- Users can update read status of AI insights
CREATE POLICY "Users can update AI insights read status" ON ai_insights
FOR UPDATE USING (
    organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid()
    )
) WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid()
    )
);
```

### **7. Functions cho Data Management**

#### 7.1 Data Cleanup Functions
```sql
-- scripts/setup-data-cleanup-functions.sql
-- Cleanup old hourly aggregates (keep only current day)
CREATE OR REPLACE FUNCTION cleanup_old_hourly_aggregates()
RETURNS void AS $$
BEGIN
    DELETE FROM hourly_aggregates 
    WHERE timestamp < CURRENT_DATE;
    
    RAISE NOTICE 'Cleaned up old hourly aggregates';
END;
$$ LANGUAGE plpgsql;

-- Cleanup old daily aggregates (keep only 365 days)
CREATE OR REPLACE FUNCTION cleanup_old_daily_aggregates()
RETURNS void AS $$
BEGIN
    DELETE FROM daily_aggregates 
    WHERE date < CURRENT_DATE - INTERVAL '365 days';
    
    RAISE NOTICE 'Cleaned up old daily aggregates';
END;
$$ LANGUAGE plpgsql;

-- Cleanup old raw data backup (keep only 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_raw_data_backup()
RETURNS void AS $$
BEGIN
    DELETE FROM raw_data_backup 
    WHERE fetched_at < CURRENT_DATE - INTERVAL '30 days';
    
    RAISE NOTICE 'Cleaned up old raw data backup';
END;
$$ LANGUAGE plpgsql;
```

#### 7.2 Data Aggregation Functions
```sql
-- scripts/setup-aggregation-functions.sql
-- Aggregate hourly data from raw data
CREATE OR REPLACE FUNCTION aggregate_hourly_data(org_id UUID)
RETURNS void AS $$
BEGIN
    -- Logic để tổng hợp dữ liệu theo giờ
    INSERT INTO hourly_aggregates (organization_id, channel, metric, value, timestamp)
    SELECT 
        organization_id,
        source as channel,
        metric,
        AVG(value) as value,
        date_trunc('hour', fetched_at) as timestamp
    FROM raw_data_backup
    WHERE organization_id = org_id
    AND fetched_at >= CURRENT_DATE
    GROUP BY organization_id, source, metric, date_trunc('hour', fetched_at)
    ON CONFLICT (organization_id, channel, metric, timestamp) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Aggregate daily data from hourly data
CREATE OR REPLACE FUNCTION aggregate_daily_data(org_id UUID)
RETURNS void AS $$
BEGIN
    -- Logic để tổng hợp dữ liệu theo ngày
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
```

## 🚀 Triển khai theo thứ tự ưu tiên

### **Tuần 1: Core Data Tables**
1. Tạo bảng hourly_aggregates và daily_aggregates
2. Tạo bảng raw_data_backup
3. Setup indexes và partitioning
4. Test data insertion

### **Tuần 2: AI Insights Tables**
1. Tạo bảng ai_insights và performance_alerts
2. Setup RLS policies
3. Test access control
4. Setup cleanup functions

### **Tuần 3: Real-time Analytics**
1. Tạo bảng realtime_sessions và event_tracking
2. Setup TTL indexes
3. Test real-time data insertion
4. Setup monitoring

### **Tuần 4: Advanced Analytics**
1. Tạo bảng cohort_analysis và funnel_analysis
2. Setup data sources management
3. Test aggregation functions
4. Performance optimization

## 📊 Metrics cải thiện

### **Data Management**
- Data retention: Automated cleanup policies
- Data aggregation: Hourly/daily automatic aggregation
- Performance: Optimized indexes và partitioning
- Scalability: Support 1000+ organizations

### **Analytics Capabilities**
- Real-time tracking: Live session monitoring
- AI insights: Automated anomaly detection
- Cohort analysis: User behavior tracking
- Funnel analysis: Conversion path optimization

### **Data Quality**
- Data validation: Automated checks
- Error handling: Comprehensive logging
- Backup strategy: Raw data preservation
- Recovery: Point-in-time restoration

## 💰 Chi phí ước tính

### **Database Storage**
- Hourly aggregates: ~10GB/tháng cho 1000 orgs
- Daily aggregates: ~1GB/tháng cho 1000 orgs
- AI insights: ~100MB/tháng cho 1000 orgs
- **Tổng: ~11GB/tháng**

### **Supabase Costs**
- Storage: $25/tháng (25GB)
- Compute: $25/tháng (Pro plan)
- **Tổng: $50/tháng**

## 🎯 Kết quả mong đợi

### **Sau khi hoàn thành Database Improvements:**
- ✅ Automated data pipeline với hourly/daily aggregation
- ✅ AI-powered insights và alerts
- ✅ Real-time analytics tracking
- ✅ Advanced cohort và funnel analysis
- ✅ Scalable multi-tenant architecture
- ✅ Comprehensive data management 