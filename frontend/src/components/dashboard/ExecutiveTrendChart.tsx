import React, { useState, useMemo } from 'react';
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
  TrendingUp, 
  BarChart3, 
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  id: string;
  name: string;
  revenue?: number;
  cost?: number;
  roas?: number;
  cpa?: number;
  ctr?: number;
  conversion_rate?: number;
}

interface ExecutiveTrendChartProps {
  data: TrendData[];
  selectedKPIs: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
}

export const ExecutiveTrendChart: React.FC<ExecutiveTrendChartProps> = ({
  data,
  selectedKPIs,
  dateRange,
  connectedChannels = ['facebook', 'google', 'tiktok', 'email']
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedKPI, setSelectedKPI] = useState<string>(selectedKPIs[0] || 'revenue');

  // Lọc data chỉ lấy các kênh đã kết nối, kênh chưa kết nối giá trị = 0
  const filteredChannels = useMemo(() => {
    return data.map(item =>
      connectedChannels.includes(item.id)
        ? item
        : { ...item, revenue: 0, cost: 0, roas: 0, cpa: 0, ctr: 0, conversion_rate: 0 }
    );
  }, [data, connectedChannels]);

  // Mock trend data cho demo (7 ngày)
  const trendData = useMemo(() => {
    const days = 7;
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dayData: any = {
        date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      };
      filteredChannels.forEach(channel => {
        const baseValue = channel[selectedKPI as keyof TrendData] as number || 0;
        const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
        const dailyValue = baseValue * (1 + variation) / days;
        dayData[channel.id] = Math.round(dailyValue);
      });
      result.push(dayData);
    }
    return result;
  }, [filteredChannels, selectedKPI]);

  // KPI labels và colors
  const kpiConfig = useMemo(() => ({
    revenue: { label: 'Revenue', color: '#10b981', format: 'currency', prefix: '₫', suffix: '' },
    cost: { label: 'Cost', color: '#ef4444', format: 'currency', prefix: '₫', suffix: '' },
    roas: { label: 'ROAS', color: '#3b82f6', format: 'decimal', prefix: '', suffix: 'x' },
    cpa: { label: 'CPA', color: '#f59e0b', format: 'currency', prefix: '₫', suffix: '' },
    ctr: { label: 'CTR', color: '#8b5cf6', format: 'percentage', prefix: '', suffix: '%' },
    conversion_rate: { label: 'Conversion Rate', color: '#06b6d4', format: 'percentage', prefix: '', suffix: '%' }
  }), []);

  // Format tooltip value
  const formatTooltipValue = (value: number) => {
    const config = kpiConfig[selectedKPI as keyof typeof kpiConfig];
    if (!config) return value.toString();
    switch (config.format) {
      case 'currency':
        return `${config.prefix}${value.toLocaleString('vi-VN')}`;
      case 'percentage':
        return `${value.toFixed(1)}${config.suffix}`;
      case 'decimal':
        return `${value.toFixed(2)}${config.suffix}`;
      default:
        return value.toString();
    }
  };

  // Chart colors
  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trend Comparison
            <Badge variant="secondary">
              {selectedKPI ? kpiConfig[selectedKPI as keyof typeof kpiConfig]?.label : 'Revenue'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedKPI} onValueChange={setSelectedKPI}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedKPIs.map(kpi => (
                  <SelectItem key={kpi} value={kpi}>
                    {kpiConfig[kpi as keyof typeof kpiConfig]?.label || kpi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            >
              {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                {filteredChannels.map((channel, idx) => (
                  <Line
                    key={channel.id}
                    type="monotone"
                    dataKey={channel.id}
                    name={channel.name}
                    stroke={chartColors[idx % chartColors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            ) : (
              <ReBarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                {filteredChannels.map((channel, idx) => (
                  <Bar
                    key={channel.id}
                    dataKey={channel.id}
                    name={channel.name}
                    fill={chartColors[idx % chartColors.length]}
                  />
                ))}
              </ReBarChart>
            )}
          </ResponsiveContainer>
        </div>
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {filteredChannels.map((channel, index) => {
            const totalValue = trendData.reduce((sum, day) => sum + (day[channel.id] || 0), 0);
            const avgValue = totalValue / trendData.length;
            const config = kpiConfig[selectedKPI as keyof typeof kpiConfig];
            return (
              <div key={channel.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="font-medium text-xs">{channel.name}</span>
                </div>
                <div className="text-lg font-bold">
                  {formatTooltipValue(totalValue)}
                </div>
                <div className="text-xs text-gray-500">
                  TB: {formatTooltipValue(Math.round(avgValue))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 