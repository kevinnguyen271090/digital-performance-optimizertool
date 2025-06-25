# Avenger Hub - Digital Performance Optimizer

## Tổng quan sản phẩm

- **Dashboard:**
  - Trang phân tích nhanh, trực quan, cập nhật real-time cho quản trị/marketing.
  - Hiển thị KPI tổng quan, so sánh đa kênh, insight/cảnh báo, filter nhanh, drill-down, responsive.
  - Dữ liệu lấy từ nguồn thật (Supabase, Google Sheet, API), không dùng mockdata.
  - **Không còn tính năng xuất PDF trên Dashboard** (tính năng này đã chuyển sang trang Report).

- **Report:**
  - Trang tạo báo cáo tuỳ biến (Custom Report), quản lý lịch sử báo cáo.
  - Có các template mẫu (báo cáo tổng quan, từng kênh, mục tiêu, v.v.).
  - Cho phép kéo thả block KPI, bảng, biểu đồ, insight để tự thiết kế layout báo cáo.
  - Chọn filter, khoảng thời gian, kênh, trường dữ liệu, nhóm/sắp xếp.
  - Preview trực tiếp trước khi xuất PDF/CSV.
  - Lưu lại cấu hình báo cáo để tái sử dụng, chia sẻ, xuất nhiều lần.
  - Quản lý lịch sử báo cáo đã xuất (Report/History).

- **Recommendations:**
  - Trang tổng hợp AI Insights, cảnh báo, gợi ý tối ưu, dự báo bất thường.

## Lưu ý
- Dashboard = phân tích nhanh, real-time, không xuất PDF.
- Report = tuỳ biến sâu, xuất PDF/CSV, template mẫu, kéo thả, lưu lịch sử.
- Recommendations = AI Insights, cảnh báo, gợi ý tối ưu.

Ứng dụng dashboard toàn diện để theo dõi và tối ưu hiệu suất marketing đa nền tảng, tích hợp các công cụ digital marketing phổ biến.

## 🚀 Tính năng chính

- **Dashboard tổng quan** với KPI cards và metrics real-time
- **Quản lý mục tiêu marketing** với tracking và analytics
- **Tích hợp đa nền tảng**: Meta, Google, TikTok, WooCommerce
- **Onboarding tour tương tác** cho người dùng mới
- **Date range picker** linh hoạt
- **Account selector** cho multi-account management
- **Dark/Light theme** toggle
- **Responsive design** cho mọi thiết bị

## 🏗️ Cấu trúc dự án (Sau refactor)

```
src/
├── components/
│   ├── dashboard/           # Components con cho Dashboard
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardViewToggle.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── DashboardPlatforms.tsx
│   │   ├── DashboardChannels.tsx
│   │   └── DashboardExecutive.tsx
│   ├── settings/           # Components cho Settings
│   └── ui/                 # UI components chung
├── hooks/                  # Custom hooks
│   ├── useGoals.ts         # Quản lý goals
│   ├── useDateRange.ts     # Quản lý date range
│   ├── useAccountSelection.ts # Quản lý account selection
│   └── useDashboardData.ts # Quản lý dashboard data
├── types/                  # TypeScript types
│   ├── dashboard.ts        # Types cho dashboard
│   ├── goals.ts           # Types cho goals
│   ├── platform.ts        # Types cho platforms
│   └── common.ts          # Common types
├── constants/              # Constants và config
│   ├── dashboard.ts       # Dashboard constants
│   ├── platforms.ts       # Platform constants
│   └── goals.ts          # Goal constants
├── utils/                  # Utilities và services
└── pages/                  # Page components
```

## 🎯 Nguyên tắc thiết kế

- **Separation of Concerns**: Tách biệt logic, UI và data
- **Reusability**: Components có thể tái sử dụng
- **Type Safety**: Sử dụng TypeScript nghiêm ngặt
- **Maintainability**: Code dễ bảo trì và mở rộng
- **Performance**: Tối ưu bundle size và loading time

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Custom Hooks
- **UI Components**: Lucide React Icons
- **Tour Guide**: React Joyride
- **Backend**: Supabase (planned)
- **Deployment**: Vercel/Netlify

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
cd digital-performance-optimizer
npm install
```

### Chạy development server
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build production
```bash
npm run build
```

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env.local` trong thư mục gốc:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Platform Integrations
Các platform integrations được cấu hình trong `src/constants/platforms.ts`

## 📊 Tính năng chi tiết

### Dashboard Views
1. **Overview**: Tổng quan KPI và goals
2. **Executive**: Báo cáo cấp quản lý
3. **Platforms**: Chi tiết từng nền tảng
4. **Channels**: Phân tích kênh marketing

### Goals Management
- Tạo, chỉnh sửa, xóa mục tiêu
- Tracking progress real-time
- Multiple metrics support
- Period-based goals

### Platform Integrations
- **Meta**: Facebook, Instagram, Ads Manager
- **Google**: Analytics, Ads, Search Console
- **TikTok**: Business, Ads, Shop
- **WooCommerce**: E-commerce analytics

## 🎨 UI/UX Features

### Onboarding Tour
- Hướng dẫn tương tác cho người dùng mới
- Sử dụng React Joyride
- Customizable steps và styling

### Theme System
- Dark/Light mode toggle
- Consistent color scheme
- Responsive design

