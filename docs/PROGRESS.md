# Nhật ký tiến độ - Digital Performance Optimizer

File này ghi lại các thay đổi, quyết định và tiến độ của dự án theo từng ngày.

---

## 📊 Trạng thái tổng quan

### ✅ Đã hoàn thành (Done)
- [x] Thiết lập dự án và UI cơ bản
- [x] Hệ thống xác thực người dùng (Supabase Auth)
- [x] Kết nối nền tảng bên ngoài (Meta, Google, TikTok, WooCommerce)
- [x] Dashboard với dữ liệu thực
- [x] Dashboard thông minh theo nền tảng
- [x] Quản lý hồ sơ cá nhân (profile)
- [x] Hệ thống tổ chức (organization), phân quyền
- [x] Bảo mật RLS, ON DELETE CASCADE
- [x] Refactor code thành Enterprise level
- [x] Tự động hóa dọn dẹp dữ liệu (pg_cron)

### ➖ Đang làm (In Progress)
- [ ] Lịch sử hoạt động, thông báo
- [ ] Dashboard, báo cáo nâng cao

### ⬜ Chưa làm (Not Started)
- [ ] Báo cáo tự động PDF/Excel
- [ ] Recommendations Engine AI-powered
- [ ] Advanced Analytics (cohort, funnel, attribution)
- [ ] Deployment và Production

---

### **Ngày 25/07/2024**

**✅ Đã hoàn thành:**

1.  **Gỡ lỗi giao diện (UI Debugging):**
    - Chẩn đoán và xác định nguyên nhân lỗi `z-index` và `overflow` khiến cho `DropdownMenu` của User Profile bị che khuất bởi các thành phần khác.
    - Lỗi xuất phát từ `react-joyride` (component `OnboardingTour`) và thứ tự xếp lớp (stacking context) của `header`.

2.  **Tái cấu trúc (Refactoring):**
    - **Quyết định:** Thay thế `DropdownMenu` bằng một `UserProfileModal` dạng popup (panel trượt từ bên phải) để mang lại trải nghiệm người dùng tốt hơn và giải quyết triệt để vấn đề `z-index`.
    - Tạo component mới `UserProfileModal.tsx`.
    - Cập nhật `AppLayout.tsx` để sử dụng modal mới, loại bỏ hoàn toàn code dropdown cũ.

3.  **Tích hợp Backend (Supabase):**
    - **Khởi tạo Database:** Thiết lập thành công project trên Supabase.
    - **Tạo Cấu trúc Dữ liệu:** Viết và chạy script SQL để tạo bảng `connections`. Bảng này có các cột quan trọng như `user_id`, `platform`, `credentials` (JSONB), và `status`.
    - **Bảo mật:** Kích hoạt Row Level Security (RLS) và tạo các policy để đảm bảo người dùng chỉ có thể truy cập và chỉnh sửa dữ liệu của chính họ.

**🎯 Mục tiêu tiếp theo:**

-   **Tích hợp `Settings.tsx` với Database:**
    -   Chỉnh sửa trang `Settings` để lưu thông tin kết nối (access tokens, API keys) vào bảng `connections` trong Supabase.
    -   Đọc trạng thái kết nối từ database để hiển thị đúng trên giao diện, kể cả sau khi người dùng tải lại trang. 

## Cột mốc đã hoàn thành ✅

### 1. Thiết lập dự án và UI cơ bản
- [x] Tạo React app với TypeScript
- [x] Cài đặt Tailwind CSS và shadcn/ui
- [x] Xây dựng layout và navigation
- [x] Tạo các trang cơ bản (Dashboard, Settings, Reports, Recommendations)

### 2. Hệ thống xác thực người dùng
- [x] Tích hợp Supabase Auth
- [x] Tạo trang đăng nhập/đăng ký
- [x] Implement Protected Routes
- [x] Tạo UserProfileModal cho quản lý tài khoản

### 3. Kết nối nền tảng bên ngoài
- [x] Thiết kế database schema cho connections
- [x] Tạo giao diện kết nối Meta, Google, TikTok, WooCommerce
- [x] Implement OAuth flow cho các nền tảng
- [x] Lưu trữ credentials an toàn trong Supabase
- [x] Cập nhật trạng thái kết nối real-time

### 4. Dashboard với dữ liệu thực ⭐ MỚI
- [x] Tạo service để lấy dữ liệu từ các API nền tảng
- [x] Implement fetchAllPlatformData() để tổng hợp dữ liệu
- [x] Cập nhật Dashboard để hiển thị dữ liệu thực thay vì mock data
- [x] Thêm loading state và error handling
- [x] Tự động phát hiện nền tảng đã kết nối
- [x] Tính toán metrics tổng hợp (CTR, CPA, ROAS) từ dữ liệu thực

