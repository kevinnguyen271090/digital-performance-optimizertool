# 🚀 Quick Deploy Guide - Vercel + Railway + Upstash

Hướng dẫn deploy Digital Performance Optimizer lên production trong 15 phút.

## ✅ Prerequisites

Bạn cần có:
- ✅ Tài khoản Vercel (miễn phí)
- ✅ Tài khoản Railway (miễn phí)
- ✅ Tài khoản Upstash (miễn phí)
- ✅ GitHub repository

## 📦 Architecture

```
Frontend (Vercel)  →  Backend (Railway)  →  Database (Supabase)
                              ↓
                        Redis (Upstash)
```

---

## Step 1: Setup Upstash Redis (2 phút) ⚡

### 1.1 Tạo Database

1. Truy cập https://console.upstash.com
2. Click **Create Database**
3. Configuration:
   - Name: `dpo-redis`
   - Type: `Regional`
   - Region: `ap-southeast-1` (Singapore)
   - TLS: `Enabled`
4. Click **Create**

### 1.2 Lấy Connection String

Sau khi tạo xong:
1. Click vào database
2. Tab **Details**
3. Copy `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN`

**Hoặc dùng Redis URL:**
```bash
REDIS_URL=rediss://default:[password]@[host].upstash.io:6379
```

**⚠️ LƯU LẠI** - Sẽ cần cho Railway

---

## Step 2: Deploy Backend lên Railway (5 phút) 🚂

### 2.1 Create New Project

1. Truy cập https://railway.app
2. Click **New Project**
3. Chọn **Deploy from GitHub repo**
4. Authorize Railway nếu chưa
5. Chọn repo: `digital-performance-optimizertool`

### 2.2 Configure Settings

Click vào service → **Settings**:

```yaml
Root Directory: backend
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Build Command: pip install -r requirements.txt
```

### 2.3 Add Environment Variables

Click **Variables** tab.

**⚠️ QUAN TRỌNG:** Bạn cần điền TẤT CẢ environment variables.

**Tham khảo file template:**
- `backend/.env.example` - Xem tất cả variables cần thiết
- `docs/ENVIRONMENT_CONFIGURATION.md` - Hướng dẫn chi tiết

**Các biến QUAN TRỌNG nhất:**

```bash
# Application
DEBUG=false
ENVIRONMENT=production
PORT=8000

# Database - Lấy từ Supabase Dashboard
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Redis - Từ Upstash (Step 1)
REDIS_URL=rediss://...

# Celery (dùng cùng Redis)
CELERY_BROKER_URL=rediss://...
CELERY_RESULT_BACKEND=rediss://...

# CORS - Sẽ update sau khi có Vercel URL
CORS_ORIGINS=["https://your-app.vercel.app"]
FRONTEND_URL=https://your-app.vercel.app

# OAuth - Lấy từ Google/Meta/TikTok Console
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
META_APP_ID=...
META_APP_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
```

**📚 Xem chi tiết:** `docs/ENVIRONMENT_CONFIGURATION.md` để biết cách lấy từng credential.

### 2.4 Deploy

1. Railway tự động deploy sau khi add variables
2. Đợi 2-3 phút
3. Check **Deployments** → **View Logs**
4. **Copy Railway URL** từ deployment (dạng `https://xxx.railway.app`)

### 2.5 Test Backend

```bash
curl https://your-backend.railway.app/health

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Step 3: Deploy Frontend lên Vercel (3 phút) ▲

### 3.1 Import Project

1. Truy cập https://vercel.com/new
2. Click **Import Project**
3. Import từ GitHub: `digital-performance-optimizertool`

### 3.2 Configure Build Settings

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Add Environment Variables

Click **Environment Variables**, thêm:

**⚠️ QUAN TRỌNG:** Thay `your-backend.railway.app` bằng Railway URL từ Step 2.4

```bash
# API Configuration
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_BACKEND_URL=https://your-backend.railway.app

