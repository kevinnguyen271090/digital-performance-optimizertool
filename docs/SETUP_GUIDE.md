# Digital Performance Optimizer - Setup Guide

## 🚀 Hướng dẫn Setup dự án

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- npm hoặc yarn
- pip (Python package manager)
- Git
- Supabase account
- Google Cloud account (cho OAuth)
- Redis (cho Celery background jobs)
- OpenSSL (cho HTTPS development)

> ⚠️ **Lưu ý quan trọng**: Link test luôn phải là **https://localhost:3000** vì đã khai báo với bên thứ 3 để accept API. Không thay đổi trong giai đoạn build dự án.

## 📋 Bước 1: Setup Supabase Project

### 1.1 Tạo Supabase Project
```bash
# Truy cập https://supabase.com
# Tạo project mới
# Lưu lại Project URL và anon key
```

### 1.2 Setup Database Schema
```sql
-- Chạy các script SQL sau trong Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analytics_data CASCADE;
DROP TABLE IF EXISTS imported_data CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Bảng organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  domain VARCHAR(100),
  plan VARCHAR(50) DEFAULT 'free',
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng organization_members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Bảng connections
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  service VARCHAR(100),
  credentials JSONB NOT NULL,
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'connected',
  last_sync TIMESTAMP,
  sync_frequency VARCHAR(20) DEFAULT 'hourly',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng imported_data
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

-- Bảng analytics_data (cho real-time data)
CREATE TABLE analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  service VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  metrics JSONB NOT NULL,
  dimensions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng audit_logs
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

-- Bảng error_logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50),
  error_message TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 Setup Row Level Security (RLS)
```sql
-- Enable RLS trên tất cả bảng
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their organization data" 
ON organizations FOR ALL 
USING (id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON organization_members FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON connections FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON imported_data FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON analytics_data FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON audit_logs FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access their organization data" 
ON error_logs FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));
```

### 1.4 Setup Indexes
```sql
-- Indexes cho performance
CREATE INDEX idx_connections_user_org ON connections(user_id, organization_id);
CREATE INDEX idx_connections_platform ON connections(platform, service);
CREATE INDEX idx_imported_data_org ON imported_data(organization_id);
CREATE INDEX idx_analytics_data_org_date ON analytics_data(organization_id, timestamp);
CREATE INDEX idx_analytics_data_platform ON analytics_data(platform, service);
CREATE INDEX idx_audit_logs_org_date ON audit_logs(organization_id, created_at);
```

### 1.5 Setup Functions
```sql
-- Function để tạo organization khi user đăng ký
```

## 📋 Bước 2: Setup Backend (Python FastAPI)

### 2.1 Cài đặt Backend Dependencies
```bash
cd digital-performance-optimizer/backend
pip install -r requirements.txt
```

### 2.2 Cấu hình Environment Variables
```bash
# Copy file env.example thành .env
cp env.example .env

# Cập nhật các giá trị trong .env
DATABASE_URL=postgresql://username:password@localhost:5432/digital_performance_optimizer
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6379/0
```

### 2.3 Chạy Backend Development Server
```bash
cd digital-performance-optimizer/backend
uvicorn app.main:app --reload
```

Backend API sẽ chạy tại `http://localhost:8000`

### 2.4 Setup Celery Background Jobs
```bash
# Terminal 1: Chạy Redis
redis-server

# Terminal 2: Chạy Celery Worker
cd digital-performance-optimizer/backend
celery -A app.core.celery worker --loglevel=info

# Terminal 3: Chạy Celery Beat (scheduler)
cd digital-performance-optimizer/backend
celery -A app.core.celery beat --loglevel=info
```
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO organizations (name, domain)
  VALUES ('My Organization', 'example.com');
  
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, NEW.id, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger để tự động tạo organization
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function để cleanup old data
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_data 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  DELETE FROM error_logs 
  WHERE created_at < NOW() - INTERVAL '3 months';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('cleanup-old-data', '0 2 * * 0', 'SELECT cleanup_old_analytics_data();');
```

## 📋 Bước 2: Setup Frontend Project

### 2.1 Clone và Install Dependencies
```bash
# Clone project
git clone <your-repo-url>
cd digital-performance-optimizer

# Install dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### 2.2 Setup Environment Variables
```bash
# Tạo file .env.local
cp .env.example .env.local

# Cập nhật các biến môi trường
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_META_APP_ID=your_meta_app_id
VITE_META_APP_SECRET=your_meta_app_secret
```

### 2.3 Setup Google OAuth
```bash
# Truy cập Google Cloud Console
# Tạo OAuth 2.0 credentials
# Thêm authorized redirect URIs:
# - http://localhost:5173/auth/callback
# - https://your-domain.com/auth/callback
```

