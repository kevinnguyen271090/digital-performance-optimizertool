// Mock data cho Reports - Tuân thủ Data Source Strategy
// Environment-based configuration và API contract consistency

// ✅ LOGIC CHÍNH: Chỉ hiển thị số liệu các kênh đã kết nối, kênh chưa kết nối giá trị mặc định là 0
import { CONNECTED_CHANNELS, DISCONNECTED_CHANNELS } from '../../../utils/mockData';

// Helper function để filter data theo connectedChannels
export const filterReportsDataByConnectedChannels = <T extends { channels?: string[] }>(
  data: T[],
  connectedChannels: string[] = CONNECTED_CHANNELS
): T[] => {
  return data.map(item => {
    if (item.channels) {
      const filteredChannels = item.channels.filter(channel => 
        connectedChannels.includes(channel.toLowerCase())
      );
      return { ...item, channels: filteredChannels };
    }
    return item;
  });
};

// Helper function để kiểm tra có dữ liệu thật không
export const hasRealReportsData = <T extends { channels?: string[] }>(
  data: T[],
  connectedChannels: string[] = CONNECTED_CHANNELS
): boolean => {
  return data.some(item => 
    item.channels && 
    item.channels.some(channel => connectedChannels.includes(channel.toLowerCase()))
  );
};

// Helper function để tạo zero data cho reports chưa có kênh kết nối
export const createZeroReportsData = <T extends { channels?: string[] }>(
  template: T,
  connectedChannels: string[] = CONNECTED_CHANNELS
): T => {
  return {
    ...template,
    channels: template.channels?.filter(channel => 
      connectedChannels.includes(channel.toLowerCase())
    ) || []
  };
};

