import { supabase } from './supabaseClient';

export const getOrganizationIdByUser = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return data.organization_id;
};

export const getOrganizationName = async (organizationId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', organizationId)
    .single();
  if (error || !data) return null;
  return data.name;
}; 