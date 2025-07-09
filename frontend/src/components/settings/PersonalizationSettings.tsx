import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, Smartphone, Tablet, Eye, EyeOff, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { H3, Lead } from '../ui/typography';

interface PersonalizationSettingsProps {
  onClose: () => void;
}

const PersonalizationSettings: React.FC<PersonalizationSettingsProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [accentColor, setAccentColor] = useState('purple');
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [preferredView, setPreferredView] = useState<'overview' | 'executive' | 'channels'>('overview');

  const accentColors = [
    { name: 'purple', value: 'purple', gradient: 'from-purple-600 to-pink-600' },
    { name: 'blue', value: 'blue', gradient: 'from-blue-600 to-cyan-600' },
    { name: 'green', value: 'green', gradient: 'from-green-600 to-emerald-600' },
    { name: 'orange', value: 'orange', gradient: 'from-orange-600 to-red-600' },
    { name: 'indigo', value: 'indigo', gradient: 'from-indigo-600 to-purple-600' },
    { name: 'teal', value: 'teal', gradient: 'from-teal-600 to-cyan-600' },
  ];

  const fontSizes = [
    { name: 'Nhỏ', value: 'small', class: 'text-sm' },
    { name: 'Trung bình', value: 'medium', class: 'text-base' },
    { name: 'Lớn', value: 'large', class: 'text-lg' },
    { name: 'Rất lớn', value: 'xlarge', class: 'text-xl' },
  ];

  const handleSaveSettings = () => {
    // Lưu settings vào localStorage
    const settings = {
      theme,
      accentColor,
      fontSize,
      compactMode,
      showAnimations,
      preferredView,
    };
    localStorage.setItem('userPreferences', JSON.stringify(settings));
    
    // Áp dụng settings
    applySettings(settings);
    onClose();
  };

  const applySettings = (settings: any) => {
    // Áp dụng theme
    if (settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Áp dụng font size
    document.documentElement.style.fontSize = settings.fontSize === 'small' ? '14px' : 
                                            settings.fontSize === 'large' ? '18px' :
                                            settings.fontSize === 'xlarge' ? '20px' : '16px';

    // Áp dụng compact mode
    if (settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }

    // Áp dụng animations
    if (!settings.showAnimations) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <H3 className="text-xl">Tùy chỉnh giao diện</H3>
              <Lead className="text-sm opacity-75">Cá nhân hóa trải nghiệm của bạn</Lead>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chủ đề
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', icon: Sun, label: 'Sáng', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200' },
                { value: 'dark', icon: Moon, label: 'Tối', bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200' },
                { value: 'auto', icon: Monitor, label: 'Tự động', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200' },
              ].map(({ value, icon: Icon, label, bg, border }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === value
                      ? `${bg} ${border}`
                      : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Màu chủ đạo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    accentColor === color.value
                      ? 'border-gray-300 bg-white/50 dark:bg-gray-800/50'
                      : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${color.gradient}`} />
                    <span className="text-sm font-medium capitalize">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Cỡ chữ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    fontSize === size.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50'
                  }`}
                >
                  <span className={`font-medium ${size.class}`}>{size.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chế độ hiển thị
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Chế độ compact</span>
                </div>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Hiệu ứng animation</span>
                </div>
                <input
                  type="checkbox"
                  checked={showAnimations}
                  onChange={(e) => setShowAnimations(e.target.checked)}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Preferred View */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Giao diện mặc định
            </label>
            <select
              value={preferredView}
              onChange={(e) => setPreferredView(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="overview">Tổng quan</option>
              <option value="executive">Executive</option>
              <option value="channels">Kênh</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationSettings; 