import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Download,
  Share2,
  Edit,
  Trash2
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'performance' | 'analytics' | 'custom';
  estimatedTime: string;
  includes: string[];
}

interface CustomReportsSectionProps {
  onReportCreated?: (report: any) => void;
}

const CustomReportsSection: React.FC<CustomReportsSectionProps> = ({ onReportCreated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateReport = (template: ReportTemplate) => {
    setIsCreating(true);
    setSelectedTemplate(template.id);
    
    // Simulate report creation
    setTimeout(() => {
      const newReport = {
        id: `report-${Date.now()}`,
        name: template.title,
        template: template.id,
        createdAt: new Date().toISOString(),
        status: 'completed',
        data: generateMockReportData(template.id)
      };
      
      onReportCreated?.(newReport);
      setIsCreating(false);
      setSelectedTemplate(null);
    }, 2000);
  };

  const generateMockReportData = (templateId: string) => {
    const baseData = {
      totalRevenue: 125000,
      totalClicks: 45000,
      totalImpressions: 250000,
      conversionRate: 2.8,
      cpc: 1.25,
      cpm: 15.50
    };

    switch (templateId) {
      case 'performance-overview':
        return {
          ...baseData,
          channels: ['Google Ads', 'Facebook Ads', 'Instagram'],
          timeRange: 'last_30_days'
        };
      case 'roi-analysis':
        return {
          ...baseData,
          roi: 3.2,
          costPerAcquisition: 45,
          lifetimeValue: 180
        };
      case 'customer-journey':
        return {
          ...baseData,
          touchpoints: ['Search', 'Social', 'Email', 'Direct'],
          conversionPaths: ['Search > Direct', 'Social > Email > Direct']
        };
      default:
        return baseData;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Reports</h2>
          <p className="text-gray-600 mt-1">
            Create custom reports with drag & drop builder
          </p>
        </div>
        <Button onClick={() => setSelectedTemplate('custom')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Report Card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-48">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Create New Report
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Start from scratch with drag & drop builder
            </p>
          </CardContent>
        </Card>

        {/* Template Reports */}
        {reportTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCreateReport(template)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {template.icon}
                {template.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {template.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Category:</span>
                  <span className="capitalize">{template.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Estimated time:</span>
                  <span>{template.estimatedTime}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {template.includes.map((item, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  disabled={isCreating && selectedTemplate === template.id}
                >
                  {isCreating && selectedTemplate === template.id ? (
                    'Creating...'
                  ) : (
                    'Use Template'
                  )}
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{report.name}</span>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock Data
const reportTemplates: ReportTemplate[] = [
  {
    id: 'performance-overview',
    title: 'Performance Overview',
    description: 'Comprehensive view of all channel performance metrics',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'performance',
    estimatedTime: '2-3 minutes',
    includes: ['KPIs', 'Charts', 'Tables', 'Insights']
  },
  {
    id: 'roi-analysis',
    title: 'ROI Analysis',
    description: 'Return on investment analysis across all campaigns',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'analytics',
    estimatedTime: '3-4 minutes',
    includes: ['ROI Metrics', 'Cost Analysis', 'Revenue Tracking']
  },
  {
    id: 'customer-journey',
    title: 'Customer Journey',
    description: 'Track customer touchpoints and conversion paths',
    icon: <Users className="w-5 h-5" />,
    category: 'analytics',
    estimatedTime: '4-5 minutes',
    includes: ['Touchpoints', 'Conversion Paths', 'Attribution']
  },
  {
    id: 'campaign-comparison',
    title: 'Campaign Comparison',
    description: 'Compare performance across different campaigns',
    icon: <Target className="w-5 h-5" />,
    category: 'performance',
    estimatedTime: '2-3 minutes',
    includes: ['Campaign Data', 'Comparison Charts', 'Insights']
  },
  {
    id: 'custom-metrics',
    title: 'Custom Metrics',
    description: 'Create custom metrics and calculations',
    icon: <FileText className="w-5 h-5" />,
    category: 'custom',
    estimatedTime: '5-10 minutes',
    includes: ['Custom Formulas', 'Calculated Fields', 'Advanced Analytics']
  }
];

const recentReports = [
  {
    id: 1,
    name: 'Monthly Performance Report',
    description: 'Comprehensive monthly performance analysis',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Q4 Campaign Analysis',
    description: 'Fourth quarter campaign performance review',
    date: '2024-01-10'
  },
  {
    id: 3,
    name: 'Holiday Season ROI',
    description: 'Holiday campaign return on investment analysis',
    date: '2024-01-05'
  }
];

export default CustomReportsSection; 