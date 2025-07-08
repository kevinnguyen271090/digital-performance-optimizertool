import { dataSourceConfig, shouldUseMockData, shouldUseAPI, shouldFallbackToMock } from '@/config/dataSource';
import { mockData } from '@/utils/mockData';
import { useMemo } from 'react';

// API Service
class APIService {
  private baseURL = import.meta.env.VITE_API_URL || 'https://api.example.com';
  private logCount = 0;
  private readonly MAX_LOG_COUNT = 1;
  private lastLogTime = 0;
  private readonly LOG_COOLDOWN = 10000; // 10 giây

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Giới hạn số lần log và thêm cooldown
      const now = Date.now();
      if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
        // Chỉ log lỗi thực sự, không phải lỗi network bình thường
        if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
          console.error('API Error:', error);
        }
        this.logCount++;
        this.lastLogTime = now;
      }
      throw error;
    }
  }

  // Dashboard data methods
  async getDashboardData(params: any) {
    return this.fetch('/dashboard', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getExecutiveData(params: any) {
    return this.fetch('/executive', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getChannelData(channelId: string, params: any) {
    return this.fetch(`/channels/${channelId}`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

// Mock Service
class MockService {
  async getDashboardData(params: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.dashboard;
  }

  async getExecutiveData(params: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData.executive;
  }

  async getChannelData(channelId: string, params: any) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockData.executive.channels.find((c: any) => c.id === channelId) || null;
  }
}

// Main Data Service with fallback logic
class DataService {
  private apiService = new APIService();
  private mockService = new MockService();
  private logCount = 0;
  private readonly MAX_LOG_COUNT = 1;
  private lastLogTime = 0;
  private readonly LOG_COOLDOWN = 15000; // 15 giây
  private hasLoggedAPIUnavailable = false; // Thêm flag để tránh log spam

  async getData<T>(
    method: keyof APIService,
    params: any,
    fallbackMethod?: keyof MockService,
    channelId?: string
  ): Promise<T> {
    const useMock = shouldUseMockData();
    const useAPI = shouldUseAPI();
    const fallbackToMock = shouldFallbackToMock();

    // Helper để gọi đúng signature
    const callService = (service: any, method: keyof APIService | keyof MockService) => {
      if (method === 'getChannelData' && channelId) {
        return service[method](channelId, params) as Promise<T>;
      }
      return service[method](params) as Promise<T>;
    };

    // Strategy 1: Mock only
    if (useMock && !useAPI) {
      const now = Date.now();
      if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
        console.log('Using mock data');
        this.logCount++;
        this.lastLogTime = now;
      }
      return callService(this.mockService, fallbackMethod || method);
    }

    // Strategy 2: API only
    if (useAPI && !useMock) {
      const now = Date.now();
      if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
        console.log('Using API data');
        this.logCount++;
        this.lastLogTime = now;
      }
      return callService(this.apiService, method);
    }

    // Strategy 3: Hybrid (API with fallback to mock)
    if (useAPI && useMock && fallbackToMock) {
      try {
        const now = Date.now();
        if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
          console.log('Trying API first, fallback to mock');
          this.logCount++;
          this.lastLogTime = now;
        }
        return await callService(this.apiService, method);
      } catch (error) {
        // Chỉ log một lần khi API không khả dụng
        if (!this.hasLoggedAPIUnavailable) {
          console.log('API unavailable, using mock data');
          this.hasLoggedAPIUnavailable = true;
        }
        return callService(this.mockService, fallbackMethod || method);
      }
    }

    // Strategy 4: Mock with API fallback
    if (useMock && useAPI && !fallbackToMock) {
      try {
        const now = Date.now();
        if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
          console.log('Trying mock first, fallback to API');
          this.logCount++;
          this.lastLogTime = now;
        }
        return await callService(this.mockService, fallbackMethod || method);
      } catch (error) {
        const now = Date.now();
        if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
          console.warn('Mock failed, using API data:', error);
          this.logCount++;
          this.lastLogTime = now;
        }
        return callService(this.apiService, method);
      }
    }

    // Default fallback
    const now = Date.now();
    if (this.logCount < this.MAX_LOG_COUNT && (now - this.lastLogTime) > this.LOG_COOLDOWN) {
      console.log('Using default mock data');
      this.logCount++;
      this.lastLogTime = now;
    }
    return callService(this.mockService, fallbackMethod || method);
  }

  // Convenience methods
  async getDashboardData(params: any) {
    return this.getData('getDashboardData', params);
  }

  async getExecutiveData(params: any) {
    return this.getData('getExecutiveData', params);
  }

  async getChannelData(channelId: string, params: any) {
    return this.getData('getChannelData', params, 'getChannelData', channelId);
  }
}

export const dataService = new DataService();

// Hook for React components
export const useDataService = () => {
  return useMemo(() => ({
    getDashboardData: dataService.getDashboardData.bind(dataService),
    getExecutiveData: dataService.getExecutiveData.bind(dataService),
    getChannelData: dataService.getChannelData.bind(dataService),
    config: dataSourceConfig,
  }), []); // ✅ Memo hóa để tránh tạo object mới mỗi lần render
}; 