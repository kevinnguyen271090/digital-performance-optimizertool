# Data Source Strategy - Mock Data vs API

## Tổng quan

Hệ thống được thiết kế để linh hoạt chuyển đổi giữa mock data và API thật mà không cần sửa code nhiều.

## Các Strategy

### 1. **Environment-based Configuration**

```bash
# Development - Sử dụng mock data
NODE_ENV=development
REACT_APP_DATA_SOURCE=mock

# Production - Sử dụng API thật
NODE_ENV=production  
REACT_APP_DATA_SOURCE=api

# Hybrid - API với fallback về mock
REACT_APP_DATA_SOURCE=hybrid
```

### 2. **Data Source Modes**

| Mode | Description | Use Case |
|------|-------------|----------|
| `mock` | Chỉ sử dụng mock data | Development, Testing, Demo |
| `api` | Chỉ sử dụng API thật | Production |
| `hybrid` | API trước, fallback về mock | Staging, Beta testing |

### 3. **Fallback Logic**

```typescript
// Strategy 1: Mock only
if (useMock && !useAPI) {
  return mockData;
}

// Strategy 2: API only  
if (useAPI && !useMock) {
  return apiData;
}

// Strategy 3: API with fallback to mock
if (useAPI && useMock && fallbackToMock) {
  try {
    return await apiData;
  } catch (error) {
    return mockData;
  }
}
```

## Cách sử dụng

### 1. **Development**

```bash
# .env.development
NODE_ENV=development
REACT_APP_DATA_SOURCE=mock
REACT_APP_API_URL=http://localhost:8000
```

### 2. **Production**

```bash
# .env.production  
NODE_ENV=production
REACT_APP_DATA_SOURCE=api
REACT_APP_API_URL=https://api.avengerhub.com
```

### 3. **Testing**

```bash
# .env.test
NODE_ENV=test
REACT_APP_DATA_SOURCE=mock
```

## Component Usage

### Trước đây (Hard-coded mock data):

```typescript
// ExecutiveDashboard.tsx
const mockData = useMemo(() => ({
  channels: [
    { id: 'facebook', name: 'Facebook Ads', revenue: 50000000 },
    // ...
  ]
}), []);
```

### Bây giờ (Service-based):

```typescript
// ExecutiveDashboard.tsx
const { data, loading, error, dataSource } = useDashboardData({
  dateRange,
  selectedChannels
});

// Tự động chọn data source dựa trên environment
```

## Benefits

### ✅ **Development**
- Không cần API server để dev
- UI/UX testing nhanh chóng
- Demo cho khách hàng dễ dàng

### ✅ **Production**  
- Tự động chuyển sang API thật
- Fallback an toàn khi API lỗi
- Không cần sửa code khi deploy

### ✅ **Testing**
- Unit test với mock data
- Integration test với API
- E2E test với hybrid mode

## Migration Guide

### Bước 1: Cập nhật Environment
```bash
# Development
echo "REACT_APP_DATA_SOURCE=mock" >> .env.development

# Production  
echo "REACT_APP_DATA_SOURCE=api" >> .env.production
```

### Bước 2: Cập nhật Components
```typescript
// Thay thế hard-coded mock data
const { data, loading } = useDashboardData();

// Sử dụng data từ service
if (loading) return <Loading />;
if (!data) return <EmptyState />;

return <Chart data={data.channels} />;
```

### Bước 3: Deploy
```bash
# Development
npm run dev  # Sử dụng mock data

# Production  
npm run build  # Sử dụng API thật
```

## Best Practices

### 1. **Mock Data Structure**
- Giữ cấu trúc mock data giống API response
- Sử dụng realistic data cho testing
- Cập nhật mock data khi API thay đổi

### 2. **Error Handling**
- Luôn có fallback cho API errors
- Log rõ ràng data source đang sử dụng
- User-friendly error messages

### 3. **Performance**
- Mock data nhanh hơn API calls
- Caching cho API responses
- Lazy loading cho large datasets

### 4. **Security**
- Không expose API keys trong mock data
- Validate data structure
- Sanitize user inputs

## Troubleshooting

### Q: Mock data không hiển thị?
A: Kiểm tra `REACT_APP_DATA_SOURCE=mock` trong .env

### Q: API calls fail trong production?
A: Kiểm tra `REACT_APP_API_URL` và network connectivity

### Q: Fallback không hoạt động?
A: Kiểm tra `fallbackToMock` setting trong config

### Q: Performance issues?
A: Sử dụng caching và optimize API calls

---

## 🎯 **TÁC ĐỘNG CỦA VIỆC CHIA FRONTEND-BACKEND-DATABASE VỚI DATA SOURCE STRATEGY**

### ✅ **1. HỖ TRỢ HOÀN HẢO CHO VIỆC TÁCH RIÊNG**

**Data Source Strategy được thiết kế đặc biệt cho kiến trúc tách riêng:**

#### **Development Mode (Mock Data)**
```bash
# Frontend dev không cần backend
REACT_APP_DATA_SOURCE=mock
npm run dev  # Chạy độc lập với mock data
```

#### **Production Mode (Real API)**
```bash
# Frontend kết nối với backend Python
REACT_APP_DATA_SOURCE=api
REACT_APP_API_URL=https://api.avengerhub.com
```

#### **Hybrid Mode (API + Fallback)**
```bash
# Staging environment
REACT_APP_DATA_SOURCE=hybrid
# Tự động fallback về mock nếu API lỗi
```

