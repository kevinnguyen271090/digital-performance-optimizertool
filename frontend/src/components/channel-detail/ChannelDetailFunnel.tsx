import React from 'react';

interface ChannelDetailFunnelProps {
  funnel?: {
    traffic: number;
    leads: number;
    qualifiedLeads: number;
    orders: number;
    revenue: number;
  };
}

const ChannelDetailFunnel: React.FC<ChannelDetailFunnelProps> = ({
  funnel
}) => {
  if (!funnel) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversion Funnel
        </h3>
        <div className="text-center py-8 text-gray-500">
          Funnel data not available
        </div>
      </div>
    );
  }

  const funnelSteps = [
    { name: 'Traffic', value: funnel.traffic, color: '#3B82F6' },
    { name: 'Leads', value: funnel.leads, color: '#10B981' },
    { name: 'Qualified Leads', value: funnel.qualifiedLeads, color: '#F59E0B' },
    { name: 'Orders', value: funnel.orders, color: '#EF4444' },
    { name: 'Revenue', value: funnel.revenue, color: '#8B5CF6' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Conversion Funnel
      </h3>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
        <div className="space-y-4">
          {funnelSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: step.color }}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{step.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{step.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      backgroundColor: step.color, 
                      width: `${(step.value / funnel.traffic) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailFunnel; 