### Loading States
- Skeleton loading
- Progress indicators
- Error handling

## 🔄 Recent Updates (Tháng 6/2024)

### ✅ Refactor Progress
- [x] Tách Dashboard.tsx thành các components nhỏ
- [x] Tạo custom hooks cho state management
- [x] Tách types và interfaces
- [x] Tạo constants files
- [x] Clean up unused imports
- [x] Cải thiện type safety

### 🎯 Benefits của refactor
- **Maintainability**: Code dễ bảo trì và debug
- **Reusability**: Components có thể tái sử dụng
- **Performance**: Bundle size nhỏ hơn
- **Developer Experience**: Dễ dàng tìm và sửa code
- **Type Safety**: TypeScript strict mode

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Basic dashboard structure
- [x] Core components
- [x] TypeScript setup
- [x] Basic integrations

### Phase 2: Core Integrations 🏗️
- [ ] Meta platform integration
- [ ] Google Analytics integration
- [ ] Basic reporting

### Phase 3: Advanced Features 📅
- [ ] Advanced analytics
- [ ] Cross-platform attribution
- [ ] Custom dashboards

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Coding Standards

### TypeScript
- Sử dụng strict mode
- Define types cho tất cả props và state
- Avoid `any` type khi có thể

### React
- Sử dụng functional components
- Prefer hooks over class components
- Keep components small và focused

### File Structure
- Mỗi component một file
- Group related components trong thư mục
- Use index files cho exports

## 🐛 Troubleshooting

### Common Issues
1. **TypeScript errors**: Chạy `npm run type-check`
2. **Build errors**: Xóa `node_modules` và `npm install`
3. **Port conflicts**: Thay đổi port trong package.json

### Debug Mode
```bash
npm run start:debug
```

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

- **Issues**: Tạo issue trên GitHub
- **Documentation**: Xem [PLANNING.md](PLANNING.md) để biết roadmap chi tiết
- **Email**: contact@example.com

## 🚩 Định hướng phát triển & Kiến trúc dữ liệu (Checkpoint 07/2024)

- Luôn sử dụng dữ liệu thật từ Google Sheets, không dùng mockup.
- Giao diện mapping động, validate realtime, báo lỗi rõ ràng, hướng dẫn sửa cụ thể.
- Lưu cấu hình mapping cho từng kết nối, cho phép chỉnh sửa, đồng bộ lại.
- Import dữ liệu vào database nội bộ, dashboard/report chỉ lấy dữ liệu từ DB, không gọi Google API mỗi lần.
- Xây dựng module tạo report/dashboard động giống Looker Studio/Power BI.

**Kiến trúc dữ liệu:**
- Bảng metadata kết nối, bảng dữ liệu động (jsonb), bảng mapping, bảng report/dashboard.
- Lưu lịch sử mapping, import, trạng thái đồng bộ.

## 🚩 Mở rộng database & tối ưu hiệu suất (Checkpoint 07/2024)

### Các bảng mới đã tạo:
- **notifications:** Lưu thông báo cho user (báo lỗi, nhắc nhở, trạng thái import...)
- **activity_logs:** Lưu lịch sử thao tác, audit trail, log lỗi.
- **shared_reports:** Chia sẻ report/dashboard giữa các user, phân quyền view/edit.
- **scheduled_jobs:** Lên lịch tự động import, sync, gửi báo cáo.
- **organizations, organization_members:** Hỗ trợ tổ chức/team, phân quyền nội bộ.
- **api_keys:** Quản lý API key cho tích hợp ngoài.

### Phương án tối ưu database & hiệu suất:
- Chỉ lưu dữ liệu cần thiết, dùng jsonb cho dữ liệu động.
- Luôn bật RLS, policy bảo mật chặt chẽ.
- Index các trường truy vấn nhiều (user_id, report_id, organization_id...)
- Hạn chế join phức tạp, ưu tiên truy vấn theo user.
- Lên lịch dọn dẹp log, notification cũ.
- Sử dụng Supabase Storage cho file lớn.
- Theo dõi chi phí, tối ưu query, chỉ import dữ liệu cần thiết.

## Checkpoint: Tự động hóa dọn dẹp dữ liệu (Data Cleanup Automation)

- Đã triển khai tự động hóa dọn dẹp dữ liệu bằng extension `pg_cron` của Postgres.
- Lịch chạy: 2h sáng chủ nhật hàng tuần.
- Các hàm cleanup:
  - `cleanup_old_notifications()`
  - `cleanup_old_activity_logs()`
  - `cleanup_old_imported_data()`
- Kiểm tra log job:
  ```sql
  select * from cron.job_run_details order by end_time desc limit 10;
  ```
- Không cần sử dụng Edge Function schedule hoặc dịch vụ cron ngoài cho các tác vụ này.
- Đảm bảo các hàm cleanup hoạt động đúng, kiểm tra log định kỳ để phát hiện lỗi sớm.

**Digital Performance Optimizer** - Tối ưu hiệu suất marketing đa nền tảng 🚀

> **Lưu ý:** Nếu phát triển thêm các tính năng lớn (ví dụ: workflow, automation, phân quyền nâng cao...), cần đánh giá lại database, bổ sung bảng mới nếu cần, và cập nhật tài liệu này để team không bị quên.