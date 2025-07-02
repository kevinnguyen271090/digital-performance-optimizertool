import React from 'react';
import DashboardInsights from './DashboardInsights';

interface InsightsSectionProps {
  platformData: any;
  selectedChannel: string;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ platformData, selectedChannel }) => {
  return (
    <div className="w-full mb-8">
      <DashboardInsights platformData={platformData} selectedChannel={selectedChannel} />
    </div>
  );
};

export default InsightsSection; 