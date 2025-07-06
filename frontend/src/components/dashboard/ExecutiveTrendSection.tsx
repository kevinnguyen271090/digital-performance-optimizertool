import React from 'react';
import { ExecutiveTrendChart } from './ExecutiveTrendChart';

interface ExecutiveTrendSectionProps {
  data: any[];
  selectedKPIs?: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
}

const ExecutiveTrendSection: React.FC<ExecutiveTrendSectionProps> = ({
  data,
  selectedKPIs = ['revenue'],
  dateRange,
  connectedChannels = []
}) => {
  return (
    <div className="space-y-6">
      {/* Trend Chart - So sánh trend */}
      <ExecutiveTrendChart 
        data={data}
        selectedKPIs={selectedKPIs}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
      />
    </div>
  );
};

export default ExecutiveTrendSection; 