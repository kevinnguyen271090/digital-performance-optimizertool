import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Modal from '../ui/modal';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Target, 
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AttributionAnalysisModalContent from './analytics/AttributionAnalysisModalContent';
import CohortAnalysisModalContent from './analytics/CohortAnalysisModalContent';
import PredictiveAnalyticsModalContent from './analytics/PredictiveAnalyticsModalContent';
import CustomerJourneyMapModalContent from './analytics/CustomerJourneyMapModalContent';
import SegmentationModalContent from './analytics/SegmentationModalContent';

interface AnalyticsModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon' | 'beta';
  features: string[];
  estimatedTime: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

interface AdvancedAnalyticsSectionProps {
  onModuleSelected?: (moduleId: string) => void;
}

const AdvancedAnalyticsSection: React.FC<AdvancedAnalyticsSectionProps> = ({ onModuleSelected }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loadingModule, setLoadingModule] = useState<string | null>(null);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    setLoadingModule(moduleId);
    setTimeout(() => {
      setLoadingModule(null);
      onModuleSelected?.(moduleId);
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'coming-soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'beta':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">
            Deep dive analysis tools for advanced marketers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Documentation
          </Button>
          <Button variant="outline" size="sm">
            Schedule Demo
          </Button>
        </div>
      </div>

      {/* Analytics Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsModules.map((module) => (
          <Card 
            key={module.id} 
            className={`hover:shadow-lg transition-all cursor-pointer ${
              selectedModule === module.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleModuleClick(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {module.icon}
                  {module.title}
                </CardTitle>
                {getStatusIcon(module.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {module.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Complexity:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(module.complexity)}`}>
                    {module.complexity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Setup time:</span>
                  <span className="text-gray-700">{module.estimatedTime}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-gray-700">Key Features:</p>
                <div className="space-y-1">
                  {module.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                  {module.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{module.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  disabled={loadingModule === module.id || module.status === 'coming-soon'}
                >
                  {loadingModule === module.id ? (
                    'Loading...'
                  ) : module.status === 'coming-soon' ? (
                    'Coming Soon'
                  ) : (
                    'Open'
                  )}
                </Button>
                {module.status === 'available' && (
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal hiển thị analysis detail */}
      <Modal
        open={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={selectedModule ? analyticsModules.find(m => m.id === selectedModule)?.title : ''}
        className="max-w-4xl w-[70vw] min-w-[700px]"
      >
        {selectedModule === 'attribution' && <AttributionAnalysisModalContent />}
        {selectedModule === 'cohort' && <CohortAnalysisModalContent />}
        {selectedModule === 'predictive' && <PredictiveAnalyticsModalContent />}
        {selectedModule === 'journey-map' && <CustomerJourneyMapModalContent />}
        {selectedModule === 'segmentation' && <SegmentationModalContent />}
        {/* Các module khác sẽ bổ sung sau khi confirm */}
        {['attribution','cohort','predictive','journey-map','segmentation'].indexOf(selectedModule || '') === -1 && (
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              {selectedModule && analyticsModules.find(m => m.id === selectedModule)?.icon}
              <p className="text-gray-500 mb-2 mt-4">
                {selectedModule && analyticsModules.find(m => m.id === selectedModule)?.title} module
              </p>
              <p className="text-sm text-gray-400">
                Detailed analytics interface will be implemented here
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Modules</p>
                <p className="text-2xl font-bold text-green-600">4</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coming Soon</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beta Features</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock Data
const analyticsModules: AnalyticsModule[] = [
  {
    id: 'attribution',
    title: 'Attribution Analysis',
    description: 'Multi-touch attribution and customer journey mapping',
    icon: <BarChart3 className="w-5 h-5" />,
    status: 'available',
    complexity: 'advanced',
    estimatedTime: '5-10 minutes',
    features: [
      'Multi-touch attribution models',
      'Customer journey mapping',
      'Cross-channel revenue attribution',
      'Attribution model comparison',
      'Conversion path analysis'
    ]
  },
  {
    id: 'cohort',
    title: 'Cohort Analysis',
    description: 'Customer retention and behavior analysis',
    icon: <Users className="w-5 h-5" />,
    status: 'available',
    complexity: 'intermediate',
    estimatedTime: '3-5 minutes',
    features: [
      'Cohort retention charts',
      'Revenue cohort analysis',
      'Behavioral cohort patterns',
      'Cohort comparison tools',
      'Retention optimization'
    ]
  },
  {
    id: 'predictive',
    title: 'Predictive Analytics',
    description: 'Revenue forecasting and churn prediction',
    icon: <TrendingUp className="w-5 h-5" />,
    status: 'beta',
    complexity: 'advanced',
    estimatedTime: '10-15 minutes',
    features: [
      'Revenue forecasting models',
      'Churn prediction algorithms',
      'LTV prediction',
      'Campaign performance prediction',
      'AI-powered insights'
    ]
  },
  {
    id: 'segmentation',
    title: 'Advanced Segmentation',
    description: 'RFM analysis and behavioral segmentation',
    icon: <Target className="w-5 h-5" />,
    status: 'available',
    complexity: 'intermediate',
    estimatedTime: '5-7 minutes',
    features: [
      'RFM analysis',
      'Behavioral segmentation',
      'Geographic analysis',
      'Device/platform analysis',
      'Custom segment creation'
    ]
  },
  {
    id: 'realtime',
    title: 'Real-time Monitoring',
    description: 'Live dashboard and performance alerts',
    icon: <Activity className="w-5 h-5" />,
    status: 'coming-soon',
    complexity: 'basic',
    estimatedTime: '2-3 minutes',
    features: [
      'Live performance dashboard',
      'Real-time alerts',
      'Campaign monitoring',
      'Performance optimization',
      'Instant notifications'
    ]
  },
  {
    id: 'journey-map',
    title: 'Customer Journey Map',
    description: 'Visualize customer paths across channels before conversion',
    icon: <Users className="w-5 h-5" />,
    status: 'available',
    complexity: 'intermediate',
    estimatedTime: '3-6 minutes',
    features: [
      'Multi-channel journey visualization',
      'Identify key touchpoints',
      'Detect bottlenecks',
      'Optimize conversion paths',
      'Journey segmentation'
    ]
  }
];

export default AdvancedAnalyticsSection; 