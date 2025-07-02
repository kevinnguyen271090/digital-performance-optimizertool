"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Digital Performance Optimizer API")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Digital Performance Optimizer API")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade digital marketing analytics platform API",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for production
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "your-domain.com"]
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Digital Performance Optimizer API",
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/api/v1/")
async def api_root():
    """API root endpoint"""
    return {
        "message": "Digital Performance Optimizer API v1",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "analytics": "/api/v1/analytics",
            "goals": "/api/v1/goals",
            "organizations": "/api/v1/organizations"
        }
    }


# Import and include routers
# from app.api.v1 import analytics, goals, organizations, auth
# app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
# app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
# app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["organizations"])
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    ) 