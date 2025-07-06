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
  ChevronDown, 
  ChevronUp, 
  Filter,
  Download,
  Calendar,
  Users,
  MapPin,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface DrilldownData {
  id: string;
  channel: string;
  name: string;
  revenue?: number;
  cost?: number;
  roas?: number;
  cpa?: number;
  ctr?: number;
  conversion_rate?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

interface ExecutiveDrilldownSectionProps {
  selectedChannel?: string;
  selectedCampaign?: string;
  drilldownLevel: 'channel' | 'campaign' | 'ad_group' | 'ad';
  data: DrilldownData[];
}

export const ExecutiveDrilldownSection: React.FC<ExecutiveDrilldownSectionProps> = ({
  selectedChannel,
  selectedCampaign,
  drilldownLevel,
  data
}) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Filter data based on selection
  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (selectedChannel) {
      filtered = filtered.filter(item => item.channel === selectedChannel);
    }
    
    if (selectedCampaign) {
      filtered = filtered.filter(item => item.id === selectedCampaign);
    }
    
    return filtered;
  }, [data, selectedChannel, selectedCampaign]);

  // Mock detailed data for drill-down
  const detailedData = useMemo(() => {
    const result = [];
    
    filteredData.forEach(item => {
      // Ad Groups
      result.push({
        id: `${item.id}_ag1`,
        parentId: item.id,
        level: 'ad_group',
        name: `${item.name} - Ad Group 1`,
        revenue: item.revenue ? item.revenue * 0.4 : 0,
        cost: item.cost ? item.cost * 0.4 : 0,
        roas: item.roas ? item.roas * 0.95 : 0,
        cpa: item.cpa ? item.cpa * 1.05 : 0,
        ctr: item.ctr ? item.ctr * 1.1 : 0,
        conversion_rate: item.conversion_rate ? item.conversion_rate * 0.9 : 0,
        impressions: item.impressions ? item.impressions * 0.4 : 0,
        clicks: item.clicks ? item.clicks * 0.4 : 0,
        conversions: item.conversions ? item.conversions * 0.4 : 0
      });
      
      result.push({
        id: `${item.id}_ag2`,
        parentId: item.id,
        level: 'ad_group',
        name: `${item.name} - Ad Group 2`,
        revenue: item.revenue ? item.revenue * 0.6 : 0,
        cost: item.cost ? item.cost * 0.6 : 0,
        roas: item.roas ? item.roas * 1.05 : 0,
        cpa: item.cpa ? item.cpa * 0.95 : 0,
        ctr: item.ctr ? item.ctr * 0.9 : 0,
        conversion_rate: item.conversion_rate ? item.conversion_rate * 1.1 : 0,
        impressions: item.impressions ? item.impressions * 0.6 : 0,
        clicks: item.clicks ? item.clicks * 0.6 : 0,
        conversions: item.conversions ? item.conversions * 0.6 : 0
      });
    });
    
    return result;
  }, [filteredData]);

  // Format value
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return `₫${value.toLocaleString('vi-VN')}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return `${value.toFixed(2)}x`;
      case 'number':
        return value.toLocaleString('vi-VN');
      default:
        return value.toString();
    }
  };

  // Handle row expansion
  const handleRowToggle = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'channel': return 'Kênh';
      case 'campaign': return 'Campaign';
      case 'ad_group': return 'Ad Group';
      case 'ad': return 'Ad';
      default: return level;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-5 w-5" />
            Drill-down: {getLevelLabel(drilldownLevel)}
            {selectedChannel && (
              <Badge variant="secondary">{selectedChannel}</Badge>
            )}
            {selectedCampaign && (
              <Badge variant="outline">{selectedCampaign}</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[300px]">Tên</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">CPA</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedData.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRowToggle(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedRows.includes(item.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.level}
                        </Badge>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatValue(item.revenue || 0, 'currency')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.cost || 0, 'currency')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.roas || 0, 'decimal')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.cpa || 0, 'currency')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.ctr || 0, 'percentage')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.conversion_rate || 0, 'percentage')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.impressions || 0, 'number')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.clicks || 0, 'number')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatValue(item.conversions || 0, 'number')}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded row with detailed breakdown */}
                  {expandedRows.includes(item.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={11}>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Device Breakdown */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm flex items-center gap-1">
                                <Monitor className="h-4 w-4" />
                                Device Breakdown
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Desktop</span>
                                  <span>45%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mobile</span>
                                  <span>40%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tablet</span>
                                  <span>15%</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Location Breakdown */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Top Locations
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Hà Nội</span>
                                  <span>35%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>TP.HCM</span>
                                  <span>30%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Đà Nẵng</span>
                                  <span>15%</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Audience Breakdown */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Audience
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>New Users</span>
                                  <span>60%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Returning</span>
                                  <span>40%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Performance Insights */}
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-sm mb-2">Performance Insights</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="p-3 bg-green-50 rounded-lg">
                                <div className="font-medium text-green-800">✅ Strong Performance</div>
                                <div className="text-green-600">ROAS cao hơn 20% so với trung bình</div>
                              </div>
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="font-medium text-yellow-800">⚠️ Cần tối ưu</div>
                                <div className="text-yellow-600">CTR thấp hơn 15% so với trung bình</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tổng Revenue:</span>
              <span className="ml-2 font-medium">
                ₫{detailedData.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tổng Cost:</span>
              <span className="ml-2 font-medium">
                ₫{detailedData.reduce((sum, item) => sum + (item.cost || 0), 0).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">ROAS TB:</span>
              <span className="ml-2 font-medium">
                {(detailedData.reduce((sum, item) => sum + (item.roas || 0), 0) / detailedData.length).toFixed(2)}x
              </span>
            </div>
            <div>
              <span className="text-gray-600">CPA TB:</span>
              <span className="ml-2 font-medium">
                ₫{(detailedData.reduce((sum, item) => sum + (item.cpa || 0), 0) / detailedData.length).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 