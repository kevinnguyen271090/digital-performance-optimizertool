# 📁 Cấu trúc thư mục dự án - Digital Performance Optimizer

## 🎯 Tổng quan
Tài liệu này mô tả chi tiết cấu trúc thư mục, chức năng của từng file và mối quan hệ giữa các component trong hệ thống Digital Performance Optimizer.

## 🏗️ Cấu trúc thư mục gốc

```
digital-performance-optimizer/
├── frontend/                    # 🎨 React Frontend Application
├── backend/                     # 🐍 Python FastAPI Backend
├── docs/                       # 📚 Tài liệu dự án
├── scripts/                    # 🔧 SQL scripts & utilities
├── supabase/                   # ☁️ Supabase configuration
└── README.md                   # 📖 Tài liệu chính
```

## 🎨 Frontend Structure (`frontend/src/`)

### 📁 **Pages** - Các trang chính của ứng dụng
```
pages/
├── Dashboard.tsx              # 🏠 Trang Dashboard chính
├── Auth.tsx                   # 🔐 Trang đăng nhập/đăng ký
├── Profile.tsx                # 👤 Trang hồ sơ người dùng
├── Settings.tsx               # ⚙️ Trang cài đặt
├── Recommendations.tsx        # 💡 Trang khuyến nghị
└── Reports.tsx               # 📊 Trang báo cáo
```

### 📁 **Components** - Các component UI

#### 🎯 **Dashboard Components** (`components/dashboard/`)
```
dashboard/
├── DashboardContent.tsx        # 📋 Nội dung chính dashboard
├── DashboardHeader.tsx         # 🎯 Header với filter, date range
├── DashboardOverview.tsx       # 📊 Tổng quan dashboard
├── DashboardKPIs.tsx          # 📈 KPI cards
├── DashboardDataTable.tsx      # 📋 Bảng dữ liệu chi tiết
├── DashboardInsights.tsx       # 💡 Insights và gợi ý
├── DashboardGoals.tsx          # 🎯 Quản lý mục tiêu
├── DashboardActivity.tsx       # 📝 Hoạt động gần đây
├── DashboardViewToggle.tsx     # 🔄 Chuyển đổi view
├── ChannelSubTabs.tsx         # 🏷️ Tab con cho kênh
├── KPISection.tsx             # 📊 Section KPI tổng quan
├── InsightsSection.tsx        # 💡 Section insights
├── MainContentSection.tsx     # 📋 Section nội dung chính
├── GoalsSection.tsx           # 🎯 Section goals
└── [Chart Components]         # 📈 Các component biểu đồ
    ├── ExecutiveDashboard.tsx  # 🏢 Dashboard Executive
    ├── ExecutiveHeader.tsx     # 🎯 Header Executive
    ├── ExecutiveKPITable.tsx   # 📋 Bảng KPI Executive
    ├── ExecutiveFunnelSection.tsx # 📊 Funnel chart
    ├── ExecutivePieSection.tsx    # 🥧 Pie chart
    ├── ExecutiveTrendSection.tsx  # 📈 Trend chart
    ├── ExecutiveDrilldownSection.tsx # 🔍 Drill-down
    └── ExecutiveAlertSection.tsx   # ⚠️ Alerts & recommendations
```

#### 🔧 **Settings Components** (`components/settings/`)
```
settings/
├── ConnectedAccountsTab.tsx    # 🔗 Tab kết nối tài khoản
├── GoogleAccountSelector.tsx   # 🟢 Chọn tài khoản Google
├── GoogleServiceSelectionModal.tsx # 🔧 Modal chọn dịch vụ Google
├── MetaConnectModal.tsx        # 🔵 Modal kết nối Meta
├── WooCommerceConnectModal.tsx # 🟠 Modal kết nối WooCommerce
├── WooCommerceGuideModal.tsx   # 📖 Hướng dẫn WooCommerce
├── PlatformButton.tsx          # 🔘 Button kết nối platform
├── platformData.tsx           # 📊 Data cho platforms
├── icons.tsx                  # 🎨 Icons cho platforms
└── types.ts                   # 📝 Types cho settings
```

#### 📊 **Channel Detail Components** (`components/channel-detail/`)
```
channel-detail/
├── ChannelDetailView.tsx       # 👁️ View chính channel detail
├── ChannelDetailHeader.tsx     # 🎯 Header channel detail
├── ChannelDetailInsights.tsx   # 💡 Insights cho channel
├── ChannelDetailMetrics.tsx    # 📊 Metrics cho channel
└── ChannelDetailTable.tsx      # 📋 Table cho channel
```

