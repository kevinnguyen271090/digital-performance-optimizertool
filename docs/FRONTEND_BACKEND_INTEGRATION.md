# 🔗 HƯỚNG DẪN KẾT NỐI FRONTEND VỚI BACKEND

## 🎯 **TỔNG QUAN**

Để kết nối React frontend với Supabase database, chúng ta cần tạo Python FastAPI backend làm middleware. Đây là kiến trúc hoàn chỉnh:

```
Frontend (React) → Backend (FastAPI) → Database (Supabase)
```

## 🏗️ **KIẾN TRÚC HỆ THỐNG**

### **📊 Flow dữ liệu:**
```
1. Frontend gọi API → Backend
2. Backend xử lý logic → Supabase Database
3. Database trả dữ liệu → Backend
4. Backend format dữ liệu → Frontend
```

### **🔧 Components:**
- ✅ **Frontend**: React + TypeScript + Vite
- ✅ **Backend**: Python FastAPI + Supabase Client
- ✅ **Database**: Supabase (PostgreSQL)
- ✅ **Authentication**: Supabase Auth
- ✅ **Real-time**: WebSocket (tương lai)

## 🚀 **SETUP BACKEND**

### **1. Cài đặt dependencies:**
```bash
cd digital-performance-optimizer/backend
pip install -r requirements.txt
```

### **2. Tạo file .env:**
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# API Configuration
SECRET_KEY=your-secret-key
DEBUG=true
ENVIRONMENT=development

# External APIs
GOOGLE_ANALYTICS_API_KEY=your-google-key
META_ADS_API_KEY=your-meta-key
OPENAI_API_KEY=your-openai-key
```

### **3. Chạy backend:**
```bash
cd digital-performance-optimizer/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔌 **API ENDPOINTS**

### **📊 Analytics Endpoints:**

#### **1. Dashboard Data:**
```http
GET /api/v1/analytics/dashboard/{organization_id}
```
**Response:**
```json
{
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "date_range": "last_7_days",
  "channels": [
    {
      "channel": "facebook_ads",
      "platform": "facebook",
      "metrics": {
        "impressions": 800,
        "clicks": 40
      },
      "trend": {
        "impressions": 15.5,
        "clicks": 8.2
      },
      "performance": "good"
    }
  ],
  "kpis": [
    {
      "name": "Total Impressions",
      "value": 1800,
      "target": null,
      "unit": "impressions",
      "trend": 15.5,
      "status": "on_track"
    }
  ],
  "summary": {
    "total_records": 4,
    "channels_count": 2,
    "metrics_count": 2
  },
  "last_updated": "2025-01-06T14:57:17.641978+00:00"
}
```

#### **2. Channel Metrics:**
```http
GET /api/v1/analytics/channels/{organization_id}
```

#### **3. KPI Data:**
```http
GET /api/v1/analytics/kpis/{organization_id}
```

#### **4. Executive Data:**
```http
GET /api/v1/analytics/executive/{organization_id}
```

#### **5. AI Insights:**
```http
GET /api/v1/analytics/insights/{organization_id}
```

#### **6. Performance Alerts:**
```http
GET /api/v1/analytics/alerts/{organization_id}
```

## 🔧 **FRONTEND INTEGRATION**

### **1. Tạo API service:**
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Analytics API
export const analyticsAPI = {
  getDashboardData: (organizationId: string, dateRange?: string) =>
    api.get(`/analytics/dashboard/${organizationId}`, {
      params: { date_range: dateRange }
    }),
    
  getChannelMetrics: (organizationId: string, dateRange?: string) =>
    api.get(`/analytics/channels/${organizationId}`, {
      params: { date_range: dateRange }
    }),
    
  getKPIData: (organizationId: string, dateRange?: string) =>
    api.get(`/analytics/kpis/${organizationId}`, {
      params: { date_range: dateRange }
    }),
    
  getExecutiveData: (organizationId: string, dateRange?: string) =>
    api.get(`/analytics/executive/${organizationId}`, {
      params: { date_range: dateRange }
    }),
    
  getAIInsights: (organizationId: string, limit?: number) =>
    api.get(`/analytics/insights/${organizationId}`, {
      params: { limit }
    }),
    
  getPerformanceAlerts: (organizationId: string, limit?: number) =>
    api.get(`/analytics/alerts/${organizationId}`, {
      params: { limit }
    }),
};
```

### **2. Cập nhật hooks:**
```typescript
// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export const useDashboardData = (organizationId: string, dateRange = 'last_7_days') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getDashboardData(organizationId, dateRange);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchData();
    }
  }, [organizationId, dateRange]);

  return { data, loading, error };
};
```

### **3. Cập nhật components:**
```typescript
// src/components/dashboard/DashboardOverview.tsx
import { useDashboardData } from '../../hooks/useDashboardData';

