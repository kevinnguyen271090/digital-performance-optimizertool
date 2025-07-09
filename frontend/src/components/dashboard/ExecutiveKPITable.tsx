import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { hasRealData } from '@/utils/mockData';

interface KPIData {
  id: string;
  name: string;
  revenue?: number;
  cost?: number;
  roas?: number;
  cpa?: number;
  ctr?: number;
  conversion_rate?: number;
  cpc?: number;
  cpm?: number;
  engagement_rate?: number;
  drop_off_rate?: number;
}

interface ExecutiveKPITableProps {
  data: KPIData[];
  selectedKPIs: string[];
  onDrilldown?: (level: 'channel' | 'campaign' | 'ad_group' | 'ad', id: string) => void;
  connectedChannels?: string[];
}

export const ExecutiveKPITable: React.FC<ExecutiveKPITableProps> = ({
  data,
  selectedKPIs,
  onDrilldown,
  connectedChannels = ['facebook', 'google']
}) => {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // KPI labels và formatting
  const kpiConfig = useMemo(() => ({
    revenue: { label: 'Revenue', format: 'currency', prefix: '₫', suffix: '' },
    cost: { label: 'Cost', format: 'currency', prefix: '₫', suffix: '' },
    roas: { label: 'ROAS', format: 'decimal', prefix: '', suffix: 'x' },
    cpa: { label: 'CPA', format: 'currency', prefix: '₫', suffix: '' },
    ctr: { label: 'CTR', format: 'percentage', prefix: '', suffix: '%' },
    conversion_rate: { label: 'Conv. Rate', format: 'percentage', prefix: '', suffix: '%' },
    cpc: { label: 'CPC', format: 'currency', prefix: '₫', suffix: '' },
    cpm: { label: 'CPM', format: 'currency', prefix: '₫', suffix: '' },
    engagement_rate: { label: 'Engagement', format: 'percentage', prefix: '', suffix: '%' },
    drop_off_rate: { label: 'Drop-off', format: 'percentage', prefix: '', suffix: '%' }
  }), []);

  // Format value theo config
  const formatValue = (value: number, kpi: string) => {
    const config = kpiConfig[kpi as keyof typeof kpiConfig];
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

  // Tính toán performance indicator
  const getPerformanceIndicator = (value: number, kpi: string) => {
    // Logic đơn giản: so sánh với giá trị trung bình
    const avgValue = data.reduce((sum, item) => sum + (item[kpi as keyof KPIData] as number || 0), 0) / data.length;
    
    if (kpi === 'roas' || kpi === 'ctr' || kpi === 'conversion_rate' || kpi === 'engagement_rate') {
      // Higher is better
      return value > avgValue * 1.1 ? 'good' : value < avgValue * 0.9 ? 'bad' : 'neutral';
    } else {
      // Lower is better (cost metrics)
      return value < avgValue * 0.9 ? 'good' : value > avgValue * 1.1 ? 'bad' : 'neutral';
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof KPIData] as number || 0;
      const bValue = b[sortColumn as keyof KPIData] as number || 0;
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Handle drill-down
  const handleDrilldown = (id: string) => {
    onDrilldown?.('channel', id);
  };

  // Kiểm tra có dữ liệu thật không
  const hasRealDataForTable = useMemo(() => {
    return hasRealData(data, connectedChannels);
  }, [data, connectedChannels]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>KPI Comparison Table</span>
          <Badge variant="outline">
            {data.length} kênh/campaign
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasRealDataForTable && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Chưa có dữ liệu thật. Chỉ hiển thị dữ liệu từ các kênh đã kết nối.
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gradientFrom/10 to-gradientTo/10">
                <TableHead className="w-[200px] text-gray-900 dark:text-white font-bold">Kênh/Campaign</TableHead>
                {selectedKPIs.map(kpi => (
                  <TableHead 
                    key={kpi}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-gradientFrom/20 hover:to-gradientTo/20 text-gray-900 dark:text-white font-bold transition-colors"
                    onClick={() => handleSort(kpi)}
                  >
                    <div className="flex items-center gap-1">
                      {kpiConfig[kpi as keyof typeof kpiConfig]?.label || kpi}
                      {sortColumn === kpi && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-gray-900 dark:text-white font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => {
                const isConnected = connectedChannels.includes(item.id);
                return (
                  <TableRow key={item.id} className={`hover:bg-gradient-to-r hover:from-gradientFrom/10 hover:to-gradientTo/10 transition-colors ${!isConnected ? 'opacity-50' : ''}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-gradientFrom to-gradientTo text-white border-0 shadow-sm">
                          {item.id}
                        </Badge>
                        {!isConnected && (
                          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300 bg-white dark:bg-gray-800">
                            Chưa kết nối
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    {selectedKPIs.map(kpi => {
                      const value = item[kpi as keyof KPIData] as number || 0;
                      const perf = getPerformanceIndicator(value, kpi);
                      return (
                        <TableCell key={kpi} className="text-sm">
                          <span className={`font-semibold px-2 py-1 rounded-lg ${
                            perf === 'good' ? 'bg-gradient-to-r from-gradientFrom to-gradientTo text-white' :
                            perf === 'bad' ? 'bg-red-500 text-white' :
                            'bg-accent/20 text-accent'
                          }`}>
                            {formatValue(value, kpi)}
                          </span>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Button size="sm" className="bg-gradient-to-r from-gradientFrom to-gradientTo text-white font-semibold shadow-sm hover:from-purple-700 hover:to-pink-700 transition">
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary row */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
            <div>
              <span className="text-gray-600">Tổng Revenue:</span>
              <span className="ml-2 font-medium">
                ₫{data.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tổng Cost:</span>
              <span className="ml-2 font-medium">
                ₫{data.reduce((sum, item) => sum + (item.cost || 0), 0).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">ROAS TB:</span>
              <span className="ml-2 font-medium">
                {(data.reduce((sum, item) => sum + (item.roas || 0), 0) / data.length).toFixed(2)}x
              </span>
            </div>
            <div>
              <span className="text-gray-600">CPA TB:</span>
              <span className="ml-2 font-medium">
                ₫{(data.reduce((sum, item) => sum + (item.cpa || 0), 0) / data.length).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 