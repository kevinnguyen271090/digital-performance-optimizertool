# HƯỚNG DẪN PHÂN CHIA DATABASE: SUPABASE vs BIGQUERY

## 🎯 Mục tiêu
Phân chia bảng giữa Supabase (hot data) và BigQuery (cold storage) để tối ưu chi phí và hiệu năng theo kiến trúc hệ thống.

## 📊 PHÂN CHIA THEO KIẾN TRÚC HỆ THỐNG

### **🔥 SUPABASE (Hot Data - Truy cập thường xuyên)**

#### **1. Core Business Tables**
```sql
-- ✅ TẠI SUPABASE - Truy cập thường xuyên
✅ organizations
✅ organization_members  
✅ user_profiles
✅ user_2fa
```

**Lý do**: Quản lý user, organization, authentication - truy cập liên tục.

#### **2. Real-time Analytics Tables**
```sql
-- ✅ TẠI SUPABASE - Real-time data
✅ hourly_aggregates (1 ngày)
✅ daily_aggregates (365 ngày)
✅ realtime_sessions (24 giờ)
✅ event_tracking (30 ngày)
```

**Lý do**: Dashboard real-time, performance monitoring, user tracking.

#### **3. Active Insights Tables**
```sql
-- ✅ TẠI SUPABASE - Active insights
✅ ai_insights (90 ngày)
✅ performance_alerts (30 ngày)
✅ funnel_analysis (365 ngày)
✅ cohort_analysis (365 ngày)
```

**Lý do**: AI insights, alerts, active analytics - cần truy cập nhanh.

#### **4. New Chart Tables**
```sql
-- ✅ TẠI SUPABASE - Chart data
✅ demographics_data (365 ngày)
✅ creative_performance (365 ngày)
✅ competitive_data (365 ngày)
```

**Lý do**: Chart data cho dashboard - cần query nhanh.

### **❄️ BIGQUERY (Cold Storage - Dữ liệu lâu dài)**

#### **1. Historical Data Backup**
```sql
-- ❄️ TẠI BIGQUERY - Historical backup
❄️ raw_data_backup_historical (>365 ngày)
❄️ hourly_aggregates_historical (>1 ngày)
❄️ daily_aggregates_historical (>365 ngày)
❄️ ai_insights_historical (>90 ngày)
```

**Lý do**: Dữ liệu cũ, ít truy cập, chi phí thấp.

#### **2. Deep Analytics Tables**
```sql
-- ❄️ TẠI BIGQUERY - Deep analysis
❄️ long_term_cohort_analysis (>365 ngày)
❄️ historical_funnel_analysis (>365 ngày)
❄️ advanced_analytics_data (>1 năm)
❄️ machine_learning_datasets (>2 năm)
```

**Lý do**: Phân tích sâu, ML training, historical trends.

#### **3. Data Warehouse Tables**
```sql
-- ❄️ TẠI BIGQUERY - Data warehouse
❄️ marketing_data_warehouse
❄️ customer_journey_warehouse
❄️ performance_metrics_warehouse
❄️ competitive_intelligence_warehouse
```

**Lý do**: Data warehouse cho business intelligence.

## 🚀 IMPLEMENTATION STRATEGY

### **Phase 1: MVP (1000 users)**
```sql
-- TẤT CẢ TẠI SUPABASE
✅ organizations
✅ organization_members
✅ user_profiles
✅ hourly_aggregates (1 ngày)
✅ daily_aggregates (365 ngày)
✅ ai_insights (90 ngày)
✅ performance_alerts (30 ngày)
✅ realtime_sessions (24 giờ)
✅ event_tracking (30 ngày)
✅ funnel_analysis (365 ngày)
✅ cohort_analysis (365 ngày)
✅ demographics_data (365 ngày)
✅ creative_performance (365 ngày)
✅ competitive_data (365 ngày)
```

**Chi phí**: ~$25/tháng (Supabase Pro)