# Supabase (same as backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# OAuth (same as backend)
VITE_GOOGLE_CLIENT_ID=...
VITE_META_APP_ID=...
VITE_TIKTOK_CLIENT_KEY=...

# Redirect URIs - Sẽ update sau khi có Vercel URL
VITE_GOOGLE_REDIRECT_URI=https://your-app.vercel.app/auth/oauth/callback
VITE_META_REDIRECT_URI=https://your-app.vercel.app/auth/oauth/callback
VITE_TIKTOK_REDIRECT_URI=https://your-app.vercel.app/auth/oauth/callback

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_EXECUTIVE_DASHBOARD=true
VITE_ENABLE_ADVANCED_ANALYTICS=true

# Production
VITE_DEBUG=false
VITE_LOG_LEVEL=error
VITE_ENVIRONMENT=production
```

**📚 Tham khảo:** `frontend/.env.example` để xem tất cả variables

### 3.4 Deploy

1. Click **Deploy**
2. Đợi 2-3 phút
3. **Copy Vercel URL** (dạng `https://your-app.vercel.app`)

---

## Step 4: Update CORS & Redirect URIs (5 phút) 🔄

### 4.1 Update Backend CORS

Quay lại **Railway** → **Variables**, update:

```bash
CORS_ORIGINS=["https://your-actual-app.vercel.app"]
FRONTEND_URL=https://your-actual-app.vercel.app
ALLOWED_HOSTS=["*.railway.app","your-actual-app.vercel.app"]
```

Replace `your-actual-app.vercel.app` với URL thật từ Step 3.4

### 4.2 Update Google OAuth

1. Truy cập https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. Chọn OAuth 2.0 Client ID của bạn
4. **Authorized redirect URIs** → Add:
   ```
   https://your-app.vercel.app/auth/oauth/callback
   ```
5. Click **Save**

### 4.3 Update Meta/Facebook

1. Truy cập https://developers.facebook.com
2. **My Apps** → Chọn app của bạn
3. **Settings** → **Basic**
4. **App Domains** → Add: `your-app.vercel.app`
5. **Settings** → **Advanced** → **OAuth Redirect URIs** → Add:
   ```
   https://your-app.vercel.app/auth/oauth/callback
   ```
6. Click **Save Changes**

### 4.4 Update TikTok

1. Truy cập https://developers.tiktok.com
2. **My Apps** → Chọn app của bạn
3. **Redirect URIs** → Add:
   ```
   https://your-app.vercel.app/auth/oauth/callback
   ```
4. Save

### 4.5 Redeploy Frontend (nếu cần)

Nếu bạn đã update env vars:
1. Vercel Dashboard → Project → **Deployments**
2. Click **...** → **Redeploy**

---

## Step 5: Verification ✅

### 5.1 Test Backend

```bash
# Health check
curl https://your-backend.railway.app/health

# API endpoints
curl https://your-backend.railway.app/api/v1/

# Should return JSON với danh sách endpoints
```

### 5.2 Test Frontend

1. Mở browser: `https://your-app.vercel.app`
2. Mở DevTools (F12)
3. Check **Console** - Không có errors màu đỏ
4. Check **Network** tab - API calls đến Railway thành công

### 5.3 Test Authentication Flow

1. Click **Login**
2. Thử login với Google/Facebook
3. Verify redirect về app thành công
4. Check dashboard load data

### 5.4 Test Full Integration

- [ ] Login/Logout works
- [ ] Dashboard loads
- [ ] Connect Google Ads works
- [ ] Connect Meta Ads works
- [ ] Data fetching from Supabase works
- [ ] No CORS errors

---

## 🎯 Custom Domain (Optional)

### Setup Custom Domain trên Vercel

1. Vercel Project → **Settings** → **Domains**
2. Add domain: `digitalmkthub.com`
3. Configure DNS records:

**Apex domain (@):**
```
A     @     76.76.21.21
```