### 5. Dashboard thông minh theo nền tảng ⭐ MỚI NHẤT
- [x] Tạo PlatformDashboard component cho từng nền tảng riêng biệt
- [x] Implement view toggle giữa "Tổng quan" và "Theo nền tảng"
- [x] KPI cards động theo nền tảng đã kết nối
- [x] Platform-specific insights và metrics
- [x] Responsive design cho mọi loại khách hàng

## Các tính năng đã hoạt động

### ✅ Xác thực và Bảo mật
- Đăng ký/đăng nhập bằng email
- Session management với Supabase
- Row Level Security cho dữ liệu người dùng
- Protected routes

### ✅ Kết nối nền tảng
- Meta (Facebook/Instagram) - OAuth flow
- Google Analytics - OAuth flow  
- TikTok - OAuth flow
- WooCommerce - API credentials
- Lưu trữ an toàn trong database
- Cập nhật trạng thái real-time

### ✅ Dashboard thông minh
- **View tổng quan**: Hiển thị dữ liệu tổng hợp từ tất cả nền tảng
- **View theo nền tảng**: Dashboard riêng cho từng platform
- **KPI động**: Chỉ hiển thị metrics phù hợp với nền tảng đã kết nối
- **Fallback graceful**: Tự động chuyển về demo data nếu chưa kết nối
- **Platform-specific insights**: Thông tin chi tiết cho từng nền tảng
- **Responsive design**: Hoạt động tốt trên mọi thiết bị

### ✅ UX tối ưu cho mọi loại khách hàng
- **Khách hàng 1-2 nền tảng**: Dashboard tập trung vào metrics phù hợp
- **Khách hàng 3-4 nền tảng**: Tổng quan toàn diện + chi tiết từng nền tảng
- **Khách hàng chưa kết nối**: Demo data + hướng dẫn kết nối
- **Chuyển đổi view linh hoạt**: Toggle giữa tổng quan và chi tiết

## Cột mốc tiếp theo 🎯

### 6. Báo cáo tự động
- [ ] Tạo báo cáo PDF/Excel từ dữ liệu thực
- [ ] Lập lịch gửi báo cáo tự động
- [ ] Template báo cáo tùy chỉnh theo nền tảng

### 7. Recommendations Engine
- [ ] Phân tích dữ liệu để đưa ra gợi ý
- [ ] AI-powered insights
- [ ] A/B testing recommendations
- [ ] Cross-platform optimization suggestions

### 8. Advanced Analytics
- [ ] Cohort analysis
- [ ] Funnel analysis
- [ ] Attribution modeling
- [ ] Cross-platform attribution

### 9. Deployment và Production
- [ ] Deploy lên Vercel/Netlify
- [ ] Cấu hình domain và SSL
- [ ] Monitoring và logging
- [ ] Performance optimization

## Công nghệ sử dụng

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage)
- **APIs:** Meta Graph API, Google Analytics API, TikTok API, WooCommerce API
- **Deployment:** (Sẽ triển khai)

## Cấu trúc Database

### Bảng `connections`
```sql
- user_id (UUID, FK to auth.users)
- platform (text) - 'meta', 'google', 'tiktok', 'woocommerce'
- credentials (jsonb) - Lưu tokens/keys
- status (text) - 'connected', 'disconnected'
- created_at (timestamp)
- updated_at (timestamp)
```

## Ghi chú quan trọng

- Tất cả credentials được mã hóa và lưu an toàn trong Supabase
- Row Level Security đảm bảo mỗi user chỉ thấy dữ liệu của mình
- Fallback graceful về demo data khi chưa kết nối nền tảng
- Real-time updates cho trạng thái kết nối
- Dashboard thông minh tự động điều chỉnh theo nền tảng đã kết nối
- UX tối ưu cho mọi loại khách hàng (1-4 nền tảng) 

---

### **Checkpoint ngày 25/07/2024**

- Đã thống nhất định hướng:
    - Không dùng mockup, chỉ dùng dữ liệu thật từ Google Sheets.
    - Mapping động, validate realtime, báo lỗi rõ ràng, hướng dẫn sửa.
    - Lưu cấu hình mapping, import dữ liệu vào DB nội bộ.
    - Dashboard/report chỉ lấy dữ liệu từ DB, không gọi Google API mỗi lần.
    - Sẽ phát triển module report/dashboard động giống Looker Studio/Power BI.
- Đã lên lộ trình triển khai từng bước, ưu tiên mapping động và import dữ liệu thật trước. 

### **Checkpoint ngày 25/07/2024 (bổ sung)**

- Đã tạo thêm các bảng: notifications, activity_logs, shared_reports, scheduled_jobs, organizations, organization_members, api_keys.
- Lý do: Hỗ trợ thông báo, log thao tác, chia sẻ report, tự động hóa, tổ chức/team, tích hợp API ngoài.
- Đã lưu ý tối ưu hiệu suất: index, dọn dẹp log, tối ưu query, chỉ import cần thiết, dùng Supabase Storage cho file lớn. 

