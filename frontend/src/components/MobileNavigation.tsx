import React, { useState } from "react";
import { Menu, X, Home, TrendingUp, FileText, Settings, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface MobileNavigationProps {
  currentPath: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/recommendations", label: "Recommendations", icon: TrendingUp },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-[#1F2937] shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gradientFrom to-gradientTo bg-clip-text text-transparent">Digital Marketing Hub</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">User</span>
            <img 
              src="https://i.pravatar.cc/32" 
              alt="avatar" 
              className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600" 
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-primary dark:bg-[#111827] shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Digital Marketing Hub</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow-md"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/70">
                  Version 1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 transition-all duration-200 rounded-lg ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom padding for mobile content */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default MobileNavigation; 