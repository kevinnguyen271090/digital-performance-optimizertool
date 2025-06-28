import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
        if (data.session) navigate('/');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) navigate('/');
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/adwords'
        }
      });
      if (error) throw error;
      // Supabase sẽ tự động tạo user nếu là user mới
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý login với Facebook
  const handleFacebookLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
      if (error) throw error;
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: "url('/bg-login.jpg') center/cover no-repeat, linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
        minHeight: "100vh"
      }}
    >
      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 backdrop-blur-md z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-accent dark:text-accent">
            {t('auth.welcome_back', 'Chào mừng trở lại')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.sign_in_to_account', 'Đăng nhập vào tài khoản của bạn')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t('auth.email', 'Email')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder={t('auth.email', 'Email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('auth.password', 'Mật khẩu')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder={t('auth.password', 'Mật khẩu')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {t('auth.remember_me', 'Ghi nhớ đăng nhập')}
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent/80">
                {t('auth.forgot_password', 'Quên mật khẩu?')}
              </a>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-2 text-center font-semibold">
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              background: '#2563eb', // blue-600
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 rgba(37,99,235,0.15)'
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
          >
            {loading ? t('common.loading', 'Đang tải...') : t('auth.login', 'Đăng nhập')}
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  {t('auth.or_continue_with', 'Hoặc tiếp tục với')}
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
              >
                {t('auth.login_with_google', 'Đăng nhập bằng Google')}
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
              >
                {t('auth.login_with_facebook', 'Đăng nhập bằng Facebook')}
              </button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.dont_have_account', 'Chưa có tài khoản?')}{' '}
              <a href="#" className="font-medium text-accent hover:text-accent/80">
                {t('auth.create_account', 'Tạo tài khoản')}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;