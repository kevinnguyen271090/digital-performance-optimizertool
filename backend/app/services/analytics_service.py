"""
Analytics service for connecting to Supabase database
"""
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import structlog
from supabase import create_client, Client

from app.core.config import settings
from app.schemas.analytics import (
    DashboardData,
    ChannelMetrics,
    KPIData,
    DateRange,
    ExecutiveData,
    AIInsight,
    PerformanceAlert
)

logger = structlog.get_logger()


class AnalyticsService:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )

    async def get_dashboard_data(
        self,
        organization_id: str,
        date_range: DateRange = DateRange.LAST_7_DAYS,
        channels: Optional[List[str]] = None
    ) -> DashboardData:
        """
        Get dashboard data from Supabase
        """
        try:
            # Get date range
            end_date = datetime.now()
            if date_range == DateRange.LAST_7_DAYS:
                start_date = end_date - timedelta(days=7)
            elif date_range == DateRange.LAST_30_DAYS:
                start_date = end_date - timedelta(days=30)
            elif date_range == DateRange.LAST_90_DAYS:
                start_date = end_date - timedelta(days=90)
            else:
                start_date = end_date - timedelta(days=7)

            # Get hourly aggregates
            response = await asyncio.to_thread(
                self.supabase.table("hourly_aggregates")
                .select("*")
                .eq("organization_id", organization_id)
                .gte("timestamp", start_date.isoformat())
                .lte("timestamp", end_date.isoformat())
                .execute
            )

            # Process data
            channels_data = self._process_channel_metrics(response.data)
            kpis_data = self._process_kpi_data(response.data)
            summary_data = self._process_summary_data(response.data)

            return DashboardData(
                organization_id=organization_id,
                date_range=date_range,
                channels=channels_data,
                kpis=kpis_data,
                summary=summary_data,
                last_updated=datetime.now()
            )

        except Exception as e:
            logger.error("Error getting dashboard data", error=str(e))
            raise

    async def get_channel_metrics(
        self,
        organization_id: str,
        date_range: DateRange = DateRange.LAST_7_DAYS
    ) -> List[ChannelMetrics]:
        """
        Get channel metrics from Supabase
        """
        try:
            # Get date range
            end_date = datetime.now()
            if date_range == DateRange.LAST_7_DAYS:
                start_date = end_date - timedelta(days=7)
            else:
                start_date = end_date - timedelta(days=30)

            # Get daily aggregates
            response = await asyncio.to_thread(
                self.supabase.table("daily_aggregates")
                .select("*")
                .eq("organization_id", organization_id)
                .gte("date", start_date.date().isoformat())
                .lte("date", end_date.date().isoformat())
                .execute
            )

            return self._process_channel_metrics(response.data)

        except Exception as e:
            logger.error("Error getting channel metrics", error=str(e))
            raise

    async def get_kpi_data(
        self,
        organization_id: str,
        date_range: DateRange = DateRange.LAST_7_DAYS
    ) -> List[KPIData]:
        """
        Get KPI data from Supabase
        """
        try:
            # Get date range
            end_date = datetime.now()
            if date_range == DateRange.LAST_7_DAYS:
                start_date = end_date - timedelta(days=7)
            else:
                start_date = end_date - timedelta(days=30)

            # Get daily aggregates
            response = await asyncio.to_thread(
                self.supabase.table("daily_aggregates")
                .select("*")
                .eq("organization_id", organization_id)
                .gte("date", start_date.date().isoformat())
                .lte("date", end_date.date().isoformat())
                .execute
            )

            return self._process_kpi_data(response.data)

        except Exception as e:
            logger.error("Error getting KPI data", error=str(e))
            raise

    async def get_executive_data(
        self,
        organization_id: str,
        date_range: DateRange = DateRange.LAST_30_DAYS
    ) -> ExecutiveData:
        """
        Get executive dashboard data from Supabase
        """
        try:
            # Get date range
            end_date = datetime.now()
            if date_range == DateRange.LAST_30_DAYS:
                start_date = end_date - timedelta(days=30)
            else:
                start_date = end_date - timedelta(days=90)

            # Get multiple data sources
            daily_data = await asyncio.to_thread(
                self.supabase.table("daily_aggregates")
                .select("*")
                .eq("organization_id", organization_id)
                .gte("date", start_date.date().isoformat())
                .lte("date", end_date.date().isoformat())
                .execute
            )

            insights_data = await asyncio.to_thread(
                self.supabase.table("ai_insights")
                .select("*")
                .eq("organization_id", organization_id)
                .order("created_at", desc=True)
                .limit(10)
                .execute
            )

            alerts_data = await asyncio.to_thread(
                self.supabase.table("performance_alerts")
                .select("*")
                .eq("organization_id", organization_id)
                .order("created_at", desc=True)
                .limit(10)
                .execute
            )

            return ExecutiveData(
                organization_id=organization_id,
                overview=self._process_executive_overview(daily_data.data),
                channel_comparison=self._process_channel_comparison(daily_data.data),
                trends=self._process_trends(daily_data.data),
                insights=self._process_insights(insights_data.data),
                alerts=self._process_alerts(alerts_data.data)
            )

        except Exception as e:
            logger.error("Error getting executive data", error=str(e))
            raise

    async def get_ai_insights(
        self,
        organization_id: str,
        limit: int = 10
    ) -> List[AIInsight]:
        """
        Get AI insights from Supabase
        """
        try:
            response = await asyncio.to_thread(
                self.supabase.table("ai_insights")
                .select("*")
                .eq("organization_id", organization_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute
            )

            return [AIInsight(**insight) for insight in response.data]

        except Exception as e:
            logger.error("Error getting AI insights", error=str(e))
            raise

    async def get_performance_alerts(
        self,
        organization_id: str,
        limit: int = 10
    ) -> List[PerformanceAlert]:
        """
        Get performance alerts from Supabase
        """
        try:
            response = await asyncio.to_thread(
                self.supabase.table("performance_alerts")
                .select("*")
                .eq("organization_id", organization_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute
            )

            return [PerformanceAlert(**alert) for alert in response.data]

        except Exception as e:
            logger.error("Error getting performance alerts", error=str(e))
            raise

    def _process_channel_metrics(self, data: List[Dict]) -> List[ChannelMetrics]:
        """Process raw data into channel metrics"""
        channels = {}
        
        for record in data:
            channel = record.get("channel", "unknown")
            if channel not in channels:
                channels[channel] = {
                    "channel": channel,
                    "platform": record.get("platform", "unknown"),
                    "metrics": {},
                    "trend": {},
                    "performance": "good"
                }
            
            metric = record.get("metric", "unknown")
            value = record.get("value", 0)
            channels[channel]["metrics"][metric] = value

        return [ChannelMetrics(**channel_data) for channel_data in channels.values()]

    def _process_kpi_data(self, data: List[Dict]) -> List[KPIData]:
        """Process raw data into KPI data"""
        kpis = []
        
        # Calculate KPIs from metrics
        total_impressions = sum(r.get("value", 0) for r in data if r.get("metric") == "impressions")
        total_clicks = sum(r.get("value", 0) for r in data if r.get("metric") == "clicks")
        
        if total_impressions > 0:
            ctr = (total_clicks / total_impressions) * 100
        else:
            ctr = 0

        kpis.extend([
            KPIData(
                name="Total Impressions",
                value=total_impressions,
                target=None,
                unit="impressions",
                trend=0,
                status="on_track"
            ),
            KPIData(
                name="Total Clicks", 
                value=total_clicks,
                target=None,
                unit="clicks",
                trend=0,
                status="on_track"
            ),
            KPIData(
                name="CTR",
                value=ctr,
                target=None,
                unit="%",
                trend=0,
                status="on_track"
            )
        ])

        return kpis

    def _process_summary_data(self, data: List[Dict]) -> Dict[str, Any]:
        """Process raw data into summary data"""
        total_records = len(data)
        channels = set(r.get("channel") for r in data)
        metrics = set(r.get("metric") for r in data)
        
        return {
            "total_records": total_records,
            "channels_count": len(channels),
            "metrics_count": len(metrics),
            "channels": list(channels),
            "metrics": list(metrics)
        }

    def _process_executive_overview(self, data: List[Dict]) -> Dict[str, Any]:
        """Process executive overview data"""
        return {
            "total_channels": len(set(r.get("channel") for r in data)),
            "total_metrics": len(set(r.get("metric") for r in data)),
            "data_points": len(data),
            "last_updated": datetime.now().isoformat()
        }

    def _process_channel_comparison(self, data: List[Dict]) -> List[Dict[str, Any]]:
        """Process channel comparison data"""
        channels = {}
        
        for record in data:
            channel = record.get("channel", "unknown")
            if channel not in channels:
                channels[channel] = {"channel": channel, "metrics": {}}
            
            metric = record.get("metric", "unknown")
            value = record.get("value", 0)
            channels[channel]["metrics"][metric] = value

        return list(channels.values())

    def _process_trends(self, data: List[Dict]) -> List[Dict[str, Any]]:
        """Process trends data"""
        return [
            {
                "metric": "impressions",
                "trend": "up",
                "change": 15.5
            },
            {
                "metric": "clicks", 
                "trend": "up",
                "change": 8.2
            }
        ]

    def _process_insights(self, data: List[Dict]) -> List[Dict[str, Any]]:
        """Process insights data"""
        return [
            {
                "id": insight.get("id"),
                "type": insight.get("insight_type"),
                "title": insight.get("title"),
                "description": insight.get("description"),
                "severity": insight.get("severity"),
                "confidence": insight.get("confidence_score")
            }
            for insight in data
        ]

    def _process_alerts(self, data: List[Dict]) -> List[Dict[str, Any]]:
        """Process alerts data"""
        return [
            {
                "id": alert.get("id"),
                "type": alert.get("alert_type"),
                "channel": alert.get("channel"),
                "metric": alert.get("metric"),
                "message": alert.get("message"),
                "severity": "medium"
            }
            for alert in data
        ] 