// ✅ THÊM MỚI: Function để tạo data format cho Reports
export function createReportsData(reportType: string, reportData: any): any {
  // Tạo overview data cho reports
  const overview = {
    totalReports: reportData.totalReports || 0,
    completedReports: reportData.completedReports || 0,
    processingReports: reportData.processingReports || 0,
    failedReports: reportData.failedReports || 0,
    totalSize: reportData.totalSize || '0MB',
    avgDataPoints: reportData.avgDataPoints || 0,
    // Report-specific metrics
    mostUsedTemplate: reportData.mostUsedTemplate || 'Performance Overview',
    avgCreationTime: reportData.avgCreationTime || '5 minutes',
    exportCount: reportData.exportCount || 0,
    shareCount: reportData.shareCount || 0,
    // Channel distribution
    channelDistribution: reportData.channelDistribution || {
      facebook: 0,
      google: 0,
      tiktok: 0,
      email: 0
    },
    // Report types distribution
    typeDistribution: reportData.typeDistribution || {
      performance: 0,
      analytics: 0,
      custom: 0
    }
  };

  // Tạo template reports data
  const templates = [
    {
      id: 'performance-overview',
      title: 'Performance Overview',
      description: 'Comprehensive view of all channel performance metrics',
      icon: 'BarChart3',
      category: 'performance',
      estimatedTime: '2-3 minutes',
      includes: ['KPIs', 'Charts', 'Tables', 'Insights'],
      usageCount: 45,
      rating: 4.8,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'roi-analysis',
      title: 'ROI Analysis',
      description: 'Return on investment analysis across all campaigns',
      icon: 'TrendingUp',
      category: 'analytics',
      estimatedTime: '3-4 minutes',
      includes: ['ROI Metrics', 'Cost Analysis', 'Revenue Tracking'],
      usageCount: 32,
      rating: 4.6,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'customer-journey',
      title: 'Customer Journey',
      description: 'Track customer touchpoints and conversion paths',
      icon: 'Users',
      category: 'analytics',
      estimatedTime: '4-5 minutes',
      includes: ['Touchpoints', 'Conversion Paths', 'Attribution'],
      usageCount: 28,
      rating: 4.7,
      lastUpdated: '2024-01-12'
    },
    {
      id: 'campaign-comparison',
      title: 'Campaign Comparison',
      description: 'Compare performance across different campaigns',
      icon: 'Target',
      category: 'performance',
      estimatedTime: '2-3 minutes',
      includes: ['Campaign Data', 'Comparison Charts', 'Insights'],
      usageCount: 38,
      rating: 4.5,
      lastUpdated: '2024-01-08'
    },
    {
      id: 'custom-metrics',
      title: 'Custom Metrics',
      description: 'Create custom metrics and calculations',
      icon: 'FileText',
      category: 'custom',
      estimatedTime: '5-10 minutes',
      includes: ['Custom Formulas', 'Calculated Fields', 'Advanced Analytics'],
      usageCount: 15,
      rating: 4.9,
      lastUpdated: '2024-01-20'
    }
  ];

  // Tạo analytics modules data
  const analyticsModules = [
    {
      id: 'attribution',
      title: 'Attribution Analysis',
      description: 'Multi-touch attribution and customer journey mapping',
      icon: 'BarChart3',
      status: 'available',
      complexity: 'advanced',
      estimatedTime: '5-10 minutes',
      features: [
        'Multi-touch attribution models',
        'Customer journey mapping',
        'Cross-channel revenue attribution',
        'Attribution model comparison',
        'Conversion path analysis'
      ],
      usageCount: 12,
      avgSetupTime: '8 minutes',
      successRate: 95
    },
    {
      id: 'cohort',
      title: 'Cohort Analysis',
      description: 'Customer retention and behavior analysis',
      icon: 'Users',
      status: 'available',
      complexity: 'intermediate',
      estimatedTime: '3-5 minutes',
      features: [
        'Cohort retention charts',
        'Revenue cohort analysis',
        'Behavioral cohort patterns',
        'Cohort comparison tools',
        'Retention optimization'
      ],
      usageCount: 18,
      avgSetupTime: '4 minutes',
      successRate: 92
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      description: 'Revenue forecasting and churn prediction',
      icon: 'TrendingUp',
      status: 'beta',
      complexity: 'advanced',
      estimatedTime: '10-15 minutes',
      features: [
        'Revenue forecasting models',
        'Churn prediction algorithms',
        'LTV prediction',
        'Campaign performance prediction',
        'AI-powered insights'
      ],
      usageCount: 8,
      avgSetupTime: '12 minutes',
      successRate: 88
    },
    {
      id: 'competitive',
      title: 'Competitive Intelligence',
      description: 'Market share and competitor benchmarking',
      icon: 'Globe',
      status: 'coming-soon',
      complexity: 'intermediate',
      estimatedTime: '5-8 minutes',
      features: [
        'Market share analysis',
        'Competitor benchmarking',
        'Industry trends tracking',
        'Competitive ad spend analysis',
        'Market positioning insights'
      ],
      usageCount: 0,
      avgSetupTime: '0 minutes',
      successRate: 0
    },
    {
      id: 'segmentation',
      title: 'Advanced Segmentation',
      description: 'RFM analysis and behavioral segmentation',
      icon: 'Target',
      status: 'coming-soon',
      complexity: 'intermediate',
      estimatedTime: '5-7 minutes',
      features: [
        'RFM analysis',
        'Behavioral segmentation',
        'Geographic analysis',
        'Device/platform analysis',
        'Custom segment creation'
      ],
      usageCount: 0,
      avgSetupTime: '0 minutes',
      successRate: 0
    },
    {
      id: 'realtime',
      title: 'Real-time Monitoring',
      description: 'Live dashboard and performance alerts',
      icon: 'Activity',
      status: 'available',
      complexity: 'basic',
      estimatedTime: '2-3 minutes',
      features: [
        'Live performance dashboard',
        'Real-time alerts',
        'Campaign monitoring',
        'Performance optimization',
        'Instant notifications'
      ],
      usageCount: 25,
      avgSetupTime: '2 minutes',
      successRate: 98
    }
  ];

  // Tạo saved reports data
  const savedReports = [
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
      metrics: ['Revenue', 'ROAS', 'CPA', 'CTR'],
      exportCount: 5,
      shareCount: 3,
      rating: 4.8
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
      metrics: ['Conversions', 'Cost', 'Revenue', 'ROI'],
      exportCount: 3,
      shareCount: 2,
      rating: 4.6
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
      metrics: ['ROI', 'Revenue', 'Cost', 'Conversions'],
      exportCount: 8,
      shareCount: 5,
      rating: 4.9
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
      metrics: ['Attribution', 'Touchpoints', 'Conversion Paths'],
      exportCount: 0,
      shareCount: 0,
      rating: 0
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
      metrics: ['Custom ROI', 'Revenue', 'Cost'],
      exportCount: 2,
      shareCount: 1,
      rating: 4.7
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
      metrics: ['Market Share', 'Competitor Data'],
      exportCount: 0,
      shareCount: 0,
      rating: 0
    }
  ];

  // Tạo trends data cho reports
  const trends = {
    reportsCreated: [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 8 },
      { date: '2024-01-03', count: 12 },
      { date: '2024-01-04', count: 6 },
      { date: '2024-01-05', count: 15 },
      { date: '2024-01-06', count: 9 },
      { date: '2024-01-07', count: 11 }
    ],
    reportsExported: [
      { date: '2024-01-01', count: 3 },
      { date: '2024-01-02', count: 7 },
      { date: '2024-01-03', count: 10 },
      { date: '2024-01-04', count: 4 },
      { date: '2024-01-05', count: 12 },
      { date: '2024-01-06', count: 6 },
      { date: '2024-01-07', count: 8 }
    ],
    analyticsUsage: [
      { date: '2024-01-01', attribution: 2, cohort: 3, predictive: 1 },
      { date: '2024-01-02', attribution: 4, cohort: 2, predictive: 0 },
      { date: '2024-01-03', attribution: 3, cohort: 5, predictive: 2 },
      { date: '2024-01-04', attribution: 1, cohort: 3, predictive: 1 },
      { date: '2024-01-05', attribution: 5, cohort: 4, predictive: 3 },
      { date: '2024-01-06', attribution: 2, cohort: 6, predictive: 1 },
      { date: '2024-01-07', attribution: 4, cohort: 3, predictive: 2 }
    ]
  };

  // Tạo insights data cho reports
  const insights = [
    {
      type: 'success',
      title: 'Reports usage tăng',
      description: 'Số lượng reports được tạo tăng 25% so với tuần trước',
      impact: 'Hiệu quả cao hơn trong việc phân tích dữ liệu'
    },
    {
      type: 'warning',
      title: 'Analytics modules ít sử dụng',
      description: 'Các module phân tích nâng cao chưa được sử dụng nhiều',
      impact: 'Cần training và hướng dẫn thêm cho users'
    },
    {
      type: 'info',
      title: 'Template phổ biến',
      description: 'Performance Overview là template được sử dụng nhiều nhất',
      impact: 'Có thể tối ưu template này để tăng hiệu quả'
    }
  ];

  return {
    overview,
    templates,
    analyticsModules,
    savedReports,
    trends,
    insights
  };
}

