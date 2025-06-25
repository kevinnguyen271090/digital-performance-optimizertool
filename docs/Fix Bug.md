# Danh sách lỗi & vấn đề cần fix

## 1. Kết nối Supabase & Backend
- [ ] Chưa kiểm tra kỹ lỗi khi không có biến môi trường REACT_APP_SUPABASE_URL hoặc REACT_APP_SUPABASE_ANON_KEY (file utils/supabaseClient.ts). Nếu thiếu sẽ throw error, cần UX tốt hơn.
- [ ] Một số truy vấn Supabase chưa xử lý hết lỗi trả về (ví dụ: useGoals, useDashboardData, useSettings chỉ log lỗi ra console hoặc alert, chưa có UI thông báo rõ ràng cho user).
- [ ] Chưa có retry hoặc fallback khi kết nối Supabase thất bại.
- [ ] Một số truy vấn Supabase có thể bị lỗi RLS (Row Level Security) nếu cấu hình backend thay đổi, chưa có kiểm tra kỹ.

## 2. Logic kết nối tài khoản (Settings) - CRITICAL
- [x] **LỖI NGHIÊM TRỌNG**: Đoạn render các modal kết nối (GoogleAccountSelector, WooCommerceConnectModal, MetaConnectModal, GoogleSheetsConnector) trong Settings.tsx đã bị comment lại (dòng 67-95). Điều này khiến các modal không hiển thị khi bấm nút kết nối. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Hook useGoogleAccountConnect được gọi nhưng không được sử dụng (dòng 28). Các biến googleAccessToken, googleProfile, triggerGoogleLogin không được truyền vào GoogleAccountSelector. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Các hàm handleGoogleAccountsSelected, handleWooCommerceSuccess, handleMetaSuccess, handleMetaFail, handleGoogleSheetsSuccess không được định nghĩa trong component Settings nhưng được sử dụng trong các modal đã comment. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Các state showGoogleAccountSelectorModal, showWooModal, showMetaModal, showGoogleSheetsModal, selectedGoogleService không được lấy từ hook useSettings nhưng được sử dụng trong các modal đã comment. ✅ **ĐÃ SỬA**
- [ ] Logic truyền accessToken/profile giữa các modal Google chưa rõ ràng, có thể gây lỗi khi xác thực nhiều dịch vụ Google.
- [ ] Chưa có kiểm tra trạng thái kết nối thực tế (ví dụ: token hết hạn, revoke, v.v.)

## 3. Performance
- [ ] Chưa có lazy loading cho các modal lớn hoặc component ít dùng (ví dụ: các modal kết nối, OnboardingTour).
- [ ] Một số hook fetch data (useDashboardData, useGoals) chưa debounce hoặc cache, có thể gây nhiều request không cần thiết.
- [ ] Chưa có kiểm soát loading state đồng bộ giữa các component khi fetch nhiều nguồn dữ liệu.

## 4. UX/UI
- [ ] Chưa có UI/UX thông báo lỗi rõ ràng khi kết nối thất bại (hiện tại chỉ alert hoặc log console).
- [ ] Một số nút/label chưa dịch hết sang tiếng Việt (ví dụ: nút Connect, Cancel trong WooCommerceConnectModal).
- [ ] Một số modal chưa có animation hoặc hiệu ứng đóng/mở mượt mà.
- [ ] Chưa có kiểm tra accessibility (a11y) cho các modal, button, input.

## 5. Khác
- [ ] Chưa có test coverage cho các hook và component quan trọng (Settings, Dashboard, Goal, ...).
- [ ] Chưa có kiểm tra memory leak khi mở/đóng modal nhiều lần.

---

> Ghi chú: Danh sách này sẽ được cập nhật liên tục khi phát hiện thêm lỗi hoặc vấn đề mới trong quá trình kiểm tra và phát triển. 