# 🚀 Quick Reference - Digital Performance Optimizer

## 📋 Tổng quan
Tài liệu này cung cấp thông tin tra cứu nhanh về các file, component và chức năng trong dự án.

## 🎯 **Tìm file nhanh**

### 📊 **Dashboard & Charts**
| Tìm gì | File | Chức năng |
|--------|------|-----------|
| Dashboard chính | `pages/Dashboard.tsx` | Trang dashboard tổng quan |
| Executive Dashboard | `components/dashboard/ExecutiveDashboard.tsx` | Dashboard cho executive |
| KPI Cards | `components/dashboard/DashboardKPIs.tsx` | Hiển thị KPI cards |
| Funnel Chart | `components/dashboard/ExecutiveFunnelSection.tsx` | Biểu đồ funnel |
| Pie Chart | `components/dashboard/ExecutivePieSection.tsx` | Biểu đồ pie |
| Trend Chart | `components/dashboard/ExecutiveTrendSection.tsx` | Biểu đồ trend |
| Channel Detail | `components/ChannelDetailView.tsx` | Chi tiết từng kênh |

### 🔐 **Authentication & Profile**
| Tìm gì | File | Chức năng |
|--------|------|-----------|
| Đăng nhập | `pages/Auth.tsx` | Trang đăng nhập/đăng ký |
| Profile | `pages/Profile.tsx` | Trang hồ sơ người dùng |
| Profile Header | `components/profile/ProfileHeader.tsx` | Header profile |
| Avatar Upload | `components/profile/AvatarUpload.tsx` | Upload avatar |
| Security | `components/profile/SecuritySection.tsx` | Bảo mật (2FA) |

### ⚙️ **Settings & Connections**
| Tìm gì | File | Chức năng |
|--------|------|-----------|
| Settings | `pages/Settings.tsx` | Trang cài đặt |
| Google Connect | `components/settings/GoogleAccountSelector.tsx` | Kết nối Google |
| Meta Connect | `components/settings/MetaConnectModal.tsx` | Kết nối Meta |
| WooCommerce | `components/settings/WooCommerceConnectModal.tsx` | Kết nối WooCommerce |
| Google Sheets | `components/google-sheets/GoogleSheetsConnector.tsx` | Kết nối Google Sheets |

### 💡 **Recommendations & Reports**
| Tìm gì | File | Chức năng |
|--------|------|-----------|
| Recommendations | `pages/Recommendations.tsx` | Trang khuyến nghị |
| Reports | `pages/Reports.tsx` | Trang báo cáo |
| Recommendation Card | `components/RecommendationCard.tsx` | Card khuyến nghị |
| Report Card | `components/ReportCard.tsx` | Card báo cáo |

## 🔧 **Custom Hooks**

### 📊 **Data Management**
| Hook | File | Chức năng |
|------|------|-----------|
| Dashboard Data | `hooks/useDashboardData.ts` | Quản lý data dashboard |
| Dashboard State | `hooks/useDashboardState.ts` | Quản lý state dashboard |
| Executive Filters | `hooks/useExecutiveFilters.ts` | Filter cho executive |
| Executive Mock Data | `hooks/useExecutiveMockData.ts` | Mock data cho executive |
| Connected Channels | `hooks/useConnectedChannels.ts` | Quản lý kênh đã kết nối |

### 👤 **User Management**
| Hook | File | Chức năng |
|------|------|-----------|
| Profile | `hooks/useProfile.ts` | Quản lý profile |
| Profile Security | `hooks/useProfileSecurity.ts` | Bảo mật profile |
| Organization | `hooks/useOrganization.ts` | Quản lý tổ chức |
| Google Connect | `hooks/useGoogleAccountConnect.ts` | Kết nối Google |

### ⚙️ **System Management**
| Hook | File | Chức năng |
|------|------|-----------|
| Settings | `hooks/useSettings.ts` | Quản lý settings |
| Security | `hooks/useSecurity.ts` | Bảo mật hệ thống |
| Analytics | `hooks/useAnalytics.ts` | Tracking analytics |
| Performance | `hooks/usePerformanceMonitor.ts` | Monitor performance |

## 📝 **Types & Interfaces**

### 📊 **Dashboard Types**
| Type | File | Mô tả |
|------|------|-------|
| DashboardView | `types/dashboard.ts` | Loại view dashboard |
| PlatformConnection | `types/dashboard.ts` | Kết nối platform |
| ExecutiveData | `types/dashboard.ts` | Data cho executive |
| ChannelDetailData | `types/dashboard.ts` | Data cho channel detail |

### 🏢 **Enterprise Types**
| Type | File | Mô tả |
|------|------|-------|
| EnterpriseConfig | `types/enterprise.ts` | Config enterprise |
| SecurityEvent | `types/enterprise.ts` | Event bảo mật |
| AnalyticsEvent | `types/enterprise.ts` | Event analytics |
| PerformanceMetrics | `types/enterprise.ts` | Metrics performance |

