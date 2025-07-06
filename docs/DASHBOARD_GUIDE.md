# Dashboard Guide cho Digital Marketing Director

## 1. Executive Dashboard Layout

### 🎯 **Overview Performance (Executive Summary)**

#### **Header Section**
- **Date Range Selector**: Chọn khoảng thời gian (7 ngày, 30 ngày, 90 ngày, custom)
- **Last Updated**: Thời gian cập nhật dữ liệu cuối cùng
- **Action Buttons**: Filter, Export Report, Share

#### **Key Performance Indicators (KPIs)**
1. **Tổng Doanh Thu** (Total Revenue)
   - Hiển thị: `₫50,000,000`
   - Trend: +12.5% so với kỳ trước
   - Color: Green gradient
   - Icon: DollarSign

2. **ROAS** (Return on Ad Spend)
   - Hiển thị: `3.25x`
   - Trend: +8.3% so với kỳ trước
   - Color: Blue gradient
   - Icon: Target

3. **Tổng Chuyển Đổi** (Total Conversions)
   - Hiển thị: `1,250`
   - Trend: +15.2% so với kỳ trước
   - Color: Purple gradient
   - Icon: Users

4. **CPA** (Cost Per Acquisition)
   - Hiển thị: `₫40,000`
   - Trend: -5.1% so với kỳ trước
   - Color: Orange gradient
   - Icon: DollarSign

### 📊 **Channel Performance Table**

#### **Columns hiển thị:**
1. **Kênh** (Channel)
   - Tên kênh + Icon
   - Số impressions
   - Visual indicator

2. **Doanh Thu** (Revenue)
   - Số tiền + Trend arrow
   - % change so với kỳ trước

3. **Chi Phí** (Spend)
   - Số tiền đã chi

4. **ROAS**
   - Giá trị + Performance indicator
   - Color coding: Green (>3x), Yellow (2-3x), Red (<2x)

5. **CPA**
   - Giá trị per conversion

6. **CTR** (Click-Through Rate)
   - Percentage

7. **Conv. Rate** (Conversion Rate)
   - Percentage

8. **Trạng Thái** (Status)
   - Badge: Tốt, Cần cải thiện, Kritisk

### 📈 **Performance Trends**

