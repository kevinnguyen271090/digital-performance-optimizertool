# 🗺️ Component Mapping - Digital Performance Optimizer

## 📋 Tổng quan
Tài liệu này map các component với trang tương ứng để dễ dàng hiểu component nào thuộc trang nào và chức năng của từng component.

## 🏠 **Dashboard.tsx** - Trang Dashboard chính

### 📊 **Components chính**
```
Dashboard.tsx
├── DashboardHeader.tsx         # 🎯 Header với filter, date range, view toggle
├── KPISection.tsx             # 📊 Section KPI tổng quan
├── InsightsSection.tsx        # 💡 Section insights và gợi ý
├── MainContentSection.tsx     # 📋 Section nội dung chính
└── GoalsSection.tsx           # 🎯 Section goals
```

### 📈 **Chart Components (trong MainContentSection)**
```
MainContentSection.tsx
└── DashboardContent.tsx
    ├── ExecutiveDashboard.tsx  # 🏢 Executive tab
    │   ├── ExecutiveHeader.tsx     # 🎯 Header Executive
    │   ├── ExecutiveKPITable.tsx   # 📋 Bảng KPI Executive
    │   ├── ExecutiveFunnelSection.tsx # 📊 Funnel chart
    │   ├── ExecutivePieSection.tsx    # 🥧 Pie chart
    │   ├── ExecutiveTrendSection.tsx  # 📈 Trend chart
    │   ├── ExecutiveDrilldownSection.tsx # 🔍 Drill-down
    │   └── ExecutiveAlertSection.tsx   # ⚠️ Alerts & recommendations
    └── ChannelDetailView.tsx  # 📊 Channels tab
        ├── ChannelDetailHeader.tsx     # 🎯 Header channel detail
        ├── ChannelDetailInsights.tsx   # 💡 Insights cho channel
        ├── ChannelDetailMetrics.tsx    # 📊 Metrics cho channel
        └── ChannelDetailTable.tsx      # 📋 Table cho channel
```

### 🔧 **Modal Components**
```
Dashboard.tsx
├── GoalModal.tsx              # 📝 Modal thêm/sửa goal
├── KPIImportModal.tsx         # 📥 Modal import KPI từ Excel
└── CreateReportModal.tsx      # 📄 Modal tạo report
```

### 🎯 **KPI & Goal Components**
```
KPISection.tsx
├── KPICard.tsx                # 📊 Card KPI
└── GoalCard.tsx               # 🎯 Card goal

GoalsSection.tsx
└── GoalCard.tsx               # 🎯 Card goal (reused)
```

## 🔐 **Auth.tsx** - Trang đăng nhập/đăng ký

### 🔐 **Auth Components**
```
Auth.tsx
└── AuthForm.tsx               # 📝 Form đăng nhập/đăng ký
```

## 👤 **Profile.tsx** - Trang hồ sơ người dùng

### 👤 **Profile Components**
```
Profile.tsx
├── ProfileHeader.tsx           # 🎯 Header với avatar và thông tin
├── ProfileEditForm.tsx         # ✏️ Form chỉnh sửa profile
├── OrganizationSection.tsx     # 🏢 Quản lý tổ chức
├── EmailVerificationBanner.tsx # 📧 Banner xác thực email
├── AvatarUpload.tsx            # 📤 Upload avatar
└── SecuritySection.tsx         # 🔐 Bảo mật (2FA, password)
```

### 🔧 **Modal Components**
```
Profile.tsx
├── CreateOrganizationModal.tsx # 🏢 Modal tạo tổ chức
└── UserProfileModal.tsx        # 👤 Modal user profile
```

## ⚙️ **Settings.tsx** - Trang cài đặt

### 🔗 **Connection Components**
```
Settings.tsx
├── ConnectedAccountsTab.tsx    # 🔗 Tab kết nối tài khoản
│   ├── GoogleAccountSelector.tsx   # 🟢 Chọn tài khoản Google
│   │   └── GoogleServiceSelectionModal.tsx # 🔧 Modal chọn dịch vụ Google
│   ├── MetaConnectModal.tsx        # 🔵 Modal kết nối Meta
│   ├── WooCommerceConnectModal.tsx # 🟠 Modal kết nối WooCommerce
│   │   └── WooCommerceGuideModal.tsx # 📖 Hướng dẫn WooCommerce
│   └── PlatformButton.tsx          # 🔘 Button kết nối platform
└── AccountSelector.tsx         # 👥 Selector tài khoản
```

### 🟢 **Google Sheets Components**
```
Settings.tsx
└── GoogleSheetsConnector.tsx   # 🔗 Connector Google Sheets
    ├── FilePicker.tsx             # 📁 Chọn file Google Sheets
    ├── SheetPicker.tsx            # 📄 Chọn sheet trong file
    ├── Preview.tsx                # 👀 Preview dữ liệu
    └── Mapping.tsx                # 🔗 Mapping columns
```