#### 🟢 **Google Sheets Components** (`components/google-sheets/`)
```
google-sheets/
├── GoogleSheetsConnector.tsx   # 🔗 Connector chính
├── FilePicker.tsx             # 📁 Chọn file Google Sheets
├── SheetPicker.tsx            # 📄 Chọn sheet trong file
├── Preview.tsx                # 👀 Preview dữ liệu
├── Mapping.tsx                # 🔗 Mapping columns
├── googleSheetsService.ts     # 🔧 Service cho Google Sheets
└── index.ts                   # 📦 Export tất cả
```

#### 👤 **Profile Components** (`components/profile/`)
```
profile/
├── ProfileHeader.tsx           # 🎯 Header với avatar và thông tin
├── ProfileEditForm.tsx         # ✏️ Form chỉnh sửa profile
├── OrganizationSection.tsx     # 🏢 Quản lý tổ chức
├── EmailVerificationBanner.tsx # 📧 Banner xác thực email
├── AvatarUpload.tsx            # 📤 Upload avatar
└── index.ts                   # 📦 Export tất cả
```

#### 🎨 **UI Components** (`components/ui/`)
```
ui/
├── button.tsx                 # 🔘 Button component
├── card.tsx                   # 🃏 Card component
├── badge.tsx                  # 🏷️ Badge component
├── dropdown-menu.tsx          # 📋 Dropdown menu
├── select.tsx                 # 📝 Select component
├── table.tsx                  # 📊 Table component
├── tooltip.tsx                # 💡 Tooltip component
├── empty-state.tsx            # 📭 Empty state component
├── platform-legend.tsx        # 🎨 Platform legend
└── index.ts                   # 📦 Export tất cả
```

#### 🔧 **Common Components** (`components/`)
```
[Common Components]
├── AppLayout.tsx              # 🏗️ Layout chính ứng dụng
├── AccountSelector.tsx        # 👥 Chọn tài khoản
├── ChannelPerformanceTabs.tsx # 📊 Tabs performance
├── CreateReportModal.tsx      # 📄 Modal tạo report
├── DateRangePicker.tsx        # 📅 Chọn khoảng thời gian
├── ErrorBoundary.tsx          # 🛡️ Error boundary
├── ExecutiveDashboard.tsx     # 🏢 Executive dashboard
├── ExecutiveSummary.tsx       # 📋 Executive summary
├── GoalCard.tsx               # 🎯 Card goal
├── GoalModal.tsx              # 📝 Modal thêm/sửa goal
├── KPICard.tsx                # 📊 Card KPI
├── KPIImportModal.tsx         # 📥 Modal import KPI từ Excel
├── MobileNavigation.tsx       # 📱 Navigation mobile
├── OnboardingTour.tsx         # 🎓 Tour onboarding
├── ProtectedRoute.tsx         # 🛡️ Route bảo vệ
├── RecommendationCard.tsx     # 💡 Card recommendation
├── ReportCard.tsx             # 📊 Card report
├── RevenueOrderModal.tsx      # 💰 Modal revenue order
├── SearchBar.tsx              # 🔍 Search bar
├── SearchModal.tsx            # 🔍 Modal search
├── ThemeToggle.tsx            # 🌙 Toggle theme
├── Toast.tsx                  # 🍞 Toast notification
├── TrendChart.tsx             # 📈 Chart trend
├── UserProfileModal.tsx       # 👤 Modal user profile
└── index.ts                   # 📦 Export tất cả components
```

### 📁 **Hooks** - Custom React Hooks
```
hooks/
├── useExecutiveFilters.ts      # 🔍 Filter state cho Executive
├── useExecutiveMockData.ts    # 📊 Mock data cho Executive
├── useAnalytics.ts            # 📈 Analytics tracking
├── useDashboardData.ts        # 📊 Dashboard data management
├── useConnectedChannels.ts    # 🔗 Connected channels management
├── useSettings.ts             # ⚙️ Settings management
├── useSecurity.ts             # 🛡️ Security features
├── useProfileSecurity.ts      # 🔐 Profile security
├── useOrganization.ts         # 🏢 Organization management
├── usePerformanceMonitor.ts   # 📊 Performance monitoring
├── useProfile.ts              # 👤 Profile management
├── useGoogleAccountConnect.ts # 🟢 Google account connection
├── useDashboardState.ts       # 📊 Dashboard state management
├── useGoals.ts                # 🎯 Goals management
├── useAccountSelection.ts     # 👥 Account selection
├── useDateRange.ts            # 📅 Date range management
└── index.ts                   # 📦 Export tất cả hooks
```

