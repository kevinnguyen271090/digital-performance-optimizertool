"""
Analytics schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DateRange(str, Enum):
    LAST_7_DAYS = "last_7_days"
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    CUSTOM = "custom"


class ChannelMetrics(BaseModel):
    channel: str
    platform: str
    metrics: Dict[str, Any]
    trend: Dict[str, float]
    performance: str  # "good", "warning", "critical"


class KPIData(BaseModel):
    name: str
    value: float
    target: Optional[float]
    unit: str
    trend: float
    status: str  # "on_track", "behind", "ahead"


class DashboardData(BaseModel):
    organization_id: str
    date_range: DateRange
    channels: List[ChannelMetrics]
    kpis: List[KPIData]
    summary: Dict[str, Any]
    last_updated: datetime


class ExecutiveData(BaseModel):
    organization_id: str
    overview: Dict[str, Any]
    channel_comparison: List[Dict[str, Any]]
    trends: List[Dict[str, Any]]
    insights: List[Dict[str, Any]]
    alerts: List[Dict[str, Any]]


class AIInsight(BaseModel):
    id: str
    insight_type: str
    title: str
    description: str
    severity: str
    confidence_score: float
    created_at: datetime


class PerformanceAlert(BaseModel):
    id: str
    alert_type: str
    channel: str
    metric: str
    current_value: float
    threshold_value: float
    message: str
    created_at: datetime 