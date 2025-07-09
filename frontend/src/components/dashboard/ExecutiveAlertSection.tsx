import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Lightbulb,
  Target,
  Clock,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Alert {
  id: string;
  channel: string;
  type: 'warning' | 'success' | 'error' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high';
  metric?: string;
  value?: number;
  change?: number;
  recommendation?: string;
  action?: string;
}

interface ExecutiveAlertSectionProps {
  alerts: Alert[];
  selectedChannel?: string;
}

export const ExecutiveAlertSection: React.FC<ExecutiveAlertSectionProps> = ({
  alerts,
  selectedChannel
}) => {
  const [filterType, setFilterType] = useState<'all' | 'warning' | 'success' | 'error' | 'info'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Lọc alerts theo channel và filter
  const filteredAlerts = useMemo(() => {
    let filtered = alerts;
    
    if (selectedChannel) {
      filtered = filtered.filter(alert => alert.channel === selectedChannel);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }
    
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }
    
    return filtered;
  }, [alerts, selectedChannel, filterType, filterSeverity]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[severity as keyof typeof variants]} className="text-xs">
        {severity}
      </Badge>
    );
  };

  const getChangeIndicator = (change?: number) => {
    if (!change) return null;
    
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Mock recommendations data
  const recommendations = useMemo(() => [
    {
      id: '1',
      type: 'budget',
      title: 'Tăng Budget',
      description: 'Tăng budget cho campaign có ROAS cao nhất',
      impact: 'high',
      effort: 'medium',
      estimatedImprovement: '+15% Revenue'
    },
    {
      id: '2',
      type: 'creative',
      title: 'Cập nhật Creative',
      description: 'Thay đổi hình ảnh và copy cho campaign có CTR thấp',
      impact: 'medium',
      effort: 'low',
      estimatedImprovement: '+10% CTR'
    },
    {
      id: '3',
      type: 'targeting',
      title: 'Mở rộng Audience',
      description: 'Thêm lookalike audience cho campaign hiệu quả',
      impact: 'high',
      effort: 'high',
      estimatedImprovement: '+25% Reach'
    }
  ], []);

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts & Notifications
              <Badge variant="outline">
                {filteredAlerts.length} alerts
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity} onValueChange={(value) => setFilterSeverity(value as any)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tất cả mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức độ</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>Không có alert nào trong khoảng thời gian này</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.message}</span>
                      {getSeverityBadge(alert.severity)}
                      {alert.channel && (
                        <Badge variant="secondary" className="text-xs">
                          {alert.channel}
                        </Badge>
                      )}
                    </div>
                    
                    {alert.metric && alert.value && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{alert.metric}: {alert.value}</span>
                        {getChangeIndicator(alert.change)}
                      </div>
                    )}
                    
                    {alert.recommendation && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Đề xuất:</span> {alert.recommendation}
                      </div>
                    )}
                    
                    {alert.action && (
                      <Button size="sm" variant="outline" className="mt-2">
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations
            <Badge variant="secondary">3 đề xuất</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{rec.title}</span>
                  </div>
                  <Badge 
                    variant={rec.impact === 'high' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {rec.impact}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-gray-500 dark:text-gray-400">Effort: {rec.effort}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{rec.estimatedImprovement}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Thực hiện
                  </Button>
                  <Button size="sm" variant="outline">
                    Chi tiết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Budget Adjustment</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20">
              <Users className="h-5 w-5" />
              <span className="text-xs">Audience Update</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <Target className="h-5 w-5" />
              <span className="text-xs">Bidding Strategy</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs">Create Alert</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 