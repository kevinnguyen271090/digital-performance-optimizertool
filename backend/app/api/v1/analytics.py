"""
Analytics API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import structlog

from app.core.config import settings
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    DashboardData,
    ChannelMetrics,
    KPIData,
    DateRange
)

logger = structlog.get_logger()
router = APIRouter()


@router.get("/dashboard/{organization_id}", response_model=DashboardData)
async def get_dashboard_data(
    organization_id: str,
    date_range: DateRange = Query(default=DateRange.LAST_7_DAYS),
    channels: Optional[List[str]] = Query(default=None)
):
    """
    Get dashboard data for organization
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_dashboard_data(
            organization_id=organization_id,
            date_range=date_range,
            channels=channels
        )
        return data
    except Exception as e:
        logger.error("Error getting dashboard data", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/channels/{organization_id}", response_model=List[ChannelMetrics])
async def get_channel_metrics(
    organization_id: str,
    date_range: DateRange = Query(default=DateRange.LAST_7_DAYS)
):
    """
    Get channel metrics for organization
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_channel_metrics(
            organization_id=organization_id,
            date_range=date_range
        )
        return data
    except Exception as e:
        logger.error("Error getting channel metrics", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/kpis/{organization_id}", response_model=List[KPIData])
async def get_kpi_data(
    organization_id: str,
    date_range: DateRange = Query(default=DateRange.LAST_7_DAYS)
):
    """
    Get KPI data for organization
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_kpi_data(
            organization_id=organization_id,
            date_range=date_range
        )
        return data
    except Exception as e:
        logger.error("Error getting KPI data", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/executive/{organization_id}")
async def get_executive_data(
    organization_id: str,
    date_range: DateRange = Query(default=DateRange.LAST_30_DAYS)
):
    """
    Get executive dashboard data
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_executive_data(
            organization_id=organization_id,
            date_range=date_range
        )
        return data
    except Exception as e:
        logger.error("Error getting executive data", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/insights/{organization_id}")
async def get_ai_insights(
    organization_id: str,
    limit: int = Query(default=10, le=50)
):
    """
    Get AI insights for organization
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_ai_insights(
            organization_id=organization_id,
            limit=limit
        )
        return data
    except Exception as e:
        logger.error("Error getting AI insights", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/alerts/{organization_id}")
async def get_performance_alerts(
    organization_id: str,
    limit: int = Query(default=10, le=50)
):
    """
    Get performance alerts for organization
    """
    try:
        analytics_service = AnalyticsService()
        data = await analytics_service.get_performance_alerts(
            organization_id=organization_id,
            limit=limit
        )
        return data
    except Exception as e:
        logger.error("Error getting performance alerts", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error") 