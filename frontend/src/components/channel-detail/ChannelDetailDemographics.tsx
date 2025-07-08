import React from 'react';

interface ChannelDetailDemographicsProps {
  demographics?: {
    ageGroups: Array<{ age: string; percentage: number }>;
    genders: Array<{ gender: string; percentage: number }>;
    locations: Array<{ location: string; percentage: number }>;
    devices: Array<{ device: string; percentage: number }>;
  };
}

const ChannelDetailDemographics: React.FC<ChannelDetailDemographicsProps> = ({
  demographics
}) => {
  if (!demographics) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Demographics & Audience
        </h3>
        <div className="text-center py-8 text-gray-500">
          Demographics data not available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Demographics & Audience
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Age Groups</h4>
          <div className="space-y-2">
            {demographics.ageGroups.map((age, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{age.age}</span>
                <span className="text-sm font-medium">{age.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Genders */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Gender Distribution</h4>
          <div className="space-y-2">
            {demographics.genders.map((gender, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{gender.gender}</span>
                <span className="text-sm font-medium">{gender.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Top Locations</h4>
          <div className="space-y-2">
            {demographics.locations.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{location.location}</span>
                <span className="text-sm font-medium">{location.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Device Types</h4>
          <div className="space-y-2">
            {demographics.devices.map((device, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{device.device}</span>
                <span className="text-sm font-medium">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailDemographics; 