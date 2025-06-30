import React from 'react';
import { User, Mail, Calendar, Shield, Edit3, Camera } from 'lucide-react';

interface UserProfile {
  user_id: string;
  username?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

interface ProfileHeaderProps {
  profile: UserProfile | null;
  emailVerified: boolean;
  onEditClick: () => void;
  onAvatarChange: () => void;
  loading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  emailVerified,
  onEditClick,
  onAvatarChange,
  loading = false
}) => {
  const getInitials = (name?: string, username?: string) => {
    const displayName = name || username || '';
    return displayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Avatar and Basic Info */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {/* Avatar Section */}
          <div className="relative group">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="avatar" 
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-200 dark:border-gray-600 shadow-sm">
                {getInitials(profile?.full_name, profile?.username)}
              </div>
            )}
            
            {/* Avatar Change Overlay */}
            <button
              onClick={onAvatarChange}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {profile?.full_name || profile?.username || 'Chưa có tên'}
            </h1>
            
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{profile?.email || 'N/A'}</span>
              {emailVerified && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Vai trò: {profile?.role || 'User'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Tham gia: {formatDate(profile?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onEditClick}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* Email Verification Status */}
      {!emailVerified && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              Email chưa được xác thực
            </span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            Vui lòng kiểm tra email và xác thực tài khoản để sử dụng đầy đủ tính năng.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader; 