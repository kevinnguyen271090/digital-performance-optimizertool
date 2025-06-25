// Performance Types
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

export interface PerformanceConfig {
  enableMonitoring: boolean;
  slowRenderThreshold: number;
  enableBundleAnalysis: boolean;
  enableLazyLoading: boolean;
}

// Security Types
export interface SecurityEvent {
  type: 'xss' | 'csrf' | 'injection' | 'rate_limit' | 'unauthorized';
  details: string;
  timestamp: number;
  userId?: string;
  ip?: string;
}

export interface SecurityConfig {
  enableCSP: boolean;
  enableXSS: boolean;
  enableCSRF: boolean;
  enableRateLimit: boolean;
  maxRequestsPerMinute: number;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface PageViewEvent {
  page: string;
  title?: string;
  properties?: Record<string, any>;
}

export interface UserProperties {
  userId: string;
  email?: string;
  plan?: string;
  organization?: string;
}

export interface AnalyticsConfig {
  enableTracking: boolean;
  enablePageViews: boolean;
  enableUserTracking: boolean;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
}

// Error Handling Types
export interface ErrorConfig {
  enableErrorBoundary: boolean;
  enableErrorReporting: boolean;
  enableErrorRecovery: boolean;
  maxErrorRetries: number;
}

// Caching Types
export interface CacheConfig {
  enableServiceWorker: boolean;
  enableMemoryCache: boolean;
  enableLocalStorage: boolean;
  cacheExpiryTime: number;
}

// Monitoring Types
export interface MonitoringConfig {
  enableHealthChecks: boolean;
  enableUptimeMonitoring: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserBehaviorTracking: boolean;
}

// API Types
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableRequestLogging: boolean;
  enableResponseCaching: boolean;
}

// Enterprise Configuration
export interface EnterpriseConfig {
  performance: PerformanceConfig;
  security: SecurityConfig;
  analytics: AnalyticsConfig;
  errorHandling: ErrorConfig;
  caching: CacheConfig;
  monitoring: MonitoringConfig;
  api: ApiConfig;
}

// Service Worker Types
export interface ServiceWorkerConfig {
  cacheName: string;
  staticCache: string;
  dynamicCache: string;
  staticFiles: string[];
}

// Health Check Types
export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  timestamp: number;
  checks: {
    database: boolean;
    api: boolean;
    cache: boolean;
    memory: boolean;
  };
  metrics: {
    memoryUsage: number;
    responseTime: number;
    errorRate: number;
  };
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  timestamp: number;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

// Rate Limiting Types
export interface RateLimitInfo {
  key: string;
  count: number;
  limit: number;
  resetTime: number;
  windowMs: number;
}

// Feature Flags
export interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableAITools: boolean;
  enableTeamCollaboration: boolean;
  enableCustomReports: boolean;
  enableDataExport: boolean;
  enableRealTimeSync: boolean;
}

// Enterprise User Types
export interface EnterpriseUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  organization: string;
  permissions: string[];
  plan: 'basic' | 'professional' | 'enterprise';
  lastLogin: number;
  isActive: boolean;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'professional' | 'enterprise';
  memberCount: number;
  createdAt: number;
  settings: {
    timezone: string;
    currency: string;
    language: string;
    features: FeatureFlags;
  };
}

// Compliance Types
export interface ComplianceConfig {
  gdpr: {
    enabled: boolean;
    dataRetentionDays: number;
    allowDataExport: boolean;
    requireConsent: boolean;
  };
  sox: {
    enabled: boolean;
    auditTrail: boolean;
    dataEncryption: boolean;
  };
  hipaa: {
    enabled: boolean;
    phiProtection: boolean;
    accessLogging: boolean;
  };
} 