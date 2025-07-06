import { useState, useMemo } from 'react';
import { CONNECTED_CHANNELS, filterDataByConnectedChannels, hasRealData } from '@/utils/mockData';

interface UseConnectedChannelsProps {
  initialConnectedChannels?: string[];
}

export const useConnectedChannels = ({ 
  initialConnectedChannels = CONNECTED_CHANNELS 
}: UseConnectedChannelsProps = {}) => {
  const [connectedChannels, setConnectedChannels] = useState<string[]>(initialConnectedChannels);

  // Helper function để filter data theo connectedChannels
  const filterData = useMemo(() => {
    return <T extends { id: string }>(data: T[]) => {
      return filterDataByConnectedChannels(data, connectedChannels);
    };
  }, [connectedChannels]);

  // Helper function để kiểm tra có dữ liệu thật không
  const checkHasRealData = useMemo(() => {
    return <T extends { id: string }>(data: T[]) => {
      return hasRealData(data, connectedChannels);
    };
  }, [connectedChannels]);

  // Helper function để tạo zero data cho kênh chưa kết nối
  const createZeroData = useMemo(() => {
    return <T extends { id: string }>(template: T) => {
      return {
        ...template,
        ...Object.keys(template).reduce((acc, key) => {
          if (key !== 'id' && key !== 'name' && typeof template[key as keyof T] === 'number') {
            acc[key as keyof T] = 0 as any;
          }
          return acc;
        }, {} as Partial<T>)
      };
    };
  }, []);

  // Helper function để kiểm tra kênh có được kết nối không
  const isChannelConnected = useMemo(() => {
    return (channelId: string) => {
      return connectedChannels.includes(channelId);
    };
  }, [connectedChannels]);

  // Helper function để thêm kênh kết nối
  const addConnectedChannel = (channelId: string) => {
    if (!connectedChannels.includes(channelId)) {
      setConnectedChannels(prev => [...prev, channelId]);
    }
  };

  // Helper function để xóa kênh kết nối
  const removeConnectedChannel = (channelId: string) => {
    setConnectedChannels(prev => prev.filter(id => id !== channelId));
  };

  // Helper function để cập nhật danh sách kênh kết nối
  const updateConnectedChannels = (channels: string[]) => {
    setConnectedChannels(channels);
  };

  return {
    connectedChannels,
    filterData,
    checkHasRealData,
    createZeroData,
    isChannelConnected,
    addConnectedChannel,
    removeConnectedChannel,
    updateConnectedChannels,
    setConnectedChannels
  };
}; 