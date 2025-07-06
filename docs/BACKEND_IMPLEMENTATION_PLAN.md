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

---

## 🎯 **TÁC ĐỘNG CỦA VIỆC CHIA FRONTEND-BACKEND-DATABASE VỚI BACKEND IMPLEMENTATION**

### ✅ **1. PHÙ HỢP HOÀN TOÀN VỚI KIẾN TRÚC ĐÃ THIẾT KẾ**

**Backend Implementation Plan đã được thiết kế đặc biệt cho kiến trúc tách riêng:**

#### **API-First Design**
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analytics, goals, organizations, auth

app = FastAPI(
    title="Digital Performance API",
    description="Backend API cho Avenger Hub Dashboard",
    version="1.0.0"
)

# CORS cho frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://avengerhub.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(goals.router, prefix="/api/goals", tags=["goals"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["organizations"])
```

#### **Database Integration**
```python
# backend/app/database/connection.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Kết nối với Supabase PostgreSQL
DATABASE_URL = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### ✅ **2. LỢI ÍCH CỤ THỂ CHO BACKEND DEVELOPMENT**

#### **Independent Development**
```bash
# Backend team có thể dev độc lập
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Test API với Postman/curl
curl http://localhost:8000/api/analytics/dashboard/org-123
```

#### **API Documentation**
```python
# Tự động generate API docs
# Truy cập: http://localhost:8000/docs
# Hoặc: http://localhost:8000/redoc
```

#### **Database Management**
```python
# Alembic migrations
alembic revision --autogenerate -m "Add analytics tables"
alembic upgrade head

# Database seeding
python scripts/seed_data.py
```

### ✅ **3. INTEGRATION VỚI FRONTEND**

#### **CORS Configuration**
```python
# backend/app/core/config.py
class Settings(BaseSettings):
    # CORS settings cho frontend
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Development
        "https://avengerhub.com",  # Production
        "https://avengerhub.vercel.app"  # Vercel
    ]
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Digital Performance API"
    
    # Database settings
    DATABASE_URL: str = "postgresql://..."
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"
```

#### **Authentication Integration**
```python
# backend/app/api/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Verify JWT token từ Supabase"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id
```

### ✅ **4. DATA PIPELINE INTEGRATION**

#### **Real-time Data Sync**
```python
# backend/app/tasks/data_sync.py
@celery_app.task
def sync_google_analytics_data(org_id: str):
    """Sync Google Analytics data cho organization"""
    service = GoogleAnalyticsService()
    data = service.fetch_data(org_id)
    
    # Lưu vào hourly_aggregates
    for metric, value in data.items():
        hourly_aggregate = HourlyAggregate(
            organization_id=org_id,
            channel="google_analytics",
            metric=metric,
            value=value,
            timestamp=datetime.utcnow()
        )
        db.add(hourly_aggregate)
    db.commit()
```

#### **AI Insights Generation**
```python
# backend/app/tasks/ai_insights.py
@celery_app.task
def generate_ai_insights(org_id: str):
    """Generate AI insights từ dữ liệu"""
    # Lấy dữ liệu từ hourly_aggregates
    data = get_hourly_aggregates(org_id)
    
    # Phát hiện bất thường
    anomalies = detect_anomalies(data)
    
    # Tạo insights
    insights = generate_insights(data)
    
    # Lưu vào ai_insights table
    for insight in insights:
        ai_insight = AIInsight(
            organization_id=org_id,
            insight_type=insight["type"],
            title=insight["title"],
            description=insight["description"],
            severity=insight["severity"],
            confidence_score=insight["confidence"]
        )
        db.add(ai_insight)
    db.commit()
```

### ✅ **5. DEPLOYMENT STRATEGY**

#### **Development Environment**
```bash
# Local development
cd backend
uvicorn app.main:app --reload

# Database
supabase start

# Redis (cho Celery)
redis-server
```

#### **Staging Environment**
```bash
# Docker deployment
docker build -t backend:staging .
docker run -p 8000:8000 backend:staging

# Environment variables
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://..."
export OPENAI_API_KEY="..."
```

