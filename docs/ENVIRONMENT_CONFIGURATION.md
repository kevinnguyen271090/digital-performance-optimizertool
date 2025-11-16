# 🌍 Environment Configuration Guide

Hướng dẫn cấu hình môi trường Local, Staging và Production.

## 📋 Tổng quan

Dự án sử dụng 3 môi trường:
- **Local**: Development trên máy local (localhost)
- **Staging**: Testing trước production
- **Production**: Live environment cho end users

## 🔐 Bảo mật

**LƯU Ý QUAN TRỌNG:**
- ❌ KHÔNG BAO GIỜ commit file `.env` chứa credentials thật
- ❌ KHÔNG push credentials lên GitHub (kể cả private repo)
- ✅ SỬ DỤNG `.env.example` làm template
- ✅ LƯU credentials thật ở nơi AN TOÀN (password manager, secrets manager)

## 📁 Cấu trúc File Environment

```
project/
├── backend/
│   ├── .env.example          # Template (commit được)
│   ├── .env                  # Local credentials (gitignored)
│   ├── .env.local            # Local override (gitignored)
│   ├── .env.staging          # Staging credentials (gitignored)
│   └── .env.production       # Production credentials (gitignored)
│
├── frontend/
│   ├── .env.example          # Template (commit được)
│   ├── .env                  # Local credentials (gitignored)
│   ├── .env.staging          # Staging credentials (gitignored)
│   └── .env.production       # Production credentials (gitignored)
```

## 🚀 Setup Nhanh

### Bước 1: Copy từ example

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Bước 2: Điền credentials

Mở file `.env` và thay thế các placeholders bằng credentials thật:

**Backend `.env`:**
```bash
# Thay thế:
DATABASE_URL=your-database-url
# Bằng:
DATABASE_URL=postgresql://user:pass@host:port/db
```

**Frontend `.env`:**
```bash
# Thay thế:
VITE_SUPABASE_URL=your-supabase-url
# Bằng:
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### Bước 3: Verify

```bash
# Backend - Check if env loaded
cd backend
python -c "from app.core.config import settings; print(settings.SUPABASE_URL)"

# Frontend - Check if env loaded
cd frontend
npm run dev
# Mở console và check import.meta.env.VITE_SUPABASE_URL
```

## 📝 Danh sách Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGci...` |
| `SECRET_KEY` | App secret key | `random-string-min-32-chars` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGci...` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Debug mode | `false` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `SENTRY_DSN` | Sentry error tracking | `` |

## 🌍 Setup theo Môi trường

### Local Development

```bash
# backend/.env
DEBUG=true
ENVIRONMENT=development
DATABASE_URL=postgresql://localhost:5432/dev_db
SUPABASE_URL=https://xxx.supabase.co
REDIS_URL=redis://localhost:6379

# frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
VITE_DEBUG=true
```

### Staging

```bash
# backend/.env.staging
DEBUG=true
ENVIRONMENT=staging
DATABASE_URL=postgresql://staging-db:5432/staging_db
DOMAIN=staging.digitalmkthub.com
REDIS_URL=redis://staging-redis:6379

# frontend/.env.staging
VITE_API_URL=https://staging-api.digitalmkthub.com/api/v1
VITE_DEBUG=true
```

### Production

```bash
# backend/.env.production
DEBUG=false
ENVIRONMENT=production
DATABASE_URL=postgresql://prod-db:5432/prod_db
DOMAIN=digitalmkthub.com
REDIS_URL=redis://prod-redis:6379

# frontend/.env.production
VITE_API_URL=https://api.digitalmkthub.com/api/v1
VITE_DEBUG=false
```

## 🔄 Switching Environments

### Manual Method

```bash
# Switch to staging
cp backend/.env.staging backend/.env
cp frontend/.env.staging frontend/.env

# Switch to production
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env
```

### Script Method (Recommended)

```bash
# Create switch script
./scripts/switch-env.sh staging
./scripts/switch-env.sh production
```

## 🔒 Lấy Credentials

### Supabase Credentials

1. Truy cập https://supabase.com/dashboard
2. Chọn project của bạn
3. Settings > API
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY`

