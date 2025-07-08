# Digital Performance Optimizer (Avenger Hub)

## 🏗️ Cấu trúc dự án (Monorepo)

```
digital-performance-optimizer/
├── frontend/                     # React + Vite Frontend
│   ├── src/                      # Source code
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── ... (các file cấu hình frontend)
├── backend/                      # Python FastAPI Backend
│   ├── app/                      # Backend source code
│   ├── requirements.txt          # Python dependencies
│   └── ... (các file cấu hình backend)
├── scripts/                      # SQL scripts, database setup
├── supabase/                     # Supabase config, edge functions
├── docs/                         # Tài liệu dự án
└── README.md                     # File này
```

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database Setup
```bash
# Chạy các script SQL trong thư mục scripts/
```

## 📚 Documentation

- [Architecture Overview](docs/Architecture%20of%20system.md)
- [Current Status](docs/CURRENT_STATUS.md)
- [Setup Guide](docs/SETUP_GUIDE.md)
- [Backend Implementation Plan](docs/BACKEND_IMPLEMENTATION_PLAN.md)
- [Component Architecture](docs/COMPONENT_ARCHITECTURE.md)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Python FastAPI, Celery, Redis
- **Database**: Supabase (PostgreSQL + RLS)
- **Deployment**: Vercel/Netlify (Frontend), DigitalOcean/AWS (Backend)

## 📊 Features

- ✅ Dashboard tổng quan với KPI real-time
- ✅ Quản lý mục tiêu marketing
- ✅ Tích hợp đa nền tảng (Meta, Google, WooCommerce)
- ✅ 2FA Authentication
- ✅ Multi-tenant architecture
- ✅ AI Insights & Analytics
- ✅ Background data processing

## 🔧 Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- Redis
- Supabase account

### Environment Setup
1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Copy `backend/env.example` to `backend/.env`
3. Update environment variables

### Running the Application
```bash
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 3: Redis
redis-server

# Terminal 4: Celery Worker
cd backend && celery -A app.core.celery worker --loglevel=info

# Terminal 5: Celery Beat
cd backend && celery -A app.core.celery beat --loglevel=info
```

## 📝 License

MIT License

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

## 🎯 **TỔNG QUAN**

Digital Performance Optimizer là một nền tảng phân tích hiệu suất marketing kỹ thuật số toàn diện, được thiết kế để giúp các doanh nghiệp tối ưu hóa chiến dịch marketing và tăng ROI.

## ✨ **TÍNH NĂNG CHÍNH**

### 📊 **Dashboard Analytics**
- **Overview**: KPIs tổng quan, trends, insights
- **Executive**: Business metrics, funnel analysis
- **Channel Detail**: Deep dive analytics cho từng kênh
- **Real-time Monitoring**: Live performance tracking

### 📋 **Reports System**
- **Custom Reports**: Drag & drop builder
- **Advanced Analytics**: Attribution, Cohort, Predictive
- **Saved Reports**: Management và sharing
- **Export Options**: PDF, Excel, CSV

### ⚙️ **Settings & Management**
- **Platform Connections**: Google, Meta, TikTok, WooCommerce
- **User Management**: Profiles, permissions, organizations
- **Security**: 2FA, OAuth, role-based access
- **Data Export/Import**: Backup và restore

## 🚀 **QUICK START**

### **Prerequisites**
- Node.js 18+ 
- npm hoặc yarn
- Git

### **Installation**
```bash
# Clone repository
git clone [repository-url]
cd digital-performance-optimizer

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### **Access**
- **Local:** https://localhost:3000
- **HTTPS:** Enabled với SSL certificate
- **Default:** Dashboard Overview

## 🏗️ **TECHNOLOGY STACK**

### **Frontend**
- **React 18** + TypeScript
- **Tailwind CSS** + Shadcn/ui
- **Vite** build tool
- **Recharts** data visualization
- **Lucide React** icons

### **Backend** (Planned)
- **FastAPI** Python framework
- **Supabase** database
- **PostgreSQL** data storage
- **Redis** caching

### **Integrations**
- **Google Analytics** + Google Ads
- **Meta Business** + Facebook Ads
- **TikTok Ads**
- **WooCommerce**
- **Email Marketing**

## 📁 **PROJECT STRUCTURE**

```
digital-performance-optimizer/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   └── types/          # TypeScript types
├── backend/                 # FastAPI backend (planned)
├── docs/                   # Documentation
├── scripts/                # Database scripts
└── supabase/              # Supabase config
```

## 🔒 **SECURITY**

### **⚠️ Known Issues**
- **SheetJS Vulnerability**: High severity vulnerability trong package `xlsx`
  - **Status**: No fix available
  - **Impact**: Prototype Pollution, ReDoS attacks
  - **Mitigation**: Chỉ xử lý file Excel từ nguồn tin cậy
  - **Monitoring**: Theo dõi SheetJS updates

### **Security Features**
- ✅ HTTPS enabled
- ✅ Input validation
- ✅ XSS protection
- ✅ OAuth 2.0 authentication
- ✅ Role-based access control

**Chi tiết:** Xem [SECURITY.md](./docs/SECURITY.md)

## 📚 **DOCUMENTATION**

### **Development**
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Component Architecture](./docs/COMPONENT_ARCHITECTURE.md)
- [Data Source Strategy](./docs/DATA_SOURCE_STRATEGY.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)

### **Features**
- [Dashboard Guide](./docs/DASHBOARD_GUIDE.md)
- [Reports System](./docs/ADVANCED_ANALYTICS_PLAN.md)
- [Database Overview](./docs/DATABASE_OVERVIEW.md)
- [API Documentation](./docs/FRONTEND_BACKEND_INTEGRATION.md)

### **Progress**
- [Current Status](./docs/CURRENT_STATUS.md)
- [Development Plan](./docs/DEVELOPMENT_PLAN.md)
- [Progress Tracking](./docs/PROGRESS.md)

## 🎯 **FEATURES ROADMAP**

### **Phase 1: Core Dashboard** ✅
- [x] Overview analytics
- [x] Executive dashboard
- [x] Channel detail views
- [x] Basic reporting

### **Phase 2: Advanced Analytics** 🔄
- [x] Attribution analysis
- [ ] Cohort analysis
- [ ] Predictive analytics
- [ ] Competitive intelligence

### **Phase 3: Enterprise Features** 📋
- [ ] Custom report builder
- [ ] Team collaboration
- [ ] Advanced permissions
- [ ] API integrations

### **Phase 4: Backend Integration** 📋
- [ ] FastAPI backend
- [ ] Real data processing
- [ ] Database optimization
- [ ] Production deployment

## 🤝 **CONTRIBUTING**

### **Development Guidelines**
1. Fork repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Conventional Commits**: Git commit messages

## 📄 **LICENSE**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **SUPPORT**

### **Contact**
- **Email**: [support@email.com]
- **Documentation**: [docs-url]
- **Issues**: [GitHub Issues]

### **Community**
- **Discord**: [Discord Server]
- **Twitter**: [@handle]
- **Blog**: [Blog URL]

---

**Version:** 0.1.0  
**Last Updated:** January 2024  
**Status:** 🚀 **Active Development** 