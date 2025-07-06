import React from 'react';
import { ExecutiveFunnelCompare } from './ExecutiveFunnelCompare';
import OverlayFunnelChart from './OverlayFunnelChart';
import ConversionRateFunnelChart from './ConversionRateFunnelChart';
import CostPerStageChart from './CostPerStageChart';
import AOVBarChart from './AOVBarChart';

interface ExecutiveFunnelSectionProps {
  data: any[];
  selectedChannels?: string[];
  dateRange?: { from: Date; to: Date };
  connectedChannels?: string[];
  onConnect?: () => void;
}

const ExecutiveFunnelSection: React.FC<ExecutiveFunnelSectionProps> = ({
  data,
  selectedChannels = [],
  dateRange,
  connectedChannels = [],
  onConnect
}) => {
  return (
    <div className="space-y-6">
      {/* Funnel Chart - So sánh funnel */}
      <ExecutiveFunnelCompare 
        data={data}
        selectedChannels={selectedChannels}
        dateRange={dateRange}
        connectedChannels={connectedChannels}
        onConnect={onConnect}
      />
      {/* Overlay Funnel Chart - So sánh hình dạng funnel các kênh */}
      <OverlayFunnelChart data={data} />
      {/* Conversion Rate Funnel Chart - Tỷ lệ chuyển đổi từng bước */}
      <ConversionRateFunnelChart data={data} />
      {/* Cost Per Stage Chart - Chi phí từng giai đoạn funnel */}
      <CostPerStageChart data={data.map(c => ({...c, cost: c.cost ?? Math.round((c.revenue || 0) * 0.3)}))} />
      {/* AOV Bar Chart - Giá trị đơn hàng trung bình */}
      <AOVBarChart data={data} />
    </div>
  );
};

export default ExecutiveFunnelSection; 