### 🎯 **Goal Types**
| Type | File | Mô tả |
|------|------|-------|
| Goal | `types/goals.ts` | Interface goal |
| GoalFormData | `types/goals.ts` | Form data goal |
| GoalUnit | `types/goals.ts` | Đơn vị goal |
| GoalPeriod | `types/goals.ts` | Kỳ hạn goal |

## 🔧 **Utils & Services**

### 📊 **Data Utils**
| Util | File | Chức năng |
|------|------|-----------|
| Dashboard Utils | `utils/dashboardUtils.ts` | Utils cho dashboard |
| Mock Data | `utils/mockData.ts` | Generator mock data |
| Platform Data | `utils/platformDataService.ts` | Service platform data |
| Organization | `utils/organization.ts` | Utils organization |

### 🏢 **Enterprise Utils**
| Util | File | Chức năng |
|------|------|-----------|
| Enterprise Config | `config/enterprise.ts` | Config enterprise |
| Data Source | `config/dataSource.ts` | Config data source |

## 🎨 **UI Components**

### 🔘 **Basic UI**
| Component | File | Chức năng |
|-----------|------|-----------|
| Button | `components/ui/button.tsx` | Button component |
| Card | `components/ui/card.tsx` | Card component |
| Badge | `components/ui/badge.tsx` | Badge component |
| Select | `components/ui/select.tsx` | Select component |
| Table | `components/ui/table.tsx` | Table component |

### 📋 **Advanced UI**
| Component | File | Chức năng |
|-----------|------|-----------|
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | Dropdown menu |
| Tooltip | `components/ui/tooltip.tsx` | Tooltip component |
| Empty State | `components/ui/empty-state.tsx` | Empty state |
| Platform Legend | `components/ui/platform-legend.tsx` | Platform legend |

## 📊 **Common Patterns**

### 🔄 **State Management Pattern**
```typescript
// 1. Custom Hook cho logic
const useCustomHook = () => {
  const [state, setState] = useState();
  // Logic here
  return { state, setState };
};

// 2. Component sử dụng hook
const Component = () => {
  const { state, setState } = useCustomHook();
  return <div>{/* JSX */}</div>;
};
```

### 📊 **Data Flow Pattern**
```typescript
// 1. Mock data trong utils
export const mockData = { /* data */ };

// 2. Hook quản lý data
const useDataHook = () => {
  return { data: mockData };
};

// 3. Component nhận data
const Component = () => {
  const { data } = useDataHook();
  return <div>{/* render data */}</div>;
};
```

### 🎯 **Component Structure Pattern**
```typescript
// 1. Interface cho props
interface ComponentProps {
  data: any;
  onAction: () => void;
}

// 2. Component với TypeScript
const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  return <div>{/* JSX */}</div>;
};
```

## 🚀 **Quick Commands**

### 📁 **Tìm file nhanh**
```bash
# Tìm component theo tên
find src/components -name "*Dashboard*"

# Tìm hook theo tên
find src/hooks -name "*use*"

# Tìm type theo tên
find src/types -name "*.ts"
```

### 🔍 **Tìm trong code**
```bash
# Tìm import của component
grep -r "import.*Dashboard" src/

# Tìm usage của hook
grep -r "useDashboard" src/

# Tìm interface
grep -r "interface.*Dashboard" src/
```

## 📋 **Checklist thường dùng**

### ✅ **Khi thêm component mới**
- [ ] Tạo file trong đúng folder
- [ ] Export trong `index.ts`
- [ ] Thêm TypeScript interface
- [ ] Thêm vào mapping docs
- [ ] Test component

### ✅ **Khi thêm hook mới**
- [ ] Tạo file trong `hooks/`
- [ ] Export trong `hooks/index.ts`
- [ ] Thêm TypeScript types
- [ ] Thêm vào docs
- [ ] Test hook

### ✅ **Khi refactor**
- [ ] Cập nhật import paths
- [ ] Cập nhật exports
- [ ] Cập nhật docs
- [ ] Test functionality
- [ ] Check build

## 🆘 **Troubleshooting**

### ❌ **Lỗi thường gặp**
| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| Import error | Sai path | Kiểm tra `index.ts` exports |
| Type error | Thiếu interface | Thêm type trong `types/` |
| Build error | Circular dependency | Kiểm tra import cycles |
| Runtime error | Hook usage | Kiểm tra Rules of Hooks |

### 🔧 **Debug tips**
```typescript
// 1. Console log để debug
console.log('Component rendered:', props);

// 2. React DevTools để inspect
// 3. Network tab để check API calls
// 4. Performance tab để check performance
```

---

**Last updated**: December 2024  
**Maintainer**: Development Team  
**Version**: 1.0 