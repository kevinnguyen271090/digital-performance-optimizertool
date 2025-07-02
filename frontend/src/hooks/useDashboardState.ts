import { useState } from "react";
import { DashboardView } from "../types/dashboard";
import { Goal } from "../types/goals";

// A helper type for platform accounts, can be moved to a types file later
interface PlatformAccounts {
  platform: string;
  accounts: { id: string; [key: string]: any }[];
}

export const useDashboardState = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [dateRangeString, setDateRangeString] = useState("last30days");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<{[key: string]: string[]}>({
    Meta: [],
    Google: [],
    TikTok: []
  });

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  const handleToggleAccountSelector = () => {
    setShowAccountSelector(!showAccountSelector);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    // Convert dates to string format for display
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };
    
    if (startDate.toDateString() === endDate.toDateString()) {
      setDateRangeString(formatDate(startDate));
    } else {
      setDateRangeString(`${formatDate(startDate)} - ${formatDate(endDate)}`);
    }
  };

  const handleOpenGoalModal = () => {
    setEditingGoal(null);
    setShowGoalModal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    // Logic xóa goal sẽ được thực hiện ở hook useGoals (Supabase)
  };

  const handleApplyAccountSelection = (newSelectedAccounts: { [key: string]: string[] }) => {
    setSelectedAccounts(newSelectedAccounts);
  };

  const handleResetToDefault = (platformAccounts: PlatformAccounts[]) => {
    const allSelected = platformAccounts.reduce((acc, platform) => {
      acc[platform.platform] = platform.accounts.map(account => account.id);
      return acc;
    }, {} as { [key: string]: string[] });
    setSelectedAccounts(allSelected);
  };

  return {
    currentView,
    showAccountSelector,
    dateRangeString,
    showGoalModal,
    editingGoal,
    selectedAccounts,
    handleViewChange,
    handleToggleAccountSelector,
    handleDateRangeChange,
    handleOpenGoalModal,
    handleEditGoal,
    handleDeleteGoal,
    handleApplyAccountSelection,
    handleResetToDefault,
    setShowGoalModal,
    setEditingGoal
  };
}; 