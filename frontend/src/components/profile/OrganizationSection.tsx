import React, { useState } from 'react';
import { Building, Plus, Users, Crown, Calendar, Settings } from 'lucide-react';
import CreateOrganizationModal from '../CreateOrganizationModal';

interface Organization {
  organizations: {
    id: string;
    name: string;
    created_at: string;
  };
  role: string;
  created_at: string;
}

interface OrganizationSectionProps {
  organizations: Organization[];
  userId: string;
  onCreateOrganization?: () => void;
  onInviteUser?: (organization: Organization) => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  organizations,
  userId,
  onCreateOrganization,
  onInviteUser
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedOrgForSettings, setSelectedOrgForSettings] = useState<Organization | null>(null);

  const handleOpenSettings = (org: Organization) => {
    setSelectedOrgForSettings(org);
    setShowSettingsModal(true);
  };
  const handleCloseSettings = () => {
    setShowSettingsModal(false);
    setSelectedOrgForSettings(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Settings className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'Chủ sở hữu';
      case 'admin':
        return 'Quản trị viên';
      case 'member':
        return 'Thành viên';
      default:
        return role;
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    onCreateOrganization?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Tổ chức
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mới</span>
        </button>
      </div>

      {/* Organizations List */}
      {organizations && organizations.length > 0 ? (
        <div className="space-y-4">
          {organizations.map((org) => (
            <div 
              key={org.organizations.id} 
              className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {org.organizations.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleIcon(org.role)}
                        <span className="text-sm text-gray-600">
                          {getRoleLabel(org.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Tham gia: {new Date(org.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3" />
                      <span>
                        Tạo: {new Date(org.organizations.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleOpenSettings(org)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Cài đặt tổ chức"
                >
                  <Settings className="w-4 h-4" />
                </button>
                 {onInviteUser && (
                  <button
                    onClick={() => onInviteUser(org)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mời thành viên"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Chưa có tổ chức nào
          </h4>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Tạo tổ chức đầu tiên để bắt đầu quản lý dự án và chia sẻ với team của bạn
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tạo tổ chức đầu tiên
          </button>
        </div>
      )}

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
      />

      {showSettingsModal && selectedOrgForSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Cài đặt tổ chức</h4>
              <button
                onClick={handleCloseSettings}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Tên tổ chức</div>
                <div className="font-medium text-gray-900">{selectedOrgForSettings.organizations.name}</div>
              </div>
              <div className="text-sm text-gray-600">
                Khu vực cài đặt chi tiết sẽ được bổ sung (quyền, thông tin doanh nghiệp...).
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseSettings}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSection; 