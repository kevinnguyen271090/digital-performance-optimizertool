import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

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

interface TwoFactorStatus {
  enabled: boolean;
  secret?: string;
  qrCode?: string;
}

interface UseProfileSecurityReturn {
  securityState: SecurityState;
  loading: boolean;
  message: string;
  messageType: 'success' | 'error';
  
  // Password management
  isChangingPassword: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // 2FA management
  twoFactorStatus: TwoFactorStatus;
  isSettingUp2FA: boolean;
  isVerifying2FA: boolean;
  isDisabling2FA: boolean;
  setup2FA: () => Promise<void>;
  verify2FA: (token: string) => Promise<void>;
  disable2FA: () => Promise<void>;
  
  // Security monitoring
  getLoginHistory: () => Promise<void>;
  clearMessage: () => void;
  check2FAStatus: () => Promise<void>;
}

export const useProfileSecurity = (): UseProfileSecurityReturn => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    twoFactorEnabled: false,
    lastPasswordChange: null,
    loginHistory: []
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({ enabled: false });
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      setMessage('Mật khẩu đã được thay đổi thành công');
      setMessageType('success');
      setSecurityState(prev => ({
        ...prev,
        lastPasswordChange: new Date().toISOString()
      }));
    } catch (error: any) {
      console.error('Error changing password:', error);
      setMessage(error.message || 'Không thể thay đổi mật khẩu');
      setMessageType('error');
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
  }, []);

  const check2FAStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_2fa')
        .select('enabled')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking 2FA status:', error);
        return;
      }

      setTwoFactorStatus({
        enabled: data?.enabled || false
      });
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  }, []);

  const setup2FA = useCallback(async () => {
    setIsSettingUp2FA(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Không có session');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/two-factor-auth/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể thiết lập 2FA');
      }

      const data = await response.json();
      setTwoFactorStatus({
        enabled: false,
        secret: data.secret,
        qrCode: data.qrCode
      });

      setMessage('QR Code đã được tạo. Vui lòng quét mã để hoàn tất thiết lập 2FA');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error setting up 2FA:', error);
      setMessage(error.message || 'Không thể thiết lập 2FA');
      setMessageType('error');
      throw error;
    } finally {
      setIsSettingUp2FA(false);
    }
  }, []);

  const verify2FA = useCallback(async (token: string) => {
    setIsVerifying2FA(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Không có session');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/two-factor-auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Mã xác thực không đúng');
      }

      setTwoFactorStatus(prev => ({
        ...prev,
        enabled: true,
        secret: undefined,
        qrCode: undefined
      }));

      setMessage('2FA đã được kích hoạt thành công');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error verifying 2FA:', error);
      setMessage(error.message || 'Không thể xác thực 2FA');
      setMessageType('error');
      throw error;
    } finally {
      setIsVerifying2FA(false);
    }
  }, []);

  const disable2FA = useCallback(async () => {
    setIsDisabling2FA(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Không có session');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/two-factor-auth/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tắt 2FA');
      }

      setTwoFactorStatus({ enabled: false });
      setMessage('2FA đã được tắt thành công');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      setMessage(error.message || 'Không thể tắt 2FA');
      setMessageType('error');
      throw error;
    } finally {
      setIsDisabling2FA(false);
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
      console.error('Error fetching login history:', error);
      setMessage('Không thể tải lịch sử đăng nhập');
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
    isChangingPassword,
    changePassword,
    twoFactorStatus,
    isSettingUp2FA,
    isVerifying2FA,
    isDisabling2FA,
    setup2FA,
    verify2FA,
    disable2FA,
    getLoginHistory,
    clearMessage,
    check2FAStatus
  };
}; 