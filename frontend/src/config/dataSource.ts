export type DataSource = 'mock' | 'api' | 'hybrid';

export interface DataSourceConfig {
  mode: DataSource;
  mockDataEnabled: boolean;
  apiEnabled: boolean;
  fallbackToMock: boolean;
}

// Environment-based configuration
const getDataSourceConfig = (): DataSourceConfig => {
  const env = import.meta.env.MODE;
  const dataSource = import.meta.env.VITE_DATA_SOURCE as DataSource;
  
  switch (env) {
    case 'development':
      return {
        mode: dataSource || 'mock',
        mockDataEnabled: true,
        apiEnabled: dataSource === 'api' || dataSource === 'hybrid',
        fallbackToMock: true
      };
    
    case 'test':
      return {
        mode: 'mock',
        mockDataEnabled: true,
        apiEnabled: false,
        fallbackToMock: false
      };
    
    case 'production':
      return {
        mode: dataSource || 'api',
        mockDataEnabled: dataSource === 'mock' || dataSource === 'hybrid',
        apiEnabled: true,
        fallbackToMock: dataSource === 'hybrid'
      };
    
    default:
      return {
        mode: 'mock',
        mockDataEnabled: true,
        apiEnabled: false,
        fallbackToMock: false
      };
  }
};

export const dataSourceConfig = getDataSourceConfig();

// Helper functions
export const shouldUseMockData = (): boolean => {
  return dataSourceConfig.mockDataEnabled;
};

export const shouldUseAPI = (): boolean => {
  return dataSourceConfig.apiEnabled;
};

export const shouldFallbackToMock = (): boolean => {
  return dataSourceConfig.fallbackToMock;
};

// Data source selector
export const getDataSource = () => {
  return dataSourceConfig.mode;
}; 