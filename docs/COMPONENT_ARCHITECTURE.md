# Component Architecture - Digital Performance Optimizer

## 📋 Tổng quan
Tài liệu này mô tả cấu trúc, liên kết và tác dụng của từng component trong hệ thống Digital Performance Optimizer. Giúp team hiểu rõ để tránh lặp lại hoặc xóa nhầm component.

## 🏗️ Cấu trúc thư mục components

```
src/components/
├── dashboard/                    # Dashboard components
│   ├── DashboardHeader.tsx      # Header với filter, date range, view toggle
│   ├── DashboardOverview.tsx    # Overview tổng quan (đã refactor)
│   ├── DashboardContent.tsx     # Nội dung chính (charts, tables)
│   ├── DashboardKPIs.tsx        # KPI cards (đã refactor)
│   ├── DashboardDataTable.tsx   # Bảng dữ liệu chi tiết
│   ├── DashboardInsights.tsx    # Insights và gợi ý tối ưu
│   ├── DashboardGoals.tsx       # Goals management (đã refactor)
│   ├── DashboardActivity.tsx    # Recent activity
│   ├── KPISection.tsx           # ✅ MỚI: Section KPI tổng quan
│   ├── InsightsSection.tsx      # ✅ MỚI: Section insights
│   ├── MainContentSection.tsx   # ✅ MỚI: Section nội dung chính
│   └── GoalsSection.tsx         # ✅ MỚI: Section goals
├── settings/                    # Settings components
│   ├── ConnectedAccountsTab.tsx # Tab kết nối tài khoản
│   ├── GoogleAccountSelector.tsx # Chọn tài khoản Google
│   ├── GoogleServiceSelectionModal.tsx # Modal chọn dịch vụ Google
│   ├── MetaConnectModal.tsx     # Modal kết nối Meta
│   ├── WooCommerceConnectModal.tsx # Modal kết nối WooCommerce
│   ├── WooCommerceGuideModal.tsx # Hướng dẫn WooCommerce
│   ├── PlatformButton.tsx       # Button kết nối platform
│   ├── platformData.tsx         # Data cho platforms
│   ├── icons.tsx               # Icons cho platforms
│   └── types.ts                # Types cho settings
├── google-sheets/              # Google Sheets components
│   ├── GoogleSheetsConnector.tsx # Connector chính
│   ├── FilePicker.tsx          # Chọn file Google Sheets
│   ├── SheetPicker.tsx         # Chọn sheet trong file
│   ├── Preview.tsx             # Preview dữ liệu
│   ├── Mapping.tsx             # Mapping columns
│   ├── googleSheetsService.ts  # Service cho Google Sheets
│   └── index.ts                # Export tất cả
├── channel-detail/             # Channel detail components
│   ├── ChannelDetailView.tsx   # View chính (đã refactor)
│   ├── ChannelDetailHeader.tsx # Header channel detail
│   ├── ChannelDetailInsights.tsx # Insights cho channel
│   ├── ChannelDetailMetrics.tsx # Metrics cho channel
│   └── ChannelDetailTable.tsx  # Table cho channel
├── ui/                         # UI components
│   └── dropdown-menu.tsx       # Dropdown menu
├── [Common Components]         # Components dùng chung
│   ├── AppLayout.tsx           # Layout chính
│   ├── AccountSelector.tsx     # Chọn tài khoản
│   ├── ChannelPerformanceTabs.tsx # Tabs performance
│   ├── CreateReportModal.tsx   # Modal tạo report
│   ├── DateRangePicker.tsx     # Chọn khoảng thời gian
│   ├── ErrorBoundary.tsx       # Error boundary
│   ├── ExecutiveDashboard.tsx  # Executive dashboard
│   ├── ExecutiveSummary.tsx    # Executive summary
│   ├── GoalCard.tsx            # Card goal
│   ├── GoalModal.tsx           # Modal thêm/sửa goal
│   ├── KPICard.tsx             # Card KPI
│   ├── KPIImportModal.tsx      # ✅ MỚI: Modal import KPI từ Excel
│   ├── MobileNavigation.tsx    # Navigation mobile
│   ├── OnboardingTour.tsx      # Tour onboarding
│   ├── PlatformDashboard.tsx   # Dashboard theo platform
│   ├── ProtectedRoute.tsx      # Route bảo vệ
│   ├── RecommendationCard.tsx  # Card recommendation
│   ├── ReportCard.tsx          # Card report
│   ├── RevenueOrderModal.tsx   # Modal revenue order
│   ├── SearchBar.tsx           # Search bar
│   ├── SearchModal.tsx         # Modal search
│   ├── ThemeToggle.tsx         # Toggle theme
│   ├── Toast.tsx               # Toast notification
│   ├── TrendChart.tsx          # Chart trend
│   └── UserProfileModal.tsx    # Modal user profile
└── index.ts                    # Export tất cả components
```

