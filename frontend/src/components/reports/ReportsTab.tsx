import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Globe, 
  Activity,
  Plus,
  Save,
  Download,
  Share2
} from 'lucide-react';
import CustomReportsSection from './CustomReportsSection';
import AdvancedAnalyticsSection from './AdvancedAnalyticsSection';
import SavedReportsSection from './SavedReportsSection';

interface ReportsTabProps {
  dateRange: { from: Date; to: Date };
  selectedChannels: string[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ dateRange, selectedChannels }) => {
  const [activeTab, setActiveTab] = useState('custom');

  const handleReportCreated = (report: any) => {
    console.log('Report created:', report);
    // Có thể thêm logic lưu report vào localStorage hoặc gọi API
  };

  const handleModuleSelected = (moduleId: string) => {
    console.log('Analytics module selected:', moduleId);
    // Có thể thêm logic để mở module analytics cụ thể
  };

  const handleReportView = (report: any) => {
    console.log('View report:', report);
    // Có thể thêm logic để xem report
  };

  const handleReportEdit = (report: any) => {
    console.log('Edit report:', report);
    // Có thể thêm logic để edit report
  };

  const handleReportDelete = (reportId: string) => {
    console.log('Delete report:', reportId);
    // Có thể thêm logic để xóa report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">
            Create custom reports and access advanced analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Advanced Analytics
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Saved Reports
          </TabsTrigger>
        </TabsList>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <CustomReportsSection onReportCreated={handleReportCreated} />
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedAnalyticsSection onModuleSelected={handleModuleSelected} />
        </TabsContent>

        {/* Saved Reports Tab */}
        <TabsContent value="saved" className="space-y-6">
          <SavedReportsSection 
            onReportView={handleReportView}
            onReportEdit={handleReportEdit}
            onReportDelete={handleReportDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsTab; 