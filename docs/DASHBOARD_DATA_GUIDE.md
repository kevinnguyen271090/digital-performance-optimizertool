# DASHBOARD DATA GUIDE

## 1. Tổng quan luồng dữ liệu dashboard
- Dữ liệu được lấy từ các platform (Google, Facebook, Zalo, TikTok, Email, CRM...) thông qua API hoặc import file.
- Dữ liệu raw được lưu vào database (hoặc cache), sau đó tổng hợp, chuẩn hóa và tính toán các chỉ số (KPI) để hiển thị lên dashboard.
- Các chỉ số tổng quan và chi tiết đều lấy từ các bảng dữ liệu đã chuẩn hóa.

## 2. Nguồn dữ liệu
- **Google Ads, Facebook Ads, TikTok Ads, Zalo Ads:**
  - Kết nối qua API chính thức của từng platform (OAuth, access token...)
  - Lấy các trường: impressions, clicks, spend, conversions, revenue, v.v.
- **Website/CRM:**
  - Kết nối qua API, webhook hoặc import file (CSV, Excel)
  - Lấy các trường: traffic, lead, qualified lead, order, revenue, customer info...
- **Các nguồn khác:**
  - Email, Automation tool, v.v. (tùy nhu cầu)

## 3. Công thức tính các chỉ số

### KPI cơ bản
- **Impressions:** Tổng số lượt hiển thị
- **Clicks:** Tổng số lượt click
- **Traffic:** Tổng số lượt truy cập website/app
- **Lead:** Số lượng khách hàng tiềm năng
- **Qualified Lead:** Số lead đủ điều kiện (theo tiêu chí business)
- **Order:** Số đơn hàng
- **Revenue:** Tổng doanh thu
- **Spend/Cost:** Tổng chi phí quảng cáo

### KPI hiệu quả
- **CTR (Click Through Rate):**
  CTR = (Clicks / Impressions) * 100
- **Engagement Rate:**
  Engagement Rate = (Tổng like + share + comment) / Impressions * 100
- **CPC (Cost per Click):**
  CPC = Spend / Clicks
- **CPM (Cost per 1000 Impressions):**
  CPM = (Spend / Impressions) * 1000
- **CPA (Cost per Acquisition):**
  CPA = Spend / Số lượng chuyển đổi (order hoặc lead)
- **ROAS (Return on Ad Spend):**
  ROAS = Revenue / Spend
- **Drop-off rate giữa các bước funnel:**
  Drop-off = (1 - Số lượng bước sau / Số lượng bước trước) * 100
- **Customer Lifetime Value (CLV):**
  CLV = Tổng doanh thu từ 1 khách hàng / Số khách hàng

### KPI nâng cao (nếu có)
- **Churn Rate:**
  Churn Rate = (Số khách hàng rời bỏ / Tổng số khách hàng đầu kỳ) * 100
- **Tỷ lệ khách hàng mới/cũ (New Customer Rate):**
  New Customer Rate = (Số khách hàng mới / Tổng số khách hàng) * 100
- **Average Time to Convert:**
  Average Time to Convert = Tổng thời gian chuyển đổi / Số lượt chuyển đổi
- **Customer Lifetime Value (CLV):**
  CLV = Tổng doanh thu từ 1 khách hàng / Số khách hàng

## 4. Lưu ý về chuẩn hóa, mapping, cập nhật dữ liệu
- Đảm bảo mapping đúng các trường dữ liệu giữa các platform (ví dụ: Facebook "actions" = Google "conversions")
- Chuẩn hóa đơn vị tiền tệ, múi giờ, format ngày tháng
- Cập nhật dữ liệu định kỳ (cronjob, webhook, hoặc trigger thủ công)
- Kiểm tra dữ liệu thiếu, lỗi, trùng lặp

## 5. Gợi ý mở rộng/nâng cao
- Có thể bổ sung thêm các chỉ số đặc thù cho từng ngành
- Tích hợp AI/ML để dự báo, gợi ý tối ưu
- Cho phép drill-down, filter nâng cao, export dữ liệu

---

**Ví dụ minh họa:**

| Ngày      | Kênh      | Impressions | Clicks | Spend  | Lead | Order | Revenue |
|-----------|-----------|-------------|--------|--------|------|-------|---------|
| 2024-06-01| Facebook  | 10000       | 500    | 2,000,000 | 30   | 10    | 5,000,000 |
| 2024-06-01| Google    | 8000        | 400    | 1,600,000 | 25   | 8     | 4,000,000 |

- CTR Facebook = (500/10000)*100 = 5%
- CPC Google = 1,600,000/400 = 4,000đ
- ROAS Facebook = 5,000,000/2,000,000 = 2.5x
- Drop-off Lead→Order Facebook = (1-10/30)*100 = 66.7%

---

**Nếu cần chi tiết mapping từng platform, liên hệ team data để lấy tài liệu API cụ thể.**

#### Ví dụ minh họa nâng cao:
| Ngày      | Kênh      | Total Revenue | Total Customers | Churned Customers | Start Customers | New Customers | Total Conversion Time | Total Conversions |
|-----------|-----------|--------------|-----------------|-------------------|-----------------|---------------|----------------------|------------------|
| 2024-06-01| Facebook  | 5,000,000    | 100             | 5                 | 105             | 20            | 300                  | 10               |

- CLV Facebook = 5,000,000 / 100 = 50,000đ
- Churn Rate Facebook = (5/105)*100 = 4.76%
- New Customer Rate Facebook = (20/100)*100 = 20%
- Average Time to Convert Facebook = 300/10 = 30 ngày 