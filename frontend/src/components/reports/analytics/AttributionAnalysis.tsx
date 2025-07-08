import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Download,
  Share2,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface AttributionModel {
  id: string;
  name: string;
  description: string;
  revenue: number;
  conversions: number;
  cpa: number;
  accuracy: number;
  color: string;
}

interface CustomerJourney {
  id: string;
  path: string[];
  touchpoints: number;
  conversionRate: number;
  avgTime: number;
  revenue: number;
}

interface AttributionAnalysisProps {
  dateRange: { from: Date; to: Date };
  selectedChannels: string[];
}

const AttributionAnalysis: React.FC<AttributionAnalysisProps> = ({ 
  dateRange, 
  selectedChannels 
}) => {
  const [activeModel, setActiveModel] = useState<string>('linear');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attribution Analysis</h2>
          <p className="text-gray-600 mt-1">
            Multi-touch attribution and customer journey mapping
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attribution Model
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
              >
                <option value="linear">Linear Attribution</option>
                <option value="time-decay">Time Decay</option>
                <option value="first-click">First Click</option>
                <option value="last-click">Last Click</option>
                <option value="position-based">Position Based</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channels
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                {selectedChannels.join(', ')}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </Button>
            <Button variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attribution Models Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attribution Models Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attributionModels.map((model) => (
                <div 
                  key={model.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    activeModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveModel(model.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{model.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${model.color}`}>
                      {model.accuracy}% accuracy
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-medium">${(model.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-medium">{model.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">CPA</p>
                      <p className="font-medium">${model.cpa}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Attribution by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelAttribution.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${channel.color}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{channel.name}</p>
                      <p className="text-sm text-gray-500">{channel.touchpoints} touchpoints</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${(channel.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-500">{channel.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Journey Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerJourneys.map((journey) => (
              <div 
                key={journey.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJourney === journey.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedJourney(journey.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Journey {journey.id}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{journey.touchpoints} touchpoints</span>
                    <span className="text-gray-500">{journey.avgTime} days avg</span>
                    <span className="font-medium text-green-600">{journey.conversionRate}% conversion</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {journey.path.map((step, index) => (
                    <React.Fragment key={index}>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {step}
                      </span>
                      {index < journey.path.length - 1 && (
                        <span className="text-gray-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Revenue: ${(journey.revenue / 1000).toFixed(0)}K</span>
                  <span className="text-gray-500">Frequency: {journey.touchpoints} interactions</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Paths Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Conversion Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topConversionPaths.map((path, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      {path.path.map((step, stepIndex) => (
                        <React.Fragment key={stepIndex}>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {step}
                          </span>
                          {stepIndex < path.path.length - 1 && (
                            <span className="text-gray-400 text-xs">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{path.conversions} conversions</p>
                    <p className="text-sm text-gray-500">{path.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attribution Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attributionInsights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${insight.type === 'success' ? 'bg-green-500' : insight.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{insight.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock Data
const attributionModels: AttributionModel[] = [
  {
    id: 'linear',
    name: 'Linear Attribution',
    description: 'Equal credit to all touchpoints in the conversion path',
    revenue: 25000000,
    conversions: 1200,
    cpa: 45000,
    accuracy: 85,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'time-decay',
    name: 'Time Decay',
    description: 'More credit to touchpoints closer to conversion',
    revenue: 28000000,
    conversions: 1350,
    cpa: 42000,
    accuracy: 88,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'first-click',
    name: 'First Click',
    description: 'Full credit to the first touchpoint',
    revenue: 22000000,
    conversions: 1100,
    cpa: 48000,
    accuracy: 75,
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 'last-click',
    name: 'Last Click',
    description: 'Full credit to the last touchpoint before conversion',
    revenue: 30000000,
    conversions: 1500,
    cpa: 40000,
    accuracy: 82,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'position-based',
    name: 'Position Based',
    description: '40% first, 20% middle, 40% last touchpoint',
    revenue: 26000000,
    conversions: 1250,
    cpa: 44000,
    accuracy: 87,
    color: 'bg-indigo-100 text-indigo-700'
  }
];

const channelAttribution = [
  { id: 'facebook', name: 'Facebook Ads', revenue: 12000000, percentage: 48, touchpoints: 850, color: 'bg-blue-500' },
  { id: 'google', name: 'Google Ads', revenue: 8000000, percentage: 32, touchpoints: 650, color: 'bg-red-500' },
  { id: 'tiktok', name: 'TikTok Ads', revenue: 3000000, percentage: 12, touchpoints: 250, color: 'bg-pink-500' },
  { id: 'email', name: 'Email Marketing', revenue: 2000000, percentage: 8, touchpoints: 150, color: 'bg-green-500' }
];

const customerJourneys: CustomerJourney[] = [
  {
    id: '1',
    path: ['Facebook', 'Google', 'Direct'],
    touchpoints: 3,
    conversionRate: 2.5,
    avgTime: 7,
    revenue: 150000
  },
  {
    id: '2',
    path: ['Google', 'Facebook', 'Email', 'Direct'],
    touchpoints: 4,
    conversionRate: 3.2,
    avgTime: 12,
    revenue: 200000
  },
  {
    id: '3',
    path: ['TikTok', 'Facebook', 'Direct'],
    touchpoints: 3,
    conversionRate: 1.8,
    avgTime: 5,
    revenue: 120000
  },
  {
    id: '4',
    path: ['Email', 'Google', 'Facebook', 'Direct'],
    touchpoints: 4,
    conversionRate: 4.1,
    avgTime: 15,
    revenue: 250000
  }
];

const topConversionPaths = [
  { path: ['Facebook', 'Google', 'Direct'], conversions: 450, percentage: 30 },
  { path: ['Google', 'Facebook', 'Direct'], conversions: 380, percentage: 25 },
  { path: ['TikTok', 'Facebook', 'Direct'], conversions: 280, percentage: 19 },
  { path: ['Email', 'Google', 'Direct'], conversions: 220, percentage: 15 },
  { path: ['Facebook', 'Direct'], conversions: 150, percentage: 10 }
];

const attributionInsights = [
  {
    type: 'success',
    title: 'Facebook drives awareness',
    description: 'Facebook is the top first-touch channel, driving 65% of initial awareness',
    impact: 'Consider increasing Facebook budget for top-of-funnel campaigns'
  },
  {
    type: 'warning',
    title: 'Long conversion paths',
    description: 'Average conversion path is 3.2 touchpoints, indicating complex customer journey',
    impact: 'Optimize for multi-touch attribution and cross-channel coordination'
  },
  {
    type: 'info',
    title: 'Email effectiveness',
    description: 'Email has the highest conversion rate (4.1%) despite lower volume',
    impact: 'Focus on email list growth and segmentation'
  }
];

export default AttributionAnalysis; 