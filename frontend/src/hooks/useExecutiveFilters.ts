import { useState } from 'react';

export type DrilldownLevel = 'channel' | 'campaign' | 'ad_group' | 'ad';

export interface ExecutiveFilters {
  selectedChannels: string[];
  setSelectedChannels: (channels: string[]) => void;
  selectedCampaigns: string[];
  setSelectedCampaigns: (campaigns: string[]) => void;
  selectedKPIs: string[];
  setSelectedKPIs: (kpis: string[]) => void;
  drilldownLevel: DrilldownLevel;
  setDrilldownLevel: (level: DrilldownLevel) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedCampaign: string;
  setSelectedCampaign: (campaign: string) => void;
  handleClearFilters: () => void;
}

export function useExecutiveFilters(): ExecutiveFilters {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(['revenue', 'cost', 'roas', 'cpa']);
  const [drilldownLevel, setDrilldownLevel] = useState<DrilldownLevel>('channel');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const handleClearFilters = () => {
    setSelectedChannels([]);
    setSelectedCampaigns([]);
    setSelectedKPIs(['revenue', 'cost', 'roas', 'cpa']);
    setSelectedChannel('');
    setSelectedCampaign('');
    setDrilldownLevel('channel');
  };

  return {
    selectedChannels,
    setSelectedChannels,
    selectedCampaigns,
    setSelectedCampaigns,
    selectedKPIs,
    setSelectedKPIs,
    drilldownLevel,
    setDrilldownLevel,
    selectedChannel,
    setSelectedChannel,
    selectedCampaign,
    setSelectedCampaign,
    handleClearFilters
  };
} 