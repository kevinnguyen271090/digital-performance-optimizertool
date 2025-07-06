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
              <TableRow>
                <TableHead className="w-[200px]">Kênh/Campaign</TableHead>
                {selectedKPIs.map(kpi => (
                  <TableHead 
                    key={kpi}
                    className="cursor-pointer hover:bg-gray-50"
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
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => {
                const isConnected = connectedChannels.includes(item.id);
                
                return (
                  <TableRow key={item.id} className={`hover:bg-gray-50 ${!isConnected ? 'opacity-50' : ''}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.id}
                        </Badge>
                        {!isConnected && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            Chưa kết nối
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    {selectedKPIs.map(kpi => {
                      const value = item[kpi as keyof KPIData] as number || 0;
                      const performance = isConnected ? getPerformanceIndicator(value, kpi) : 'neutral';
                      
                      return (
                        <TableCell key={kpi}>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${!isConnected ? 'text-gray-400' : ''}`}>
                              {formatValue(value, kpi)}
                            </span>
                            {isConnected && performance === 'good' && (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            )}
                            {isConnected && performance === 'bad' && (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            {performance === 'neutral' && (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDrilldown(item.id)}
                        className="h-8 w-8 p-0"
                        disabled={!isConnected}
                      >
                        <ChevronRight className="h-4 w-4" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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