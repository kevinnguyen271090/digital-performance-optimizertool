import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Xử lý đăng nhập/đăng ký
  const handleAuth = async (email: string, password: string, username?: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
        setIsRegister(false);
        setLoading(false);
        return;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            if (!profile) {
              await supabase.from('user_profiles').insert({
                user_id: user.id,
                username: user.email ? user.email.split('@')[0] : 'unknown',
                email: user.email ?? '',
                avatar_url: user.email ? user.email[0].toUpperCase() : '',
                role: 'user'
              });
            }
          }
          navigate('/');
        }
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý login với Google
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      // Sau khi login thành công, kiểm tra và tạo profile nếu chưa có (ở useEffect hoặc sau khi login)
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi giữa login/register
  const switchMode = () => setIsRegister((v) => !v);

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: "url('/bg-login.jpg') center/cover no-repeat, linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)", minHeight: "100vh" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 backdrop-blur-md z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-black dark:text-accent">
            {isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isRegister ? 'Tạo tài khoản mới để bắt đầu' : 'Đăng nhập vào tài khoản của bạn'}
          </p>
        </div>
        <AuthForm
          isRegister={isRegister}
          onSubmit={handleAuth}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
          error={error}
          switchMode={switchMode}
        />
      </div>
    </div>
  );
};

export default AuthPage;