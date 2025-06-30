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

## 3. Performance & Vòng lặp vô hạn - CRITICAL
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong usePerformanceMonitor do useEffect dependencies không đúng. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong usePageTracking do pageView function thay đổi liên tục. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong EnterpriseApp do config và callbacks không được memoize. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong ProtectedRoute do fetchSession function không được memoize. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong WooCommerceConnectModal do checkExistingConnection function không được memoize. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Vòng lặp vô hạn trong useOrganization do fetchOrganizations và createOrganization functions không được memoize. ✅ **ĐÃ SỬA**
- [x] **LỖI NGHIÊM TRỌNG**: Invalid hook call trong EnterpriseApp do useCallback được gọi bên trong useEffect (vi phạm Rules of Hooks). ✅ **ĐÃ SỬA**
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

# Bug & Fix Progress

## Hướng dẫn ghi nhận bug
- Mỗi bug nên ghi rõ: mô tả, trạng thái (open/doing/done), người phụ trách, ngày phát hiện, ngày fix, ảnh/chụp màn hình nếu có.
- Khi fix xong, cập nhật trạng thái và mô tả cách fix.

## Template báo cáo bug
| ID | Mô tả bug | Trạng thái | Người phụ trách | Ngày phát hiện | Ngày fix | Cách fix/nguyên nhân |
|----|-----------|------------|-----------------|---------------|----------|---------------------|
| BUG-001 | Vòng lặp vô hạn trong usePerformanceMonitor | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Tối ưu dependencies và logic useEffect |
| BUG-002 | Vòng lặp vô hạn trong usePageTracking | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Loại bỏ pageView khỏi dependencies |
| BUG-003 | Vòng lặp vô hạn trong EnterpriseApp | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Memoize config và callbacks |
| BUG-004 | Vòng lặp vô hạn trong ProtectedRoute | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Memoize fetchSession function |
| BUG-005 | Vòng lặp vô hạn trong WooCommerceConnectModal | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Memoize checkExistingConnection function |
| BUG-006 | Vòng lặp vô hạn trong useOrganization | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Memoize fetchOrganizations and createOrganization functions |
| BUG-007 | Invalid hook call in EnterpriseApp | ✅ Done | AI Assistant | Hôm nay | Hôm nay | Memoize useCallback |

## Tiến độ fix bug
- [x] Bug #1: Vòng lặp vô hạn trong usePerformanceMonitor (đã fix)
- [x] Bug #2: Vòng lặp vô hạn trong usePageTracking (đã fix)
- [x] Bug #3: Vòng lặp vô hạn trong EnterpriseApp (đã fix)
- [x] Bug #4: Vòng lặp vô hạn trong ProtectedRoute (đã fix)
- [x] Bug #5: Vòng lặp vô hạn trong WooCommerceConnectModal (đã fix)
- [x] Bug #6: Vòng lặp vô hạn trong useOrganization (đã fix)
- [x] Bug #7: Invalid hook call in EnterpriseApp (đã fix)

---

> Ghi chú: Danh sách này sẽ được cập nhật liên tục khi phát hiện thêm lỗi hoặc vấn đề mới trong quá trình kiểm tra và phát triển. 

---
### [Ngày cập nhật: hôm nay]
- [x] **CRITICAL**: Vòng lặp vô hạn trong các hook và component đã được sửa. Các vấn đề chính:
  - usePerformanceMonitor: Tối ưu dependencies và logic useEffect
  - usePageTracking: Loại bỏ pageView khỏi dependencies
  - EnterpriseApp: Memoize config và callbacks
  - ProtectedRoute: Memoize fetchSession function
  - WooCommerceConnectModal: Memoize checkExistingConnection function
  - useOrganization: Memoize fetchOrganizations and createOrganization functions
  - Invalid hook call: Memoize useCallback
- [ ] Tính năng tổ chức chưa hiển thị/tạo được trên trang Profile. Cần kiểm tra lại luồng fetch/create organization, props truyền vào modal, và dữ liệu trả về từ Supabase.
--- 