## 🔗 Liên kết và dependencies

### 1. Dashboard Flow
```
Dashboard.tsx (Main)
├── DashboardHeader.tsx
├── KPISection.tsx
│   ├── GoalModal.tsx (thêm KPI thủ công)
│   └── KPIImportModal.tsx (import Excel)
├── InsightsSection.tsx
│   └── DashboardInsights.tsx
├── MainContentSection.tsx
│   ├── DashboardContent.tsx
│   └── DashboardKPIs.tsx
└── GoalsSection.tsx
    └── GoalModal.tsx
```

### 2. Executive Dashboard Flow ✅ MỚI
```
ExecutiveDashboard.tsx (Main - 196 dòng)
├── useExecutiveFilters.ts (53 dòng) - Custom hook quản lý filter state
├── useExecutiveMockData.ts (81 dòng) - Custom hook quản lý mock data
├── ExecutiveHeader.tsx - Header và filter controls
├── ExecutiveKPITable.tsx - Bảng so sánh KPI với drill-down
├── ExecutiveFunnelSection.tsx - Funnel chart (tách riêng)
├── ExecutivePieSection.tsx - Pie chart (tách riêng)
├── ExecutiveTrendSection.tsx - Trend chart (tách riêng)
├── ExecutiveDrilldownSection.tsx - Phân rã chi tiết theo kênh/campaign
└── ExecutiveAlertSection.tsx - Cảnh báo và đề xuất AI
```

### 3. Settings Flow
```
Settings.tsx (Main)
├── ConnectedAccountsTab.tsx
│   ├── GoogleAccountSelector.tsx
│   │   └── GoogleServiceSelectionModal.tsx
│   ├── MetaConnectModal.tsx
│   ├── WooCommerceConnectModal.tsx
│   │   └── WooCommerceGuideModal.tsx
│   └── PlatformButton.tsx
```

### 4. Google Sheets Flow
```
GoogleSheetsConnector.tsx (Main)
├── FilePicker.tsx
├── SheetPicker.tsx
├── Preview.tsx
└── Mapping.tsx
```

## 📊 Tác dụng của từng component

### 🎯 Dashboard Components

#### **KPISection.tsx** ✅ MỚI
- **Tác dụng**: Hiển thị KPI tổng quan và nút thêm/import KPI
- **Props**: `kpiData`, `onAddGoal`, `onImportExcel`
- **Dependencies**: GoalModal, KPIImportModal
- **Trạng thái**: Đang sử dụng

#### **InsightsSection.tsx** ✅ MỚI
- **Tác dụng**: Hiển thị insight/cảnh báo/gợi ý tối ưu
- **Props**: `platformData`, `selectedChannel`
- **Dependencies**: DashboardInsights
- **Trạng thái**: Đang sử dụng

#### **MainContentSection.tsx** ✅ MỚI
- **Tác dụng**: Bảng số liệu chi tiết, so sánh kênh, biểu đồ
- **Props**: `platformData`, `currentView`, `connectedPlatforms`, `hasConnectedPlatforms`, `selectedAccounts`, `executiveData`, `channelDetailData`, `dateRangeString`, `kpiData`, `compareChannels`
- **Dependencies**: DashboardContent, DashboardKPIs
- **Trạng thái**: Đang sử dụng

#### **GoalsSection.tsx** ✅ MỚI
- **Tác dụng**: Danh sách goals, nút thêm/sửa/xóa goal
- **Props**: `goals`, `onAddGoal`, `t`
- **Dependencies**: GoalModal
- **Trạng thái**: Đang sử dụng

#### **DashboardHeader.tsx**
- **Tác dụng**: Header với filter, date range, view toggle
- **Props**: `currentView`, `onViewChange`, `onDateRangeChange`, `onToggleAccountSelector`, `dateRangeString`
- **Dependencies**: DateRangePicker
- **Trạng thái**: Đang sử dụng

#### **DashboardContent.tsx**
- **Tác dụng**: Nội dung chính (charts, tables)
- **Props**: `platformData`, `currentView`, `connectedPlatforms`, `hasConnectedPlatforms`, `selectedAccounts`, `onAccountSelectionChange`, `executiveData`, `channelDetailData`, `dateRangeString`
- **Dependencies**: PlatformDashboard, ExecutiveDashboard
- **Trạng thái**: Đang sử dụng

#### **DashboardKPIs.tsx**
- **Tác dụng**: KPI cards
- **Props**: `kpis`, `compareChannels`
- **Dependencies**: KPICard
- **Trạng thái**: Đang sử dụng

#### **DashboardDataTable.tsx**
- **Tác dụng**: Bảng dữ liệu chi tiết
- **Props**: `platformData`, `selectedChannel`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **DashboardInsights.tsx**
- **Tác dụng**: Insights và gợi ý tối ưu
- **Props**: `platformData`, `selectedChannel`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **DashboardGoals.tsx**
- **Tác dụng**: Goals management
- **Props**: `goals`, `onEditGoal`, `onDeleteGoal`, `onOpenGoalModal`
- **Dependencies**: GoalCard
- **Trạng thái**: Đang sử dụng