### **Phase 2: Scale (10k+ users)**
```sql
-- SUPABASE (Hot Data)
✅ organizations
✅ organization_members
✅ user_profiles
✅ hourly_aggregates (1 ngày)
✅ daily_aggregates (365 ngày)
✅ ai_insights (90 ngày)
✅ performance_alerts (30 ngày)
✅ realtime_sessions (24 giờ)
✅ event_tracking (30 ngày)
✅ funnel_analysis (365 ngày)
✅ cohort_analysis (365 ngày)
✅ demographics_data (365 ngày)
✅ creative_performance (365 ngày)
✅ competitive_data (365 ngày)

-- BIGQUERY (Cold Storage)
❄️ raw_data_backup_historical
❄️ hourly_aggregates_historical
❄️ daily_aggregates_historical
❄️ ai_insights_historical
❄️ long_term_cohort_analysis
❄️ historical_funnel_analysis
❄️ marketing_data_warehouse
```

**Chi phí**: ~$50/tháng (Supabase + BigQuery)

### **Phase 3: Enterprise (100k+ users)**
```sql
-- SUPABASE (Hot Data - 30 ngày)
✅ organizations
✅ organization_members
✅ user_profiles
✅ hourly_aggregates (1 ngày)
✅ daily_aggregates (30 ngày)
✅ ai_insights (30 ngày)
✅ performance_alerts (30 ngày)
✅ realtime_sessions (24 giờ)
✅ event_tracking (30 ngày)
✅ funnel_analysis (30 ngày)
✅ cohort_analysis (30 ngày)
✅ demographics_data (30 ngày)
✅ creative_performance (30 ngày)
✅ competitive_data (30 ngày)

-- BIGQUERY (Cold Storage + Data Warehouse)
❄️ raw_data_backup_historical
❄️ hourly_aggregates_historical
❄️ daily_aggregates_historical (>30 ngày)
❄️ ai_insights_historical
❄️ long_term_cohort_analysis
❄️ historical_funnel_analysis
❄️ marketing_data_warehouse
❄️ customer_journey_warehouse
❄️ performance_metrics_warehouse
❄️ competitive_intelligence_warehouse
❄️ machine_learning_datasets
❄️ advanced_analytics_data
```

**Chi phí**: ~$200/tháng (Supabase + BigQuery + Advanced Analytics)

## 📋 SETUP SCRIPTS

### **Supabase Setup Scripts**
```sql
-- File: scripts/setup-supabase-tables.sql

-- Core Business Tables
CREATE TABLE organizations (...);
CREATE TABLE organization_members (...);
CREATE TABLE user_profiles (...);
CREATE TABLE user_2fa (...);

-- Real-time Analytics Tables
CREATE TABLE hourly_aggregates (...);
CREATE TABLE daily_aggregates (...);
CREATE TABLE realtime_sessions (...);
CREATE TABLE event_tracking (...);

-- Active Insights Tables
CREATE TABLE ai_insights (...);
CREATE TABLE performance_alerts (...);
CREATE TABLE funnel_analysis (...);
CREATE TABLE cohort_analysis (...);

-- Chart Data Tables
CREATE TABLE demographics_data (...);
CREATE TABLE creative_performance (...);
CREATE TABLE competitive_data (...);
```