### 2.4 Setup Meta OAuth
```bash
# Truy cập Meta for Developers
# Tạo Facebook App
# Thêm Facebook Login product
# Cấu hình OAuth redirect URIs
```

## 📋 Bước 3: Setup Edge Functions

### 3.1 Tạo Edge Functions
```bash
# Tạo thư mục functions
mkdir supabase/functions

# Tạo function cho Google Analytics
mkdir supabase/functions/fetch-google-analytics
```

### 3.2 Google Analytics Edge Function
```typescript
// supabase/functions/fetch-google-analytics/index.ts
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Fetch connections that need sync
    const { data: connections, error } = await supabase
      .from('connections')
      .select('*')
      .eq('platform', 'google')
      .eq('service', 'ga4')
      .eq('status', 'connected');

    if (error) throw error;

    for (const connection of connections || []) {
      // Fetch Google Analytics data
      const analyticsData = await fetchGoogleAnalyticsData(connection);
      
      // Store in analytics_data table
      await supabase
        .from('analytics_data')
        .insert({
          organization_id: connection.organization_id,
          platform: 'google',
          service: 'ga4',
          metrics: analyticsData,
          dimensions: { accountId: connection.metadata?.accountId }
        });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function fetchGoogleAnalyticsData(connection: any) {
  // Implement Google Analytics API call
  // Return metrics data
  return {
    sessions: 1000,
    users: 800,
    pageviews: 2500,
    revenue: 5000
  };
}
```

### 3.3 Deploy Edge Functions
```bash
# Deploy functions
supabase functions deploy fetch-google-analytics

# Hoặc deploy tất cả
supabase functions deploy
```

## 📋 Bước 4: Setup Cron Jobs

### 4.1 Setup pg_cron Jobs
```sql
-- Schedule Google Analytics sync
SELECT cron.schedule(
  'sync-google-analytics',
  '*/15 * * * *', -- Every 15 minutes
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/fetch-google-analytics'',
    headers := ''{"Authorization": "Bearer your-service-role-key"}''
  );'
);

-- Schedule Meta Ads sync
SELECT cron.schedule(
  'sync-meta-ads',
  '*/30 * * * *', -- Every 30 minutes
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/fetch-meta-ads'',
    headers := ''{"Authorization": "Bearer your-service-role-key"}''
  );'
);
```

## 📋 Bước 5: Setup Development

### 5.1 Start Development Server
```bash
# Start development server
npm run dev

# Hoặc
yarn dev
```

### 5.2 Test Setup
```bash
# Test database connection
npm run test:db

# Test OAuth flows
npm run test:auth

# Test API endpoints
npm run test:api
```

## 📋 Bước 6: Production Deployment

### 6.1 Build Production
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

### 6.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 6.3 Setup Custom Domain
```bash
# Add custom domain in Vercel dashboard
# Update OAuth redirect URIs
# Update environment variables
```

## 🔧 Troubleshooting

### Common Issues

#### 1. RLS Policy Errors
```sql
-- Check if user has organization
SELECT * FROM organization_members WHERE user_id = auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'connections';
```

#### 2. OAuth Redirect Issues
```bash
# Check redirect URIs in Google/Meta console
# Ensure they match your domain exactly
# Check for trailing slashes
```

#### 3. Edge Function Errors
```bash
# Check function logs
supabase functions logs fetch-google-analytics

# Test function locally
supabase functions serve fetch-google-analytics
```

#### 4. Database Connection Issues
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test connection
supabase db ping
```

## 📊 Monitoring & Maintenance

### 6.1 Setup Monitoring
```sql
-- Create monitoring views
CREATE VIEW api_health AS
SELECT 
  platform,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as errors,
  AVG(response_time) as avg_response_time
FROM audit_logs 
WHERE action LIKE 'api_%'
GROUP BY platform;
```

### 6.2 Setup Alerts
```sql
-- Create alert function
CREATE OR REPLACE FUNCTION check_system_health()
RETURNS void AS $$
BEGIN
  -- Check for high error rates
  IF EXISTS (
    SELECT 1 FROM error_logs 
    WHERE created_at > NOW() - INTERVAL '1 hour'
    GROUP BY platform 
    HAVING COUNT(*) > 10
  ) THEN
    -- Send alert (implement your alert mechanism)
    RAISE NOTICE 'High error rate detected';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Schedule health check
