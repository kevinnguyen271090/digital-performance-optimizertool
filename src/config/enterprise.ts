export interface EnterpriseConfig {
  // Performance
  performance: {
    enableMonitoring: boolean;
    slowRenderThreshold: number; // ms
    enableBundleAnalysis: boolean;
    enableLazyLoading: boolean;
  };

  // Security
  security: {
    enableCSP: boolean;
    enableXSS: boolean;
    enableCSRF: boolean;
    enableRateLimit: boolean;
    maxRequestsPerMinute: number;
  };

  // Analytics
  analytics: {
    enableTracking: boolean;
    enablePageViews: boolean;
    enableUserTracking: boolean;
    enablePerformanceTracking: boolean;
    enableErrorTracking: boolean;
  };

  // Error Handling
  errorHandling: {
    enableErrorBoundary: boolean;
    enableErrorReporting: boolean;
    enableErrorRecovery: boolean;
    maxErrorRetries: number;
  };

  // Caching
  caching: {
    enableServiceWorker: boolean;
    enableMemoryCache: boolean;
    enableLocalStorage: boolean;
    cacheExpiryTime: number; // ms
  };

  // Monitoring
  monitoring: {
    enableHealthChecks: boolean;
    enableUptimeMonitoring: boolean;
    enablePerformanceMonitoring: boolean;
    enableUserBehaviorTracking: boolean;
  };

  // API
  api: {
    baseUrl: string;
    timeout: number; // ms
    retryAttempts: number;
    enableRequestLogging: boolean;
    enableResponseCaching: boolean;
  };
}

export const ENTERPRISE_CONFIG: EnterpriseConfig = {
  performance: {
    enableMonitoring: process.env.NODE_ENV === 'production',
    slowRenderThreshold: 16, // 60fps
    enableBundleAnalysis: process.env.NODE_ENV === 'development',
    enableLazyLoading: true,
  },

  security: {
    enableCSP: true,
    enableXSS: true,
    enableCSRF: true,
    enableRateLimit: true,
    maxRequestsPerMinute: 100,
  },

  analytics: {
    enableTracking: true,
    enablePageViews: true,
    enableUserTracking: true,
    enablePerformanceTracking: true,
    enableErrorTracking: true,
  },

  errorHandling: {
    enableErrorBoundary: true,
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enableErrorRecovery: true,
    maxErrorRetries: 3,
  },

  caching: {
    enableServiceWorker: process.env.NODE_ENV === 'production',
    enableMemoryCache: true,
    enableLocalStorage: true,
    cacheExpiryTime: 24 * 60 * 60 * 1000, // 24 hours
  },

  monitoring: {
    enableHealthChecks: true,
    enableUptimeMonitoring: process.env.NODE_ENV === 'production',
    enablePerformanceMonitoring: true,
    enableUserBehaviorTracking: true,
  },

  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    enableRequestLogging: process.env.NODE_ENV === 'development',
    enableResponseCaching: true,
  },
};

// Environment-specific overrides
export const getEnterpriseConfig = (): EnterpriseConfig => {
  const config = { ...ENTERPRISE_CONFIG };

  // Development overrides
  if (process.env.NODE_ENV === 'development') {
    config.performance.enableMonitoring = true;
    config.analytics.enableTracking = false; // Disable in dev
    config.errorHandling.enableErrorReporting = false;
  }

  // Production overrides
  if (process.env.NODE_ENV === 'production') {
    config.performance.enableBundleAnalysis = false;
    config.api.enableRequestLogging = false;
  }

  return config;
}; 