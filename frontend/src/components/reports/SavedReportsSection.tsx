import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  FileText, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  User,
  BarChart3,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

interface SavedReport {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'analytics' | 'custom';
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  lastModified: string;
  createdBy: string;
  size: string;
  dataPoints: number;
  channels: string[];
  dateRange: string;
  template?: string;
  metrics: string[];
}

interface SavedReportsSectionProps {
  onReportView?: (report: SavedReport) => void;
  onReportEdit?: (report: SavedReport) => void;
  onReportDelete?: (reportId: string) => void;
}

const SavedReportsSection: React.FC<SavedReportsSectionProps> = ({ 
  onReportView, 
  onReportEdit, 
  onReportDelete 
}) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'performance' | 'analytics' | 'custom'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  useEffect(() => {
    // Load saved reports from localStorage
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    setReports(savedReports.length > 0 ? savedReports : mockSavedReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.type === filter;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewReport = (report: SavedReport) => {
    onReportView?.(report);
  };

  const handleEditReport = (report: SavedReport) => {
    onReportEdit?.(report);
  };

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
    onReportDelete?.(reportId);
  };

  const handleBulkDelete = () => {
    const updatedReports = reports.filter(r => !selectedReports.includes(r.id));
    setReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
    setSelectedReports([]);
  };

  const handleExportSelected = () => {
    const selectedReportData = reports.filter(r => selectedReports.includes(r.id));
    // Simulate export
    console.log('Exporting reports:', selectedReportData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <BarChart3 className="w-4 h-4" />;
      case 'analytics':
        return <TrendingUp className="w-4 h-4" />;
      case 'custom':
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Reports</h2>
          <p className="text-gray-600 mt-1">
            Manage and access your saved reports
          </p>
        </div>
        <div className="flex gap-2">
          {selectedReports.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleExportSelected}>
                <Download className="w-4 h-4 mr-2" />
                Export Selected ({selectedReports.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Reports' },
            { key: 'performance', label: 'Performance' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'custom', label: 'Custom' }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first report to get started'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Create First Report
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(report.type)}
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports([...selectedReports, report.id]);
                      } else {
                        setSelectedReports(selectedReports.filter(id => id !== report.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {report.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Data points:</span>
                    <span className="font-medium">{report.dataPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Size:</span>
                    <span className="font-medium">{report.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Date range:</span>
                    <span className="font-medium">{report.dateRange}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Channels:</p>
                  <div className="flex flex-wrap gap-1">
                    {report.channels.slice(0, 3).map((channel, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                      >
                        {channel}
                      </span>
                    ))}
                    {report.channels.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{report.channels.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewReport(report)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditReport(report)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'processing').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reports.reduce((total, r) => {
                    const size = parseInt(r.size.replace('MB', ''));
                    return total + size;
                  }, 0)}MB
                </p>
              </div>
              <User className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock Data
const mockSavedReports: SavedReport[] = [
  {
    id: 'report-1',
    name: 'Monthly Performance Report',
    description: 'Comprehensive monthly performance analysis across all channels',
    type: 'performance',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    createdBy: 'John Doe',
    size: '2.5MB',
    dataPoints: 15000,
    channels: ['Facebook', 'Google', 'TikTok'],
    dateRange: 'Dec 1 - Dec 31, 2024',
    metrics: ['Revenue', 'ROAS', 'CPA', 'CTR']
  },
  {
    id: 'report-2',
    name: 'Q4 Campaign Analysis',
    description: 'Fourth quarter campaign performance review with insights',
    type: 'analytics',
    status: 'completed',
    createdAt: '2024-01-10T14:20:00Z',
    lastModified: '2024-01-12T09:15:00Z',
    createdBy: 'Jane Smith',
    size: '1.8MB',
    dataPoints: 12000,
    channels: ['Facebook', 'Google'],
    dateRange: 'Oct 1 - Dec 31, 2024',
    metrics: ['Conversions', 'Cost', 'Revenue', 'ROI']
  },
  {
    id: 'report-3',
    name: 'Holiday Season ROI',
    description: 'Holiday campaign return on investment analysis',
    type: 'performance',
    status: 'completed',
    createdAt: '2024-01-05T16:45:00Z',
    lastModified: '2024-01-05T16:45:00Z',
    createdBy: 'Mike Johnson',
    size: '3.2MB',
    dataPoints: 20000,
    channels: ['Facebook', 'Google', 'TikTok', 'Email'],
    dateRange: 'Nov 15 - Jan 15, 2024',
    metrics: ['ROI', 'Revenue', 'Cost', 'Conversions']
  },
  {
    id: 'report-4',
    name: 'Customer Journey Analysis',
    description: 'Multi-touch attribution and customer journey mapping',
    type: 'analytics',
    status: 'processing',
    createdAt: '2024-01-20T11:00:00Z',
    lastModified: '2024-01-20T11:00:00Z',
    createdBy: 'Sarah Wilson',
    size: '4.1MB',
    dataPoints: 25000,
    channels: ['Facebook', 'Google', 'TikTok'],
    dateRange: 'Jan 1 - Jan 20, 2024',
    metrics: ['Attribution', 'Touchpoints', 'Conversion Paths']
  },
  {
    id: 'report-5',
    name: 'Custom ROI Report',
    description: 'Custom ROI analysis with advanced filtering',
    type: 'custom',
    status: 'completed',
    createdAt: '2024-01-18T13:30:00Z',
    lastModified: '2024-01-19T08:45:00Z',
    createdBy: 'Alex Brown',
    size: '1.5MB',
    dataPoints: 8000,
    channels: ['Facebook', 'Google'],
    dateRange: 'Jan 1 - Jan 18, 2024',
    metrics: ['Custom ROI', 'Revenue', 'Cost']
  },
  {
    id: 'report-6',
    name: 'Competitive Analysis',
    description: 'Market share and competitor benchmarking report',
    type: 'analytics',
    status: 'failed',
    createdAt: '2024-01-22T09:15:00Z',
    lastModified: '2024-01-22T09:15:00Z',
    createdBy: 'Lisa Chen',
    size: '0MB',
    dataPoints: 0,
    channels: ['All Channels'],
    dateRange: 'Jan 1 - Jan 22, 2024',
    metrics: ['Market Share', 'Competitor Data']
  }
];

export default SavedReportsSection; 