#### **DashboardActivity.tsx**
- **Tác dụng**: Recent activity
- **Props**: None
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

### 🎯 Settings Components

#### **ConnectedAccountsTab.tsx**
- **Tác dụng**: Tab kết nối tài khoản
- **Props**: None
- **Dependencies**: GoogleAccountSelector, MetaConnectModal, WooCommerceConnectModal
- **Trạng thái**: Đang sử dụng

#### **GoogleAccountSelector.tsx**
- **Tác dụng**: Chọn tài khoản Google
- **Props**: `accessToken`, `onAccountsSelected`
- **Dependencies**: GoogleServiceSelectionModal
- **Trạng thái**: Đang sử dụng

#### **GoogleServiceSelectionModal.tsx**
- **Tác dụng**: Modal chọn dịch vụ Google
- **Props**: `isOpen`, `onClose`, `onServiceSelect`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **MetaConnectModal.tsx**
- **Tác dụng**: Modal kết nối Meta
- **Props**: `isOpen`, `onClose`, `onSuccess`, `onFail`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **WooCommerceConnectModal.tsx**
- **Tác dụng**: Modal kết nối WooCommerce
- **Props**: `isOpen`, `onClose`, `onSuccess`
- **Dependencies**: WooCommerceGuideModal
- **Trạng thái**: Đang sử dụng

#### **WooCommerceGuideModal.tsx**
- **Tác dụng**: Hướng dẫn WooCommerce
- **Props**: `isOpen`, `onClose`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **PlatformButton.tsx**
- **Tác dụng**: Button kết nối platform
- **Props**: `platform`, `isConnected`, `onClick`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

### 🎯 Google Sheets Components

#### **GoogleSheetsConnector.tsx**
- **Tác dụng**: Connector chính
- **Props**: `open`, `onClose`, `onSuccess`
- **Dependencies**: FilePicker, SheetPicker, Preview, Mapping
- **Trạng thái**: Đang sử dụng

#### **FilePicker.tsx**
- **Tác dụng**: Chọn file Google Sheets
- **Props**: `onFileSelect`, `onNext`, `onBack`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **SheetPicker.tsx**
- **Tác dụng**: Chọn sheet trong file
- **Props**: `selectedFile`, `onSheetSelect`, `onNext`, `onBack`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **Preview.tsx**
- **Tác dụng**: Preview dữ liệu
- **Props**: `onNext`, `onBack`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **Mapping.tsx**
- **Tác dụng**: Mapping columns
- **Props**: `mapping`, `onMappingChange`, `onNext`, `onBack`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

### 🎯 Channel Detail Components

#### **ChannelDetailView.tsx**
- **Tác dụng**: View chính
- **Props**: `channel`, `data`
- **Dependencies**: ChannelDetailHeader, ChannelDetailInsights, ChannelDetailMetrics, ChannelDetailTable
- **Trạng thái**: Đang sử dụng

#### **ChannelDetailHeader.tsx**
- **Tác dụng**: Header channel detail
- **Props**: `channel`, `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ChannelDetailInsights.tsx**
- **Tác dụng**: Insights cho channel
- **Props**: `channel`, `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ChannelDetailMetrics.tsx**
- **Tác dụng**: Metrics cho channel
- **Props**: `channel`, `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ChannelDetailTable.tsx**
- **Tác dụng**: Table cho channel
- **Props**: `channel`, `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

### 🎯 Common Components

#### **AppLayout.tsx**
- **Tác dụng**: Layout chính
- **Props**: `children`
- **Dependencies**: MobileNavigation, ThemeToggle, UserProfileModal
- **Trạng thái**: Đang sử dụng

#### **AccountSelector.tsx**
- **Tác dụng**: Chọn tài khoản
- **Props**: `accounts`, `selectedAccount`, `onAccountChange`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ChannelPerformanceTabs.tsx**
- **Tác dụng**: Tabs performance
- **Props**: `currentTab`, `onTabChange`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **CreateReportModal.tsx**
- **Tác dụng**: Modal tạo report
- **Props**: `isOpen`, `onClose`, `onCreate`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **DateRangePicker.tsx**
- **Tác dụng**: Chọn khoảng thời gian
- **Props**: `startDate`, `endDate`, `onDateChange`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ErrorBoundary.tsx**
- **Tác dụng**: Error boundary
- **Props**: `children`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ExecutiveDashboard.tsx**
- **Tác dụng**: Executive dashboard
- **Props**: `data`
- **Dependencies**: ExecutiveSummary
- **Trạng thái**: Đang sử dụng

