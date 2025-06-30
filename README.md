# Digital Performance Optimizer 🚀

**Enterprise-grade digital marketing analytics platform** - Tối ưu hiệu suất marketing đa nền tảng với AI insights và automation.

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

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd digital-performance-optimizer
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
# Edit .env với Supabase credentials
```

4. **Setup HTTPS Development Server**
```bash
# Cài đặt mkcert (tải từ https://github.com/FiloSottile/mkcert/releases)
C:\mkcert\mkcert.exe -install
C:\mkcert\mkcert.exe localhost 127.0.0.1 ::1

# Copy certificate files
copy "localhost+2.pem" "server.cert"
copy "localhost+2-key.pem" "server.key"
```

5. **Start development server**
```bash
npm run dev
```

**Access**: https://localhost:3000

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── dashboard/       # Dashboard components
│   ├── profile/         # Profile management
│   ├── settings/        # Platform connections
│   └── google-sheets/   # Google Sheets integration
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript definitions
├── constants/           # App constants
└── config/              # Environment configs
```

## 🔧 Development

### HTTPS Development
Dự án được cấu hình để chạy HTTPS trên localhost với certificate mkcert:
- **URL**: https://localhost:3000
- **Certificate**: mkcert localhost certificate
- **Browser**: No security warnings
- **OAuth**: Fully compatible với OAuth providers

### Available Scripts
```bash
npm run dev          # Start development server (HTTPS)
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🗄️ Database

### Supabase Setup
1. Tạo project trên Supabase
2. Copy URL và anon key vào `.env`
3. Chạy SQL scripts trong `scripts/`

### Required Tables
- `organizations` - Organization management
- `connections` - Platform connections
- `analytics_data` - Analytics data storage
- `audit_logs` - Activity logging
- `user_2fa` - Two-factor authentication

## 🔐 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth Providers
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_META_APP_ID=your_meta_app_id
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_WOOCOMMERCE_CONSUMER_KEY=your_woocommerce_key
```

## 📊 Features Overview

### Dashboard
- **Real-time Metrics** - Live performance data
- **Multi-Platform View** - Unified analytics across platforms
- **AI Insights** - Automated optimization recommendations
- **Custom Date Ranges** - Flexible time period analysis

### Profile Management
- **User Profiles** - Complete user information management
- **Organization Settings** - Multi-org support
- **Security Settings** - 2FA, password management
- **Avatar Upload** - Profile picture management

### Platform Integration
- **Google Analytics** - GA4 data integration
- **Meta Ads** - Facebook/Instagram ads data
- **TikTok Ads** - Video advertising analytics
- **WooCommerce** - E-commerce performance
- **Google Sheets** - Data export và reporting

### Enterprise Features
- **Performance Monitoring** - Component và API performance
- **Error Tracking** - Comprehensive error logging
- **User Analytics** - Behavior tracking và insights
- **Caching** - Multi-level caching strategy
- **Offline Support** - Service worker implementation

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect repository
2. Set environment variables
3. Deploy automatically

## 📚 Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Refactor Progress](./docs/REFACTOR_PROGRESS.md) - Development progress
- [Component Architecture](./docs/COMPONENT_ARCHITECTURE.md) - Component structure
- [Database Overview](./docs/DATABASE_OVERVIEW.md) - Database schema
- [Enterprise Features](./docs/ENTERPRISE_FEATURES.md) - Enterprise capabilities

## 🔧 Troubleshooting

### Common Issues

#### Certificate Errors
```bash
# Fix "key values mismatch" error
del server.cert server.key
C:\mkcert\mkcert.exe localhost 127.0.0.1 ::1
copy "localhost+2.pem" "server.cert"
copy "localhost+2-key.pem" "server.key"
```

#### Port Issues
```bash
# Check port usage
netstat -ano | findstr :3000
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🆘 Support

- **Documentation**: Check [docs](./docs/) folder
- **Issues**: Create GitHub issue
- **Email**: support@example.com

---

**Built with ❤️ for enterprise digital marketing teams**

**Status**: ✅ Production Ready | 🏢 Enterprise Grade | 🚀 HTTPS Development

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

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library

---

**Digital Performance Optimizer** - Tối ưu hiệu suất marketing đa nền tảng 🚀

> **Lưu ý**: Đây là dự án đang phát triển. Vui lòng xem [roadmap](./docs/PLANNING.md) để biết thêm chi tiết về các tính năng sắp tới. 