import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Users,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';

interface Organization {
  organization_id: string;
  organization_name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  is_owner: boolean;
  member_count: number;
}

interface OrganizationSelectorProps {
  onOrganizationChange: (orgId: string) => void;
  selectedOrganizationId?: string;
}

const roleConfig = {
  owner: {
    label: 'Owner',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Full access to all features'
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800',
    description: 'Manage connections and analytics'
  },
  member: {
    label: 'Member',
    icon: User,
    color: 'bg-green-100 text-green-800',
    description: 'Create and view connections'
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800',
    description: 'View-only access'
  }
};

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  onOrganizationChange,
  selectedOrganizationId
}) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    console.log("OrganizationSelector: user changed", user);
    fetchUserOrganizations();
  }, [user]);

  const fetchUserOrganizations = async () => {
    if (!user) {
      console.log("OrganizationSelector: No user, setting loading to false");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("OrganizationSelector: Fetching organizations for user", user.id);
      
      // Thử gọi RPC function trước
      const { data, error } = await supabase.rpc('get_user_organizations', {
        p_user_id: user.id
      });

      console.log("OrganizationSelector: RPC response", { data, error });

      if (error) {
        console.log("OrganizationSelector: RPC failed, trying direct table query");
        
        // Fallback: query trực tiếp table
        const { data: tableData, error: tableError } = await supabase
          .from('organization_members')
          .select(`
            organization_id,
            role,
            organizations!inner(name)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (tableError) {
          console.error('Error fetching organizations from table:', tableError);
          setLoading(false);
          return;
        }

        // Transform data để match với interface
        const orgs = tableData.map((item: any) => ({
          organization_id: item.organization_id,
          organization_name: item.organizations.name,
          role: item.role,
          is_owner: item.role === 'owner',
          member_count: 1 // Default value
        }));

        console.log("OrganizationSelector: Table query result", orgs);
        setOrganizations(orgs);

        // Set default organization
        if (orgs.length > 0) {
          const defaultOrg = selectedOrganizationId 
            ? orgs.find(org => org.organization_id === selectedOrganizationId)
            : orgs[0];
          
          if (defaultOrg) {
            console.log("OrganizationSelector: Setting default org", defaultOrg);
            setSelectedOrg(defaultOrg);
            onOrganizationChange(defaultOrg.organization_id);
          }
        }
      } else {
        // RPC thành công
        const orgs = data || [];
        console.log("OrganizationSelector: Organizations found", orgs);
        setOrganizations(orgs);

        // Set default organization
        if (orgs.length > 0) {
          const defaultOrg = selectedOrganizationId 
            ? orgs.find(org => org.organization_id === selectedOrganizationId)
            : orgs[0];
          
          if (defaultOrg) {
            console.log("OrganizationSelector: Setting default org", defaultOrg);
            setSelectedOrg(defaultOrg);
            onOrganizationChange(defaultOrg.organization_id);
          }
        } else {
          console.log("OrganizationSelector: No organizations found");
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationChange = (orgId: string) => {
    const org = organizations.find(o => o.organization_id === orgId);
    if (org) {
      setSelectedOrg(org);
      onOrganizationChange(orgId);
    }
  };

  const getRoleConfig = (role: string) => {
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;
  };

  // Luôn render component, ngay cả khi không có organizations
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Selector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Organizations</h3>
                <p className="text-gray-600 mb-4">
                  You are not a member of any organization yet.
                </p>
                <Button onClick={() => window.location.href = '/organizations/create'}>
                  Create Organization
                </Button>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Organization
                </label>
                <Select 
                  value={selectedOrg?.organization_id} 
                  onValueChange={handleOrganizationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => {
                      const roleConfig = getRoleConfig(org.role);
                      const RoleIcon = roleConfig.icon;
                      
                      return (
                        <SelectItem key={org.organization_id} value={org.organization_id}>
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <span>{org.organization_name}</span>
                            <Badge variant="secondary" className={roleConfig.color}>
                              {roleConfig.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {selectedOrg && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{selectedOrg.organization_name}</h4>
                        <p className="text-sm text-gray-600">
                          {getRoleConfig(selectedOrg.role).description}
                        </p>
                      </div>
                      <Badge variant="secondary" className={getRoleConfig(selectedOrg.role).color}>
                        {getRoleConfig(selectedOrg.role).label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{selectedOrg.member_count} members</span>
                      </div>
                      {selectedOrg.is_owner && (
                        <div className="flex items-center gap-1">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span>Owner</span>
                        </div>
                      )}
                    </div>

                    {/* Permission Summary */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Your Permissions</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Settings className="h-3 w-3" />
                          <span>Manage Connections</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>View Analytics</span>
                        </div>
                        {selectedOrg.role === 'owner' && (
                          <>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Manage Members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              <span>Organization Settings</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {selectedOrg.role === 'owner' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setShowMembersModal(true)}
                        >
                          <Users className="h-3 w-3" />
                          Manage Members
                        </Button>
                      )}
                      {selectedOrg.role === 'owner' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setShowSettingsModal(true)}
                        >
                          <Settings className="h-3 w-3" />
                          Settings
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Quản lý thành viên Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Quản lý thành viên</h4>
              <button onClick={() => setShowMembersModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Đóng">✕</button>
            </div>
            <div>Chức năng mời/xóa thành viên sẽ được phát triển trong bản tiếp theo.</div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowMembersModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Đóng</button>
            </div>
          </div>
        </div>
      )}
      {/* Cài đặt tổ chức Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Cài đặt tổ chức</h4>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Đóng">✕</button>
            </div>
            <div>Bạn là <b>Owner</b>. Các tùy chọn cấu hình nâng cao sẽ được bổ sung.</div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 