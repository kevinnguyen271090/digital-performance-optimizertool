import { supabase } from '../utils/supabaseClient';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

// Get organizations that the current user is a member of
export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get organizations where user is a member
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        organization_members!inner(user_id)
      `)
      .eq('organization_members.user_id', user.id);

    if (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw error;
  }
};

// Get specific organization
export const getOrganization = async (id: string): Promise<Organization> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Get organization members
export const getOrganizationMembers = async (organizationId: string): Promise<OrganizationMember[]> => {
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', organizationId);

  if (error) {
    throw error;
  }

  return data || [];
};

// Create organization
export const createOrganization = async (data: {
  name: string;
  description?: string;
}): Promise<Organization> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      ...data,
      owner_id: user.id
    })
    .select()
    .single();

  if (orgError) {
    throw orgError;
  }

  // Owner membership sẽ được thêm tự động bởi trigger ở backend

  return org;
};

// Update organization
export const updateOrganization = async (id: string, data: Partial<Organization>): Promise<Organization> => {
  const { data: org, error } = await supabase
    .from('organizations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return org;
};

// Delete organization
export const deleteOrganization = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}; 