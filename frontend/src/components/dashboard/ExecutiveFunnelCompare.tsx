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
  TrendingDown,
  Download,
  BarChart3,
  Users,
  Target,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { ChartEmptyState } from '@/components/ui/empty-state';
import { PlatformLegend } from '@/components/ui/platform-legend';

interface FunnelData {
  id: string;
  name: string;
  platform: number;
  lead: number;
  qualified_lead: number;
  order: number;
  revenue: number;
  conversion_rates: {
    platform_to_lead: number;
    lead_to_qualified: number;
    qualified_to_order: number;
    order_to_revenue: number;
  };
}

interface ExecutiveFunnelCompareProps {
  data: FunnelData[];
  selectedChannels?: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
  onConnect?: () => void;
}

const funnelSteps = [
  { key: 'platform', label: 'Platform' },
  { key: 'lead', label: 'Lead' },
  { key: 'qualified_lead', label: 'Qualified Lead' },
  { key: 'order', label: 'Order' },
  { key: 'revenue', label: 'Revenue' }
];
const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ExecutiveFunnelCompare: React.FC<ExecutiveFunnelCompareProps> = ({
  data,
  selectedChannels = [],
  dateRange,
  connectedChannels = ['facebook', 'google', 'tiktok', 'email'],
  onConnect
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'conversion_rate'>('volume');
  const [displayMode, setDisplayMode] = useState<'absolute' | 'percent'>('absolute');

  // Lọc data chỉ lấy các kênh đã kết nối, kênh chưa kết nối giá trị = 0
  const filteredData = useMemo(() => {
    return data.map(item =>
      connectedChannels.includes(item.id)
        ? item
        : { ...item, platform: 0, lead: 0, qualified_lead: 0, order: 0, revenue: 0 }
    ).filter(item => selectedChannels.length === 0 || selectedChannels.includes(item.id));
  }, [data, connectedChannels, selectedChannels]);

  // Kiểm tra xem có dữ liệu thật không
  const hasRealData = useMemo(() => {
    return filteredData.some(item => 
      connectedChannels.includes(item.id) && 
      (item.platform > 0 || item.lead > 0 || item.qualified_lead > 0 || item.order > 0 || item.revenue > 0)
    );
  }, [filteredData, connectedChannels]);

  // Tạo danh sách platforms cho legend
  const platforms = useMemo(() => {
    const allPlatforms = ['facebook', 'google', 'tiktok', 'email'];
    return allPlatforms.map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      isConnected: connectedChannels.includes(id)
    }));
  }, [connectedChannels]);

  // Chuẩn hóa data cho BarChart: mỗi phần tử là một kênh, mỗi trường là một step
  const chartData = useMemo(() => {
    if (displayMode === 'absolute') {
      return filteredData.map(channel => {
        const obj: any = { name: channel.name };
        funnelSteps.forEach(step => {
          obj[step.key] = channel[step.key as keyof FunnelData];
        });
        return obj;
      });
    } else {
      // percent mode
      return filteredData.map(channel => {
        const obj: any = { name: channel.name };
        const base = channel[funnelSteps[0].key as keyof FunnelData] as number || 1;
        funnelSteps.forEach(step => {
          const val = channel[step.key as keyof FunnelData] as number;
          obj[step.key] = base > 0 ? Math.round((val / base) * 1000) / 10 : 0; // làm tròn 0.1%
        });
        return obj;
      });
    }
  }, [filteredData, displayMode]);

  // Render Bar cho từng step, mỗi Bar có yAxisId phù hợp
  const barElements = useMemo(() => {
    return funnelSteps.map((step, idx) => (
      <Bar
        key={step.key}
        dataKey={step.key}
        name={step.label}
        fill={chartColors[idx % chartColors.length]}
        yAxisId={step.key === 'revenue' ? 'right' : 'left'}
        isAnimationActive={false}
      >
        <LabelList dataKey={step.key} position="top" formatter={(value: any) => displayMode === 'percent' ? `${value}%` : (step.key === 'revenue' ? `₫${value.toLocaleString('vi-VN')}` : value.toLocaleString('vi-VN'))} />
      </Bar>
    ));
  }, [displayMode]);

  // Format value
  const formatValue = (value: number, type: string) => {
    if (type === 'currency') return `₫${value.toLocaleString('vi-VN')}`;
    if (type === 'number') return value.toLocaleString('vi-VN');
    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Funnel Comparison
            <Badge variant="secondary">
              {selectedMetric === 'volume' ? 'Volume' : 'Conversion Rate'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant={displayMode === 'absolute' ? 'default' : 'outline'} size="sm" onClick={() => setDisplayMode('absolute')}>Số lượng</Button>
            <Button variant={displayMode === 'percent' ? 'default' : 'outline'} size="sm" onClick={() => setDisplayMode('percent')}>Tỷ lệ %</Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Platform Legend */}
          <PlatformLegend platforms={platforms} className="mb-4" />
          
          {/* Chart Area */}
          <div className="relative h-[400px] w-full">
            {!hasRealData ? (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <ChartEmptyState 
                  chartType="funnel"
                  onConnect={onConnect}
                  className="text-center p-6"
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" tickFormatter={v => displayMode === 'percent' ? `${v}%` : v.toLocaleString('vi-VN')} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={v => displayMode === 'percent' ? `${v}%` : `₫${v.toLocaleString('vi-VN')}`} />
                  <Tooltip formatter={(value: any, name: any, props: any) => {
                    if (displayMode === 'percent') return `${value}%`;
                    return name === 'Revenue' ? `₫${value.toLocaleString('vi-VN')}` : value.toLocaleString('vi-VN');
                  }} />
                  <Legend />
                  {barElements}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 