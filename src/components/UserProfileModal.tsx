import React from 'react';
import { LogOut, User, CreditCard, Settings, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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

  return (
    // Fullscreen overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Modal content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 w-72 h-full shadow-2xl p-6 ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Account</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col">
          <a href="#profile" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Profile</span>
          </a>
          <a href="#billing" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Billing</span>
          </a>
          <a href="#settings" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Settings</span>
          </a>
          
          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 p-3 rounded-lg text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

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


export default UserProfileModal; 