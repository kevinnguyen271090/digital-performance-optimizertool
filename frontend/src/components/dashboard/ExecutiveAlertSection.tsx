import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  Target,
  Clock,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

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

  // Filter alerts
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

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  // Get change indicator
  const getChangeIndicator = (change?: number) => {
    if (!change) return null;
    
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">+{change}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          <span className="text-sm">{change}%</span>
        </div>
      );
    }
  };

  // Mock recommendations
  const recommendations = useMemo(() => [
    {
      id: '1',
      type: 'optimization',
      title: 'Tối ưu Budget Allocation',
      description: 'Chuyển 20% budget từ Facebook sang Google Ads để tăng ROAS',
      impact: 'high',
      effort: 'medium',
      estimatedImprovement: '+15% ROAS'
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
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-sm bg-popover border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">Tất cả loại</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
              </select>
              
              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="text-sm bg-popover border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
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
                <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
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
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{alert.metric}: {alert.value}</span>
                        {getChangeIndicator(alert.change)}
                      </div>
                    )}
                    
                    {alert.recommendation && (
                      <div className="text-sm text-gray-600">
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
              <div key={rec.id} className="p-4 border rounded-lg space-y-3">
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
                
                <p className="text-sm text-gray-600">{rec.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-gray-500">Effort: {rec.effort}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
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
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Budget Adjustment</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs">Audience Update</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Target className="h-5 w-5" />
              <span className="text-xs">Bidding Strategy</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs">Create Alert</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 