import React, { useEffect, useCallback, useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useAnalytics, usePageTracking } from '../hooks/useAnalytics';
import { useSecurity } from '../hooks/useSecurity';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { getEnterpriseConfig } from '../config/enterprise';

interface EnterpriseAppProps {
  children: React.ReactNode;
  pageName?: string;
  pageTitle?: string;
}

const EnterpriseApp: React.FC<EnterpriseAppProps> = ({ 
  children, 
  pageName = 'unknown',
  pageTitle 
}) => {
  const config = useMemo(() => getEnterpriseConfig(), []);
  const { track, identify } = useAnalytics();
  const { sanitizeInput, checkRateLimit, logSecurityEvent } = useSecurity(config.security);
  
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'EnterpriseApp',
    enabled: config.performance.enableMonitoring,
    threshold: config.performance.slowRenderThreshold,
    onSlowRender: useCallback((metrics: any) => {
      track('performance_slow_render', {
        component: metrics.componentName,
        renderTime: metrics.renderTime,
        threshold: config.performance.slowRenderThreshold
      });
    }, [track, config.performance.slowRenderThreshold])
  });

  // Page tracking
  usePageTracking(pageName, pageTitle);

  // Health check callback - di chuyển ra ngoài useEffect
  const healthCheck = useCallback(() => {
    track('health_check', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      performance: {
        memory: (performance as any).memory,
        timing: performance.timing
      }
    });
  }, [track]);

  // Security monitoring
  useEffect(() => {
    // Monitor for potential XSS attacks
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTML && originalInnerHTML.set) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value: string) {
          const sanitized = sanitizeInput(value);
          originalInnerHTML.set!.call(this, sanitized);
        },
        get: originalInnerHTML.get,
        configurable: true
      });
    }

    return () => {
      if (originalInnerHTML) {
        Object.defineProperty(Element.prototype, 'innerHTML', originalInnerHTML);
      }
    };
  }, [sanitizeInput]);

  // Rate limiting for API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Check rate limit
      if (!checkRateLimit(`api_${url}`, config.security.maxRequestsPerMinute, 60000)) {
        logSecurityEvent('rate_limit', `API rate limit exceeded for ${url}`);
        throw new Error('Rate limit exceeded');
      }

      try {
        const response = await originalFetch(input, init);
        
        // Track API performance
        if (config.analytics.enablePerformanceTracking) {
          track('api_call', {
            url,
            method: init?.method || 'GET',
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        // Track API errors
        if (config.analytics.enableErrorTracking) {
          track('api_error', {
            url,
            method: init?.method || 'GET',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [checkRateLimit, logSecurityEvent, track, config]);

  // Health check
  useEffect(() => {
    if (config.monitoring.enableHealthChecks) {
      const interval = setInterval(healthCheck, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [healthCheck, config.monitoring.enableHealthChecks]);

  // User identification
  useEffect(() => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (userId && config.analytics.enableUserTracking) {
      identify(userId, {
        email: localStorage.getItem('userEmail'),
        plan: localStorage.getItem('userPlan'),
        organization: localStorage.getItem('userOrganization')
      });
    }
  }, [identify, config.analytics.enableUserTracking]);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default EnterpriseApp; 