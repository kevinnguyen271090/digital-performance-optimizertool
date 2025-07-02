import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';

interface UserProfile {
  user_id: string;
  username?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

interface ProfileForm {
  full_name: string;
  username: string;
  avatar_url: string;
}

interface UseProfileReturn {
  profile: UserProfile | null;
  authInfo: any;
  emailVerified: boolean;
  loading: boolean;
  message: string;
  form: ProfileForm;
  editMode: boolean;
  userId: string | null;
  updateProfile: (formData: ProfileForm) => Promise<boolean>;
  resendVerification: () => Promise<boolean>;
  setEditMode: (mode: boolean) => void;
  setForm: (form: ProfileForm) => void;
  setMessage: (message: string) => void;
}

export const useProfile = (): UseProfileReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ 
    full_name: '', 
    username: '', 
    avatar_url: '' 
  });
  const prevUserId = useRef<string | null>(null);

  // Fetch user and profile data
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session:', session, sessionError);
        if (session?.user) {
          setUserId(session.user.id);
          setAuthInfo(session.user);
          setEmailVerified(!!session.user.email_confirmed_at);

          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_id, username, email, full_name, avatar_url, role, created_at')
            .eq('user_id', session.user.id)
            .single();
          console.log('ProfileData:', profileData, profileError);

          if (profileData) {
            setProfile(profileData);
            if (prevUserId.current !== session.user.id) {
              setForm({
                full_name: profileData.full_name || '',
                username: profileData.username || '',
                avatar_url: profileData.avatar_url || ''
              });
              prevUserId.current = session.user.id;
            }
          }
        }
      } catch (error: any) {
        setMessage('Lỗi tải thông tin: ' + error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, []);

  // Update profile
  const updateProfile = async (formData: ProfileForm): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          avatar_url: formData.avatar_url
        })
        .eq('user_id', userId);

      if (error) {
        setMessage('Lỗi cập nhật: ' + error.message);
        return false;
      }

      setMessage('Cập nhật thành công!');
      setEditMode(false);
      setProfile((prev) => prev ? { ...prev, ...formData } : prev);
      return true;
    } catch (error: any) {
      setMessage('Lỗi cập nhật: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerification = async (): Promise<boolean> => {
    if (!profile?.email) {
      setMessage('Không tìm thấy email để gửi xác thực');
      return false;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: profile.email 
      });

      if (error) {
        setMessage('Lỗi gửi lại email xác thực: ' + error.message);
        return false;
      }

      setMessage('Đã gửi lại email xác thực!');
      return true;
    } catch (error: any) {
      setMessage('Lỗi gửi lại email xác thực: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    authInfo,
    emailVerified,
    loading,
    message,
    form,
    editMode,
    userId,
    updateProfile,
    resendVerification,
    setEditMode,
    setForm,
    setMessage
  };
}; 