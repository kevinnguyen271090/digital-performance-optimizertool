# BACKEND IMPLEMENTATION PLAN

## 🎯 Mục tiêu
Xây dựng backend hoàn chỉnh theo kiến trúc hệ thống đã đề xuất: Python FastAPI + Cron Jobs + Data Pipeline + AI Insights.

## 📋 Kế hoạch triển khai

### **Phase 1: Core Backend API (Ưu tiên cao)**

#### 1.1 Python FastAPI Backend
```bash
# Tạo thư mục backend
mkdir backend
cd backend

# Cài đặt dependencies
pip install fastapi uvicorn python-dotenv sqlalchemy psycopg2-binary
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
pip install facebook-business python-dateutil pandas numpy
pip install celery redis python-jose[cryptography] passlib[bcrypt]
```

#### 1.2 Cấu trúc Backend (Đã cập nhật 2025)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entrypoint
│   ├── core/                   # Core config, security, celery
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── database/               # DB connection, session, migrations
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── organization.py
│   │   ├── analytics.py
│   │   └── goals.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── analytics.py
│   │   └── goals.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── analytics.py
│   │   ├── goals.py
│   │   └── organizations.py
│   ├── services/               # Business logic/service layer
│   │   ├── __init__.py
│   │   ├── google_analytics.py
│   │   ├── meta_ads.py
│   │   ├── woocommerce.py
│   │   └── ai_insights.py
│   ├── tasks/                  # Celery tasks, scheduled jobs
│   └── utils/                  # Helper functions, utilities
├── requirements.txt
├── pyproject.toml
└── env.example
```

#### 1.3 API Endpoints cần xây dựng
```python
# Analytics API
GET /api/analytics/dashboard/{org_id}
GET /api/analytics/channel/{channel_id}
POST /api/analytics/aggregate
GET /api/analytics/insights/{org_id}

# Goals API
GET /api/goals/{org_id}
POST /api/goals
PUT /api/goals/{goal_id}
DELETE /api/goals/{goal_id}

# Organizations API
GET /api/organizations
POST /api/organizations
PUT /api/organizations/{org_id}

# Data Sync API
POST /api/sync/google-analytics
POST /api/sync/meta-ads
POST /api/sync/woocommerce
```

### **Phase 2: Data Pipeline & Cron Jobs (Ưu tiên cao)**

#### 2.1 Celery Configuration
```python
# backend/app/core/celery.py
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "digital_performance_optimizer",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.google_analytics",
        "app.tasks.meta_ads", 
        "app.tasks.woocommerce",
        "app.tasks.ai_insights"
    ]
)
```

#### 2.2 Scheduled Tasks
```python
# backend/app/tasks/google_analytics.py
from app.core.celery import celery_app
from app.services.google_analytics import GoogleAnalyticsService

@celery_app.task
def fetch_google_analytics_data():
    """Fetch Google Analytics data every 15 minutes"""
    service = GoogleAnalyticsService()
    return service.fetch_and_store_data()

@celery_app.task
def aggregate_hourly_data():
    """Aggregate hourly data every hour"""
    # Logic tổng hợp dữ liệu theo giờ

@celery_app.task  
def aggregate_daily_data():
    """Aggregate daily data at midnight"""
    # Logic tổng hợp dữ liệu theo ngày
```

#### 2.3 Cron Schedule
```python
# backend/app/core/celery.py
celery_app.conf.beat_schedule = {
    'fetch-google-analytics': {
        'task': 'app.tasks.google_analytics.fetch_google_analytics_data',
        'schedule': 900.0,  # 15 minutes
    },
    'fetch-meta-ads': {
        'task': 'app.tasks.meta_ads.fetch_meta_ads_data', 
        'schedule': 900.0,  # 15 minutes
    },
    'aggregate-hourly': {
        'task': 'app.tasks.analytics.aggregate_hourly_data',
        'schedule': 3600.0,  # 1 hour
    },
    'aggregate-daily': {
        'task': 'app.tasks.analytics.aggregate_daily_data',
        'schedule': crontab(hour=0, minute=0),  # Midnight
    },
    'generate-ai-insights': {
        'task': 'app.tasks.ai_insights.generate_insights',
        'schedule': 3600.0,  # 1 hour
    },
}
```

### **Phase 3: AI Insights Engine (Ưu tiên trung bình)**

#### 3.1 AI Insights Service
```python
# backend/app/services/ai_insights.py
import pandas as pd
import numpy as np
from typing import Dict, List
import openai

class AIInsightsService:
    def __init__(self):
        self.openai_client = openai.OpenAI()
    
    def detect_anomalies(self, data: pd.DataFrame) -> List[Dict]:
        """Phát hiện bất thường trong dữ liệu"""
        # Logic phát hiện bất thường
        
    def generate_recommendations(self, data: pd.DataFrame) -> List[Dict]:
        """Tạo gợi ý tối ưu marketing"""
        # Logic tạo gợi ý
        
    def predict_trends(self, data: pd.DataFrame) -> Dict:
        """Dự báo xu hướng"""
        # Logic dự báo