export const DashboardOverview = ({ organizationId }: { organizationId: string }) => {
  const { data, loading, error } = useDashboardData(organizationId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <div className="kpi-grid">
        {data?.kpis.map(kpi => (
          <KPICard key={kpi.name} kpi={kpi} />
        ))}
      </div>
      <div className="channels-grid">
        {data?.channels.map(channel => (
          <ChannelCard key={channel.channel} channel={channel} />
        ))}
      </div>
    </div>
  );
};
```

## 🔄 **REAL-TIME UPDATES**

### **1. WebSocket Setup (tương lai):**
```typescript
// src/services/websocket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

export const useRealTimeUpdates = (organizationId: string) => {
  useEffect(() => {
    socket.emit('join-organization', organizationId);
    
    socket.on('data-update', (data) => {
      // Update dashboard data
    });
    
    return () => {
      socket.emit('leave-organization', organizationId);
    };
  }, [organizationId]);
};
```

### **2. Polling (tạm thời):**
```typescript
// src/hooks/useRealTimeData.ts
export const useRealTimeData = (organizationId: string, interval = 30000) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await analyticsAPI.getDashboardData(organizationId);
      setData(response.data);
    };
    
    fetchData();
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [organizationId, interval]);
  
  return data;
};
```

## 🧪 **TESTING**

### **1. Test Backend:**
```bash
# Test API endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/analytics/dashboard/550e8400-e29b-41d4-a716-446655440000
```

### **2. Test Frontend:**
```bash
# Start frontend
cd digital-performance-optimizer/frontend
npm run dev
```

### **3. Test Integration:**
- ✅ Backend chạy trên port 8000
- ✅ Frontend chạy trên port 5173
- ✅ API calls thành công
- ✅ Data hiển thị đúng trên dashboard

## 🎯 **NEXT STEPS**

### **Phase 1: Basic Integration (Ưu tiên cao)**
1. ✅ **Setup Backend** - FastAPI + Supabase
2. ✅ **Create API Endpoints** - Analytics endpoints
3. ⏳ **Update Frontend** - Connect với API
4. ⏳ **Test Integration** - Verify data flow

### **Phase 2: Advanced Features**
1. ⏳ **Authentication** - Supabase Auth integration
2. ⏳ **Real-time Updates** - WebSocket setup
3. ⏳ **Caching** - Redis cache layer
4. ⏳ **Background Tasks** - Celery integration

### **Phase 3: Production**
1. ⏳ **Deployment** - Docker + Cloud deployment
2. ⏳ **Monitoring** - Performance monitoring
3. ⏳ **Security** - Security audit
4. ⏳ **Scaling** - Load balancing

## 🎉 **KẾT LUẬN**

### **✅ Đã hoàn thành:**
- ✅ **Backend Architecture** - FastAPI + Supabase
- ✅ **API Endpoints** - Analytics endpoints
- ✅ **Database Connection** - Supabase integration
- ✅ **Data Processing** - Service layer

### **🚀 Sẵn sàng cho:**
- ✅ **Frontend Integration** - Connect React với API
- ✅ **Real-time Features** - WebSocket setup
- ✅ **Production Deployment** - Scalable architecture
- ✅ **Advanced Analytics** - AI-powered insights

---

**🎉 BACKEND SETUP HOÀN THÀNH! SẴN SÀNG KẾT NỐI VỚI FRONTEND!** 