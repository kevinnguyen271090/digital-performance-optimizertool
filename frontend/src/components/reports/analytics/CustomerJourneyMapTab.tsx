import React, { useMemo, useState } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { mockAttributionJourneys, buildSankeyData } from '@/utils';

// Tooltip node
const NodeTooltip = ({ node }: any) => (
  <div style={{ padding: 8, background: '#222', color: '#fff', borderRadius: 4, fontSize: 14 }}>
    <b>Kênh:</b> {node.id}
    <br />
    <b>Tổng lượt qua:</b> {node.value}
  </div>
);

const CustomerJourneyMapTab: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  
  const sankeyData = useMemo(() => {
    try {
      const data = buildSankeyData(mockAttributionJourneys);
      
      // Validate data trước khi render
      if (!data.nodes || data.nodes.length === 0) {
        throw new Error('No nodes available for Sankey chart');
      }
      
      if (!data.links || data.links.length === 0) {
        throw new Error('No links available for Sankey chart');
      }
      
      // Kiểm tra circular links
      const nodeIds = new Set(data.nodes.map(n => n.id));
      const validLinks = data.links.filter(link => 
        nodeIds.has(link.source) && 
        nodeIds.has(link.target) && 
        link.source !== link.target
      );
      
      if (validLinks.length === 0) {
        throw new Error('No valid links after filtering');
      }
      
      return { nodes: data.nodes, links: validLinks };
    } catch (err) {
      console.error('Error building Sankey data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { nodes: [], links: [] };
    }
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Lỗi Sankey Chart</h3>
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (sankeyData.nodes.length === 0 || sankeyData.links.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          Không có dữ liệu để hiển thị Customer Journey Map.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minWidth: 600 }}>
      <div className="mb-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded p-2">
        <b>Customer Journey Map:</b> Minh họa trực quan hành trình khách hàng qua các kênh/điểm chạm trước khi chuyển đổi.<br/>
        <span className="block mt-1">Biểu đồ Sankey thể hiện các bước/kênh khách hàng đi qua trước khi chuyển đổi. Di chuột vào node để xem tổng lượt qua từng kênh. Phân tích các hành trình phổ biến để phát hiện bottleneck hoặc điểm mạnh.</span>
      </div>
      <div style={{ height: 400, minWidth: 600 }}>
        <ResponsiveSankey
          data={sankeyData}
          margin={{ top: 10, right: 40, bottom: 10, left: 40 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeThickness={32}
          nodeInnerPadding={6}
          nodeBorderWidth={2}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkContract={12}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={4}
          labelTextColor={{ from: 'color', modifiers: [['darker', 2.5]] }}
          label={(node) => node.id}
          nodeTooltip={NodeTooltip}
          animate={true}
          motionConfig="gentle"
          theme={{
            labels: {
              text: {
                fontSize: 18,
                fill: '#fff',
                fontWeight: 600,
                textShadow: '0 1px 4px #000',
              },
            },
            tooltip: {
              container: {
                background: '#222',
                color: '#fff',
                fontSize: 14,
                borderRadius: 4,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default CustomerJourneyMapTab; 