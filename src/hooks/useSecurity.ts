import { useCallback, useEffect, useState } from 'react';

interface SecurityConfig {
  enableCSP?: boolean;
  enableXSS?: boolean;
  enableCSRF?: boolean;
  enableRateLimit?: boolean;
}

interface SecurityEvent {
  type: 'xss' | 'csrf' | 'injection' | 'rate_limit' | 'unauthorized';
  details: string;
  timestamp: number;
  userId?: string;
  ip?: string;
}

class SecurityService {
  private static instance: SecurityService;
  private events: SecurityEvent[] = [];
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // XSS Protection
  sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // CSRF Protection
  validateCSRFToken(token: string): boolean {
    // TODO: Implement CSRF token validation
    return true;
  }

  // Rate Limiting
  checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      this.logSecurityEvent('rate_limit', `Rate limit exceeded for key: ${key}`);
      return false;
    }

    record.count++;
    return true;
  }

  // Input Validation
  validateInput(input: any, rules: Record<string, any>): boolean {
    // TODO: Implement comprehensive input validation
    return true;
  }

  // Security Event Logging
  logSecurityEvent(type: SecurityEvent['type'], details: string, userId?: string) {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: Date.now(),
      userId
    };

    this.events.push(event);

    // Development logging
    if (import.meta.env.MODE === 'development') {
      console.warn('[Security] Event:', event);
    }

    // TODO: Send to security monitoring service
    // Example: securityService.report(event);
  }

  // Get security events
  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  // Clear old events
  clearOldEvents(maxAge: number) {
    const now = Date.now();
    this.events = this.events.filter(event => now - event.timestamp < maxAge);
  }
}

export const useSecurity = (config?: SecurityConfig) => {
  const [securityService] = useState(() => SecurityService.getInstance());

  const sanitizeInput = useCallback((input: string): string => {
    return securityService.sanitizeInput(input);
  }, [securityService]);

  const validateCSRFToken = useCallback((token: string): boolean => {
    return securityService.validateCSRFToken(token);
  }, [securityService]);

  const checkRateLimit = useCallback((key: string, limit: number, windowMs: number): boolean => {
    return securityService.checkRateLimit(key, limit, windowMs);
  }, [securityService]);

  const validateInput = useCallback((input: any, rules: Record<string, any>): boolean => {
    return securityService.validateInput(input, rules);
  }, [securityService]);

  const logSecurityEvent = useCallback((type: SecurityEvent['type'], details: string, userId?: string) => {
    securityService.logSecurityEvent(type, details, userId);
  }, [securityService]);

  // Auto-cleanup old events
  useEffect(() => {
    const interval = setInterval(() => {
      securityService.clearOldEvents(24 * 60 * 60 * 1000); // 24 hours
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [securityService]);

  return {
    sanitizeInput,
    validateCSRFToken,
    checkRateLimit,
    validateInput,
    logSecurityEvent,
    getEvents: () => securityService.getEvents()
  };
}; 