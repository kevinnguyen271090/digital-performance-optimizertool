import React, { useState, useMemo } from 'react';
import { ExecutiveHeader } from './ExecutiveHeader';
import { ExecutiveKPITable } from './ExecutiveKPITable';
import ExecutiveFunnelSection from './ExecutiveFunnelSection';
import ExecutivePieSection from './ExecutivePieSection';
import ExecutiveTrendSection from './ExecutiveTrendSection';
import { ExecutiveDrilldownSection } from './ExecutiveDrilldownSection';
import { ExecutiveAlertSection } from './ExecutiveAlertSection';
import { useConnectedChannels } from '@/hooks/useConnectedChannels';
import { useExecutiveMockData } from '../../hooks/useExecutiveMockData';

interface ExecutiveDashboardProps {
  data?: any;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  data,
  dateRange,
  onDateRangeChange
}) => {
  // State cho filters
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(['revenue', 'cost', 'roas', 'cpa']);
  const [drilldownLevel, setDrilldownLevel] = useState<'channel' | 'campaign' | 'ad_group' | 'ad'>('channel');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  // Sử dụng hook để quản lý connectedChannels
  const { 
    connectedChannels, 
    filterData, 
    checkHasRealData 
  } = useConnectedChannels();

  // Available options
  const availableChannels = useMemo(() => [
    { value: 'facebook', label: 'Facebook Ads' },
    { value: 'google', label: 'Google Ads' },
    { value: 'tiktok', label: 'TikTok Ads' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'crm', label: 'CRM' }
  ], []);

  const availableKPIs = useMemo(() => [
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost', label: 'Cost' },
    { value: 'roas', label: 'ROAS' },
    { value: 'cpa', label: 'CPA' },
    { value: 'ctr', label: 'CTR' },
    { value: 'conversion_rate', label: 'Conversion Rate' },
    { value: 'cpc', label: 'CPC' },
    { value: 'cpm', label: 'CPM' },
    { value: 'engagement_rate', label: 'Engagement Rate' },
    { value: 'drop_off_rate', label: 'Drop-off Rate' }
  ], []);

  // Mock data cho demo - áp dụng logic filter connectedChannels
  const mockData = useExecutiveMockData(filterData, connectedChannels);

  // Kiểm tra có dữ liệu thật không
  const hasRealDataForChannels = useMemo(() => {
    return checkHasRealData(mockData.channels);
  }, [mockData.channels, checkHasRealData]);

  const handleChannelChange = (channel: string) => {
    if (channel === '') {
      setSelectedChannels([]);
    } else {
      setSelectedChannels([channel]);
    }
  };

  const handleCampaignChange = (campaign: string) => {
    if (campaign === 'all') {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns([campaign]);
    }
  };

  const handleKPIChange = (kpi: string) => {
    if (kpi === '') {
      setSelectedKPIs([]);
    } else {
      setSelectedKPIs([kpi]);
    }
  };

  const handleDrilldownLevelChange = (level: 'channel' | 'campaign' | 'ad_group' | 'ad') => {
    setDrilldownLevel(level);
  };

  const handleDrilldown = (level: 'channel' | 'campaign' | 'ad_group' | 'ad', id: string) => {
    setDrilldownLevel(level);
    if (level === 'channel') {
      setSelectedChannel(id);
      setSelectedCampaign('');
    } else if (level === 'campaign') {
      setSelectedCampaign(id);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export data with current filters');
  };

  const handlePeriodComparison = () => {
    // TODO: Implement period comparison
    console.log('Compare with previous period');
  };

  const handleClearFilters = () => {
    setSelectedChannels([]);
    setSelectedCampaigns([]);
    setSelectedKPIs(['revenue', 'cost', 'roas', 'cpa']);
    setSelectedChannel('');
    setSelectedCampaign('');
  };

  return (
    <div className="space-y-6">
      {/* Executive Header với Filters */}
      <ExecutiveHeader
        dateRange={dateRange}
        selectedChannels={selectedChannels}
        selectedCampaigns={selectedCampaigns}
        selectedKPIs={selectedKPIs}
        drilldownLevel={drilldownLevel}
        selectedChannel={selectedChannel}
        selectedCampaign={selectedCampaign}
        onDateRangeChange={onDateRangeChange}
        onChannelChange={handleChannelChange}
        onCampaignChange={handleCampaignChange}
        onKPIChange={handleKPIChange}
        onDrilldownLevelChange={handleDrilldownLevelChange}
        onExport={handleExport}
        onPeriodComparison={handlePeriodComparison}
        onClearFilters={handleClearFilters}
      />

      {/* KPI Table - So sánh & phân rã */}
      <ExecutiveKPITable 
        data={mockData.channels}
        selectedKPIs={selectedKPIs.length > 0 ? selectedKPIs : ['revenue', 'cost', 'roas', 'cpa']}
        onDrilldown={handleDrilldown}
        connectedChannels={connectedChannels}
      />

      {/* Funnel Section - Gom tất cả funnel chart */}
      <ExecutiveFunnelSection
        data={mockData.funnelData}
        selectedChannels={selectedChannels}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
        onConnect={() => { window.location.href = '/settings'; }}
      />

      {/* Pie Section - Gom pie chart */}
      <ExecutivePieSection
        data={mockData.channels}
        selectedChannels={selectedChannels}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
        onConnect={() => { window.location.href = '/settings'; }}
      />

      {/* Trend Section - Gom trend chart */}
      <ExecutiveTrendSection
        data={mockData.channels}
        selectedKPIs={selectedKPIs.length > 0 ? selectedKPIs : ['revenue']}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
      />

      {/* Drill-down Section - Phân rã sâu */}
      {(selectedChannel || selectedCampaign) && (
        <ExecutiveDrilldownSection 
          selectedChannel={selectedChannel}
          selectedCampaign={selectedCampaign}
          drilldownLevel={drilldownLevel}
          data={mockData.campaigns}
        />
      )}

      {/* Alert Section - Cảnh báo & đề xuất */}
      <ExecutiveAlertSection 
        alerts={mockData.alerts}
        selectedChannel={selectedChannel}
      />
    </div>
  );
}; 