#### **ExecutiveSummary.tsx**
- **Tác dụng**: Executive summary
- **Props**: `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **GoalCard.tsx**
- **Tác dụng**: Card goal
- **Props**: `goal`, `onEdit`, `onDelete`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **GoalModal.tsx**
- **Tác dụng**: Modal thêm/sửa goal
- **Props**: `isOpen`, `onClose`, `onSave`, `goal`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **KPICard.tsx**
- **Tác dụng**: Card KPI
- **Props**: `title`, `value`, `change`, `status`, `icon`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **KPIImportModal.tsx** ✅ MỚI
- **Tác dụng**: Modal import KPI từ Excel
- **Props**: `isOpen`, `onClose`, `onImport`
- **Dependencies**: xlsx library
- **Trạng thái**: Đang sử dụng

#### **MobileNavigation.tsx**
- **Tác dụng**: Navigation mobile
- **Props**: `currentPage`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **OnboardingTour.tsx**
- **Tác dụng**: Tour onboarding
- **Props**: `isActive`
- **Dependencies**: react-joyride
- **Trạng thái**: Đang sử dụng

#### **PlatformDashboard.tsx**
- **Tác dụng**: Dashboard theo platform
- **Props**: `platform`, `data`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ProtectedRoute.tsx**
- **Tác dụng**: Route bảo vệ
- **Props**: `children`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **RecommendationCard.tsx**
- **Tác dụng**: Card recommendation
- **Props**: `recommendation`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **ReportCard.tsx**
- **Tác dụng**: Card report
- **Props**: `report`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **RevenueOrderModal.tsx**
- **Tác dụng**: Modal revenue order
- **Props**: `isOpen`, `onClose`, `onSave`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **SearchBar.tsx**
- **Tác dụng**: Search bar
- **Props**: `onSearch`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **SearchModal.tsx**
- **Tác dụng**: Modal search
- **Props**: `isOpen`, `onClose`
- **Dependencies**: SearchBar
- **Trạng thái**: Đang sử dụng

#### **ThemeToggle.tsx**
- **Tác dụng**: Toggle theme
- **Props**: None
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **Toast.tsx**
- **Tác dụng**: Toast notification
- **Props**: `message`, `type`, `onClose`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **TrendChart.tsx**
- **Tác dụng**: Chart trend
- **Props**: `data`, `title`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

#### **UserProfileModal.tsx**
- **Tác dụng**: Modal user profile
- **Props**: `isOpen`, `onClose`
- **Dependencies**: None
- **Trạng thái**: Đang sử dụng

## ⚠️ Lưu ý quan trọng

### 🔄 Components đã refactor
- **KPISection.tsx**: Thay thế phần KPI trong Dashboard.tsx
- **InsightsSection.tsx**: Thay thế phần insights trong Dashboard.tsx
- **MainContentSection.tsx**: Thay thế phần main content trong Dashboard.tsx
- **GoalsSection.tsx**: Thay thế phần goals trong Dashboard.tsx

### 🗑️ Components có thể xóa (nếu không dùng)
- **DashboardOverview.tsx**: Đã được thay thế bởi KPISection
- **DashboardKPIs.tsx**: Vẫn dùng trong MainContentSection
- **DashboardGoals.tsx**: Đã được thay thế bởi GoalsSection

### 🔧 Components cần bảo trì
- **DashboardContent.tsx**: Core component, không nên xóa
- **DashboardInsights.tsx**: Core component, không nên xóa
- **DashboardDataTable.tsx**: Core component, không nên xóa

### 📝 Quy tắc khi thêm component mới
1. **Đặt tên rõ ràng**: `[Feature]Section.tsx` hoặc `[Feature]Modal.tsx`
2. **Tạo interface**: Định nghĩa Props interface
3. **Export trong index.ts**: Thêm vào `src/components/index.ts`
4. **Cập nhật tài liệu**: Thêm vào file này
5. **Test**: Kiểm tra không bị conflict

### 🚫 Quy tắc khi xóa component
1. **Kiểm tra dependencies**: Xem có component nào đang import không
2. **Kiểm tra usage**: Tìm trong codebase xem có đang dùng không
3. **Backup**: Backup trước khi xóa
4. **Test**: Test lại sau khi xóa
5. **Cập nhật tài liệu**: Xóa khỏi file này

---

**Last updated**: December 2024
**Version**: 1.0
**Status**: Active 

## Các component dashboard mới (2024)

### FunnelChart
- **File:** src/components/dashboard/FunnelChart.tsx
- **Props:**
  - data: array các bước funnel (name, value)
  - height (optional)
- **Luồng dữ liệu:** Nhận data từ platformData tổng hợp.
- **Vị trí sử dụng:** Dashboard overview, dưới KPI Card.
- **Mở rộng:** Có thể thêm các bước funnel khác nếu cần.

### PieChart
- **File:** src/components/dashboard/PieChart.tsx
- **Props:**
  - data: array các nguồn (name, value)
  - title (optional), height (optional)
- **Luồng dữ liệu:** Nhận data từ platformData (trafficBySource, leadBySource, revenueBySource).
- **Vị trí sử dụng:** Dashboard overview, dưới FunnelChart.
- **Mở rộng:** Có thể dùng cho nhiều loại phân bổ khác.

### EngagementChart
- **File:** src/components/dashboard/EngagementChart.tsx
- **Props:**
  - data: array các mốc thời gian (date, like, share, comment, ctr, engagementRate)
  - height (optional)
- **Luồng dữ liệu:** Nhận data từ platformData.engagementTimeline.
- **Vị trí sử dụng:** Dashboard overview, dưới PieChart.
- **Mở rộng:** Có thể thêm các chỉ số tương tác khác.

### CPCChart
- **File:** src/components/dashboard/CPCChart.tsx
- **Props:**
  - data: array (label, cpc)
  - height (optional)
- **Luồng dữ liệu:** Nhận data từ platformData.cpcTimeline.
- **Vị trí sử dụng:** Dashboard overview, dưới EngagementChart.

### CPMChart
- **File:** src/components/dashboard/CPMChart.tsx
- **Props:**
  - data: array (label, cpm)
  - height (optional)
- **Luồng dữ liệu:** Nhận data từ platformData.cpmTimeline.
- **Vị trí sử dụng:** Dashboard overview, dưới CPCChart.

## Executive Dashboard Components (2024)

### ExecutiveHeader.tsx ✅ MỚI
- **File:** src/components/dashboard/ExecutiveHeader.tsx
- **Props:**
  - dateRange, selectedChannels, selectedCampaigns, selectedKPIs
  - drilldownLevel, selectedChannel, selectedCampaign
  - onDateRangeChange, onChannelChange, onCampaignChange, onKPIChange
  - onDrilldownLevelChange, onExport, onPeriodComparison, onClearFilters
- **Tác dụng:** Header và filter controls cho tab Executive
- **Features:** Date range picker, channel/campaign/KPI filters, drill-down selector, summary stats
- **Vị trí sử dụng:** ExecutiveDashboard container

### ExecutiveFunnelCompare.tsx ✅ MỚI
- **File:** src/components/dashboard/ExecutiveFunnelCompare.tsx
- **Props:**
  - data: FunnelData[] (platform, lead, qualified_lead, order, revenue)
  - selectedChannels, dateRange
- **Tác dụng:** Biểu đồ funnel so sánh từng kênh/campaign
- **Features:** Volume vs Conversion Rate toggle, step-by-step comparison, performance indicators
- **Vị trí sử dụng:** ExecutiveDashboard, dưới ExecutiveKPITable

### ExecutivePieCompare.tsx ✅ MỚI
- **File:** src/components/dashboard/ExecutivePieCompare.tsx
- **Props:**
  - data: PieData[] (revenue, cost, leads, orders, roas, cpa)
  - selectedChannels, dateRange
- **Tác dụng:** Pie chart phân bổ doanh thu/chi phí/lead theo kênh/campaign
- **Features:** Revenue/Cost/Leads/Orders distribution, percentage calculations, efficiency metrics
- **Vị trí sử dụng:** ExecutiveDashboard, dưới ExecutiveFunnelCompare

### ExecutiveKPITable.tsx
- **File:** src/components/dashboard/ExecutiveKPITable.tsx
- **Props:**
  - data: array các kênh/campaign với KPI
  - selectedKPIs, onDrilldown
- **Tác dụng:** Bảng KPI so sánh với drill-down
- **Features:** Sortable columns, performance indicators, drill-down actions
- **Vị trí sử dụng:** ExecutiveDashboard, dưới ExecutiveHeader

### ExecutiveDashboard.tsx
- **File:** src/components/dashboard/ExecutiveDashboard.tsx
- **Props:**
  - data, dateRange, onDateRangeChange
- **Tác dụng:** Container component cho tab Executive
- **Features:** Filter management, drill-down logic, export functionality, period comparison
- **Dependencies:** ExecutiveHeader, ExecutiveKPITable, ExecutiveFunnelCompare, ExecutivePieCompare
- **Vị trí sử dụng:** DashboardContent (Executive view)

---

## Refactor & Best Practice
- Tất cả component đều nhận data qua props, không phụ thuộc context toàn cục.
- Dễ tái sử dụng, dễ test, dễ mở rộng.
- Style đồng bộ với dashboard hiện tại. 

## Tổng quan

Hệ thống được thiết kế theo kiến trúc component-based với React + TypeScript, sử dụng các best practices để đảm bảo hiệu suất, khả năng bảo trì và mở rộng.

## Cấu trúc Component

### 1. Layout Components

#### AppLayout.tsx
- **Chức năng**: Layout chính của ứng dụng
- **Props**: children, user, loading
- **State**: sidebarOpen, currentView
- **Features**: 
  - Responsive sidebar navigation
  - User profile dropdown
  - Breadcrumb navigation
  - Loading states

#### ProtectedRoute.tsx
- **Chức năng**: Bảo vệ route yêu cầu authentication
- **Props**: children, requiredRole
- **Features**:
  - Kiểm tra authentication status
  - Redirect to login nếu chưa đăng nhập
  - Role-based access control
  - Loading states

### 2. Dashboard Components

#### DashboardContent.tsx
- **Chức năng**: Container chính cho dashboard
- **Props**: selectedAccount, dateRange
- **State**: activeTab, dashboardData
- **Features**:
  - Tab navigation (Overview, Executive)
  - Data fetching và caching
  - Error handling
  - Loading states

#### DashboardOverview.tsx
- **Chức năng**: Tab Overview - Hiển thị tổng quan
- **Props**: data, dateRange
- **State**: selectedKPIs, chartType
- **Features**:
  - KPI Cards tổng hợp
  - Trend charts tổng hợp
  - Funnel charts tổng hợp
  - Pie charts tổng hợp
  - Insights tổng hợp
  - Chỉ filter thời gian
  - Không drill-down
  - Export tổng hợp

#### ExecutiveDashboard.tsx
- **Chức năng**: Tab Executive - So sánh & drill-down
- **Props**: data, dateRange, filters
- **State**: selectedChannels, selectedCampaigns, selectedKPIs, drilldownLevel
- **Features**:
  - Bộ lọc kênh/campaign/KPI
  - KPI Table so sánh
  - Trend charts multi-series
  - Funnel charts so sánh
  - Pie charts phân bổ
  - Drill-down section
  - Alert theo kênh/campaign
  - Export theo filter

#### ExecutiveKPITable.tsx
- **Chức năng**: Bảng so sánh KPI theo kênh/campaign
- **Props**: data, selectedKPIs, selectedChannels
- **State**: sortColumn, sortDirection, drilldownData
- **Features**:
  - Bảng động với cột KPI tùy chọn
  - Sort theo cột
  - Drill-down từng hàng
  - Highlight KPI bất thường
  - Export bảng

#### ExecutiveTrendChart.tsx
- **Chức năng**: Biểu đồ trend so sánh giữa các kênh/campaign
- **Props**: data, selectedKPIs, selectedChannels, dateRange
- **State**: chartType, selectedSeries
- **Features**:
  - Multi-series line/bar chart
  - Legend động
  - Hover tooltip
  - Zoom/pan controls
  - Export chart

#### ExecutiveDrilldownSection.tsx
- **Chức năng**: Phân rã chi tiết khi chọn kênh/campaign
- **Props**: selectedChannel, selectedCampaign, drilldownData
- **State**: drilldownLevel, filters
- **Features**:
  - Drill-down nhiều cấp (kênh → campaign → ad group → ad)
  - Filter theo audience, device, location
  - Chi tiết theo ngày/tuần/tháng
  - Export drill-down data

#### ExecutiveAlertSection.tsx
- **Chức năng**: Cảnh báo và đề xuất theo kênh/campaign
- **Props**: alerts, recommendations
- **State**: selectedChannel, alertFilters
- **Features**:
  - Alert theo từng kênh/campaign
  - Đề xuất tối ưu hóa
  - Filter alert theo loại
  - Export alert report

### 3. KPI Components

#### KPICard.tsx
- **Chức năng**: Hiển thị KPI dạng card
- **Props**: title, value, change, target, format
- **Features**:
  - Hiển thị giá trị hiện tại
  - So sánh với kỳ trước
  - Progress bar vs target
  - Color coding theo performance
  - Tooltip với chi tiết

#### KPIImportModal.tsx
- **Chức năng**: Modal import KPI từ file
- **Props**: isOpen, onClose, onImport
- **State**: file, preview, mapping
- **Features**:
  - Upload file Excel/CSV
  - Preview data
  - Map columns
  - Validation
  - Import progress

### 4. Chart Components

#### TrendChart.tsx
- **Chức năng**: Biểu đồ trend line/bar
- **Props**: data, type, options
- **Features**:
  - Line/Bar chart
  - Multiple series
  - Zoom/pan
  - Export
  - Responsive

#### FunnelChart.tsx
- **Chức năng**: Biểu đồ funnel
- **Props**: data, stages
- **Features**:
  - Funnel visualization
  - Drop-off highlighting
  - Stage details
  - Export

#### PieChart.tsx
- **Chức năng**: Biểu đồ pie/donut
- **Props**: data, type
- **Features**:
  - Pie/Donut chart
  - Legend
  - Hover details
  - Export

#### EngagementChart.tsx
- **Chức năng**: Biểu đồ engagement metrics
- **Props**: data, metrics
- **Features**:
  - Engagement rate
  - Time on site
  - Bounce rate
  - Page views

#### CPCChart.tsx
- **Chức năng**: Biểu đồ Cost Per Click
- **Props**: data, channels
- **Features**:
  - CPC trends
  - Channel comparison
  - Threshold alerts

#### CPMChart.tsx
- **Chức năng**: Biểu đồ Cost Per Mille
- **Props**: data, channels
- **Features**:
  - CPM trends
  - Channel comparison
  - Threshold alerts

### 5. Settings Components

#### Settings.tsx
- **Chức năng**: Trang cài đặt chính
- **Props**: user, organizations
- **State**: activeTab, settings
- **Features**:
  - Tab navigation
  - Account settings
  - Connected accounts
  - Notifications
  - Security

#### ConnectedAccountsTab.tsx
- **Chức năng**: Quản lý tài khoản đã kết nối
- **Props**: connectedAccounts
- **State**: selectedAccount, modalState
- **Features**:
  - List connected accounts
  - Connect new account
  - Disconnect account
  - Account details

#### GoogleAccountSelector.tsx
- **Chức năng**: Chọn tài khoản Google
- **Props**: accounts, onSelect
- **State**: selectedAccount
- **Features**:
  - List Google accounts
  - Account selection
  - Permission scopes
  - Connection status

#### WooCommerceConnectModal.tsx
- **Chức năng**: Modal kết nối WooCommerce
- **Props**: isOpen, onClose, onSuccess
- **State**: connectionData, step
- **Features**:
  - OAuth flow
  - Store selection
  - Permission setup
  - Connection test

#### MetaConnectModal.tsx
- **Chức năng**: Modal kết nối Meta Ads
- **Props**: isOpen, onClose, onSuccess
- **State**: connectionData, step
- **Features**:
  - OAuth flow
  - Ad account selection
  - Permission setup
  - Connection test

### 6. Profile Components

#### Profile.tsx
- **Chức năng**: Trang profile người dùng
- **Props**: user, organizations
- **State**: activeTab, editMode
- **Features**:
  - User information
  - Organization management
  - Security settings
  - Activity log

#### ProfileHeader.tsx
- **Chức năng**: Header profile với avatar và thông tin cơ bản
- **Props**: user, organization
- **Features**:
  - Avatar upload
  - Basic info display
  - Edit mode toggle
  - Organization switcher

#### ProfileEditForm.tsx
- **Chức năng**: Form chỉnh sửa thông tin profile
- **Props**: user, onSave
- **State**: formData, validation
- **Features**:
  - Form validation
  - Real-time updates
  - Save/cancel actions
  - Error handling

#### SecuritySection.tsx
- **Chức năng**: Quản lý bảo mật (2FA, password)
- **Props**: user
- **State**: twoFactorEnabled, setupStep
- **Features**:
  - 2FA setup/disable
  - Password change
  - Security logs
  - Device management

### 7. Google Sheets Components

#### GoogleSheetsConnector.tsx
- **Chức năng**: Kết nối và import dữ liệu từ Google Sheets
- **Props**: isOpen, onClose, onImport
- **State**: connection, sheets, selectedSheet
- **Features**:
  - OAuth authentication
  - Sheet selection
  - Data preview
  - Import mapping

#### FilePicker.tsx
- **Chức năng**: Chọn file Google Sheets
- **Props**: onSelect
- **State**: files, selectedFile
- **Features**:
  - File browser
  - Search/filter
  - Recent files
  - File details

#### SheetPicker.tsx
- **Chức năng**: Chọn sheet trong file Google Sheets
- **Props**: file, onSelect
- **State**: sheets, selectedSheet
- **Features**:
  - Sheet list
  - Preview data
  - Sheet info
  - Selection

#### Mapping.tsx
- **Chức năng**: Map columns từ Google Sheets sang KPI
- **Props**: sheetData, onMap
- **State**: mapping, validation
- **Features**:
  - Column mapping
  - Data validation
  - Preview mapped data
  - Save mapping

#### Preview.tsx
- **Chức năng**: Preview dữ liệu trước khi import
- **Props**: mappedData, onConfirm
- **State**: preview, validation
- **Features**:
  - Data preview
  - Validation errors
  - Import confirmation
  - Progress tracking

### 8. Channel Detail Components

#### ChannelDetailView.tsx
- **Chức năng**: Chi tiết kênh marketing
- **Props**: channel, data
- **State**: activeTab, dateRange
- **Features**:
  - Channel overview
  - Performance metrics
  - Campaign list
  - Insights

#### ChannelDetailHeader.tsx
- **Chức năng**: Header với thông tin kênh
- **Props**: channel, metrics
- **Features**:
  - Channel info
  - Key metrics
  - Connection status
  - Quick actions

#### ChannelDetailMetrics.tsx
- **Chức năng**: Metrics chi tiết của kênh
- **Props**: metrics, dateRange
- **Features**:
  - Performance metrics
  - Trend analysis
  - Comparison
  - Alerts

#### ChannelDetailTable.tsx
- **Chức năng**: Bảng dữ liệu chi tiết
- **Props**: data, columns
- **Features**:
  - Sortable columns
  - Filtering
  - Pagination
  - Export

#### ChannelDetailInsights.tsx
- **Chức năng**: Insights và recommendations
- **Props**: insights, recommendations
- **Features**:
  - AI insights
  - Recommendations
  - Performance alerts
  - Action items

### 9. UI Components

#### ThemeToggle.tsx
- **Chức năng**: Chuyển đổi theme light/dark
- **Props**: theme, onToggle
- **Features**:
  - Theme switching
  - Persistent preference
  - Smooth transition

#### Toast.tsx
- **Chức năng**: Thông báo toast
- **Props**: message, type, duration
- **Features**:
  - Success/error/info/warning
  - Auto dismiss
  - Manual dismiss
  - Queue management

#### SearchBar.tsx
- **Chức năng**: Thanh tìm kiếm
- **Props**: onSearch, placeholder
- **State**: query, suggestions
- **Features**:
  - Real-time search
  - Search suggestions
  - Search history
  - Clear search

#### SearchModal.tsx
- **Chức năng**: Modal tìm kiếm nâng cao
- **Props**: isOpen, onClose, onSelect
- **State**: query, filters, results
- **Features**:
  - Advanced search
  - Multiple filters
  - Search results
  - Quick actions

#### MobileNavigation.tsx
- **Chức năng**: Navigation cho mobile
- **Props**: currentView, onNavigate
- **Features**:
  - Bottom navigation
  - Quick actions
  - Notifications
  - User menu

### 10. Enterprise Components

#### EnterpriseApp.tsx
- **Chức năng**: App wrapper với enterprise features
- **Props**: children
- **Features**:
  - Performance monitoring
  - Error boundary
  - Analytics tracking
  - Security checks

#### ErrorBoundary.tsx
- **Chức năng**: Bắt và xử lý lỗi
- **Props**: children, fallback
- **Features**:
  - Error catching
  - Fallback UI
  - Error reporting
  - Recovery options

#### OnboardingTour.tsx
- **Chức năng**: Tour hướng dẫn người dùng mới
- **Props**: isActive, onComplete
- **State**: currentStep, steps
- **Features**:
  - Step-by-step tour
  - Interactive highlights
  - Progress tracking
  - Skip option

## Component Patterns

### 1. Container/Presentational Pattern
- Container components: Quản lý state và logic
- Presentational components: Chỉ hiển thị UI

### 2. Custom Hooks Pattern
- Tách logic ra khỏi components
- Reusable business logic
- Testing dễ dàng hơn

### 3. Compound Components Pattern
- Components có thể kết hợp với nhau
- Flexible API design
- Type safety

### 4. Render Props Pattern
- Truyền render function làm prop
- Flexible component composition
- Dynamic rendering

## Performance Optimization

### 1. Memoization
- React.memo cho components
- useMemo cho expensive calculations
- useCallback cho functions

### 2. Lazy Loading
- Code splitting
- Dynamic imports
- Suspense boundaries

### 3. Virtual Scrolling
- Cho large lists
- Efficient rendering
- Smooth scrolling

### 4. Bundle Optimization
- Tree shaking
- Dead code elimination
- Chunk splitting

## Testing Strategy

### 1. Unit Tests
- Component rendering
- Props validation
- Event handling
- State changes

### 2. Integration Tests
- Component interactions
- API calls
- User flows
- Error scenarios

### 3. E2E Tests
- Complete user journeys
- Critical paths
- Cross-browser testing
- Performance testing

## Accessibility (a11y)

### 1. Semantic HTML
- Proper heading structure
- ARIA labels
- Keyboard navigation
- Screen reader support

### 2. Color Contrast
- WCAG compliance
- High contrast mode
- Color blind friendly
- Focus indicators

### 3. Keyboard Navigation
- Tab order
- Focus management
- Keyboard shortcuts
- Escape handling

## Internationalization (i18n)

### 1. Translation System
- React-i18next
- Translation keys
- Pluralization
- Date/number formatting

### 2. RTL Support
- Right-to-left languages
- Text direction
- Layout adaptation
- Icon flipping

## Security Considerations

### 1. Input Validation
- XSS prevention
- SQL injection prevention
- File upload validation
- Data sanitization

### 2. Authentication
- JWT tokens
- Session management
- Role-based access
- 2FA support

### 3. Data Protection
- Encryption
- Secure storage
- Data masking
- Audit logging

---

## Tóm lại

Kiến trúc component được thiết kế để:
- **Modular**: Dễ dàng thêm/sửa/xóa components
- **Reusable**: Components có thể tái sử dụng
- **Testable**: Dễ dàng viết tests
- **Performant**: Tối ưu hiệu suất
- **Accessible**: Hỗ trợ accessibility
- **International**: Hỗ trợ đa ngôn ngữ
- **Secure**: Bảo mật tốt 