import { useMemo } from 'react';
import {
  mockRFMData,
  mockBehavioralData,
  mockGeographicData,
  mockDeviceData,
  RFMData,
  BehavioralData,
  GeographicData,
  DeviceData,
} from '@/utils/mockSegmentationData';

interface UseSegmentationDataProps {
  segment?: string;
  action?: string;
  region?: string;
  platform?: string;
  week?: number;
}

export function useSegmentationData({ segment, action, region, platform, week }: UseSegmentationDataProps = {}) {
  // Lọc RFM
  const rfm = useMemo<RFMData[]>(() => {
    return mockRFMData.filter(d => !segment || d.segment === segment);
  }, [segment]);

  // Lọc behavioral
  const behavioral = useMemo<BehavioralData[]>(() => {
    return mockBehavioralData.filter(d =>
      (!segment || d.segment === segment) && (!action || d.action === action) && (!week || d.week === week)
    );
  }, [segment, action, week]);

  // Lọc geographic
  const geographic = useMemo<GeographicData[]>(() => {
    return mockGeographicData.filter(d => !region || d.region === region);
  }, [region]);

  // Lọc device/platform
  const device = useMemo<DeviceData[]>(() => {
    return mockDeviceData.filter(d => !platform || d.platform === platform);
  }, [platform]);

  return { rfm, behavioral, geographic, device };
} 