import React from 'react';

interface ChannelSubTabsProps {
  channels: { key: string; label: string; icon?: React.ReactNode }[];
  activeChannel: string;
  onChange: (key: string) => void;
}

const ChannelSubTabs: React.FC<ChannelSubTabsProps> = ({ channels, activeChannel, onChange }) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-6">
      <div className="flex space-x-2 min-w-max">
        {channels.map((ch) => (
          <button
            key={ch.key}
            onClick={() => onChange(ch.key)}
            className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-200 shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-accent/50 whitespace-nowrap
              ${activeChannel === ch.key
                ? 'bg-accent text-white border-accent scale-105 shadow-lg'
                : 'bg-white dark:bg-gray-800 text-black dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-accent/10'}
            `}
            style={{ minWidth: 120 }}
          >
            {ch.icon && <span className="mr-2 align-middle">{ch.icon}</span>}
            <span className="align-middle">{ch.label}</span>
          </button>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChannelSubTabs; 