SELECT cron.schedule('health-check', '*/5 * * * *', 'SELECT check_system_health();');
```

## 🎯 Next Steps

### Phase 1 Checklist
- [ ] Supabase project setup
- [ ] Database schema created
- [ ] RLS policies configured
- [ ] Frontend environment configured
- [ ] OAuth apps created
- [ ] Edge functions deployed
- [ ] Cron jobs scheduled
- [ ] Development server running
- [ ] Basic functionality tested

### Phase 2 Checklist
- [ ] Google Analytics integration
- [ ] Meta Ads integration
- [ ] Dashboard components
- [ ] Multi-tenant testing
- [ ] Performance optimization
- [ ] Production deployment

### Phase 3 Checklist
- [ ] Additional platform integrations
- [ ] Advanced analytics
- [ ] Custom dashboards
- [ ] AI insights
- [ ] Enterprise features

## 📞 Support

Nếu gặp vấn đề trong quá trình setup:
1. Kiểm tra logs trong Supabase dashboard
2. Xem troubleshooting section
3. Tạo issue trên GitHub
4. Liên hệ team development

---

**Lưu ý**: Đảm bảo backup dữ liệu trước khi thực hiện các thay đổi lớn và test kỹ trong môi trường development trước khi deploy production. 

### HTTPS Development Server Setup

Để chạy HTTPS trên localhost (cần thiết cho OAuth và bên thứ 3):

#### Cách 1: Tự động tạo SSL (Khuyến nghị)
```bash
cd frontend
npm run setup
```

#### Cách 2: Thủ công với mkcert
```bash
# Bước 1: Cài đặt mkcert
# Tải mkcert từ: https://github.com/FiloSottile/mkcert/releases
# Copy file mkcert.exe vào C:\mkcert\

# Bước 2: Cài đặt certificate authority
C:\mkcert\mkcert.exe -install

# Bước 3: Tạo certificate cho localhost
C:\mkcert\mkcert.exe localhost 127.0.0.1 ::1

# Bước 4: Copy certificate files
copy "localhost+2.pem" "server.cert"
copy "localhost+2-key.pem" "server.key"

# Bước 5: Khởi động server HTTPS
npm run dev
```

**Kết quả:**
- 🌐 **URL**: https://localhost:3000
- 🔒 **HTTPS**: Certificate đáng tin cậy, không cảnh báo
- 📱 **Network**: Có thể truy cập từ network

### HTTP Development Server (Alternative)

Nếu không cần HTTPS:
```bash
# Vite sẽ tự động chạy HTTP trên port 3000
npm run dev
```

## 🏗️ Project Structure

```
digital-performance-optimizer/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── profile/         # Profile components
│   │   ├── settings/        # Settings components
│   │   └── google-sheets/   # Google Sheets integration
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Constants and configurations
│   └── config/              # Environment configurations
├── supabase/                # Supabase configuration
│   └── functions/           # Edge Functions
├── scripts/                 # Database scripts
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🔐 Environment Variables

Tạo file `.env` với các biến sau:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Meta OAuth
VITE_META_APP_ID=your_meta_app_id
VITE_META_APP_SECRET=your_meta_app_secret

# TikTok OAuth
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# WooCommerce
VITE_WOOCOMMERCE_CONSUMER_KEY=your_woocommerce_consumer_key
VITE_WOOCOMMERCE_CONSUMER_SECRET=your_woocommerce_consumer_secret
```

## 🗄️ Database Setup

### 1. Supabase Setup
1. Tạo project trên Supabase
2. Copy URL và anon key vào `.env`
3. Chạy SQL scripts trong thư mục `scripts/`

### 2. Required Tables
- `organizations` - Thông tin tổ chức
- `organization_members` - Thành viên tổ chức
- `connections` - Kết nối platform
- `analytics_data` - Dữ liệu analytics
- `audit_logs` - Log hoạt động
- `user_2fa` - Two-factor authentication

### 3. Edge Functions
Deploy các Edge Functions:
```bash
supabase functions deploy fetch-google-analytics
supabase functions deploy fetch-meta-ads
supabase functions deploy two-factor-auth
supabase functions deploy cleanup
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Connect repository
2. Set environment variables
3. Deploy automatically

## 🔧 Troubleshooting

### Common Issues

#### 1. Certificate Errors
```bash
# Nếu gặp "key values mismatch"
# Xóa certificate cũ và tạo lại
del server.cert server.key
C:\mkcert\mkcert.exe localhost 127.0.0.1 ::1
copy "localhost+2.pem" "server.cert"
copy "localhost+2-key.pem" "server.key"
```

#### 2. Port Already in Use
```bash
# Kiểm tra process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

#### 3. Supabase Connection Issues
- Kiểm tra environment variables
- Verify Supabase project settings
- Check RLS policies

#### 4. OAuth Issues
- Verify redirect URIs trong OAuth apps
- Check HTTPS certificate cho localhost
- Ensure correct client IDs và secrets

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong browser console
2. Verify environment variables
3. Check database connections
4. Review Edge Function logs

---

**Happy Coding! 🚀** 