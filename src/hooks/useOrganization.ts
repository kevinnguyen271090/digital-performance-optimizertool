import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

interface OrganizationMember {
  organization_id: string;
  role: string;
  joined_at: string;
  organization: {
    name: string;
    created_at: string;
  };
}

interface UseOrganizationReturn {
  organizations: OrganizationMember[];
  loading: boolean;
  error: string;
  createOrganization: (name: string, userId: string) => Promise<boolean>;
  fetchOrganizations: (userId: string) => Promise<void>;
}

export const useOrganization = (): UseOrganizationReturn => {
  const [organizations, setOrganizations] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrganizations = useCallback(async (userId: string) => {
    setLoading(true);
    setError('');
    
    try {
      const { data: orgMembers } = await supabase
        .from('organization_members')
        .select(`
          organization_id, 
          role, 
          created_at,
          organizations (
            name, 
            created_at
          )
        `)
        .eq('user_id', userId);
      
      if (orgMembers) {
        const formattedOrgs = orgMembers.map(org => ({
          organization_id: org.organization_id,
          role: org.role,
          joined_at: org.created_at,
          organization: {
            name: org.organizations?.[0]?.name || '',
            created_at: org.organizations?.[0]?.created_at || ''
          }
        }));
        setOrganizations(formattedOrgs);
      } else {
        setOrganizations([]);
      }
    } catch (err: any) {
      setError('Lỗi tải danh sách tổ chức: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganization = useCallback(async (name: string, userId: string): Promise<boolean> => {
    setLoading(true);
    setError('');

    // Kiểm tra user đã đăng nhập chưa
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Bạn cần đăng nhập lại!');
      setLoading(false);
      return false;
    }

    try {
      // Tạo organization mới
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: name.trim(),
          plan: 'free'
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      // Thêm user làm owner của organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'owner'
        });
      
      if (memberError) throw memberError;
      
      // Refresh danh sách organization
      await fetchOrganizations(user.id);
      
      return true;
    } catch (err: any) {
      setError('Lỗi tạo tổ chức: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    createOrganization,
    fetchOrganizations
  };
}; 