### **BigQuery Setup Scripts**
```sql
-- File: scripts/setup-bigquery-tables.sql

-- Historical Data Backup
CREATE TABLE raw_data_backup_historical (
    id STRING,
    organization_id STRING,
    source STRING,
    raw_data STRING,
    fetched_at TIMESTAMP,
    processed BOOL,
    created_at TIMESTAMP
);

CREATE TABLE hourly_aggregates_historical (
    id STRING,
    organization_id STRING,
    channel STRING,
    metric STRING,
    value FLOAT64,
    timestamp TIMESTAMP,
    metadata STRING,
    created_at TIMESTAMP
);

CREATE TABLE daily_aggregates_historical (
    id STRING,
    organization_id STRING,
    channel STRING,
    metric STRING,
    value FLOAT64,
    date DATE,
    metadata STRING,
    created_at TIMESTAMP
);

-- Deep Analytics Tables
CREATE TABLE long_term_cohort_analysis (
    id STRING,
    organization_id STRING,
    cohort_date DATE,
    cohort_type STRING,
    period_number INT64,
    period_type STRING,
    cohort_size INT64,
    active_users INT64,
    retention_rate FLOAT64,
    revenue FLOAT64,
    created_at TIMESTAMP
);

CREATE TABLE historical_funnel_analysis (
    id STRING,
    organization_id STRING,
    funnel_name STRING,
    step_name STRING,
    step_order INT64,
    date DATE,
    visitors INT64,
    conversions INT64,
    conversion_rate FLOAT64,
    drop_off_rate FLOAT64,
    created_at TIMESTAMP
);

-- Data Warehouse Tables
CREATE TABLE marketing_data_warehouse (
    id STRING,
    organization_id STRING,
    date DATE,
    channel STRING,
    campaign_id STRING,
    ad_group_id STRING,
    impressions INT64,
    clicks INT64,
    ctr FLOAT64,
    cpc FLOAT64,
    spend FLOAT64,
    conversions INT64,
    revenue FLOAT64,
    roas FLOAT64,
    created_at TIMESTAMP
);

CREATE TABLE customer_journey_warehouse (
    id STRING,
    organization_id STRING,
    user_id STRING,
    session_id STRING,
    touchpoint STRING,
    timestamp TIMESTAMP,
    channel STRING,
    campaign STRING,
    action STRING,
    value FLOAT64,
    created_at TIMESTAMP
);
```

## 🔄 DATA PIPELINE STRATEGY

### **Supabase → BigQuery Sync**
```python
# File: backend/app/tasks/data_sync.py

from google.cloud import bigquery
from supabase import create_client
import pandas as pd

def sync_supabase_to_bigquery():
    """Sync data từ Supabase sang BigQuery"""
    
    # 1. Lấy dữ liệu cũ từ Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # 2. Xóa dữ liệu cũ khỏi Supabase
    def cleanup_old_data():
        # Xóa hourly_aggregates > 1 ngày
        supabase.table('hourly_aggregates').delete().gte('timestamp', '1 day ago').execute()
        
        # Xóa daily_aggregates > 365 ngày
        supabase.table('daily_aggregates').delete().gte('date', '365 days ago').execute()
        
        # Xóa ai_insights > 90 ngày
        supabase.table('ai_insights').delete().gte('created_at', '90 days ago').execute()
    
    # 3. Upload lên BigQuery
    def upload_to_bigquery(table_name, data):
        client = bigquery.Client()
        dataset_ref = client.dataset('digital_marketing')
        table_ref = dataset_ref.table(f'{table_name}_historical')
        
        # Convert to DataFrame và upload
        df = pd.DataFrame(data)
        job_config = bigquery.LoadJobConfig(
            write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
        )
        job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        job.result()
    
    # 4. Schedule sync
    # Chạy mỗi ngày lúc 02:00
    # Chạy mỗi tuần cho historical data
```

### **BigQuery → Supabase Sync (Khi cần)**
```python
# File: backend/app/tasks/bigquery_sync.py

def sync_bigquery_to_supabase():
    """Sync data từ BigQuery về Supabase khi cần"""
    
    client = bigquery.Client()
    
    # Query historical data
    query = """
    SELECT * FROM `project.dataset.daily_aggregates_historical`
    WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    """
    
    df = client.query(query).to_dataframe()
    
    # Upload về Supabase cho analysis
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    supabase.table('daily_aggregates').upsert(df.to_dict('records')).execute()
```

## 💰 COST OPTIMIZATION

### **Supabase Costs**
```bash
# Free Tier (500MB, 2GB bandwidth)
✅ 1000 users: Free
✅ 5000 users: $25/tháng (Pro)

# Pro Plan ($25/tháng)
✅ 8GB database
✅ 250GB bandwidth
✅ 1000+ organizations
```

### **BigQuery Costs**
```bash
# Storage (Long-term)
❄️ $0.02/GB/tháng (Standard)
❄️ $0.004/GB/tháng (Long-term)

# Query Processing
❄️ $5/TB processed
❄️ 1TB free/tháng

# Estimated costs cho 1000 organizations
❄️ Storage: ~$10/tháng (500GB)
❄️ Query: ~$5/tháng (1TB processed)
❄️ Total: ~$15/tháng
```

