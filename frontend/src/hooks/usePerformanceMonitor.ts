import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  threshold?: number; // ms
  onSlowRender?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitor = ({
  componentName,
  enabled = import.meta.env.MODE === 'development',
  threshold = 16, // 60fps = 16ms
  onSlowRender
}: UsePerformanceMonitorOptions) => {
  const metricsRef = useRef<PerformanceMetrics>({
    componentName,
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdate: 0
  });

  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(false);

  const logPerformance = useCallback((action: 'mount' | 'update' | 'unmount') => {
    if (!enabled) return;

    const now = performance.now();
    const renderTime = now - startTimeRef.current;

    if (action === 'mount') {
      metricsRef.current.mountTime = renderTime;
      metricsRef.current.lastUpdate = now;
      isMountedRef.current = true;
    } else if (action === 'update' && isMountedRef.current) {
      metricsRef.current.updateCount++;
      metricsRef.current.renderTime = renderTime;
      metricsRef.current.lastUpdate = now;

      // Check if render is slow
      if (renderTime > threshold && onSlowRender) {
        onSlowRender(metricsRef.current);
      }
    } else if (action === 'unmount') {
      isMountedRef.current = false;
    }

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.log(`[Performance] ${componentName} ${action}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        isSlow: renderTime > threshold
      });
    }

    // TODO: Send to analytics service in production
    if (import.meta.env.MODE === 'production') {
      // Example: analytics.track('component_performance', metricsRef.current);
    }
  }, [componentName, enabled, threshold, onSlowRender]);

  // Mount effect - chỉ chạy một lần
  useEffect(() => {
    startTimeRef.current = performance.now();
    logPerformance('mount');

    return () => {
      logPerformance('unmount');
    };
  }, []); // Empty dependency array

  // Update effect - chỉ chạy khi component update
  useEffect(() => {
    if (isMountedRef.current && metricsRef.current.updateCount > 0) {
      startTimeRef.current = performance.now();
      logPerformance('update');
    }
  }); // Không có dependency array để tránh vòng lặp

  return {
    metrics: metricsRef.current,
    logCustomEvent: (eventName: string, data?: any) => {
      if (enabled) {
        console.log(`[Performance] ${componentName} ${eventName}:`, data);
      }
    }
  };
}; 