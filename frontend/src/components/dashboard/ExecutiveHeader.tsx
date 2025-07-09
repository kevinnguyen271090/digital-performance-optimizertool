import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3, 
  Download,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

interface ExecutiveHeaderProps {
  dateRange?: { from: Date; to: Date };
  selectedChannels: string[];
  selectedCampaigns: string[];
  selectedKPIs: string[];
  drilldownLevel: 'channel' | 'campaign' | 'ad_group' | 'ad';
  selectedChannel: string;
  selectedCampaign: string;
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
  onChannelChange: (channel: string) => void;
  onCampaignChange: (campaign: string) => void;
  onKPIChange: (kpi: string) => void;
  onDrilldownLevelChange: (level: 'channel' | 'campaign' | 'ad_group' | 'ad') => void;
  onExport: () => void;
  onPeriodComparison: () => void;
  onClearFilters: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  dateRange,
  selectedChannels,
  selectedCampaigns,
  selectedKPIs,
  drilldownLevel,
  selectedChannel,
  selectedCampaign,
  onDateRangeChange,
  onChannelChange,
  onCampaignChange,
  onKPIChange,
  onDrilldownLevelChange,
  onExport,
  onPeriodComparison,
  onClearFilters
}) => {
  // Available options
  const availableChannels = [
    { value: 'facebook', label: 'Facebook Ads' },
    { value: 'google', label: 'Google Ads' },
    { value: 'tiktok', label: 'TikTok Ads' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'crm', label: 'CRM' }
  ];

  const availableCampaigns = [
    { value: 'all', label: 'Tất cả campaigns' },
    { value: 'fb_c1', label: 'Facebook - C1' },
    { value: 'fb_c2', label: 'Facebook - C2' },
    { value: 'gg_c1', label: 'Google - C1' },
    { value: 'gg_c2', label: 'Google - C2' },
    { value: 'tt_c1', label: 'TikTok - C1' },
    { value: 'tt_c2', label: 'TikTok - C2' }
  ];

  const availableKPIs = [
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
  ];

  const drilldownLevels = [
    { value: 'channel', label: 'Kênh' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'ad_group', label: 'Ad Group' },
    { value: 'ad', label: 'Ad' }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 text-lg md:text-xl">
            <BarChart3 className="h-5 w-5" />
            <span className="font-semibold">Executive Dashboard</span>
            <Badge variant="secondary" className="ml-2 text-xs px-2 py-0.5 h-6">So sánh & Drill-down</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onPeriodComparison}
              className="flex items-center gap-2 text-xs px-3 py-1 h-7"
            >
              <TrendingUp className="h-4 w-4" />
              So sánh kỳ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2 text-xs px-3 py-1 h-7"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {/* Filter Row 1 */}
        <div className="flex flex-wrap gap-3 md:gap-4 items-end">
          <div className="space-y-1 min-w-[160px]">
            <label className="dashboard-filter-label text-xs font-medium flex items-center gap-1 mb-1">
              <Calendar className="h-4 w-4" />
              Thời gian
            </label>
            <DateRangePicker
              onDateRangeChange={(startDate, endDate) => onDateRangeChange?.({ from: startDate, to: endDate })}
            />
          </div>
          <div className="space-y-1 min-w-[140px]">
            <label className="dashboard-filter-label text-xs font-medium flex items-center gap-1 mb-1">
              <Filter className="h-4 w-4" />
              Kênh
            </label>
            <Select 
              value={selectedChannels[0] || 'all'} 
              onValueChange={onChannelChange}
            >
              <SelectTrigger className="dashboard-filter-input h-8 text-xs">
                <SelectValue placeholder="Chọn kênh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kênh</SelectItem>
                {availableChannels.map(channel => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 min-w-[140px]">
            <label className="dashboard-filter-label text-xs font-medium flex items-center gap-1 mb-1">
              <Target className="h-4 w-4" />
              Campaign
            </label>
            <Select 
              value={selectedCampaigns[0] || 'all'} 
              onValueChange={onCampaignChange}
            >
              <SelectTrigger className="dashboard-filter-input h-8 text-xs">
                <SelectValue placeholder="Chọn campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả campaigns</SelectItem>
                {availableCampaigns.filter(c => c.value !== 'all').map(campaign => (
                  <SelectItem key={campaign.value} value={campaign.value}>
                    {campaign.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 min-w-[120px]">
            <label className="dashboard-filter-label text-xs font-medium flex items-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4" />
              KPI
            </label>
            <Select 
              value={selectedKPIs[0] || 'revenue'} 
              onValueChange={onKPIChange}
            >
              <SelectTrigger className="dashboard-filter-input h-8 text-xs">
                <SelectValue placeholder="Chọn KPI" />
              </SelectTrigger>
              <SelectContent>
                {availableKPIs.map(kpi => (
                  <SelectItem key={kpi.value} value={kpi.value}>
                    {kpi.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 min-w-[120px]">
            <label className="dashboard-filter-label text-xs font-medium flex items-center gap-1 mb-1">
              Drill-down:
            </label>
            <Select 
              value={drilldownLevel} 
              onValueChange={onDrilldownLevelChange}
            >
              <SelectTrigger className="dashboard-filter-input h-8 text-xs">
                <SelectValue placeholder="Chọn drill-down" />
              </SelectTrigger>
              <SelectContent>
                {drilldownLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="dashboard-filter-label text-xs font-medium mb-1 opacity-0">Ẩn</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs px-2 py-1 h-8 text-gray-400 hover:text-red-500"
            >
              Xóa filter
            </Button>
          </div>
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="dashboard-filter-label text-xs font-medium mb-1 opacity-0">Ẩn</label>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 h-7">KPI: {selectedKPIs.length} đã chọn</Badge>
          </div>
        </div>
      </CardContent>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₫110,000,000</div>
            <div className="text-sm text-gray-500">Tổng Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">₫43,000,000</div>
            <div className="text-sm text-gray-500">Tổng Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.56x</div>
            <div className="text-sm text-gray-500">ROAS TB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₫39,091</div>
            <div className="text-sm text-gray-500">CPA TB</div>
          </div>
        </div>
    </Card>
  );
}; 