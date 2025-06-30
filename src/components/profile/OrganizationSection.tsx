import React from 'react';
import { Building2, Users, Calendar, Crown, Shield, Plus, MoreVertical } from 'lucide-react';

interface OrganizationMember {
  organization_id: string;
  role: string;
  joined_at: string;
  organization: {
    name: string;
    created_at: string;
  };
}

interface OrganizationSectionProps {
  organizations: OrganizationMember[];
  loading: boolean;
  error?: string;
  onCreateOrganization: () => void;
  onEditOrganization?: (orgId: string) => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  organizations,
  loading,
  error,
  onCreateOrganization,
  onEditOrganization
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tổ chức của bạn
          </h2>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
            {organizations.length}
          </span>
        </div>
        
        <button
          onClick={onCreateOrganization}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tổ chức mới</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Organizations List */}
      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Bạn chưa tham gia tổ chức nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tạo tổ chức đầu tiên để bắt đầu quản lý dự án và team của bạn
          </p>
          <button
            onClick={onCreateOrganization}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo tổ chức đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.map((org) => (
            <div
              key={org.organization_id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {org.organization.name}
                    </h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(org.role)}`}>
                      {getRoleIcon(org.role)}
                      <span>{getRoleLabel(org.role)}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia: {formatDate(org.joined_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>Tạo: {formatDate(org.organization.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                {(org.role === 'owner' || org.role === 'admin') && onEditOrganization && (
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                )}
              </div>

              {/* Quick Stats (placeholder for future features) */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>• Thành viên: 1</span>
                  <span>• Dự án: 0</span>
                  <span>• Kết nối: 0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Về vai trò trong tổ chức
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Chủ sở hữu:</strong> Toàn quyền quản lý tổ chức • 
              <strong>Quản trị viên:</strong> Quản lý thành viên và cài đặt • 
              <strong>Thành viên:</strong> Xem và sử dụng tính năng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSection; 