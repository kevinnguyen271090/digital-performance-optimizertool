import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

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

interface SecurityState {
  twoFactorEnabled: boolean;
  lastPasswordChange: string | null;
  loginHistory: Array<{
    timestamp: string;
    ip: string;
    device: string;
    location: string;
  }>;
}

interface UseSecurityReturn {
  securityState: SecurityState;
  loading: boolean;
  message: string;
  messageType: 'success' | 'error';
  
  // Password management
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // 2FA management
  setup2FA: () => Promise<{ qrCode: string; backupCodes: string[] } | null>;
  verify2FA: (code: string) => Promise<boolean>;
  disable2FA: () => Promise<boolean>;
  
  // Security monitoring
  getLoginHistory: () => Promise<void>;
  clearMessage: () => void;
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

export const useSecurity = (): UseSecurityReturn => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    twoFactorEnabled: false,
    lastPasswordChange: null,
    loginHistory: []
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setMessage('');

    try {
      // Validate current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword
      });

      if (signInError) {
        setMessage('Mật khẩu hiện tại không đúng');
        setMessageType('error');
        return false;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setMessage('Lỗi thay đổi mật khẩu: ' + error.message);
        setMessageType('error');
        return false;
      }

      setMessage('Mật khẩu đã được thay đổi thành công!');
      setMessageType('success');
      setSecurityState(prev => ({
        ...prev,
        lastPasswordChange: new Date().toISOString()
      }));
      return true;
    } catch (error: any) {
      setMessage('Lỗi thay đổi mật khẩu: ' + error.message);
      setMessageType('error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setup2FA = useCallback(async (): Promise<{ qrCode: string; backupCodes: string[] } | null> => {
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement actual 2FA setup with Supabase
      // This would typically involve:
      // 1. Call Supabase function to generate TOTP secret
      // 2. Generate QR code for authenticator app
      // 3. Generate backup codes
      
      // Mock implementation for now
      const qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const backupCodes = [
        '12345678',
        '87654321', 
        '11111111',
        '22222222',
        '33333333',
        '44444444',
        '55555555',
        '66666666'
      ];

      setMessage('Quét mã QR bằng ứng dụng xác thực của bạn');
      setMessageType('success');
      
      return { qrCode, backupCodes };
    } catch (error: any) {
      setMessage('Lỗi thiết lập 2FA: ' + error.message);
      setMessageType('error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verify2FA = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement actual 2FA verification with Supabase
      // This would typically involve:
      // 1. Call Supabase function to verify TOTP code
      // 2. Enable 2FA for the user if verification succeeds
      
      // Mock verification for now
      if (code === '123456') {
        setSecurityState(prev => ({
          ...prev,
          twoFactorEnabled: true
        }));
        setMessage('2FA đã được kích hoạt thành công!');
        setMessageType('success');
        return true;
      } else {
        setMessage('Mã xác thực không đúng');
        setMessageType('error');
        return false;
      }
    } catch (error: any) {
      setMessage('Lỗi xác thực: ' + error.message);
      setMessageType('error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disable2FA = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement actual 2FA disable with Supabase
      // This would typically involve:
      // 1. Call Supabase function to disable 2FA
      // 2. Remove TOTP secret from user profile
      
      setSecurityState(prev => ({
        ...prev,
        twoFactorEnabled: false
      }));
      setMessage('2FA đã được tắt thành công!');
      setMessageType('success');
      return true;
    } catch (error: any) {
      setMessage('Lỗi tắt 2FA: ' + error.message);
      setMessageType('error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLoginHistory = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      // TODO: Implement actual login history retrieval
      // This would typically involve:
      // 1. Call Supabase function to get login history
      // 2. Parse and format the data
      
      // Mock data for now
      const mockHistory = [
        {
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          device: 'Chrome on Windows',
          location: 'Ho Chi Minh City, Vietnam'
        },
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          ip: '192.168.1.2',
          device: 'Safari on iPhone',
          location: 'Ho Chi Minh City, Vietnam'
        }
      ];

      setSecurityState(prev => ({
        ...prev,
        loginHistory: mockHistory
      }));
    } catch (error: any) {
      setMessage('Lỗi tải lịch sử đăng nhập: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    securityState,
    loading,
    message,
    messageType,
    changePassword,
    setup2FA,
    verify2FA,
    disable2FA,
    getLoginHistory,
    clearMessage
  };
}; 