### Google OAuth Credentials

1. Truy cập https://console.cloud.google.com
2. APIs & Services > Credentials
3. Create OAuth 2.0 Client ID
4. Copy:
   - `Client ID` → `GOOGLE_CLIENT_ID`
   - `Client Secret` → `GOOGLE_CLIENT_SECRET`
5. Thêm redirect URIs:
   - Local: `https://localhost:3000/auth/oauth/callback`
   - Staging: `https://staging.digitalmkthub.com/auth/oauth/callback`
   - Production: `https://digitalmkthub.com/auth/oauth/callback`

### Meta/Facebook Credentials

1. Truy cập https://developers.facebook.com
2. My Apps > Create App
3. Settings > Basic
4. Copy:
   - `App ID` → `META_APP_ID`
   - `App Secret` → `META_APP_SECRET`
5. Thêm redirect URIs trong OAuth settings

### TikTok Credentials

1. Truy cập https://developers.tiktok.com
2. My Apps > Create App
3. Copy credentials

## 🛡️ Security Best Practices

### 1. Secret Key Generation

```bash
# Generate secure SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use openssl
openssl rand -base64 32
```

### 2. Credentials Storage

**Development:**
- Store trong `.env` local (gitignored)
- Hoặc sử dụng password manager

**Staging/Production:**
- Sử dụng secrets manager:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Cloud provider secrets (Railway, Render, etc.)
- Hoặc environment variables trên hosting platform

### 3. Never Commit Secrets

Thêm vào `.gitignore`:
```
.env
.env.local
.env.*.local
**/.env
**/.env.local
```

### 4. Rotate Credentials Regularly

- Staging: Mỗi 3-6 tháng
- Production: Mỗi 1-3 tháng
- Immediately if compromised

## 🔍 Troubleshooting

### Error: "Missing VITE_SUPABASE_URL"

**Nguyên nhân:** Frontend không load được .env

**Giải pháp:**
```bash
# Check file tồn tại
ls -la frontend/.env

# Restart dev server
cd frontend && npm run dev
```

### Error: "Database connection failed"

**Nguyên nhân:** DATABASE_URL sai hoặc database không accessible

**Giải pháp:**
```bash
# Test connection
psql $DATABASE_URL

# Check format
# Correct: postgresql://user:pass@host:port/db
# Wrong: postgres://... (missing 'ql')
```

### Error: "Redis connection refused"

**Nguyên nhân:** Redis chưa chạy

**Giải pháp:**
```bash
# Start Redis
redis-server

# Or với Docker
docker run -d -p 6379:6379 redis:7-alpine
```

## 📚 Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy lên staging/production
- [Environment Setup](../ENVIRONMENT_SETUP.md) - Quick reference
- [Backend .env.example](../backend/.env.example) - Backend template
- [Frontend .env.example](../.env.example) - Frontend template

## ✅ Checklist

### First Time Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Get Supabase credentials
- [ ] Get Google OAuth credentials
- [ ] Get Meta/Facebook credentials (nếu cần)
- [ ] Get TikTok credentials (nếu cần)
- [ ] Generate SECRET_KEY
- [ ] Setup Redis locally
- [ ] Test backend connection
- [ ] Test frontend connection

### Before Deployment
- [ ] Create `.env.staging` với staging credentials
- [ ] Verify all required variables
- [ ] Test staging environment
- [ ] Setup production secrets manager
- [ ] Document credential locations
- [ ] Share credentials safely với team (1Password, Vault)

---

**Security Reminder:** Credentials là NHẠY CẢM. Không bao giờ:
- ❌ Commit vào git
- ❌ Share qua email/chat
- ❌ Screenshot credentials
- ❌ Hardcode trong code
- ✅ Dùng password manager
- ✅ Rotate regularly
- ✅ Use different credentials cho mỗi environment
