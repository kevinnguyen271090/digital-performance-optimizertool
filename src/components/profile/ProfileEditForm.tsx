import React, { useState } from 'react';
import { Save, X, User, AtSign, Image, AlertCircle } from 'lucide-react';

interface ProfileForm {
  full_name: string;
  username: string;
  avatar_url: string;
}

interface ProfileEditFormProps {
  form: ProfileForm;
  onSave: (formData: ProfileForm) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
  message?: string;
  onFormChange: (form: ProfileForm) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  form,
  onSave,
  onCancel,
  loading = false,
  message = '',
  onFormChange
}) => {
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileForm> = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = 'Tên hiển thị không được để trống';
    }

    if (!form.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (form.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    if (form.avatar_url && !isValidUrl(form.avatar_url)) {
      newErrors.avatar_url = 'URL avatar không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onSave(form);
    if (success) {
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    onFormChange({ ...form, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chỉnh sửa thông tin cá nhân
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Tên hiển thị
          </label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.full_name 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            placeholder="Nhập tên hiển thị của bạn"
            disabled={loading}
          />
          {errors.full_name && (
            <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.full_name}
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <AtSign className="w-4 h-4 inline mr-2" />
            Tên đăng nhập
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.username 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            placeholder="Nhập tên đăng nhập (chỉ chữ cái, số, dấu gạch dưới)"
            disabled={loading}
          />
          {errors.username && (
            <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.username}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Tên đăng nhập sẽ được sử dụng để hiển thị trong hệ thống
          </p>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Image className="w-4 h-4 inline mr-2" />
            URL Avatar
          </label>
          <input
            type="url"
            value={form.avatar_url}
            onChange={(e) => handleInputChange('avatar_url', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.avatar_url 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            placeholder="https://example.com/avatar.jpg (tùy chọn)"
            disabled={loading}
          />
          {errors.avatar_url && (
            <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.avatar_url}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Nhập URL hình ảnh avatar của bạn (để trống để sử dụng avatar mặc định)
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('thành công') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 