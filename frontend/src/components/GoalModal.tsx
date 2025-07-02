import React, { useState } from "react";
import { X, Target, TrendingUp, DollarSign, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: any) => void;
  editGoal?: any;
  goal?: any;
}

const GoalModal: React.FC<GoalModalProps> = React.memo(({ isOpen, onClose, onSave, editGoal, goal }) => {
  const { t } = useTranslation();
  const goalToEdit = goal || editGoal;
  
  const [formData, setFormData] = useState({
    title: goalToEdit?.title || "",
    targetValue: goalToEdit?.targetValue || "",
    unit: goalToEdit?.unit || "sessions",
    period: goalToEdit?.period || "monthly",
    description: goalToEdit?.description || ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const units = [
    { value: "sessions", label: t('goals.sessions', 'Sessions'), icon: Users },
    { value: "revenue", label: t('goals.revenue', 'Doanh thu (VNĐ)'), icon: DollarSign },
    { value: "orders", label: t('goals.orders', 'Đơn hàng'), icon: TrendingUp },
    { value: "ctr", label: t('goals.ctr', 'CTR (%)'), icon: Target },
    { value: "cpa", label: t('goals.cpa', 'CPA (VNĐ)'), icon: DollarSign },
    { value: "roas", label: t('goals.roas', 'ROAS (x)'), icon: TrendingUp }
  ];

  const periods = [
    { value: "weekly", label: t('goals.weekly', 'Hàng tuần') },
    { value: "monthly", label: t('goals.monthly', 'Hàng tháng') },
    { value: "quarterly", label: t('goals.quarterly', 'Hàng quý') },
    { value: "yearly", label: t('goals.yearly', 'Hàng năm') }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('goals.error_title_required', 'Vui lòng nhập tên mục tiêu');
    }

    if (!formData.targetValue || isNaN(Number(formData.targetValue)) || Number(formData.targetValue) <= 0) {
      newErrors.targetValue = t('goals.error_target_value_invalid', 'Vui lòng nhập giá trị mục tiêu hợp lệ');
    }

    if (!formData.unit) {
      newErrors.unit = t('goals.error_unit_required', 'Vui lòng chọn đơn vị');
    }

    if (!formData.period) {
      newErrors.period = t('goals.error_period_required', 'Vui lòng chọn chu kỳ');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const goal = {
        id: goalToEdit?.id || `goal-${Date.now()}`,
        ...formData,
        targetValue: Number(formData.targetValue),
        currentValue: goalToEdit?.currentValue || 0,
        status: "on-track",
        createdAt: goalToEdit?.createdAt || new Date().toISOString()
      };

      onSave(goal);
      onClose();
      setFormData({ title: "", targetValue: "", unit: "sessions", period: "monthly", description: "" });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {goalToEdit ? t('goals.edit_goal', 'Chỉnh sửa mục tiêu') : t('goals.create_goal', 'Tạo mục tiêu mới')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('goals.title', 'Tên mục tiêu')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.title ? "border-danger" : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white`}
                placeholder={t('goals.title_placeholder', 'Ví dụ: Tăng doanh thu tháng này')}
              />
              {errors.title && <p className="mt-1 text-sm text-danger">{errors.title}</p>}
            </div>

            {/* Target Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('goals.target_value', 'Giá trị mục tiêu')}
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.targetValue ? "border-danger" : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white`}
                placeholder={t('goals.target_value_placeholder', 'Nhập giá trị mục tiêu')}
              />
              {errors.targetValue && <p className="mt-1 text-sm text-danger">{errors.targetValue}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('goals.unit', 'Đơn vị')}
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.unit ? "border-danger" : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white`}
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              {errors.unit && <p className="mt-1 text-sm text-danger">{errors.unit}</p>}
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('goals.period', 'Chu kỳ')}
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.period ? "border-danger" : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white`}
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              {errors.period && <p className="mt-1 text-sm text-danger">{errors.period}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('goals.description', 'Mô tả (tùy chọn)')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent dark:bg-gray-700 dark:text-white"
                placeholder={t('goals.description_placeholder', 'Mô tả chi tiết về mục tiêu này...')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              {t('button.cancel', 'Hủy')}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition"
            >
              {t('button.save', 'Lưu')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GoalModal; 