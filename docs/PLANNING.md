# Digital Performance Optimizer - Planning & Architecture

## 🎯 Tổng quan dự án
Ứng dụng Digital Performance Optimizer là một dashboard toàn diện để theo dõi và tối ưu hiệu suất marketing đa nền tảng, tích hợp các công cụ digital marketing phổ biến như Meta, Google, TikTok, LinkedIn, Shopify và các công cụ Email Marketing, CRM.

## 🚀 Kiến trúc tổng thể & Data Pipeline

### Nguyên tắc thiết kế
- **Không truy xuất API trực tiếp** mỗi lần user xem dashboard
- **Data Warehouse trung gian** để lưu trữ/caching dữ liệu từ các nền tảng marketing
- **Multi-tenant architecture** với Row-Level Security (RLS)
- **Performance tối ưu** với caching strategy nhiều tầng

### Kiến trúc đề xuất

#### 1. Kết nối và lưu thông tin nguồn dữ liệu
```sql
-- Bảng connections (Supabase)
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'google', 'meta', 'woocommerce'
  service VARCHAR(100), -- 'google-ads', 'ga4', 'meta-ads'
  credentials JSONB NOT NULL, -- OAuth tokens, API keys
  metadata JSONB, -- Account details, settings
  status VARCHAR(20) DEFAULT 'connected',
  last_sync TIMESTAMP,
  sync_frequency VARCHAR(20) DEFAULT 'hourly', -- 'realtime', 'hourly', 'daily'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. ETL Jobs định kỳ (Data Sync)
```typescript
// Sử dụng Supabase Edge Functions + pg_cron
const etlStrategy = {
  frequency: "Every 15-30 minutes",
  implementation: "Supabase Edge Functions + pg_cron",
  dataFlow: [
    "Fetch data from APIs",
    "Transform and validate",
    "Store in analytics_data table",
    "Update materialized views",
    "Clean old data"
  ]
};
```

#### 3. Lưu trữ và xử lý dữ liệu
```sql
-- Bảng analytics_data (Tinybird cho performance)
CREATE TABLE analytics_data (
  timestamp DateTime,
  organization_id String,
  platform String,
  service String,
  metrics JSON,
  dimensions JSON
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (organization_id, platform, timestamp);

-- Bảng imported_data (Supabase cho historical)
CREATE TABLE imported_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  data_source_id UUID REFERENCES connections(id),
  table_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  schema_definition JSONB,
  row_count INTEGER DEFAULT 0,
  imported_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

#### 4. Dashboard Query
- Frontend truy vấn dữ liệu từ database (Supabase client)
- Tất cả biểu đồ, KPI lấy từ bảng snapshot đã được làm mới
- Không gọi trực tiếp API ngoài
- Performance tương tự Power BI dataset import, Looker Studio cached data

## 🔐 Multi-Tenancy và Phân quyền người dùng

### Phân tách dữ liệu theo organization_id
```sql
-- RLS Policy cho tất cả bảng dữ liệu
CREATE POLICY "Users can only access their organization data" 
ON analytics_data 
FOR ALL 
USING (organization_id = auth.jwt() ->> 'organization_id');

CREATE POLICY "Users can only access their organization data" 
ON imported_data 
FOR ALL 
USING (organization_id = auth.jwt() ->> 'organization_id');
```

### Cấu trúc bảng quản lý tenants và users
```sql
-- Bảng organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  domain VARCHAR(100),
  plan VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng organization_members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);
```

### Phân quyền theo vai trò
```typescript
const rolePermissions = {
  owner: {
    canManageUsers: true,
    canManageConnections: true,
    canViewAllDashboards: true,
    canManageBilling: true
  },
  admin: {
    canManageUsers: true,
    canManageConnections: true,
    canViewAllDashboards: true,
    canManageBilling: false
  },
  member: {
    canManageUsers: false,
    canManageConnections: false,
    canViewAllDashboards: true,
    canManageBilling: false
  },
  viewer: {
    canManageUsers: false,
    canManageConnections: false,
    canViewAllDashboards: false,
    canManageBilling: false
  }
};
```

## ⚡ Kiến trúc backend & caching layer

### Backend Strategy
```typescript
// Tận dụng tối đa Supabase
const backendStrategy = {
  crud: "Supabase client (direct)",
  complexLogic: "Supabase Edge Functions",
  etl: "Edge Functions + pg_cron",
  auth: "Supabase Auth",
  realtime: "Supabase Realtime"
};
```

### Caching Strategy nhiều tầng
```typescript
const cachingStrategy = {
  layer1: "Postgres materialized views",
  layer2: "Redis (when needed)",
  layer3: "CDN (for static assets)",
  layer4: "Browser cache"
};

// Materialized views cho common queries
CREATE MATERIALIZED VIEW organization_daily_metrics AS
SELECT 
  organization_id,
  DATE(created_at) as date,
  platform,
  SUM(revenue) as total_revenue,
  SUM(spend) as total_spend,
  COUNT(*) as total_events
FROM analytics_data
GROUP BY organization_id, DATE(created_at), platform;
```

### Performance Optimization
```sql
-- Index strategy
CREATE INDEX idx_analytics_data_org_date ON analytics_data(organization_id, date);
CREATE INDEX idx_analytics_data_platform ON analytics_data(platform, service);
CREATE INDEX idx_analytics_data_composite ON analytics_data(organization_id, platform, date);

-- Partitioning cho large tables
CREATE TABLE analytics_data_2024_01 PARTITION OF analytics_data
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Compression cho historical data
ALTER TABLE analytics_data SET (
  compression = 'zstd',
  compression_level = 3
);
```

## 🎨 Trải nghiệm người dùng & Giao diện dashboard

### Dashboard Strategy
```typescript
const dashboardStrategy = {
  approach: "Admin-configured templates",
  customization: "Role-based dashboards",
  realtime: "Near real-time (15-30 min delay)",
  responsive: "Mobile-first design"
};
```

### UI/UX Features
```typescript
const uiFeatures = {
  core: [
    "KPI cards with trends",
    "Multi-channel comparison charts",
    "Date range filters",
    "Platform-specific views"
  ],
  advanced: [
    "Custom dashboards (future)",
    "Drag-and-drop builder (future)",
    "AI insights (future)",
    "Predictive analytics (future)"
  ]
};
```

## 📊 Data Retention Strategy

```typescript
const dataRetention = {
  hot: "3 months (Tinybird)",
  warm: "1 year (Supabase)",
  cold: "5 years (compressed)",
  archive: "10+ years (S3/Cloud Storage)"
};

// Cleanup functions
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_data 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('cleanup-analytics', '0 2 * * 0', 'SELECT cleanup_old_analytics_data();');
```

## 🚀 Roadmap Implementation

### Phase 1: MVP (0-100 users) - 2-3 tháng
```typescript
const mvpFeatures = {
  core: [
    "Basic ETL pipeline",
    "Simple dashboard",
    "Multi-tenant auth",
    "RLS implementation",
    "Google Analytics integration",
    "Meta Ads integration"
  ],
  cost: "$25/month (Supabase Pro)",
  timeline: "2-3 months"
};
```

### Phase 2: Growth (100-1,000 users) - 3-4 tháng
```typescript
const growthFeatures = {
  additions: [
    "Advanced caching",
    "Materialized views",
    "Real-time notifications",
    "Custom dashboards",
    "WooCommerce integration",
    "TikTok Ads integration"
  ],
  cost: "$100/month (Supabase + Tinybird)",
  timeline: "3-4 months"
};
```

### Phase 3: Scale (1,000+ users) - 4-6 tháng
```typescript
const scaleFeatures = {
  enterprise: [
    "AI insights",
    "Predictive analytics",
    "Advanced RBAC",
    "API marketplace",
    "White-label solutions",
    "Enterprise SSO"
  ],
  cost: "$200/month",
  timeline: "4-6 months"
};
```

## 🔧 Error Handling & Monitoring

```typescript
const errorHandling = {
  apiFailures: "Retry with exponential backoff",
  dataInconsistency: "Data validation checks",
  performance: "Query timeout handling",
  monitoring: "Supabase logs + custom metrics"
};

// Monitoring queries
CREATE OR REPLACE FUNCTION log_api_error(
  platform VARCHAR,
  error_message TEXT,
  organization_id UUID
) RETURNS void AS $$
BEGIN
  INSERT INTO error_logs (platform, error_message, organization_id, created_at)
  VALUES (platform, error_message, organization_id, NOW());
END;
$$ LANGUAGE plpgsql;
```

## 🔒 Security Enhancements

```typescript
const securityMeasures = {
  encryption: "Data at rest and in transit",
  audit: "Complete audit trail",
  backup: "Daily automated backups",
  compliance: "GDPR, SOC2 ready"
};

-- Audit trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📈 Cost Analysis

| Phase | Users | Supabase | Tinybird | Total | Cost/User |
|-------|-------|----------|----------|-------|-----------|
| MVP | 100 | $25 | $0 | $25 | $0.25 |
| Growth | 1,000 | $25 | $50 | $75 | $0.075 |
| Scale | 10,000 | $25 | $150 | $175 | $0.0175 |

## 🎯 Kết luận

Kiến trúc này cung cấp:
- **Performance tối ưu** với caching strategy
- **Multi-tenancy hoàn chỉnh** với RLS
- **Scalability** từ startup đến enterprise
- **Cost-effective** so với các giải pháp thương mại
- **Security** enterprise-grade
- **Flexibility** để mở rộng tính năng

Đây là một kiến trúc rất solid có thể scale từ MVP đến enterprise, học hỏi tốt từ các nền tảng lớn như Power BI và Looker Studio.

## 🚀 Tính năng đã hoàn thành

### ✅ Core Features
- [x] Dashboard tổng quan với KPI cards
- [x] Quản lý mục tiêu marketing (Goals)
- [x] Tích hợp đa nền tảng (Meta, Google, TikTok, WooCommerce)
- [x] Date range picker
- [x] Account selector
- [x] Onboarding tour tương tác
- [x] Dark/Light theme toggle
- [x] Responsive design

### ✅ Technical Features
- [x] TypeScript integration
- [x] Custom hooks cho state management
- [x] Component refactoring và tách file
- [x] Type definitions
- [x] Constants management
- [x] Error handling
- [x] Loading states

## 🔄 Tính năng đang phát triển

### 🏗️ Platform Integrations
- [ ] **Meta (Facebook/Instagram)**
  - [ ] Facebook Login integration
  - [ ] Meta Business API
  - [ ] Ads Manager data
  - [ ] Instagram Insights
  - [ ] Page Insights

- [ ] **Google**
  - [ ] Google Analytics 4
  - [ ] Google Ads API
  - [ ] Search Console
  - [ ] Google My Business

- [ ] **TikTok**
  - [ ] TikTok Business API
  - [ ] TikTok Ads Manager
  - [ ] TikTok Shop
  - [ ] TikTok Pixel

- [ ] **LinkedIn**
  - [ ] LinkedIn Marketing API
  - [ ] Campaign Manager
  - [ ] Company Page Insights

- [ ] **Shopify**
  - [ ] Shopify Admin API
  - [ ] Order management
  - [ ] Product analytics
  - [ ] Customer insights

- [ ] **WooCommerce**
  - [ ] WooCommerce REST API
  - [ ] Order tracking
  - [ ] Product management
  - [ ] Customer analytics

### 🏗️ Email Marketing Tools
- [ ] **Mailchimp**
  - [ ] Campaign analytics
  - [ ] Subscriber management
  - [ ] A/B testing results

- [ ] **SendGrid**
  - [ ] Email delivery stats
  - [ ] Campaign performance
  - [ ] Bounce tracking

- [ ] **ConvertKit**
  - [ ] Subscriber growth
  - [ ] Email sequences
  - [ ] Conversion tracking

### 🏗️ CRM Tools
- [ ] **HubSpot**
  - [ ] Contact management
  - [ ] Deal pipeline
  - [ ] Marketing automation

- [ ] **Salesforce**
  - [ ] Lead management
  - [ ] Opportunity tracking
  - [ ] Sales analytics

- [ ] **Pipedrive**
  - [ ] Deal management
  - [ ] Sales pipeline
  - [ ] Activity tracking

## 📊 Analytics & Reporting

### 🎯 KPI Tracking
- [ ] **Revenue Metrics**
  - [ ] Total revenue
  - [ ] Revenue by platform
  - [ ] Revenue attribution
  - [ ] Customer lifetime value

- [ ] **Conversion Metrics**
  - [ ] Conversion rate
  - [ ] Cost per acquisition (CPA)
  - [ ] Return on ad spend (ROAS)
  - [ ] Click-through rate (CTR)

- [ ] **Engagement Metrics**
  - [ ] Impressions
  - [ ] Reach
  - [ ] Engagement rate
  - [ ] Social media metrics

### 📈 Advanced Analytics
- [ ] **Cross-platform attribution**
- [ ] **Customer journey mapping**
- [ ] **A/B testing framework**
- [ ] **Predictive analytics**
- [ ] **Real-time dashboards**

## 🔧 Technical Improvements

### 🏗️ Performance Optimization
- [ ] **Code splitting**
- [ ] **Lazy loading**
- [ ] **Caching strategies**
- [ ] **Bundle optimization**

### 🏗️ Testing
- [ ] **Unit tests**
- [ ] **Integration tests**
- [ ] **E2E tests**
- [ ] **Performance tests**

### 🏗️ DevOps
- [ ] **CI/CD pipeline**
- [ ] **Automated deployment**
- [ ] **Monitoring & logging**
- [ ] **Error tracking**

## 🎨 UI/UX Enhancements

### 🎯 User Experience
- [ ] **Advanced filtering**
- [ ] **Custom dashboards**
- [ ] **Export functionality**
- [ ] **Mobile app**

### 🎨 Design System
- [ ] **Component library**
- [ ] **Design tokens**
- [ ] **Accessibility improvements**
- [ ] **Internationalization**

## 🔐 Security & Compliance

### 🛡️ Security
- [ ] **OAuth 2.0 implementation**
- [ ] **API key management**
- [ ] **Data encryption**
- [ ] **Rate limiting**

### 📋 Compliance
- [ ] **GDPR compliance**
- [ ] **Data privacy controls**
- [ ] **Audit logging**
- [ ] **Data retention policies**

## 📱 Mobile & Accessibility

### 📱 Mobile Features
- [ ] **Progressive Web App (PWA)**
- [ ] **Mobile-optimized UI**
- [ ] **Offline functionality**
- [ ] **Push notifications**

### ♿ Accessibility
- [ ] **WCAG 2.1 compliance**
- [ ] **Screen reader support**
- [ ] **Keyboard navigation**
- [ ] **High contrast mode**

## 🚀 Deployment & Infrastructure

### ☁️ Cloud Infrastructure
- [ ] **AWS/Vercel deployment**
- [ ] **Database setup**
- [ ] **CDN configuration**
- [ ] **Backup strategies**

### 📊 Monitoring
- [ ] **Application monitoring**
- [ ] **Performance tracking**
- [ ] **Error alerting**
- [ ] **Usage analytics**

## 📈 Business Features

### 💼 Enterprise Features
- [ ] **Multi-tenant architecture**
- [ ] **Role-based access control**
- [ ] **Team collaboration**
- [ ] **White-label solutions**

### 📊 Advanced Reporting
- [ ] **Custom report builder**
- [ ] **Scheduled reports**
- [ ] **Data visualization**
- [ ] **Export to PDF/Excel**

## 🎯 Roadmap Timeline

### Phase 1: Foundation (Hoàn thành)
- ✅ Basic dashboard structure
- ✅ Core components
- ✅ TypeScript setup
- ✅ Basic integrations

### Phase 2: Core Integrations (Đang thực hiện)
- 🏗️ Meta platform integration
- 🏗️ Google Analytics integration
- 🏗️ Basic reporting

### Phase 3: Advanced Features (Q2 2024)
- 📅 Advanced analytics
- 📅 Cross-platform attribution
- 📅 Custom dashboards

### Phase 4: Enterprise Features (Q3 2024)
- 📅 Multi-tenant support
- 📅 Advanced security
- 📅 API marketplace

### Phase 5: AI & ML (Q4 2024)
- 📅 Predictive analytics
- 📅 Automated insights
- 📅 Smart recommendations

## 🔄 Recent Updates

### ✅ Refactor Progress (Tháng 6/2024)
- [x] Tách Dashboard.tsx thành các components nhỏ
- [x] Tạo custom hooks cho state management
- [x] Tách types và interfaces
- [x] Tạo constants files
- [x] Clean up unused imports
- [x] Cải thiện type safety

### 🎯 Next Steps
1. Hoàn thành tách các components còn lại
2. Tạo unit tests cho các hooks
3. Implement error boundaries
4. Tối ưu performance
5. Thêm loading states

## 📝 Notes
- Ưu tiên tính năng core trước khi mở rộng
- Đảm bảo code quality và maintainability
- Tập trung vào user experience
- Tuân thủ best practices của React và TypeScript 

## 🚩 Định hướng & task mới (Checkpoint 07/2024)

### Tính năng cần phát triển:
- [ ] Lấy danh sách sheet, header, sample data thật từ Google Sheets.
- [ ] Giao diện mapping động, validate realtime, báo lỗi rõ ràng.
- [ ] Lưu cấu hình mapping, cho phép chỉnh sửa, đồng bộ lại.
- [ ] Import dữ liệu vào DB, thiết kế lại database cho dữ liệu động.
- [ ] Tab quản lý nguồn dữ liệu đã kết nối.
- [ ] Module tạo report/dashboard động (giống Looker Studio/Power BI).

### Kiến trúc database:
- Bảng connections (metadata), bảng imported_data (jsonb), bảng mapping_config, bảng reports. 

## 🚩 Mở rộng database & các tính năng tương lai (Checkpoint 07/2024)

### Bảng mới đã tạo:
- notifications, activity_logs, shared_reports, scheduled_jobs, organizations, organization_members, api_keys

### Tính năng sẽ dùng:
- Thông báo realtime, log thao tác, chia sẻ report, tự động import/sync, tổ chức/team, tích hợp API ngoài.

### Checklist tối ưu:
- [ ] Index các trường truy vấn nhiều
- [ ] Dọn dẹp log, notification cũ định kỳ
- [ ] Theo dõi chi phí, tối ưu query
- [ ] Chỉ import dữ liệu cần thiết
- [ ] Sử dụng Supabase Storage cho file lớn 

## Checkpoint mới (24/06/2025)

- [x] Đã triển khai pg_cron cho tự động dọn dẹp dữ liệu định kỳ trong database.
- [x] Đã xác nhận các hàm cleanup chạy ổn định, log không lỗi.
- [x] Không cần sử dụng Edge Function schedule hoặc cron ngoài cho các tác vụ này.

## Định hướng phát triển quản lý kết nối & đồng bộ dữ liệu đa nền tảng

### 1. Lý do chọn giải pháp lưu trữ trung gian
- Tránh gọi API trực tiếp mỗi lần user xem dashboard (tốn quota, chậm, dễ rate limit).
- Dễ kiểm soát, bảo mật, tối ưu chi phí vận hành.
- Dễ mở rộng khi số lượng user, tài khoản, loại dữ liệu tăng mạnh.

### 2. Flow tổng thể
- User kết nối tài khoản → lưu vào bảng `connections` (Supabase).
- Job định kỳ (cron/Edge Function) fetch dữ liệu từ API về bảng snapshot (analytics_data, ads_data, ...).
- Dashboard/report chỉ query bảng snapshot này.
- Khi cần, user có thể trigger refresh thủ công (nếu quota cho phép).

### 3. So sánh với Power BI/Looker Studio
- Power BI/Looker Studio luôn dùng Data Warehouse/Data Extract làm trung gian, không fetch API trực tiếp.
- App MVP nên học theo mô hình này để tối ưu performance, chi phí, UX.

### 4. Định hướng mở rộng
- Khi dữ liệu lớn, chuyển sang BigQuery/Azure Data Lake.
- Có thể thêm các bảng log, lịch sử đồng bộ, bảng lưu cấu hình dashboard/report cho từng user.