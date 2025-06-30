import { useCallback, useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface PageViewEvent {
  page: string;
  title?: string;
  properties?: Record<string, any>;
}

interface UserProperties {
  userId: string;
  email?: string;
  plan?: string;
  organization?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private userId?: string;
  private userProperties?: UserProperties;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  setUser(userId: string, properties?: Partial<UserProperties>) {
    this.userId = userId;
    this.userProperties = { userId, ...properties };
    
    // TODO: Identify user in analytics service
    // Example: analytics.identify(userId, properties);
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        environment: import.meta.env.MODE
      },
      userId: this.userId,
      timestamp: Date.now()
    };

    // Development logging
    if (import.meta.env.MODE === 'development') {
      console.log('[Analytics] Track:', analyticsEvent);
    }

    // TODO: Send to analytics service
    // Example: analytics.track(event, properties);
    
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        ...properties,
        user_id: this.userId
      });
    }
  }

  pageView(page: string, title?: string, properties?: Record<string, any>) {
    const pageViewEvent: PageViewEvent = {
      page,
      title,
      properties: {
        ...properties,
        timestamp: Date.now(),
        environment: import.meta.env.MODE
      }
    };

    // Development logging
    if (import.meta.env.MODE === 'development') {
      console.log('[Analytics] Page View:', pageViewEvent);
    }

    // TODO: Send to analytics service
    // Example: analytics.page(page, properties);
    
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: page,
        page_title: title,
        ...properties
      });
    }
  }

  identify(userId: string, properties?: Record<string, any>) {
    this.setUser(userId, properties);
    
    // TODO: Send to analytics service
    // Example: analytics.identify(userId, properties);
  }
}

export const useAnalytics = () => {
  const analytics = AnalyticsService.getInstance();

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  }, [analytics]);

  const pageView = useCallback((page: string, title?: string, properties?: Record<string, any>) => {
    analytics.pageView(page, title, properties);
  }, [analytics]);

  const identify = useCallback((userId: string, properties?: Record<string, any>) => {
    analytics.identify(userId, properties);
  }, [analytics]);

  return {
    track,
    pageView,
    identify
  };
};

// Hook for automatic page tracking
export const usePageTracking = (page: string, title?: string) => {
  const { pageView } = useAnalytics();

  useEffect(() => {
    pageView(page, title);
  }, [page, title]);
}; 