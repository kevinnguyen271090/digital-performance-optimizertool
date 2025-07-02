# 🚀 Quick Start Guide

## Bắt đầu nhanh trong 5 phút

### 1. Clone và Setup
```bash
# Clone repository
git clone <your-repo-url>
cd digital-performance-optimizer

# Chạy setup script tự động
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Setup Supabase (2 phút)
1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Copy Project URL và anon key
4. Cập nhật `.env.local`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database (1 phút)
**Option A: Clean Setup (Recommended)**
1. Mở Supabase Dashboard → SQL Editor
2. Copy và paste toàn bộ nội dung từ `scripts/setup-database-simple.sql`
3. Chạy script

**Option B: Safe Setup (Nếu bảng đã tồn tại)**
1. Mở Supabase Dashboard → SQL Editor
2. Copy và paste toàn bộ nội dung từ `docs/SETUP_GUIDE.md` phần "Setup Database Schema"
3. Chạy script

### 4. Khởi động Development Server
```bash
npm run dev
```

Truy cập: http://localhost:5173

## ✅ Kiểm tra Setup

### Database Connection
- [ ] App load không lỗi
- [ ] Có thể đăng ký user mới
- [ ] User được tạo organization tự động

### Basic Features
- [ ] Dashboard hiển thị
- [ ] Settings page load
- [ ] Dark/Light mode toggle

## 🔧 Troubleshooting

### Lỗi thường gặp

#### "Supabase connection failed"
```bash
# Kiểm tra .env.local
cat .env.local | grep VITE_SUPABASE

# Kiểm tra Supabase project status
# Truy cập Supabase Dashboard
```

#### "Database schema error"
```sql
-- Kiểm tra tables đã tạo
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

#### "OAuth redirect error"
```
# Kiểm tra redirect URIs trong OAuth apps
# Đảm bảo http://localhost:5173 được thêm
```

#### "ERROR: 42P07: relation already exists" ⚠️
Đây là lỗi phổ biến khi chạy script SQL nhiều lần. Có 2 cách xử lý:

**Cách 1: Sử dụng script an toàn (Recommended)**
```sql
-- Chạy script này thay vì script cũ
-- Copy toàn bộ nội dung từ scripts/setup-database.sql
```

**Cách 2: Xóa bảng cũ thủ công**
```sql
-- Xóa các bảng cũ theo thứ tự dependency
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analytics_data CASCADE;
DROP TABLE IF EXISTS imported_data CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Sau đó chạy lại script tạo bảng
```

**Cách 3: Kiểm tra trạng thái database**
```sql
-- Chạy script kiểm tra
-- Copy toàn bộ nội dung từ scripts/check-database.sql
```

## 📚 Tài liệu chi tiết

- [Setup Guide](./docs/SETUP_GUIDE.md) - Hướng dẫn setup đầy đủ
- [Planning](./docs/PLANNING.md) - Kiến trúc và roadmap
- [Checklist](./docs/SETUP_CHECKLIST.md) - Checklist theo dõi tiến độ

## 🎯 Next Steps

Sau khi setup thành công:

1. **Setup OAuth Apps** - Google, Meta, TikTok
2. **Deploy Edge Functions** - ETL jobs
3. **Test Integrations** - Kết nối platforms
4. **Customize Dashboard** - Thêm KPI, charts
5. **Deploy Production** - Vercel deployment

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [docs/](./docs/)
- **Community**: [Discussions](https://github.com/your-repo/discussions)

---

**Digital Performance Optimizer** - Setup nhanh chóng, hiệu quả cao! 🚀 