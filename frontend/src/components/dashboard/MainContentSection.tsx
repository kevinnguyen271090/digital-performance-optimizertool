import React from 'react';
import DashboardContent from './DashboardContent';
import DashboardKPIs from './DashboardKPIs';

interface MainContentSectionProps {
  platformData: any;
  currentView: string;
  connectedPlatforms: any[];
  hasConnectedPlatforms: boolean;
  selectedAccounts: any;
  executiveData: any;
  channelDetailData: any;
  dateRangeString: string;
  kpiData: any[];
  compareChannels: any[];
}

const MainContentSection: React.FC<MainContentSectionProps> = ({
  platformData,
  currentView,
  connectedPlatforms,
  hasConnectedPlatforms,
  selectedAccounts,
  executiveData,
  channelDetailData,
  dateRangeString,
  kpiData,
  compareChannels
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 w-full mb-8">
      {/* <div className="xl:col-span-2 w-full"> */}
        <DashboardContent 
          platformData={platformData}
          currentView={currentView}
          connectedPlatforms={connectedPlatforms}
          hasConnectedPlatforms={hasConnectedPlatforms}
          selectedAccounts={selectedAccounts}
          onAccountSelectionChange={() => {}}
          executiveData={executiveData}
          channelDetailData={channelDetailData}
          dateRangeString={dateRangeString}
        />
      {/* </div> */}
      <div className="w-full space-y-6">
        <DashboardKPIs kpis={kpiData} compareChannels={compareChannels} />
      </div>
    </div>
  );
};

export default MainContentSection; 