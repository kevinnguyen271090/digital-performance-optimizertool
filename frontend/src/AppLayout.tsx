import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, Link, useOutletContext } from "react-router-dom";
import OnboardingTour from "./components/OnboardingTour";
import RevenueOrderModal from "./components/RevenueOrderModal";
import MobileNavigation from "./components/MobileNavigation";
import { ToastManager, ToastType } from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";
import SearchModal from "./components/SearchModal";
import { Search, Home, BarChart, FileText, Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const AppLayout = () => {
  const [runTour, setRunTour] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>>([]);
  const location = useLocation();
  const context = useOutletContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if user has completed onboarding tour
    const hasCompletedTour = localStorage.getItem("onboardingCompleted");
    if (!hasCompletedTour) {
      // Show onboarding tour after a short delay to let dashboard load first
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1500); // Increased delay to ensure all elements are mounted
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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

  const handleCompleteOnboarding = () => {
    setRunTour(false);
    localStorage.setItem("onboardingCompleted", "true");
    showToast("success", "Hoàn tất!", "Bạn đã sẵn sàng để khám phá ứng dụng.");
  };

  const handleFinishRevenue = () => {
    setShowRevenueModal(false);
    showToast("success", "Hoàn tất!", "Bạn có thể bắt đầu sử dụng dashboard.");
  };

  const showToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Recommendations", href: "/recommendations", icon: BarChart },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-inter">
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <OnboardingTour
        run={runTour}
        onComplete={handleCompleteOnboarding}
      />
      {showRevenueModal && <RevenueOrderModal onFinish={handleFinishRevenue} />}
      <ToastManager toasts={toasts} onClose={removeToast} />
      
      <div className="flex" style={{ overflow: "visible" }}>
        <aside className="hidden lg:flex w-64 bg-primary dark:bg-[#111827] flex-col p-4 shadow-lg">
          <div className="text-2xl font-bold mb-8 text-white" id="tour-step-1"> Digital Marketing Hub</div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavItem
                  key={item.name}
                  to={item.href}
                  icon={<Icon className={`h-5 w-5 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-gradientFrom to-gradientTo' : 'text-white/70'} transition`} />}
                  label={item.name}
                  isActive={isActive}
                />
              );
            })}
          </nav>
        </aside>
        
        <div className="flex-1 flex flex-col" style={{ overflow: "visible" }}>
          <header className="relative z-10 flex items-center justify-between bg-white dark:bg-[#1F2937] shadow-md px-4 md:px-6 py-3 md:py-4">
            <div></div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center space-x-2 px-2 md:px-3 py-2 text-sm bg-gradient-to-r from-gradientFrom to-gradientTo text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Tìm kiếm</span>
                <kbd className="hidden lg:inline-flex ml-2 items-center px-2 py-1 text-xs font-medium text-white bg-white/20 border border-white/30 rounded">
                  ⌘K
                </kbd>
              </button>
              
              <ThemeToggle />

              {/* Language Switcher - Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-md transition-colors"
                >
                  <span>{i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                  <span className="font-bold">{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                  <button
                    onClick={() => i18n.changeLanguage('vi')}
                    className={`flex items-center w-full px-4 py-2 text-sm text-white hover:bg-accent ${i18n.language === 'vi' ? 'font-bold bg-accent/20' : ''}`}
                  >
                    <span className="mr-2">🇻🇳</span> Tiếng Việt
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`flex items-center w-full px-4 py-2 text-sm text-white hover:bg-accent ${i18n.language === 'en' ? 'font-bold bg-accent/20' : ''}`}
                  >
                    <span className="mr-2">🇬🇧</span> English
                  </button>
                </div>
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-gradientFrom to-gradientTo rounded-full text-white text-sm font-medium hover:opacity-90 transition-colors shadow-sm"
                >
                  U
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <button
                      onClick={() => { setUserMenuOpen(false); window.location.href = '/profile'; }}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-accent transition-colors"
                    >
                      <span className="mr-2">👤</span> Hồ sơ
                    </button>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => { setUserMenuOpen(false); /* TODO: logout logic */ }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="mr-2">🚪</span> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet context={context} />
          </main>
        </div>
      </div>

      <MobileNavigation currentPath={location.pathname} />
    </div>
  );
};

const NavItem = ({ to, icon, label, isActive }: { to: string, icon: JSX.Element, label: string, isActive: boolean }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-l-lg transition-all cursor-pointer font-semibold focus:outline-none focus:ring-2 focus:ring-accent/70
        ${isActive
          ? 'bg-white/10 border-l-4 border-accent text-white shadow-md'
          : 'text-white/80 hover:bg-white/5 hover:text-accent'}
      `}
      tabIndex={0}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default AppLayout; 
