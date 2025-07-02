import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface UserOrganizationProfileProps {
  userId: string;
}

const UserOrganizationProfile: React.FC<UserOrganizationProfileProps> = ({ userId }) => {
  const [organizationId, setOrganizationId] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrg = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy organization_id từ organization_members
        const { data: orgMember, error: orgMemberError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId)
          .single();
        if (orgMemberError || !orgMember) throw new Error('Không tìm thấy tổ chức.');
        setOrganizationId(orgMember.organization_id);
        // Lấy tên tổ chức
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', orgMember.organization_id)
          .single();
        if (orgError || !org) throw new Error('Không tìm thấy tên tổ chức.');
        setOrganizationName(org.name);
        setNewName(org.name);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [userId]);

  const handleSave = async () => {
    if (!newName.trim() || newName === organizationName) return;
    setSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ name: newName })
        .eq('id', organizationId);
      if (updateError) throw updateError;
      setOrganizationName(newName);
      setEditing(false);
    } catch (e: any) {
      setError(e.message || 'Lỗi khi cập nhật tên tổ chức.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải thông tin tổ chức...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Thông tin tổ chức</h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Tên tổ chức</label>
        {editing ? (
          <div className="flex items-center space-x-2">
            <input
              className="border rounded px-3 py-2 w-full"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              disabled={saving}
            />
            <button
              className="px-3 py-2 bg-accent text-white rounded hover:bg-accent-dark"
              onClick={handleSave}
              disabled={saving || !newName.trim() || newName === organizationName}
            >
              Lưu
            </button>
            <button
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => { setEditing(false); setNewName(organizationName); }}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">{organizationName}</span>
            <button
              className="px-2 py-1 text-accent border border-accent rounded hover:bg-accent hover:text-white"
              onClick={() => setEditing(true)}
            >
              Đổi tên
            </button>
          </div>
        )}
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Mã tổ chức (ID)</label>
        <input className="border rounded px-3 py-2 w-full bg-gray-100 dark:bg-gray-800" value={organizationId} disabled />
      </div>
    </div>
  );
};

export default UserOrganizationProfile; 