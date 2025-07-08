import React, { useState } from 'react';
import MultiTouchAttributionTab from './MultiTouchAttributionTab';
import CustomerJourneyMapTab from './CustomerJourneyMapTab';
import AttributionModelsTab from './AttributionModelsTab';
import CrossChannelAttributionTab from './CrossChannelAttributionTab';

const TABS = [
  { key: 'multi-touch', label: 'Multi-touch Attribution' },
  { key: 'journey-map', label: 'Customer Journey Map' },
  { key: 'models', label: 'Attribution Models' },
  { key: 'cross-channel', label: 'Cross-channel Revenue' },
];

const AttributionAnalysisTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('multi-touch');

  return (
    <div>
      <div className="flex gap-2 mb-4 border-b">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {activeTab === 'multi-touch' && <MultiTouchAttributionTab />}
        {activeTab === 'journey-map' && <CustomerJourneyMapTab />}
        {activeTab === 'models' && <AttributionModelsTab />}
        {activeTab === 'cross-channel' && <CrossChannelAttributionTab />}
      </div>
    </div>
  );
};

export default AttributionAnalysisTabs; 