```

#### 3.2 Data Analysis Functions
```python
# backend/app/utils/analytics.py
def calculate_roas(revenue: float, cost: float) -> float:
    """Tính ROAS"""
    return revenue / cost if cost > 0 else 0

def calculate_cpa(cost: float, conversions: int) -> float:
    """Tính CPA"""
    return cost / conversions if conversions > 0 else 0

def detect_performance_changes(current: float, previous: float, threshold: float = 0.1) -> bool:
    """Phát hiện thay đổi hiệu suất"""
    return abs(current - previous) / previous > threshold
```

### **Phase 4: Data Storage & Aggregation (Ưu tiên cao)**

#### 4.1 Database Models
```python
# backend/app/models/analytics.py
from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class HourlyAggregate(Base):
    __tablename__ = "hourly_aggregates"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    channel = Column(String)
    metric = Column(String)
    value = Column(Float)
    timestamp = Column(DateTime)
    metadata = Column(JSON)

class DailyAggregate(Base):
    __tablename__ = "daily_aggregates"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    channel = Column(String)
    metric = Column(String)
    value = Column(Float)
    date = Column(DateTime)
    metadata = Column(JSON)

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    insight_type = Column(String)  # anomaly, recommendation, trend
    title = Column(String)
    description = Column(String)
    severity = Column(String)  # low, medium, high
    created_at = Column(DateTime)
    metadata = Column(JSON)
```

#### 4.2 Data Aggregation Logic
```python
# backend/app/services/analytics.py
class AnalyticsService:
    def aggregate_hourly_data(self, org_id: str):
        """Tổng hợp dữ liệu theo giờ"""
        # Logic tổng hợp từ raw data sang hourly aggregates
        
    def aggregate_daily_data(self, org_id: str):
        """Tổng hợp dữ liệu theo ngày"""
        # Logic tổng hợp từ hourly sang daily aggregates
        
    def cleanup_old_data(self):
        """Dọn dẹp dữ liệu cũ"""
        # Xóa hourly aggregates > 1 ngày
        # Backup daily aggregates > 365 ngày
```

### **Phase 5: Deployment & Infrastructure (Ưu tiên trung bình)**

#### 5.1 Docker Configuration
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 5.2 Docker Compose
```yaml
# backend/docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
      
  celery:
    build: .
    command: celery -A app.core.celery worker --loglevel=info
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
      
  celery-beat:
    build: .
    command: celery -A app.core.celery beat --loglevel=info
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 🚀 Triển khai theo thứ tự ưu tiên

### **Tuần 1-2: Core Backend API**
1. Setup Python FastAPI project
2. Tạo database models và schemas
3. Implement authentication và authorization
4. Tạo basic API endpoints

### **Tuần 3-4: Data Pipeline**
1. Setup Celery và Redis
2. Implement Google Analytics service
3. Implement Meta Ads service
4. Tạo scheduled tasks

### **Tuần 5-6: Data Aggregation**
1. Implement hourly/daily aggregation
2. Setup data cleanup processes
3. Test data pipeline end-to-end

### **Tuần 7-8: AI Insights**
1. Implement anomaly detection
2. Implement recommendation engine
3. Test AI insights generation

### **Tuần 9-10: Deployment**
1. Setup Docker containers
2. Deploy to cloud (DigitalOcean/AWS)
3. Monitor và optimize performance

## 💰 Chi phí ước tính

### **Development Phase (2-3 tháng)**
- Backend Server: $20-50/tháng (DigitalOcean/AWS)
- Redis: $10-20/tháng
- Monitoring: $10-20/tháng
- **Tổng: $40-90/tháng**

### **Production Phase (1000+ users)**
- Backend Server: $50-100/tháng
- Redis: $20-40/tháng
- Database: $25-50/tháng (Supabase Pro)
- Monitoring: $20-40/tháng
- **Tổng: $115-230/tháng**

## 🎯 Kết quả mong đợi

### **Sau khi hoàn thành Backend:**
- ✅ Data pipeline tự động fetch dữ liệu marketing
- ✅ AI insights tự động phát hiện bất thường và gợi ý tối ưu
- ✅ Performance dashboard real-time với dữ liệu thực
- ✅ Scalable architecture cho 1000+ doanh nghiệp
- ✅ Chi phí vận hành <$200/tháng

### **Metrics cải thiện:**
- Data freshness: Từ manual → Real-time (15 phút)
- Insights quality: Từ static → AI-powered
- User experience: Từ demo → Production-ready
- Scalability: Từ single-user → Multi-tenant enterprise 