#### **Production Environment**
```bash
# Cloud deployment (DigitalOcean/AWS)
docker build -t backend:prod .
docker run -d -p 8000:8000 backend:prod

# Load balancer
# Health checks
# Monitoring
```

### ✅ **6. MONITORING & LOGGING**

#### **API Monitoring**
```python
# backend/app/core/monitoring.py
from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

async def log_request(request: Request, call_next):
    """Log tất cả API requests"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} "
        f"took {process_time:.3f}s "
        f"status_code={response.status_code}"
    )
    
    return response
```

#### **Performance Monitoring**
```python
# backend/app/core/performance.py
from prometheus_client import Counter, Histogram
import time

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

def monitor_performance(func):
    """Decorator để monitor performance"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        result = func(*args, **kwargs)
        
        duration = time.time() - start_time
        REQUEST_COUNT.inc()
        REQUEST_LATENCY.observe(duration)
        
        return result
    return wrapper
```

### ⚠️ **7. CÁC THÁCH THỨC CẦN LƯU Ý**

#### **API Contract Consistency**
```python
# backend/app/schemas/analytics.py
from pydantic import BaseModel
from typing import List, Optional

class KPIData(BaseModel):
    name: str
    value: float
    change: float
    trend: str

class ChartData(BaseModel):
    type: str
    data: dict
    options: dict

class DashboardData(BaseModel):
    kpis: List[KPIData]
    charts: List[ChartData]
    insights: List[dict]
    
    class Config:
        # Đảm bảo JSON serialization
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

#### **Error Handling**
```python
# backend/app/core/errors.py
from fastapi import HTTPException
from typing import Union

class APIError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

def handle_api_error(error: Union[APIError, Exception]):
    """Centralized error handling"""
    if isinstance(error, APIError):
        raise HTTPException(
            status_code=error.status_code,
            detail=error.message
        )
    else:
        # Log unexpected errors
        logger.error(f"Unexpected error: {str(error)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
```

#### **Data Validation**
```python
# backend/app/utils/validation.py
from pydantic import ValidationError
from typing import Any, Dict

def validate_dashboard_data(data: Dict[str, Any]) -> bool:
    """Validate dashboard data structure"""
    try:
        DashboardData(**data)
        return True
    except ValidationError as e:
        logger.error(f"Data validation error: {e}")
        return False
```

### 📈 **8. ROADMAP IMPLEMENTATION**

#### **Phase 1: Core API (Đang thực hiện)**
```python
# ✅ Basic FastAPI setup
# ✅ Database connection
# ✅ Authentication
# ✅ Basic CRUD operations
```

#### **Phase 2: Data Pipeline (Kế hoạch)**
```python
# ⏳ Celery tasks
# ⏳ Scheduled jobs
# ⏳ Data aggregation
# ⏳ AI insights generation
```

#### **Phase 3: Advanced Features (Kế hoạch)**
```python
# ⏳ Real-time updates
# ⏳ WebSocket support
# ⏳ Advanced analytics
# ⏳ Performance optimization
```

### 🎯 **9. KẾT LUẬN**

**Backend Implementation Plan HOÀN TOÀN PHÙ HỢP với việc chia frontend-backend-database:**

#### ✅ **Tích cực:**
1. **API-first design cho frontend integration**
2. **Database integration với Supabase**
3. **Scalable architecture**
4. **Comprehensive monitoring**
5. **Production-ready deployment**

#### ⚠️ **Cần lưu ý:**
1. **API contract consistency**
2. **Error handling**
3. **Data validation**
4. **Performance monitoring**

#### 🚀 **Bước tiếp theo:**
1. **Ưu tiên cao**: Hoàn thành Core API development
2. **Ưu tiên trung bình**: Implement Data Pipeline
3. **Ưu tiên thấp**: Advanced features và optimization

**Kết luận: Backend Implementation Plan là foundation vững chắc cho việc chia tách frontend-backend-database thành công.** 