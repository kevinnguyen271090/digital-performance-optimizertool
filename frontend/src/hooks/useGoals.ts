import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Goal } from '../types/goals';

export const useGoals = (userId?: string) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch goals từ Supabase
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          // Map snake_case -> camelCase cho UI
          const mappedGoals = data.map((g: any) => ({
            ...g,
            id: g.id,
            title: g.title,
            targetValue: g.target_value,
            currentValue: g.current_value ?? 0,
            unit: g.unit,
            period: g.period,
            status: g.status ?? 'on-track',
            trend: g.trend,
            description: g.description,
            createdAt: g.created_at,
          }));
          setGoals(mappedGoals);
        }
        setLoading(false);
      });
  }, [userId]);

  // Thêm hoặc cập nhật goal
  const handleSaveGoal = async (goal: Goal) => {
    if (!userId) return;
    let res;
    // Map camelCase -> snake_case khi lưu
    const dbGoal = {
      ...goal,
      user_id: userId,
      target_value: goal.targetValue,
      current_value: goal.currentValue,
      created_at: goal.createdAt,
    };
    if (goal.id) {
      // Update
      res = await supabase
        .from('goals')
        .update(dbGoal)
        .eq('id', goal.id)
        .select();
    } else {
      // Insert
      res = await supabase
        .from('goals')
        .insert([dbGoal])
        .select();
    }
    if (!res.error) {
      // Refetch
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });
      const mappedGoals = (data || []).map((g: any) => ({
        ...g,
        id: g.id,
        title: g.title,
        targetValue: g.target_value,
        currentValue: g.current_value ?? 0,
        unit: g.unit,
        period: g.period,
        status: g.status ?? 'on-track',
        trend: g.trend,
        description: g.description,
        createdAt: g.created_at,
      }));
      setGoals(mappedGoals);
    }
    setEditGoal(null);
    setShowGoalModal(false);
  };

  // Sửa goal
  const handleEditGoal = (goal: Goal) => {
    setEditGoal(goal);
    setShowGoalModal(true);
  };

  // Xóa goal
  const handleDeleteGoal = async (goalId: string) => {
    if (!userId) return;
    await supabase.from('goals').delete().eq('id', goalId);
    // Refetch
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    const mappedGoals = (data || []).map((g: any) => ({
      ...g,
      id: g.id,
      title: g.title,
      targetValue: g.target_value,
      currentValue: g.current_value ?? 0,
      unit: g.unit,
      period: g.period,
      status: g.status ?? 'on-track',
      trend: g.trend,
      description: g.description,
      createdAt: g.created_at,
    }));
    setGoals(mappedGoals);
  };

  const openGoalModal = () => {
    setEditGoal(null);
    setShowGoalModal(true);
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setEditGoal(null);
  };

  return {
    goals,
    showGoalModal,
    editGoal,
    loading,
    handleSaveGoal,
    handleEditGoal,
    handleDeleteGoal,
    openGoalModal,
    closeGoalModal
  };
}; 