import React, { useEffect, useState } from 'react';
import { LogOut, User, CreditCard, Settings, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import UserOrganizationProfile from './UserOrganizationProfile';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'profile' | 'billing' | 'settings';
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, activeTab = 'profile' }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTabState, setActiveTabState] = useState<'profile' | 'billing' | 'settings'>(activeTab);

  useEffect(() => {
    setActiveTabState(activeTab);
  }, [activeTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      console.log('[UserProfileModal] Modal opened. activeTab:', activeTab, 'activeTabState:', activeTabState);
    }
  }, [isOpen, activeTab, activeTabState]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      console.log('[UserProfileModal] userId:', session?.user?.id);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate('/auth');
  };

  if (!isOpen) {
    return null;
  }

  // Add a slide-in animation
  const animationClass = 'animate-[slide-in-right_0.3s_ease-out]';

  // Keyframe for the animation
  const styleSheet = document.createElement("style")
  styleSheet.innerText = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .animate-\\[slide-in-right_0\\.3s_ease-out\\] {
    animation: slide-in-right 0.3s ease-out;
  }
  `
  document.head.appendChild(styleSheet);

  // Cleanup style tag khi unmount
  useEffect(() => {
    return () => {
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  return (
    // Fullscreen overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Modal content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 w-80 h-full shadow-2xl p-6 border-l-4 border-gradientFrom ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-gradientFrom to-gradientTo rounded-xl p-4 -m-6 mb-6">
          <h2 className="text-xl font-bold text-white">My Account</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex flex-col">
          <button
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors font-semibold ${activeTabState === 'profile' ? 'bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTabState('profile')}
          >
            <User className={`w-5 h-5 ${activeTabState === 'profile' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
            <span>Profile</span>
          </button>
          <button
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors font-semibold ${activeTabState === 'billing' ? 'bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTabState('billing')}
          >
            <CreditCard className={`w-5 h-5 ${activeTabState === 'billing' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
            <span>Billing</span>
          </button>
          <button
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors font-semibold ${activeTabState === 'settings' ? 'bg-gradient-to-r from-gradientFrom to-gradientTo text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTabState('settings')}
          >
            <Settings className={`w-5 h-5 ${activeTabState === 'settings' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
            <span>Settings</span>
          </button>
          
          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 p-3 rounded-lg text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </nav>

        {/* Thông tin tổ chức */}
        {activeTabState === 'profile' && userId && (
          console.log('[UserProfileModal] Render UserOrganizationProfile, userId:', userId),
          <UserOrganizationProfile userId={userId} />
        )}
        {activeTabState === 'billing' && <div>Billing info...</div>}
        {activeTabState === 'settings' && <div>Settings...</div>}
      </div>
    </div>
  );
};

export default UserProfileModal; 