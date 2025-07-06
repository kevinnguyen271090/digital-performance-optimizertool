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
  PieChart as PieChartIcon,
  DollarSign,
  Target,
  Users,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartEmptyState } from '@/components/ui/empty-state';
import { PlatformLegend } from '@/components/ui/platform-legend';

interface PieData {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  leads: number;
  orders: number;
  roas: number;
  cpa: number;
}

interface ExecutivePieCompareProps {
  data: PieData[];
  selectedChannels?: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
  onConnect?: () => void;
}

const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ExecutivePieCompare: React.FC<ExecutivePieCompareProps> = ({
  data,
  selectedChannels = [],
  dateRange,
  connectedChannels = ['facebook', 'google', 'tiktok', 'email'],
  onConnect
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'cost' | 'leads' | 'orders'>('revenue');
  const [chartType, setChartType] = useState<'pie' | 'doughnut'>('pie');

  // Lọc data chỉ lấy các kênh đã kết nối, kênh chưa kết nối giá trị = 0
  const pieData = useMemo(() => {
    return data.map(item =>
      connectedChannels.includes(item.id)
        ? item
        : { ...item, revenue: 0, cost: 0, leads: 0, orders: 0 }
    ).filter(item => selectedChannels.length === 0 || selectedChannels.includes(item.id));
  }, [data, connectedChannels, selectedChannels]);

  // Kiểm tra xem có dữ liệu thật không
  const hasRealData = useMemo(() => {
    return pieData.some(item => 
      connectedChannels.includes(item.id) && 
      (item.revenue > 0 || item.cost > 0 || item.leads > 0 || item.orders > 0)
    );
  }, [pieData, connectedChannels]);

  // Tạo danh sách platforms cho legend
  const platforms = useMemo(() => {
    const allPlatforms = ['facebook', 'google', 'tiktok', 'email'];
    return allPlatforms.map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      isConnected: connectedChannels.includes(id)
    }));
  }, [connectedChannels]);

  // Format value
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return `₫${value.toLocaleString('vi-VN')}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString('vi-VN');
      default:
        return value.toString();
    }
  };

  // Get metric label
  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return 'Revenue';
      case 'cost':
        return 'Cost';
      case 'leads':
        return 'Leads';
      case 'orders':
        return 'Orders';
      default:
        return metric;
    }
  };

  // Tổng giá trị
  const totalValue = pieData.reduce((sum, item) => sum + (item[selectedMetric as keyof PieData] as number), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Distribution Analysis
            <Badge variant="secondary">
              {getMetricLabel(selectedMetric)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChartType(chartType === 'pie' ? 'doughnut' : 'pie')}
            >
              {chartType === 'pie' ? <PieChartIcon className="h-4 w-4" /> : <PieChartIcon className="h-4 w-4" />}
            </Button>
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
                  chartType="pie"
                  onConnect={onConnect}
                  className="text-center p-6"
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey={selectedMetric}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={chartType === 'doughnut' ? 70 : 0}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={chartColors[idx % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatValue(value, selectedMetric === 'revenue' || selectedMetric === 'cost' ? 'currency' : 'number')} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {hasRealData && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Tổng: {formatValue(totalValue, selectedMetric === 'revenue' || selectedMetric === 'cost' ? 'currency' : 'number')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 