#### **Left Chart: Xu Hướng Doanh Thu**
- Line chart 30 ngày
- Revenue trend over time
- Color: Green (#10B981)

#### **Right Chart: Phân Bổ Chi Phí**
- Horizontal bar chart
- Spend distribution by channel
- Percentage visualization

### ⚠️ **Alerts & Recommendations**

#### **Alert Types:**
1. **Warning** (Yellow)
   - CPA cao hơn mục tiêu
   - CTR thấp hơn benchmark

2. **Success** (Green)
   - Channel overperforming
   - Positive trends

3. **Info** (Blue)
   - Optimization suggestions
   - A/B testing recommendations

## 2. Detailed Channel Performance

### 🎯 **Meta (Facebook/Instagram) Dashboard**

#### **KPIs:**
- **Impressions**: 150,000
- **CTR**: 2.5%
- **CPA**: ₫35,000
- **Conversions**: 450

#### **Charts:**
- Impressions trend (7 days)
- CTR trend (7 days)
- CPA trend (7 days)
- Conversions trend (7 days)

#### **Insights:**
- Top performing ad: Campaign A (CTR: 3.2%)
- Best audience: Age 25-34, Female
- Optimal time: 7-9 PM

### 🔍 **Google Analytics Dashboard**

#### **KPIs:**
- **Sessions**: 25,000
- **Page Views**: 45,000
- **Avg Session Duration**: 2.5 phút
- **Transactions**: 180

#### **Charts:**
- Sessions trend (7 days)
- Page Views trend (7 days)
- Session Duration trend (7 days)
- Transactions trend (7 days)

#### **Insights:**
- Top landing page: /products
- Best traffic source: Organic Search
- Conversion funnel: 2.1% completion rate

### 📱 **TikTok Dashboard**

#### **KPIs:**
- **Total Views**: 500,000
- **Engagement Rate**: 4.2%
- **Total Likes**: 25,000
- **Total Videos**: 15

#### **Charts:**
- Views trend (7 days)
- Engagement trend (7 days)
- Likes trend (7 days)
- Videos trend (7 days)

#### **Insights:**
- Trending video: 15.2K views
- Best hashtag: #viral
- Optimal posting time: 6-8 PM

### 🛒 **WooCommerce Dashboard**

#### **KPIs:**
- **Revenue**: ₫15,000,000
- **Orders**: 120
- **Avg Order Value**: ₫125,000
- **Total Products**: 250

#### **Charts:**
- Revenue trend (7 days)
- Orders trend (7 days)
- Order Value trend (7 days)
- Products trend (7 days)

#### **Insights:**
- Best selling product: Product A
- Peak order time: 2-4 PM
- Cart abandonment rate: 15%

## 3. Google Account Selection Strategy

### 🎯 **Vấn đề hiện tại:**
- Chỉ đăng nhập Google chung chung
- Không biết lấy dữ liệu từ tài khoản nào
- Có thể có nhiều GA4, Search Console, Google Ads accounts

### ✅ **Giải pháp: Google Account Selector**

#### **Step 1: Google OAuth Login**
- User đăng nhập Google
- Lấy access token

#### **Step 2: Account Discovery**
- Tự động tìm tất cả accounts user có access:
  - Google Analytics 4 properties
  - Search Console properties
  - Google Ads accounts

#### **Step 3: Account Selection Modal**
```typescript
interface GoogleAccount {
  id: string;
  name: string;
  type: 'ga4' | 'search-console' | 'google-ads';
  propertyId?: string;
  accountId?: string;
  isSelected: boolean;
  status: 'connected' | 'available' | 'error';
  lastSync?: Date;
}
```

#### **Step 4: Visual Account List**
- **GA4**: Blue icon "GA", Property name, Property ID
- **Search Console**: Green icon "SC", Domain name, Property ID
- **Google Ads**: Red icon "AD", Account name, Account ID

#### **Step 5: Multi-selection**
- Checkbox cho từng account
- Select all/none options
- Preview selected accounts

#### **Step 6: Connection Confirmation**
- Show selected accounts
- Confirm connection
- Store account details in database

### 📊 **Database Schema Update**

```sql
-- Bảng connections mở rộng
ALTER TABLE connections ADD COLUMN account_details JSONB;

-- Ví dụ lưu trữ:
{
  "google_accounts": [
    {
      "id": "ga4-1",
      "name": "GA4 - Avenger Hub Main",
      "type": "ga4",
      "propertyId": "GA4_PROPERTY_ID_1"
    },
    {
      "id": "google-ads-1", 
      "name": "Google Ads - Main Account",
      "type": "google-ads",
      "accountId": "ADS_ACCOUNT_ID_1"
    }
  ]
}
```

## 4. Dashboard Usage Workflow

### 🎯 **Daily Review (5-10 phút)**
1. **Check Executive Summary**
   - Tổng doanh thu hôm nay
   - ROAS trend
   - CPA alerts

2. **Scan Channel Performance**
   - Kênh nào underperforming
   - Kênh nào overperforming
   - Budget allocation

3. **Review Alerts**
   - Critical issues
   - Optimization opportunities
   - Success stories

### 📊 **Weekly Analysis (30-60 phút)**
1. **Trend Analysis**
   - 7-day performance trends
   - Week-over-week comparison
   - Seasonal patterns

2. **Channel Deep Dive**
   - Detailed performance by channel
   - Creative performance
   - Audience insights

3. **Optimization Planning**
   - Budget reallocation
   - Creative testing
   - Targeting optimization

### 📈 **Monthly Reporting (2-3 giờ)**
1. **Executive Summary**
   - Monthly performance vs targets
   - Year-over-year comparison
   - Market insights

2. **Channel Strategy Review**
   - Channel effectiveness
   - ROI analysis
   - Strategic recommendations

3. **Future Planning**
   - Budget planning
   - Campaign strategy
   - Goal setting

## 5. Key Metrics Definitions

### 💰 **Revenue Metrics**
- **Total Revenue**: Tổng doanh thu từ tất cả channels
- **Revenue per Channel**: Doanh thu theo từng kênh
- **Revenue Growth**: % tăng trưởng so với kỳ trước

### 🎯 **ROI Metrics**
- **ROAS**: Return on Ad Spend (Revenue / Ad Spend)
- **CPA**: Cost Per Acquisition (Ad Spend / Conversions)
- **CPC**: Cost Per Click (Ad Spend / Clicks)

### 👥 **Engagement Metrics**
- **CTR**: Click-Through Rate (Clicks / Impressions)
- **Conversion Rate**: Conversions / Sessions
- **Engagement Rate**: (Likes + Comments + Shares) / Views

### 📊 **Traffic Metrics**
- **Sessions**: Số phiên truy cập
- **Page Views**: Số trang được xem
- **Avg Session Duration**: Thời gian trung bình mỗi phiên

## 6. Best Practices

### 🎯 **Dashboard Setup**
1. **Customize KPIs** theo business goals
2. **Set up alerts** cho critical metrics
3. **Configure date ranges** phù hợp
4. **Export reports** định kỳ

### 📊 **Data Interpretation**
1. **Context matters**: So sánh với industry benchmarks
2. **Trend analysis**: Xem xu hướng, không chỉ số tuyệt đối
3. **Correlation**: Tìm mối liên hệ giữa các metrics
4. **Actionable insights**: Chuyển data thành actions

### 🔄 **Continuous Optimization**
1. **A/B testing**: Test hypotheses
2. **Budget optimization**: Reallocate based on performance
3. **Creative refresh**: Update ads regularly
4. **Audience targeting**: Refine based on data

---

*Tài liệu này được thiết kế cho Digital Marketing Director với kinh nghiệm lâu năm trong lĩnh vực Business Intelligence và Performance Marketing.*

## Các biểu đồ và chỉ số mới bổ sung (2024)

### 1. FunnelChart (Biểu đồ phễu chuyển đổi)
- **Vị trí:** Ngay dưới KPI Card tổng quan.
- **Ý nghĩa:** Thể hiện luồng chuyển đổi từ Traffic → Lead → Qualified Lead → Order → Revenue. Giúp nhận diện tỷ lệ rớt ở từng bước.

### 2. PieChart (Biểu đồ tròn phân bổ nguồn)
- **Vị trí:** Dưới FunnelChart, cho phép chọn phân bổ theo traffic, lead, doanh thu.
- **Ý nghĩa:** Giúp xác định kênh/nguồn nào đóng góp nhiều nhất vào traffic, lead, doanh thu.

### 3. EngagementChart (Biểu đồ tương tác)
- **Vị trí:** Dưới PieChart.
- **Ý nghĩa:** Theo dõi các chỉ số like, share, comment, CTR, Engagement Rate theo thời gian.

### 4. CPCChart, CPMChart (Biểu đồ chi phí quảng cáo)
- **Vị trí:** Dưới EngagementChart.
- **Ý nghĩa:** Theo dõi biến động CPC, CPM theo thời gian hoặc theo kênh, giúp tối ưu chi phí quảng cáo.

### 5. KPI Card bổ sung
- **Các chỉ số mới:** CPC, CPM, Engagement Rate, CTR, Drop-off rate giữa các bước funnel.
- **Ý nghĩa:** Đánh giá hiệu quả quảng cáo, tối ưu chuyển đổi, nhận diện vấn đề nhanh chóng.

---

## Cách đọc và sử dụng dashboard
- **KPI Card:** Xem nhanh các chỉ số quan trọng, so sánh với mục tiêu.
- **FunnelChart:** Xác định điểm rớt lớn nhất trong hành trình khách hàng.
- **PieChart:** Ưu tiên tối ưu kênh/nguồn có tỷ trọng lớn hoặc hiệu quả thấp.
- **EngagementChart:** Đánh giá sức mạnh nội dung, mức độ tương tác của khách hàng.
- **CPC/CPM Chart:** Theo dõi chi phí, phát hiện bất thường để tối ưu ngân sách.

---

## Lưu ý
- Các biểu đồ sẽ tự động ẩn nếu không có dữ liệu phù hợp.
- Có thể mở rộng thêm các chỉ số hoặc biểu đồ khác theo nhu cầu thực tế.

# DASHBOARD GUIDE

## Tổng quan Dashboard

Dashboard Digital Performance được thiết kế với 2 tab chính:

### 1. Tab Overview (Tổng hợp)
- **Mục đích**: Hiển thị tổng quan toàn hệ thống, không phân rã sâu
- **Đối tượng**: Digital Manager, CEO, người quản lý tổng thể
- **Tính năng**: KPI tổng hợp, biểu đồ tổng quan, insights chung

### 2. Tab Executive (So sánh & Drill-down)
- **Mục đích**: So sánh hiệu suất giữa các kênh/campaign, drill-down chi tiết
- **Đối tượng**: Digital Executive, Campaign Manager, người quản lý chi tiết
- **Tính năng**: So sánh, drill-down, filter theo kênh/campaign, phân rã KPI

---

## Tab Overview - Layout & Checklist

### Layout mẫu
```
DashboardOverview.tsx
├── OverviewHeader
│   ├── DateRangePicker
│   ├── Nút: Refresh, Export tổng hợp
├── OverviewKPICards
│   ├── Revenue Card (tổng)
│   ├── Cost Card (tổng)
│   ├── ROAS Card (tổng)
│   ├── CPA Card (tổng)
│   ├── CTR Card (tổng)
│   ├── Conversion Rate Card (tổng)
│   ├── CPC Card (tổng)
│   ├── CPM Card (tổng)
│   ├── Engagement Rate Card (tổng)
│   ├── Drop-off Rate Card (tổng)
│   ├── CLV Card (tổng)
│   ├── Churn Rate Card (tổng)
│   ├── New Customer Rate Card (tổng)
│   └── Average Time to Convert Card (tổng)
├── OverviewTrendChart
│   ├── Line chart: Trend tổng hợp (Revenue, Cost, ROAS...)
│   ├── Chỉ hiển thị tổng, không phân rã kênh
├── OverviewFunnelChart
│   ├── Funnel chart: Tổng hợp toàn hệ thống
│   ├── Không drill-down theo kênh
├── OverviewPieChart
│   ├── Pie chart: Phân bổ tổng hợp (Revenue, Cost...)
│   ├── Chỉ hiển thị tổng, không chi tiết kênh
├── OverviewInsightsSection
│   ├── Insights tổng hợp
│   ├── Alert tổng hợp
│   └── Recommendation chung
```

### Checklist Overview
- [x] KPI Cards tổng hợp (không phân rã kênh)
- [x] Trend chart tổng hợp
- [x] Funnel chart tổng hợp
- [x] Pie chart tổng hợp
- [x] Insights tổng hợp
- [x] Chỉ filter thời gian
- [x] Không drill-down
- [x] Không filter kênh/campaign
- [x] Export tổng hợp

---

## Tab Executive - Layout & Checklist

### Layout mẫu
```
ExecutiveDashboard.tsx
├── ExecutiveHeader
│   ├── Bộ lọc: [DateRangePicker] [Chọn kênh] [Chọn campaign] [Chọn KPI]
│   ├── Nút: Export, So sánh kỳ, Drill-down
├── ExecutiveKPITable
│   ├── Bảng so sánh KPI theo kênh/campaign (có thể chọn nhiều KPI)
│   ├── Cột động: Revenue, Cost, ROAS, CPA, CTR, Conversion Rate, ... (tùy filter)
│   ├── Hàng: Mỗi kênh/campaign
│   ├── Có thể drill-down từng hàng để xem chi tiết campaign/ad group/ad
├── ExecutiveTrendChart
│   ├── Line/Bar chart: So sánh trend KPI giữa các kênh/campaign (multi-series)
│   ├── Có thể chọn KPI, kênh/campaign để so sánh
├── ExecutiveFunnelCompare
│   ├── Biểu đồ funnel so sánh từng kênh/campaign (nếu có data)
├── ExecutivePieCompare
│   ├── Pie chart: Phân bổ doanh thu/chi phí/lead theo kênh/campaign
├── ExecutiveDrilldownSection
│   ├── Khi chọn 1 kênh/campaign: Hiện chi tiết từng ad group/ad, từng ngày, từng creative
│   ├── Có thể filter sâu hơn (ví dụ: theo audience, device, location...)
├── ExecutiveAlertSection
│   ├── Cảnh báo hiệu suất, bất thường, đề xuất tối ưu riêng cho từng kênh/campaign
```

### Checklist Executive

#### A. Header & Filter
- [x] Bộ lọc thời gian (DateRangePicker)
- [x] Bộ lọc kênh (Google, Facebook, TikTok, Email, CRM, ...)
- [x] Bộ lọc campaign (theo từng kênh)
- [x] Bộ lọc KPI (chọn nhiều KPI để so sánh)
- [x] Nút Export, So sánh kỳ (period comparison), Drill-down

#### B. KPI Table (So sánh & phân rã)
- [x] Bảng KPI động: mỗi hàng là 1 kênh/campaign, mỗi cột là 1 KPI (doanh thu, chi phí, ROAS, CPA, CTR, Conversion Rate, v.v.)
- [x] Có thể drill-down từng hàng để xem chi tiết campaign → ad group → ad
- [x] Có thể chọn nhiều KPI, nhiều kênh/campaign để so sánh
- [x] Có highlight/cảnh báo khi KPI vượt ngưỡng hoặc bất thường

#### C. Trend Chart (So sánh trend)
- [x] Line/Bar chart: Multi-series (mỗi series là 1 kênh/campaign)
- [x] Có thể chọn KPI, kênh/campaign để vẽ chart
- [x] Có thể so sánh nhiều kênh/campaign cùng lúc
- [x] Có thể drill-down theo ngày/tuần/tháng

#### D. Funnel & Pie Compare (So sánh phân bổ)
- [x] Funnel chart: So sánh tỷ lệ chuyển đổi từng bước theo từng kênh/campaign
- [x] Pie chart: Phân bổ doanh thu/chi phí/lead theo kênh/campaign
- [x] Có thể chọn loại phân bổ (revenue, cost, lead...)

#### E. Drill-down Section (Phân rã sâu)
- [x] Khi chọn 1 kênh/campaign: Hiện chi tiết từng ad group/ad, từng ngày, từng creative
- [x] Có thể filter sâu hơn: audience, device, location, v.v.
- [x] Có thể export dữ liệu drill-down

#### F. Alert & Recommendation (Cảnh báo & đề xuất)
- [x] Hiển thị cảnh báo hiệu suất riêng cho từng kênh/campaign (ví dụ: CPA tăng bất thường, ROAS giảm mạnh)
- [x] Đề xuất tối ưu hóa riêng cho từng kênh/campaign (ví dụ: tăng ngân sách, đổi creative, thử audience mới)
- [x] Có thể filter chỉ xem cảnh báo của 1 kênh/campaign

#### G. Khác
- [x] Không lặp lại các biểu đồ tổng hợp đã có ở Overview (ví dụ: không có KPI Card tổng hợp, không có funnel/pie tổng hợp toàn hệ thống)
- [x] Mọi KPI đều phải phân rã theo kênh/campaign (không hiển thị số tổng)
- [x] Có thể export bảng/chart theo filter hiện tại
- [x] Có thể so sánh nhiều kỳ (period comparison: tuần này vs tuần trước, tháng này vs tháng trước...)

---

## Phân biệt rõ Overview vs Executive

| Tiêu chí                | Overview (Tổng hợp)         | Executive (So sánh, drill-down)         |
|-------------------------|-----------------------------|-----------------------------------------|
| KPI                     | Tổng hợp toàn hệ thống      | Luôn phân rã theo kênh/campaign         |
| Biểu đồ                 | Chỉ tổng hợp, không drill   | Luôn có so sánh, drill-down, filter     |
| Filter                  | Chỉ filter thời gian        | Filter kênh, campaign, KPI, audience... |
| Drill-down              | Không có                    | Có, nhiều cấp (kênh → campaign → ad)    |
| Alert                   | Tổng hợp                    | Theo từng kênh/campaign                 |
| Export                  | Tổng hợp                    | Theo filter, từng kênh/campaign         |
| Trùng lặp KPI           | Không                       | Nếu trùng, luôn kèm phân rã             |

---

## Ví dụ minh họa

### ExecutiveKPITable (So sánh KPI theo kênh/campaign)

| Kênh/Campaign   | Revenue   | Cost      | ROAS | CPA   | CTR   | Conv. Rate | ... |
|-----------------|-----------|-----------|------|-------|-------|------------|-----|
| Facebook - C1   | 50,000,000| 20,000,000| 2.5x | 40,000| 5.2%  | 2.1%       | ... |
| Google - C2     | 40,000,000| 15,000,000| 2.7x | 37,500| 4.8%  | 2.5%       | ... |
| TikTok - C3     | 20,000,000| 8,000,000 | 2.0x | 45,000| 6.0%  | 1.8%       | ... |

### ExecutiveTrendChart (So sánh trend KPI)

- Line chart: Revenue của Facebook, Google, TikTok theo ngày
- Có thể chọn KPI khác (Cost, ROAS, CPA...)

### ExecutiveDrilldownSection

- Khi click vào Facebook - C1: Hiện chi tiết từng ad group, ad, audience, device, location...

---

## Gợi ý UI/UX

### Overview
- **Header luôn cố định** khi scroll, filter đơn giản
- **KPI Cards** hiển thị tổng hợp, không drill-down
- **Chart** chỉ hiển thị tổng, không phân rã
- **Export** chỉ tổng hợp

### Executive
- **Header luôn cố định** khi scroll, filter dễ thao tác
- **Bảng KPI** có thể sort, filter, search, drill-down từng hàng
- **Chart** có legend động, hover hiển thị số liệu chi tiết
- **Drill-down** mở ra modal hoặc section bên dưới, không chuyển trang
- **Alert** hiển thị badge màu, tooltip giải thích lý do cảnh báo
- **Export** cho phép tải về Excel/PDF theo filter hiện tại

---

## Tóm lại

- **Overview** = Chỉ tổng hợp, không filter sâu, không drill-down
- **Executive** = So sánh, drill-down, filter sâu, mọi KPI đều phải phân rã, không lặp lại tổng hợp của Overview 