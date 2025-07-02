import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface UseGoogleAccountConnectResult {
  accessToken: string | null;
  profile: any | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
}

export function useGoogleAccountConnect(scopes: string) : UseGoogleAccountConnectResult {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      setAccessToken(tokenResponse.access_token);
      try {
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const profileData = await profileRes.json();
        setProfile(profileData);
      } catch (err: any) {
        setError('Lỗi lấy thông tin profile Google');
      }
      setIsLoading(false);
    },
    onError: () => {
      setError('Lỗi xác thực Google!');
      setIsLoading(false);
    },
    scope: scopes,
  });

  return {
    accessToken,
    profile,
    isLoading,
    error,
    login: googleLogin,
  };
} 