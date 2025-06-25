import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useOutletContext } from "react-router-dom";
import OnboardingTour from "./components/OnboardingTour";
import RevenueOrderModal from "./components/RevenueOrderModal";
import MobileNavigation from "./components/MobileNavigation";
import { ToastManager, ToastType } from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";
import SearchModal from "./components/SearchModal";
import UserProfileModal from "./components/UserProfileModal";
import { Search, Home, BarChart, FileText, Settings as SettingsIcon } from "lucide-react";

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
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <OnboardingTour
        run={runTour}
        onComplete={handleCompleteOnboarding}
      />
      {showRevenueModal && <RevenueOrderModal onFinish={handleFinishRevenue} />}
      <ToastManager toasts={toasts} onClose={removeToast} />
      
      <div className="flex" style={{ overflow: "visible" }}>
        <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-800 flex-col p-4 shadow-lg">
          <div className="text-2xl font-bold mb-8 text-indigo-600 dark:text-indigo-400" id="tour-step-1">Avenger Hub</div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavItem
                  key={item.name}
                  to={item.href}
                  icon={<Icon className="h-5 w-5" />}
                  label={item.name}
                  isActive={isActive}
                />
              );
            })}
          </nav>
        </aside>
        
        <div className="flex-1 flex flex-col" style={{ overflow: "visible" }}>
          <header className="relative z-10 flex items-center justify-between bg-white dark:bg-gray-800 shadow-md px-4 md:px-6 py-3 md:py-4">
            <div></div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center space-x-2 px-2 md:px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Tìm kiếm</span>
                <kbd className="hidden lg:inline-flex ml-2 items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  ⌘K
                </kbd>
              </button>
              
              <ThemeToggle />
              
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-full text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                U
              </button>
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
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-500 text-white font-semibold"
          : "text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default AppLayout; 