### 📁 **Types** - TypeScript Type Definitions
```
types/
├── dashboard.ts               # 📊 Dashboard types
├── enterprise.ts              # 🏢 Enterprise types
├── goals.ts                   # 🎯 Goal types
└── index.ts                   # 📦 Export tất cả types
```

### 📁 **Utils** - Utility Functions
```
utils/
├── dashboardUtils.ts          # 🔧 Dashboard utility functions
├── mockData.ts               # 📊 Mock data generators
├── mockRecommendations.ts    # 💡 Mock recommendations
├── organization.ts           # 🏢 Organization utilities
├── platformDataService.ts    # 📊 Platform data service
├── supabaseClient.ts         # ☁️ Supabase client
└── index.ts                  # 📦 Export tất cả utils
```

### 📁 **Constants** - Application Constants
```
constants/
├── dashboard.ts               # 📊 Dashboard constants
├── dashboardData.tsx         # 📊 Dashboard data constants
└── index.ts                  # 📦 Export tất cả constants
```

### 📁 **Config** - Configuration Files
```
config/
├── enterprise.ts              # 🏢 Enterprise configuration
└── dataSource.ts             # 📊 Data source configuration
```

### 📁 **Locales** - Internationalization
```
locales/
├── en/
│   └── translation.json       # 🇬🇧 English translations
└── vi/
    └── translation.json       # 🇻🇳 Vietnamese translations
```

## 🔗 Mối quan hệ giữa các component

### 📊 **Dashboard Flow**
```
Dashboard.tsx (Main Page)
├── DashboardHeader.tsx
│   ├── DateRangePicker.tsx
│   └── DashboardViewToggle.tsx
├── KPISection.tsx
│   ├── GoalModal.tsx
│   └── KPIImportModal.tsx
├── InsightsSection.tsx
│   └── DashboardInsights.tsx
├── MainContentSection.tsx
│   └── DashboardContent.tsx
│       ├── ExecutiveDashboard.tsx (Executive tab)
│       │   ├── ExecutiveHeader.tsx
│       │   ├── ExecutiveKPITable.tsx
│       │   ├── ExecutiveFunnelSection.tsx
│       │   ├── ExecutivePieSection.tsx
│       │   ├── ExecutiveTrendSection.tsx
│       │   ├── ExecutiveDrilldownSection.tsx
│       │   └── ExecutiveAlertSection.tsx
│       └── ChannelDetailView.tsx (Channels tab)
│           ├── ChannelDetailHeader.tsx
│           ├── ChannelDetailInsights.tsx
│           ├── ChannelDetailMetrics.tsx
│           └── ChannelDetailTable.tsx
└── GoalsSection.tsx
    └── GoalModal.tsx
```

### ⚙️ **Settings Flow**
```
Settings.tsx (Main Page)
├── ConnectedAccountsTab.tsx
│   ├── GoogleAccountSelector.tsx
│   │   └── GoogleServiceSelectionModal.tsx
│   ├── MetaConnectModal.tsx
│   ├── WooCommerceConnectModal.tsx
│   │   └── WooCommerceGuideModal.tsx
│   └── PlatformButton.tsx
```

### 👤 **Profile Flow**
```
Profile.tsx (Main Page)
├── ProfileHeader.tsx
├── ProfileEditForm.tsx
├── OrganizationSection.tsx
├── EmailVerificationBanner.tsx
└── AvatarUpload.tsx
```

### 🟢 **Google Sheets Flow**
```
GoogleSheetsConnector.tsx (Main)
├── FilePicker.tsx
├── SheetPicker.tsx
├── Preview.tsx
└── Mapping.tsx
```

## 📋 Chức năng của từng trang

### 🏠 **Dashboard.tsx** - Trang chính
- **Chức năng**: Trang dashboard tổng quan
- **Components chính**: DashboardHeader, KPISection, MainContentSection, GoalsSection
- **State management**: useDashboardState, useDashboardData
- **Data flow**: Platform data → Dashboard components