## Checkpoint 24/06/2025: Tự động hóa dọn dẹp dữ liệu bằng pg_cron

- Đã tạo và kiểm tra thành công cron job dọn dẹp dữ liệu định kỳ bằng pg_cron.
- Các hàm cleanup đã chạy đúng lịch, log không báo lỗi.
- Đã kiểm tra log job bằng:
  ```sql
  select * from cron.job_run_details order by end_time desc limit 10;
  ```
- Đã tài liệu hóa quy trình cho team. 

# Dashboard - Roadmap & Checklist

## Mục tiêu chính
- Trải nghiệm phân tích nhanh, trực quan, real-time cho quản trị/marketing
- Hiển thị KPI tổng quan, so sánh đa kênh, insight/cảnh báo, filter nhanh, drill-down, responsive
- Dữ liệu lấy từ nguồn thật (Supabase, Google Sheet, API), không dùng mockdata
- Không còn tính năng xuất PDF trên Dashboard (chuyển sang trang Report)

## Công việc cần làm để hoàn thiện Dashboard

### 1. UI/UX & Layout
- [➖] Tối ưu layout tổng quan: header, filter, tab chuyển kênh, KPI card, bảng số liệu, insight
- [ ] Responsive cho mọi thiết bị (desktop, tablet, mobile)
- [ ] Drill-down đa cấp: từ tổng quan → từng kênh → từng chiến dịch
- [ ] Tooltip giải thích KPI, số liệu
- [ ] Highlight số liệu bất thường, cảnh báo
- [ ] Tối ưu UX filter: chọn nhanh thời gian, kênh, campaign
- [ ] Onboarding hướng dẫn user mới

### 2. Dữ liệu & Logic
- [✅] Kết nối dữ liệu thật: Supabase, Google Sheet, API
- [ ] Mapping trường dữ liệu chuẩn hóa (snake_case → camelCase)
- [ ] Tổng hợp số liệu đa kênh, multi-channel compare
- [ ] Tính toán KPI tổng, KPI từng kênh, ROAS, CPA, v.v.
- [ ] Hiển thị mục tiêu (goals) từ Supabase, cập nhật real-time
- [ ] Insight/cảnh báo/gợi ý tối ưu dựa trên dữ liệu thật
- [ ] Bảng số liệu chi tiết, có thể drill-down từng dòng

### 3. Tính năng nâng cao
- [ ] Tab Executive: tóm tắt nhanh, nhận định tổng thể
- [ ] Tab Platform: so sánh đa nền tảng, bảng KPI từng kênh
- [ ] Tab Channel: chi tiết từng kênh, biểu đồ, insight riêng
- [ ] Tab Overview: tổng hợp KPI, mục tiêu, insight toàn hệ thống
- [ ] (Không còn nút export PDF, export CSV vẫn giữ)

### 4. Khác
- [ ] Tối ưu hiệu năng, loading state
- [ ] Xử lý lỗi, empty state, thông báo rõ ràng
- [ ] Viết tài liệu hướng dẫn sử dụng Dashboard

---
**Lưu ý:**
- Tính năng xuất PDF đã chuyển sang trang Report (Custom Report), không còn trên Dashboard.
- Dashboard chỉ tập trung vào phân tích nhanh, real-time, không phải nơi xuất báo cáo tuỳ biến. 

# Features Progress & Milestone

## Checklist tính năng
- [✅] Đăng ký, xác thực email, đăng nhập
- [✅] Hồ sơ cá nhân (profile), cập nhật thông tin
- [✅] Hệ thống tổ chức (organization), phân quyền
- [✅] Quản lý thành viên tổ chức
- [✅] Bảo mật RLS, ON DELETE CASCADE
- [➖] Dashboard, báo cáo nâng cao
- [➖] Lịch sử hoạt động, thông báo
- [⬜] Báo cáo tự động PDF/Excel
- [⬜] Recommendations Engine AI-powered
- [⬜] Advanced Analytics

## Bảng tiến độ chi tiết
| Tính năng | Trạng thái | Người phụ trách | Ngày bắt đầu | Ngày hoàn thành |
|-----------|------------|-----------------|--------------|-----------------|
| Đăng ký/login/profile | ✅ Done | ... | ... | ... |
| Organization | ✅ Done | ... | ... | ... |
| Dashboard cơ bản | ✅ Done | ... | ... | ... |
| Dashboard nâng cao | ➖ Doing | ... | ... | ... |
| Báo cáo tự động | ⬜ Not Started | ... | ... | ... |
| Recommendations | ⬜ Not Started | ... | ... | ... |

--- 

### [Ngày cập nhật: hôm nay]
- Đã hoàn thiện logic và UI tích hợp tính năng quản lý tổ chức (tạo, xem, phân quyền) vào trang Profile.
- Đã refactor đồng bộ hook, modal, component, page.
- Cần kiểm tra và fix bug hiển thị/tạo tổ chức vào ngày mai.
--- 