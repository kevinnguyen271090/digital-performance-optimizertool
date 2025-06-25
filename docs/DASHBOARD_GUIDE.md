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