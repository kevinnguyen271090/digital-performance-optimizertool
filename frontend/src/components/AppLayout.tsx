import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { supabase } from "../utils/supabaseClient";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{ username?: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData || null);
      }
    };
    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('navigation.app_name', 'Digital Performance Optimizer')}
                </h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-accent text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  {t('navigation.dashboard', 'Dashboard')}
                </NavLink>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-accent text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  {t('navigation.reports', 'Báo cáo')}
                </NavLink>
                <NavLink
                  to="/recommendations"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-accent text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  {t('navigation.recommendations', 'Khuyến nghị')}
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-accent text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                    }`
                  }
                >
                  {t('navigation.settings', 'Cài đặt')}
                </NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Switcher - Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                >
                  <span>{i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                  <span className="font-bold">{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                  <button
                    onClick={() => i18n.changeLanguage('vi')}
                    className={`flex items-center w-full px-4 py-2 text-sm ${i18n.language === 'vi' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <span className="mr-2">🇻🇳</span> Tiếng Việt
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`flex items-center w-full px-4 py-2 text-sm ${i18n.language === 'en' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <span className="mr-2">🇬🇧</span> English
                  </button>
                </div>
              </div>

              {/* User Menu */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-full text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">👤</span> Hồ sơ
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">💳</span> Thanh toán
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="mr-2">⚙️</span> Cài đặt
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                      >
                        <span className="mr-2">🚪</span> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AppLayout; 