### **Total Cost Estimation**
```bash
# Phase 1 (MVP - 1000 users)
✅ Supabase Pro: $25/tháng
❄️ BigQuery: $0/tháng (chưa cần)
📊 Total: $25/tháng

# Phase 2 (Scale - 10k users)
✅ Supabase Pro: $25/tháng
❄️ BigQuery: $15/tháng
📊 Total: $40/tháng

# Phase 3 (Enterprise - 100k users)
✅ Supabase Pro: $25/tháng
❄️ BigQuery: $50/tháng
❄️ Advanced Analytics: $100/tháng
📊 Total: $175/tháng
```

## 🔧 MIGRATION STRATEGY

### **Phase 1: MVP (Hiện tại)**
```sql
-- TẤT CẢ TẠI SUPABASE
✅ Không cần BigQuery
✅ Chi phí thấp: $25/tháng
✅ Setup đơn giản
✅ Performance tốt
```

### **Phase 2: Scale (Khi cần)**
```sql
-- Thêm BigQuery khi:
❄️ Dữ liệu > 8GB
❄️ Cần historical analysis
❄️ Cần advanced analytics
❄️ Cần ML training data
```

### **Migration Scripts**
```python
# File: scripts/migrate_to_bigquery.py

def migrate_to_bigquery():
    """Migrate data từ Supabase sang BigQuery"""
    
    # 1. Backup current data
    backup_supabase_data()
    
    # 2. Setup BigQuery
    setup_bigquery_tables()
    
    # 3. Sync data
    sync_supabase_to_bigquery()
    
    # 4. Update application config
    update_app_config()
    
    # 5. Test migration
    test_migration()
```

## 📊 MONITORING & ALERTS

### **Supabase Monitoring**
```sql
-- Monitor Supabase usage
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **BigQuery Monitoring**
```sql
-- Monitor BigQuery usage
SELECT 
    project_id,
    dataset_id,
    table_id,
    size_bytes,
    row_count
FROM `region-us`.INFORMATION_SCHEMA.TABLES
WHERE table_schema = 'digital_marketing'
ORDER BY size_bytes DESC;
```

## 🎯 RECOMMENDATIONS

### **✅ Bắt đầu với Supabase**
1. **Setup tất cả bảng tại Supabase**
2. **Focus vào performance và user experience**
3. **Monitor usage và costs**
4. **Plan migration khi cần**

### **❄️ Thêm BigQuery khi:**
1. **Dữ liệu > 8GB**
2. **Cần historical analysis > 1 năm**
3. **Cần advanced analytics**
4. **Cần ML training data**
5. **Có budget cho enterprise features**

### **🔄 Migration Timeline**
```bash
# Month 1-6: Supabase only
✅ Setup tất cả bảng tại Supabase
✅ Monitor performance và costs
✅ Optimize queries và indexes

# Month 6-12: Evaluate BigQuery
❄️ Setup BigQuery cho historical data
❄️ Implement data sync pipeline
❄️ Test hybrid approach

# Month 12+: Full hybrid
❄️ Hot data: Supabase
❄️ Cold data: BigQuery
❄️ Advanced analytics: BigQuery
```

## 📋 CHECKLIST

### **Supabase Setup**
- [ ] Core business tables
- [ ] Real-time analytics tables
- [ ] Active insights tables
- [ ] Chart data tables
- [ ] RLS policies
- [ ] Indexes optimization
- [ ] Functions và triggers

### **BigQuery Setup (Khi cần)**
- [ ] Historical data tables
- [ ] Deep analytics tables
- [ ] Data warehouse tables
- [ ] Data sync pipeline
- [ ] Cost monitoring
- [ ] Performance optimization

### **Migration Planning**
- [ ] Data backup strategy
- [ ] Sync pipeline setup
- [ ] Application config updates
- [ ] Testing procedures
- [ ] Rollback plan

---

**Kết luận: Bắt đầu với Supabase cho tất cả bảng, thêm BigQuery khi cần historical analysis và advanced analytics. Chi phí tối ưu và performance tốt cho MVP.** 