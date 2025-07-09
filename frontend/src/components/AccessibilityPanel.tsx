import React, { useState } from 'react';
import { Accessibility, Eye, EyeOff, Volume2, VolumeX, Keyboard, MousePointer, Highlighter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { H3, Lead } from './ui/typography';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);

  if (!isOpen) return null;

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (largeText) {
      root.style.fontSize = '18px';
      root.style.lineHeight = '1.6';
    } else {
      root.style.fontSize = '16px';
      root.style.lineHeight = '1.5';
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus indicator
    if (focusIndicator) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Color blind mode
    if (colorBlindMode) {
      root.classList.add('color-blind-mode');
    } else {
      root.classList.remove('color-blind-mode');
    }

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      highContrast,
      largeText,
      reducedMotion,
      screenReader,
      focusIndicator,
      colorBlindMode
    }));
  };

  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'highContrast':
        setHighContrast(value);
        break;
      case 'largeText':
        setLargeText(value);
        break;
      case 'reducedMotion':
        setReducedMotion(value);
        break;
      case 'screenReader':
        setScreenReader(value);
        break;
      case 'focusIndicator':
        setFocusIndicator(value);
        break;
      case 'colorBlindMode':
        setColorBlindMode(value);
        break;
    }
    applyAccessibilitySettings();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <H3 className="text-xl">Tính năng hỗ trợ</H3>
              <Lead className="text-sm opacity-75">Tùy chỉnh trải nghiệm cho mọi người</Lead>
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
          {/* High Contrast */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <Highlighter className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-sm font-semibold">Độ tương phản cao</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tăng độ tương phản màu sắc</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => handleToggle('highContrast', e.target.checked)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Large Text */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-green-500" />
                <div>
                  <span className="text-sm font-semibold">Chữ lớn</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tăng kích thước chữ</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => handleToggle('largeText', e.target.checked)}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
              />
            </label>
          </div>

          {/* Reduced Motion */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <VolumeX className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="text-sm font-semibold">Giảm chuyển động</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tắt hiệu ứng animation</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => handleToggle('reducedMotion', e.target.checked)}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
            </label>
          </div>

          {/* Focus Indicator */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <MousePointer className="w-5 h-5 text-purple-500" />
                <div>
                  <span className="text-sm font-semibold">Chỉ báo focus</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị vùng đang focus</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={focusIndicator}
                onChange={(e) => handleToggle('focusIndicator', e.target.checked)}
                className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
              />
            </label>
          </div>

          {/* Color Blind Mode */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <EyeOff className="w-5 h-5 text-red-500" />
                <div>
                  <span className="text-sm font-semibold">Chế độ mù màu</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tối ưu cho người mù màu</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={colorBlindMode}
                onChange={(e) => handleToggle('colorBlindMode', e.target.checked)}
                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
              />
            </label>
          </div>

          {/* Keyboard Navigation */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center space-x-3 mb-3">
                <Keyboard className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold">Điều hướng bằng bàn phím</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <p>• Tab: Di chuyển giữa các phần tử</p>
                <p>• Enter/Space: Kích hoạt nút</p>
                <p>• Escape: Đóng modal</p>
                <p>• Arrow keys: Điều hướng menu</p>
              </div>
            </div>
          </div>

          {/* Screen Reader Support */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center space-x-3 mb-3">
                <Volume2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold">Hỗ trợ Screen Reader</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <p>• Tất cả hình ảnh có alt text</p>
                <p>• Cấu trúc heading rõ ràng</p>
                <p>• ARIA labels cho các thành phần tương tác</p>
                <p>• Mô tả cho biểu đồ và bảng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel; 