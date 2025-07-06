import { useState, useEffect, useCallback, useRef } from 'react';
import { useDataService } from '@/services/dataService';
import { dataSourceConfig } from '@/config/dataSource';

interface DashboardData {
  overview: any;
  channels: any[];
  trends: any[];
}

interface UseDashboardDataProps {
  dateRange?: { from: Date; to: Date };
  selectedChannels?: string[];
}

export const useDashboardData = ({ dateRange, selectedChannels }: UseDashboardDataProps = {}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'mock' | 'api' | 'hybrid'>('mock');
  
  // Cache để tránh fetch lặp lại
  const cacheKey = useRef<string>('');
  const isInitialized = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getDashboardData } = useDataService();

  const fetchData = useCallback(async () => {
    try {
      // Tạo cache key từ dependency
      const newCacheKey = JSON.stringify({ dateRange, selectedChannels });
      
      // Nếu cache key giống nhau và đã có data, không fetch lại
      if (cacheKey.current === newCacheKey && data && isInitialized.current) {
        return;
      }
      
      // Clear timeout cũ nếu có
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      setLoading(true);
      setError(null);
      cacheKey.current = newCacheKey;

      const params = {
        dateRange,
        selectedChannels,
        ...dataSourceConfig
      };

      const result = await getDashboardData(params);
      setData(result as DashboardData);
      setDataSource(dataSourceConfig.mode);
      isInitialized.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getDashboardData, dateRange, selectedChannels]);

  useEffect(() => {
    // Debounce fetch để tránh gọi quá nhiều
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData();
    }, 100);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    cacheKey.current = ''; // Reset cache để force fetch
    isInitialized.current = false;
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    dataSource,
    refetch,
    config: dataSourceConfig
  };
}; 