### 🔐 **Auth.tsx** - Trang xác thực
- **Chức năng**: Đăng nhập/đăng ký
- **Components chính**: AuthForm
- **State management**: Local state
- **Data flow**: User credentials → Supabase auth

### 👤 **Profile.tsx** - Trang hồ sơ
- **Chức năng**: Quản lý hồ sơ người dùng
- **Components chính**: ProfileHeader, ProfileEditForm, OrganizationSection
- **State management**: useProfile
- **Data flow**: User data → Profile components

### ⚙️ **Settings.tsx** - Trang cài đặt
- **Chức năng**: Kết nối platform, cài đặt hệ thống
- **Components chính**: ConnectedAccountsTab, GoogleAccountSelector
- **State management**: useSettings
- **Data flow**: Platform connections → Settings components

### 💡 **Recommendations.tsx** - Trang khuyến nghị
- **Chức năng**: Hiển thị khuyến nghị tối ưu
- **Components chính**: RecommendationCard
- **State management**: Local state
- **Data flow**: AI insights → Recommendation components

### 📊 **Reports.tsx** - Trang báo cáo
- **Chức năng**: Quản lý và tạo báo cáo
- **Components chính**: ReportCard, CreateReportModal
- **State management**: Local state
- **Data flow**: Dashboard data → Report generation

## 🔧 Cách sử dụng tài liệu này

### 1. **Tìm component theo chức năng**
- Muốn thêm filter? → `DashboardHeader.tsx`
- Muốn thêm chart? → `components/dashboard/[Chart Components]`
- Muốn thêm platform? → `components/settings/`

### 2. **Tìm hook theo logic**
- Muốn quản lý data? → `useDashboardData.ts`
- Muốn quản lý state? → `useDashboardState.ts`
- Muốn tracking? → `useAnalytics.ts`

### 3. **Tìm type theo domain**
- Dashboard types? → `types/dashboard.ts`
- Enterprise features? → `types/enterprise.ts`
- Goal management? → `types/goals.ts`

### 4. **Tìm utility theo chức năng**
- Mock data? → `utils/mockData.ts`
- Dashboard utils? → `utils/dashboardUtils.ts`
- Platform data? → `utils/platformDataService.ts`

## 📝 Lưu ý quan trọng

### ✅ **Best Practices**
- Mỗi component chỉ có 1 trách nhiệm chính
- Logic business được tách vào custom hooks
- Types được định nghĩa rõ ràng cho từng domain
- Utils được tổ chức theo chức năng

### 🔄 **Cập nhật cấu trúc**
- Khi thêm component mới, cập nhật tài liệu này
- Khi refactor, đảm bảo cấu trúc vẫn rõ ràng
- Khi thêm feature mới, tạo folder riêng nếu cần

### 📚 **Tài liệu liên quan**
- `COMPONENT_ARCHITECTURE.md` - Chi tiết component architecture
- `REFACTOR_PROGRESS.md` - Tiến trình refactor
- `CURRENT_STATUS.md` - Trạng thái hiện tại

## 📁 Cấu trúc dự án phần Reports (2024)

```
frontend/src/components/reports/
├── ReportsTab.tsx
├── CustomReportsSection.tsx
├── AdvancedAnalyticsSection.tsx
├── SavedReportsSection.tsx
├── analytics/
│   ├── AttributionAnalysis.tsx
│   ├── CohortAnalysis.tsx
│   ├── PredictiveAnalytics.tsx
│   ├── CompetitiveIntelligence.tsx
│   ├── AdvancedSegmentation.tsx
│   └── RealTimeMonitoring.tsx
├── templates/
│   └── ...
└── mock/
    └── ...
```

### Best Practice:
- Mỗi module analytics là 1 file/component riêng trong `analytics/`.
- Tách mock data, mock API vào `mock/` để dễ test/debug.
- Template báo cáo để trong `templates/`.
- Không để logic phức tạp trong ReportsTab, chỉ điều hướng và render.
- Khi scale, chỉ cần thêm file mới, không ảnh hưởng code cũ.
- Đặt tên file rõ ràng, dễ tìm kiếm.
- Comment code rõ ràng, ưu tiên maintainability.

### Lợi ích:
- Dễ maintain, debug, scale, onboarding dev mới.
- Chuẩn hóa cho team lớn/enterprise.

---

**Last updated**: December 2024  
**Maintainer**: Development Team  
**Version**: 1.0 