// Mock data cho Reports
export const reportsMockData = {
  overview: {
    totalReports: 25,
    completedReports: 22,
    processingReports: 2,
    failedReports: 1,
    totalSize: '45.2MB',
    avgDataPoints: 15000,
    mostUsedTemplate: 'Performance Overview',
    avgCreationTime: '5 minutes',
    exportCount: 45,
    shareCount: 23,
    channelDistribution: {
      facebook: 15,
      google: 12,
      tiktok: 8,
      email: 5
    },
    typeDistribution: {
      performance: 12,
      analytics: 8,
      custom: 5
    }
  },
  templates: [
    {
      id: 'performance-overview',
      title: 'Performance Overview',
      description: 'Comprehensive view of all channel performance metrics',
      icon: 'BarChart3',
      category: 'performance',
      estimatedTime: '2-3 minutes',
      includes: ['KPIs', 'Charts', 'Tables', 'Insights'],
      usageCount: 45,
      rating: 4.8,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'roi-analysis',
      title: 'ROI Analysis',
      description: 'Return on investment analysis across all campaigns',
      icon: 'TrendingUp',
      category: 'analytics',
      estimatedTime: '3-4 minutes',
      includes: ['ROI Metrics', 'Cost Analysis', 'Revenue Tracking'],
      usageCount: 32,
      rating: 4.6,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'customer-journey',
      title: 'Customer Journey',
      description: 'Track customer touchpoints and conversion paths',
      icon: 'Users',
      category: 'analytics',
      estimatedTime: '4-5 minutes',
      includes: ['Touchpoints', 'Conversion Paths', 'Attribution'],
      usageCount: 28,
      rating: 4.7,
      lastUpdated: '2024-01-12'
    },
    {
      id: 'campaign-comparison',
      title: 'Campaign Comparison',
      description: 'Compare performance across different campaigns',
      icon: 'Target',
      category: 'performance',
      estimatedTime: '2-3 minutes',
      includes: ['Campaign Data', 'Comparison Charts', 'Insights'],
      usageCount: 38,
      rating: 4.5,
      lastUpdated: '2024-01-08'
    },
    {
      id: 'custom-metrics',
      title: 'Custom Metrics',
      description: 'Create custom metrics and calculations',
      icon: 'FileText',
      category: 'custom',
      estimatedTime: '5-10 minutes',
      includes: ['Custom Formulas', 'Calculated Fields', 'Advanced Analytics'],
      usageCount: 15,
      rating: 4.9,
      lastUpdated: '2024-01-20'
    }
  ],
  analyticsModules: [
    {
      id: 'attribution',
      title: 'Attribution Analysis',
      description: 'Multi-touch attribution and customer journey mapping',
      icon: 'BarChart3',
      status: 'available',
      complexity: 'advanced',
      estimatedTime: '5-10 minutes',
      features: [
        'Multi-touch attribution models',
        'Customer journey mapping',
        'Cross-channel revenue attribution',
        'Attribution model comparison',
        'Conversion path analysis'
      ],
      usageCount: 12,
      avgSetupTime: '8 minutes',
      successRate: 95
    },
    {
      id: 'cohort',
      title: 'Cohort Analysis',
      description: 'Customer retention and behavior analysis',
      icon: 'Users',
      status: 'available',
      complexity: 'intermediate',
      estimatedTime: '3-5 minutes',
      features: [
        'Cohort retention charts',
        'Revenue cohort analysis',
        'Behavioral cohort patterns',
        'Cohort comparison tools',
        'Retention optimization'
      ],
      usageCount: 18,
      avgSetupTime: '4 minutes',
      successRate: 92
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      description: 'Revenue forecasting and churn prediction',
      icon: 'TrendingUp',
      status: 'beta',
      complexity: 'advanced',
      estimatedTime: '10-15 minutes',
      features: [
        'Revenue forecasting models',
        'Churn prediction algorithms',
        'LTV prediction',
        'Campaign performance prediction',
        'AI-powered insights'
      ],
      usageCount: 8,
      avgSetupTime: '12 minutes',
      successRate: 88
    },
    {
      id: 'competitive',
      title: 'Competitive Intelligence',
      description: 'Market share and competitor benchmarking',
      icon: 'Globe',
      status: 'coming-soon',
      complexity: 'intermediate',
      estimatedTime: '5-8 minutes',
      features: [
        'Market share analysis',
        'Competitor benchmarking',
        'Industry trends tracking',
        'Competitive ad spend analysis',
        'Market positioning insights'
      ],
      usageCount: 0,
      avgSetupTime: '0 minutes',
      successRate: 0
    },
    {
      id: 'segmentation',
      title: 'Advanced Segmentation',
      description: 'RFM analysis and behavioral segmentation',
      icon: 'Target',
      status: 'coming-soon',
      complexity: 'intermediate',
      estimatedTime: '5-7 minutes',
      features: [
        'RFM analysis',
        'Behavioral segmentation',
        'Geographic analysis',
        'Device/platform analysis',
        'Custom segment creation'
      ],
      usageCount: 0,
      avgSetupTime: '0 minutes',
      successRate: 0
    },
    {
      id: 'realtime',
      title: 'Real-time Monitoring',
      description: 'Live dashboard and performance alerts',
      icon: 'Activity',
      status: 'available',
      complexity: 'basic',
      estimatedTime: '2-3 minutes',
      features: [
        'Live performance dashboard',
        'Real-time alerts',
        'Campaign monitoring',
        'Performance optimization',
        'Instant notifications'
      ],
      usageCount: 25,
      avgSetupTime: '2 minutes',
      successRate: 98
    }
  ],
  savedReports: [
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
      metrics: ['Revenue', 'ROAS', 'CPA', 'CTR'],
      exportCount: 5,
      shareCount: 3,
      rating: 4.8
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
      metrics: ['Conversions', 'Cost', 'Revenue', 'ROI'],
      exportCount: 3,
      shareCount: 2,
      rating: 4.6
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
      metrics: ['ROI', 'Revenue', 'Cost', 'Conversions'],
      exportCount: 8,
      shareCount: 5,
      rating: 4.9
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
      metrics: ['Attribution', 'Touchpoints', 'Conversion Paths'],
      exportCount: 0,
      shareCount: 0,
      rating: 0
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
      metrics: ['Custom ROI', 'Revenue', 'Cost'],
      exportCount: 2,
      shareCount: 1,
      rating: 4.7
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
      metrics: ['Market Share', 'Competitor Data'],
      exportCount: 0,
      shareCount: 0,
      rating: 0
    }
  ],
  trends: {
    reportsCreated: [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 8 },
      { date: '2024-01-03', count: 12 },
      { date: '2024-01-04', count: 6 },
      { date: '2024-01-05', count: 15 },
      { date: '2024-01-06', count: 9 },
      { date: '2024-01-07', count: 11 }
    ],
    reportsExported: [
      { date: '2024-01-01', count: 3 },
      { date: '2024-01-02', count: 7 },
      { date: '2024-01-03', count: 10 },
      { date: '2024-01-04', count: 4 },
      { date: '2024-01-05', count: 12 },
      { date: '2024-01-06', count: 6 },
      { date: '2024-01-07', count: 8 }
    ],
    analyticsUsage: [
      { date: '2024-01-01', attribution: 2, cohort: 3, predictive: 1 },
      { date: '2024-01-02', attribution: 4, cohort: 2, predictive: 0 },
      { date: '2024-01-03', attribution: 3, cohort: 5, predictive: 2 },
      { date: '2024-01-04', attribution: 1, cohort: 3, predictive: 1 },
      { date: '2024-01-05', attribution: 5, cohort: 4, predictive: 3 },
      { date: '2024-01-06', attribution: 2, cohort: 6, predictive: 1 },
      { date: '2024-01-07', attribution: 4, cohort: 3, predictive: 2 }
    ]
  },
  insights: [
    {
      type: 'success',
      title: 'Reports usage tăng',
      description: 'Số lượng reports được tạo tăng 25% so với tuần trước',
      impact: 'Hiệu quả cao hơn trong việc phân tích dữ liệu'
    },
    {
      type: 'warning',
      title: 'Analytics modules ít sử dụng',
      description: 'Các module phân tích nâng cao chưa được sử dụng nhiều',
      impact: 'Cần training và hướng dẫn thêm cho users'
    },
    {
      type: 'info',
      title: 'Template phổ biến',
      description: 'Performance Overview là template được sử dụng nhiều nhất',
      impact: 'Có thể tối ưu template này để tăng hiệu quả'
    }
  ],
  // Settings for different environments
  settings: {
    development: {
      useMockData: true,
      showEmptyStates: true,
      enableDebugMode: true
    },
    production: {
      useMockData: false,
      showEmptyStates: true,
      enableDebugMode: false
    },
    test: {
      useMockData: true,
      showEmptyStates: true,
      enableDebugMode: true
    }
  }
};

// Helper function to get mock data based on environment
export const getReportsMockData = (environment: 'development' | 'production' | 'test' = 'development') => {
  const settings = reportsMockData.settings[environment] || reportsMockData.settings.development;
  
  return {
    ...reportsMockData,
    settings,
    // Filter data based on connected channels
    getFilteredData: (dataType: keyof typeof reportsMockData) => {
      const data = reportsMockData[dataType];
      if (Array.isArray(data)) {
        return filterReportsDataByConnectedChannels(data as any[], CONNECTED_CHANNELS);
      }
      return data;
    },
    // Check if has real data
    hasRealData: (dataType: keyof typeof reportsMockData) => {
      const data = reportsMockData[dataType];
      if (Array.isArray(data)) {
        return hasRealReportsData(data as any[], CONNECTED_CHANNELS);
      }
      return false;
    }
  };
};

// Export default for backward compatibility
export default reportsMockData; 