### ✅ **2. LỢI ÍCH CỤ THỂ CHO TEAM**

#### **Frontend Team**
- **Development**: Không cần backend để dev UI/UX
- **Testing**: Test với mock data nhanh chóng
- **Demo**: Demo cho khách hàng dễ dàng
- **Deploy**: Deploy frontend độc lập

#### **Backend Team**
- **Development**: Phát triển API độc lập
- **Testing**: Test API với Postman/curl
- **Deploy**: Deploy backend riêng biệt
- **Scale**: Scale backend theo nhu cầu

#### **DevOps Team**
- **Infrastructure**: Quản lý từng service riêng biệt
- **Monitoring**: Monitor từng service độc lập
- **CI/CD**: Pipeline riêng cho từng service

### ✅ **3. DEPLOYMENT FLEXIBILITY**

#### **Development Environment**
```bash
# Frontend: Mock data
cd frontend && npm run dev

# Backend: Local development
cd backend && uvicorn app.main:app --reload

# Database: Local Supabase
supabase start
```

#### **Staging Environment**
```bash
# Frontend: Hybrid mode
REACT_APP_DATA_SOURCE=hybrid
vercel --prod

# Backend: Staging API
docker build -t backend:staging
docker run backend:staging

# Database: Staging Supabase
supabase db push --env staging
```

#### **Production Environment**
```bash
# Frontend: Real API
REACT_APP_DATA_SOURCE=api
vercel --prod

# Backend: Production API
docker build -t backend:prod
docker run backend:prod

# Database: Production Supabase
supabase db push --env production
```

### ✅ **4. TEAM COLLABORATION**

#### **Parallel Development**
```bash
# Frontend team
git checkout feature/new-dashboard
npm run dev  # Chạy với mock data

# Backend team  
git checkout feature/analytics-api
uvicorn app.main:app --reload  # Chạy API local

# Không conflict, không blocking
```

#### **Independent Testing**
```bash
# Frontend tests
npm run test  # Test với mock data

# Backend tests
pytest  # Test API endpoints

# Integration tests
npm run test:integration  # Test frontend + backend
```

### ✅ **5. SCALING STRATEGY**

#### **Phase 1: MVP (Mock Data)**
```bash
# Chỉ frontend với mock data
REACT_APP_DATA_SOURCE=mock
# Deploy trên Vercel (free tier)
```

#### **Phase 2: Beta (Hybrid)**
```bash
# Frontend + Basic Backend
REACT_APP_DATA_SOURCE=hybrid
# Backend trên DigitalOcean ($20/tháng)
```

#### **Phase 3: Production (Real API)**
```bash
# Full stack với real API
REACT_APP_DATA_SOURCE=api
# Backend scale theo nhu cầu
```

### ⚠️ **6. CÁC THÁCH THỨC CẦN LƯU Ý**

#### **API Contract Consistency**
```typescript
// Cần đảm bảo mock data và API response có cùng structure
interface DashboardData {
  kpis: KPIData[];
  charts: ChartData[];
  insights: InsightData[];
}

// Mock data phải match API response
const mockDashboardData: DashboardData = {
  kpis: [...],
  charts: [...],
  insights: [...]
};
```

#### **Environment Management**
```bash
# Cần quản lý nhiều environment files
.env.development    # Mock data
.env.staging        # Hybrid mode
.env.production     # Real API
.env.test           # Mock data for testing
```

#### **Data Synchronization**
```typescript
// Real-time updates cần được handle
const { data, loading, error } = useDashboardData({
  dateRange,
  selectedChannels,
  dataSource: process.env.REACT_APP_DATA_SOURCE,
  realTime: process.env.REACT_APP_DATA_SOURCE === 'api'
});
```

### 📈 **7. ROADMAP IMPLEMENTATION**

#### **Phase 1: Mock Data Strategy (Đã hoàn thành)**
```typescript
// ✅ Đã implement
const { data, loading, error, dataSource } = useDashboardData({
  dateRange,
  selectedChannels
});
```

#### **Phase 2: Backend API Development (Đang thực hiện)**
```python
# backend/app/api/analytics.py
@router.get("/dashboard/{org_id}")
async def get_dashboard_data(org_id: str):
    return {
        "kpis": [...],
        "charts": [...],
        "insights": [...]
    }
```

#### **Phase 3: Hybrid Mode (Kế hoạch)**
```typescript
// frontend/src/services/dataService.ts
const fetchData = async () => {
  if (dataSource === 'api') {
    try {
      return await apiCall();
    } catch (error) {
      return mockData; // Fallback
    }
  }
  return mockData;
};
```

### 🎯 **8. KẾT LUẬN**

**Data Source Strategy HOÀN TOÀN PHÙ HỢP với việc chia frontend-backend-database:**

#### ✅ **Tích cực:**
1. **Hỗ trợ development độc lập**
2. **Deployment flexibility**
3. **Team collaboration tốt hơn**
4. **Scaling strategy rõ ràng**
5. **Risk mitigation với fallback**

#### ⚠️ **Cần lưu ý:**
1. **API contract consistency**
2. **Environment management**
3. **Data synchronization**
4. **Error handling**

#### 🚀 **Bước tiếp theo:**
1. **Ưu tiên cao**: Hoàn thành Backend API development
2. **Ưu tiên trung bình**: Implement hybrid mode
3. **Ưu tiên thấp**: Optimization và monitoring

**Kết luận: Data Source Strategy là key enabler cho việc chia tách frontend-backend-database thành công.** 