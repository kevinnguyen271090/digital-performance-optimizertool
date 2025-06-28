# Digital Performance Optimizer 🚀

**Dashboard toàn diện để theo dõi và tối ưu hiệu suất marketing đa nền tảng**

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Tổng quan

Digital Performance Optimizer là một ứng dụng dashboard chuyên nghiệp để theo dõi và tối ưu hiệu suất marketing đa nền tảng. Ứng dụng tích hợp các công cụ digital marketing phổ biến như Meta, Google, TikTok, LinkedIn, Shopify và các công cụ Email Marketing, CRM.

### ✨ Tính năng chính

- **📊 Dashboard đa nền tảng**: Tích hợp Google Analytics, Meta Ads, TikTok Ads, WooCommerce
- **🔐 Multi-tenant architecture**: Hỗ trợ nhiều tổ chức với Row-Level Security
- **⚡ Real-time data**: Cập nhật dữ liệu gần thời gian thực (15-30 phút)
- **🎨 Giao diện responsive**: Tối ưu cho desktop, tablet và mobile
- **🔒 Bảo mật enterprise-grade**: OAuth 2.0, RLS, audit trail
- **📈 Performance tối ưu**: Caching strategy nhiều tầng

## 🏗️ Kiến trúc

### Data Pipeline
```
User Connection → OAuth → Store Credentials → ETL Jobs → Data Warehouse → Dashboard
```

### Multi-Tenancy
- **Row-Level Security (RLS)** cho tách biệt dữ liệu
- **Organization-based access control**
- **Role-based permissions** (Owner, Admin, Member, Viewer)

### Caching Strategy
- **Layer 1**: Postgres materialized views
- **Layer 2**: Redis (khi cần)
- **Layer 3**: CDN cho static assets
- **Layer 4**: Browser cache

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- Supabase account
- Google Cloud account (cho OAuth)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd digital-performance-optimizer
```

### 2. Install Dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Setup Environment
```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_META_APP_ID=your_meta_app_id
```

### 4. Setup Database
Chạy script SQL trong Supabase SQL Editor (xem [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md))

### 5. Start Development Server
```bash
npm run dev
```

Truy cập: http://localhost:5173

## 📋 Setup Chi tiết

Xem hướng dẫn setup chi tiết tại: [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)

### Các bước chính:
1. **Setup Supabase Project** - Database schema, RLS policies
2. **Setup OAuth Apps** - Google, Meta, TikTok
3. **Deploy Edge Functions** - ETL jobs
4. **Configure Cron Jobs** - Data sync scheduling
5. **Production Deployment** - Vercel, custom domain

## 🏛️ Kiến trúc Database

### Core Tables
```sql
organizations          -- Quản lý tổ chức
organization_members   -- Thành viên tổ chức
connections           -- Kết nối nền tảng
analytics_data        -- Dữ liệu analytics real-time
imported_data         -- Dữ liệu historical
audit_logs            -- Audit trail
error_logs            -- Error tracking
```

### Data Flow
```
API Sources → Edge Functions → analytics_data → Materialized Views → Dashboard
```

## 🎨 Giao diện

### Dashboard Features
- **KPI Cards**: Revenue, ROAS, CPA, Conversions
- **Multi-channel Charts**: So sánh hiệu suất đa nền tảng
- **Real-time Updates**: Cập nhật tự động mỗi 15-30 phút
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Dark/Light Mode**: Tùy chọn giao diện

### Role-based Views
- **CEO/Director**: Dashboard tổng quan, quản lý tổ chức
- **Admin**: Quản lý kết nối, user management
- **Member**: Xem dashboard, báo cáo
- **Viewer**: Chỉ xem dữ liệu được phân quyền

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Build production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

### Project Structure
```
src/
├── components/          # React components
│   ├── dashboard/       # Dashboard components
│   ├── settings/        # Settings components
│   └── ui/             # UI components
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── utils/              # Utilities
├── constants/          # Constants
└── pages/              # Page components
```

## 📊 Performance & Scaling

### Current Performance
- **Query Response**: < 100ms (cached data)
- **Data Freshness**: 15-30 minutes
- **Concurrent Users**: 1000+ (Supabase Pro)
- **Data Retention**: 1 year hot, 5 years cold

### Scaling Strategy
- **Phase 1 (MVP)**: Supabase Pro ($25/month)
- **Phase 2 (Growth)**: Supabase + Tinybird ($100/month)
- **Phase 3 (Scale)**: Enterprise solution ($200/month)

## 🔒 Security

### Security Features
- **OAuth 2.0**: Secure authentication
- **Row-Level Security**: Data isolation
- **Audit Trail**: Complete activity logging
- **Encryption**: Data at rest and in transit
- **GDPR Compliance**: Data privacy ready

### Multi-tenant Security
```sql
-- RLS Policy example
CREATE POLICY "Users can only access their organization data" 
ON analytics_data FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));
```

## 📈 Roadmap

### Phase 1: MVP (2-3 tháng)
- [x] Basic ETL pipeline
- [x] Multi-tenant auth
- [x] Google Analytics integration
- [x] Meta Ads integration
- [x] Simple dashboard

### Phase 2: Growth (3-4 tháng)
- [ ] Advanced caching
- [ ] Materialized views
- [ ] WooCommerce integration
- [ ] TikTok Ads integration
- [ ] Custom dashboards

### Phase 3: Scale (4-6 tháng)
- [ ] AI insights
- [ ] Predictive analytics
- [ ] Advanced RBAC
- [ ] API marketplace
- [ ] White-label solutions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

### Backend
- **Supabase** - Database, Auth, Edge Functions
- **PostgreSQL** - Primary database
- **pg_cron** - Scheduled jobs
- **Row-Level Security** - Data isolation

### Integrations
- **Google Analytics 4** - Website analytics
- **Google Ads** - PPC advertising
- **Meta Ads** - Social advertising
- **TikTok Ads** - Video advertising
- **WooCommerce** - E-commerce data

## 📚 Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- [Planning](./docs/PLANNING.md) - Kiến trúc và roadmap
- [API Reference](./docs/API.md) - API documentation
- [Contributing](./docs/CONTRIBUTING.md) - Hướng dẫn đóng góp

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library

---

**Digital Performance Optimizer** - Tối ưu hiệu suất marketing đa nền tảng 🚀

> **Lưu ý**: Đây là dự án đang phát triển. Vui lòng xem [roadmap](./docs/PLANNING.md) để biết thêm chi tiết về các tính năng sắp tới. 