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

### 2. Settings Flow
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

### 3. Google Sheets Flow
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