## 💡 **Recommendations.tsx** - Trang khuyến nghị

### 💡 **Recommendation Components**
```
Recommendations.tsx
└── RecommendationCard.tsx      # 💡 Card recommendation
```

## 📊 **Reports.tsx** - Trang báo cáo

### 📊 **Report Components**
```
Reports.tsx
├── ReportCard.tsx              # 📊 Card report
├── CreateReportModal.tsx       # 📄 Modal tạo report
└── RevenueOrderModal.tsx       # 💰 Modal revenue order
```

## 🏗️ **AppLayout.tsx** - Layout chính

### 🎨 **Layout Components**
```
AppLayout.tsx
├── MobileNavigation.tsx        # 📱 Navigation mobile
├── ThemeToggle.tsx             # 🌙 Toggle theme
├── SearchModal.tsx             # 🔍 Modal search
├── Toast.tsx                   # 🍞 Toast notification
├── OnboardingTour.tsx          # 🎓 Tour onboarding
└── RevenueOrderModal.tsx       # 💰 Modal revenue order
```

## 🔧 **Common Components** - Dùng chung

### 🎨 **UI Components**
```
[Used across multiple pages]
├── DateRangePicker.tsx         # 📅 Chọn khoảng thời gian
├── ErrorBoundary.tsx           # 🛡️ Error boundary
├── ProtectedRoute.tsx          # 🛡️ Route bảo vệ
├── SearchBar.tsx               # 🔍 Search bar
├── TrendChart.tsx              # 📈 Chart trend
└── [UI Components]             # 🎨 Button, Card, Badge, etc.
```

## 📊 **Component Usage Matrix**

| Component | Dashboard | Auth | Profile | Settings | Recommendations | Reports |
|-----------|-----------|------|---------|----------|-----------------|---------|
| DashboardHeader | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| KPISection | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ExecutiveDashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ChannelDetailView | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AuthForm | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ProfileHeader | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| ConnectedAccountsTab | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| GoogleAccountSelector | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| RecommendationCard | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| ReportCard | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| DateRangePicker | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ErrorBoundary | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ProtectedRoute | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

## 🔄 **Component Dependencies**

### 📊 **Dashboard Dependencies**
```
Dashboard.tsx
├── useDashboardState.ts        # 📊 Dashboard state management
├── useDashboardData.ts         # 📊 Dashboard data management
├── useConnectedChannels.ts     # 🔗 Connected channels
├── useGoals.ts                # 🎯 Goals management
└── useAccountSelection.ts     # 👥 Account selection
```

### 👤 **Profile Dependencies**
```
Profile.tsx
├── useProfile.ts              # 👤 Profile management
├── useOrganization.ts         # 🏢 Organization management
└── useProfileSecurity.ts      # 🔐 Profile security
```

### ⚙️ **Settings Dependencies**
```
Settings.tsx
├── useSettings.ts             # ⚙️ Settings management
├── useGoogleAccountConnect.ts # 🟢 Google account connection
└── useConnectedChannels.ts    # 🔗 Connected channels
```

### 🏗️ **App Dependencies**
```
App.tsx
├── useAnalytics.ts            # 📈 Analytics tracking
├── useSecurity.ts             # 🛡️ Security features
└── usePerformanceMonitor.ts   # 📊 Performance monitoring
```

## 📝 **Cách sử dụng mapping này**

### 1. **Tìm component theo trang**
- Muốn thêm feature vào Dashboard? → Xem "Dashboard.tsx" section
- Muốn thêm feature vào Settings? → Xem "Settings.tsx" section

### 2. **Tìm component theo chức năng**
- Muốn thêm chart? → Xem "Chart Components"
- Muốn thêm modal? → Xem "Modal Components"
- Muốn thêm form? → Xem "Form Components"

### 3. **Tìm dependencies**
- Muốn biết component dùng hook nào? → Xem "Component Dependencies"
- Muốn biết component dùng ở trang nào? → Xem "Component Usage Matrix"

### 4. **Tìm component dùng chung**
- Muốn tìm component dùng nhiều trang? → Xem "Common Components"
- Muốn tìm UI component? → Xem "UI Components"

## 🔄 **Cập nhật mapping**

### ✅ **Khi thêm component mới**
1. Thêm vào section trang tương ứng
2. Cập nhật "Component Usage Matrix"
3. Cập nhật "Component Dependencies" nếu có

### ✅ **Khi refactor component**
1. Cập nhật vị trí component trong mapping
2. Cập nhật dependencies nếu thay đổi
3. Đảm bảo matrix vẫn chính xác

### ✅ **Khi thêm trang mới**
1. Tạo section mới cho trang
2. Thêm vào "Component Usage Matrix"
3. Cập nhật "Component Dependencies"

---

**Last updated**: December 2024  
**Maintainer**: Development Team  
**Version**: 1.0 