**WWW subdomain:**
```
CNAME www   cname.vercel-dns.com
```

4. Đợi DNS propagate (5-30 phút)
5. Update lại tất cả OAuth redirect URIs với domain mới

### Setup Custom Domain cho Backend

1. Railway Project → **Settings** → **Domains**
2. Add: `api.digitalmkthub.com`
3. Configure DNS:
```
CNAME api   xxx.railway.app
```

---

## 🔧 Troubleshooting

### Lỗi: "Backend connection failed"

**Nguyên nhân:** CORS không đúng hoặc Railway URL sai

**Fix:**
```bash
# Check VITE_API_URL trong Vercel
# Check CORS_ORIGINS trong Railway
# Đảm bảo 2 URLs khớp nhau
```

### Lỗi: "Redis connection error"

**Nguyên nhân:** REDIS_URL sai format

**Fix:**
```bash
# Upstash Redis URL phải có 'rediss://' (2 chữ s)
# Không phải 'redis://' (1 chữ s)
REDIS_URL=rediss://default:pass@host.upstash.io:6379
```

### Lỗi: "OAuth redirect_uri_mismatch"

**Nguyên nhân:** Redirect URI chưa được add vào OAuth console

**Fix:**
1. Check exact URL trong error message
2. Add URL đó vào Google/Meta/TikTok console
3. Wait vài phút để update

### Lỗi: Build failed trên Railway/Vercel

**Railway:**
```bash
# Check Python version
# Add runtime.txt với nội dung: python-3.11
```

**Vercel:**
```bash
# Check Node version
# Check env vars có đầy đủ không
# Check build logs trong Vercel dashboard
```

---

## 📊 Monitoring

### Railway Logs

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs -f
```

### Vercel Logs

Dashboard → Project → Deployments → Function Logs

### Upstash Metrics

Console → Database → Metrics tab

---

## 💰 Cost Estimate

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Vercel | Unlimited deployments | $0/month |
| Railway | $5 credit/month | $0-5/month |
| Upstash | 10K commands/day | $0/month |
| **Total** | | **$0-5/month** |

---

## 📝 Checklist

### Before Deploy
- [ ] Có Supabase credentials
- [ ] Có Google OAuth credentials
- [ ] Có Meta/Facebook app credentials (optional)
- [ ] Có TikTok credentials (optional)
- [ ] Repository đã push lên GitHub

### After Deploy
- [ ] Backend health check OK
- [ ] Frontend loads successfully
- [ ] CORS configured correctly
- [ ] OAuth redirect URIs updated
- [ ] All integrations tested
- [ ] Monitoring setup (optional)

---

## 🚀 Next Steps

1. **Setup Custom Domain** - Use `digitalmkthub.com`
2. **Enable Monitoring** - Setup Sentry for error tracking
3. **Configure CI/CD** - Auto-deploy on push
4. **Setup Backups** - Supabase auto-backup
5. **Performance Optimization** - Enable CDN, caching

---

## 📚 Related Documentation

- [Environment Configuration](./ENVIRONMENT_CONFIGURATION.md) - Chi tiết về env vars
- [Supabase Setup](./DATABASE_SETUP_GUIDE.md) - Database configuration
- [Backend API](./BACKEND_IMPLEMENTATION_PLAN.md) - API endpoints

---

## 📞 Need Help?

**Platform Support:**
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Upstash: https://upstash.com/docs

**Project Support:**
- GitHub Issues: https://github.com/kevinnguyen271090/digital-performance-optimizertool/issues
- Email: info@digitalmkthub.com

---

**🎉 Deployment Complete!**

Your app is live at:
- ✅ Frontend: `https://your-app.vercel.app`
- ✅ Backend: `https://your-backend.railway.app`
- ✅ Redis: Managed by Upstash
- ✅ Database: Supabase

**Total setup time:** ~15 minutes
**Monthly cost:** $0-5 (mostly free tier)
