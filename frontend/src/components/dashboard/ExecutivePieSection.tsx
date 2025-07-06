import React from 'react';
import { ExecutivePieCompare } from './ExecutivePieCompare';

interface ExecutivePieSectionProps {
  data: any[];
  selectedChannels?: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
  onConnect?: () => void;
}

const ExecutivePieSection: React.FC<ExecutivePieSectionProps> = ({
  data,
  selectedChannels = [],
  dateRange,
  connectedChannels = [],
  onConnect
}) => {
  return (
    <div className="space-y-6">
      {/* Pie Chart - Phân bổ doanh thu/chi phí */}
      <ExecutivePieCompare 
        data={data}
        selectedChannels={selectedChannels}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
        onConnect={onConnect}
      />
    </div>
  );
};

export default ExecutivePieSection; 