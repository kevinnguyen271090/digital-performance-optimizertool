import React, { useState } from 'react';
import { useProfile, useOrganization } from '../hooks';
import { 
  ProfileHeader, 
  ProfileEditForm, 
  OrganizationSection, 
  EmailVerificationBanner,
  AvatarUpload,
  SecuritySection
} from '../components/profile';
import CreateOrganizationModal from '../components/CreateOrganizationModal';

const ProfilePage: React.FC = () => {
  // Profile state management
  const {
    profile,
    emailVerified,
    loading: profileLoading,
    message,
    form,
    editMode,
    userId,
    updateProfile,
    resendVerification,
    setEditMode,
    setForm,
    setMessage
  } = useProfile();

  // Organization state management
  const {
    organizations,
    loading: orgLoading,
    error: orgError,
    fetchOrganizations,
    createOrganization
  } = useOrganization();

  // Local state
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  // Fetch organizations when userId is available
  React.useEffect(() => {
    if (userId) {
      fetchOrganizations(userId);
    }
  }, [userId, fetchOrganizations]);

  // Handlers
  const handleEditClick = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setMessage('');
    // Reset form to original values
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  };

  const handleAvatarChange = () => {
    setShowAvatarUpload(true);
  };

  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    if (!profile) return;
    await updateProfile({ ...form, avatar_url: newAvatarUrl });
    setShowAvatarUpload(false);
  };

  const handleCreateOrganization = async (name: string) => {
    if (!userId) return false;
    const success = await createOrganization(name, userId);
    if (success) {
      setShowCreateOrg(false);
    }
    return success;
  };

  const handleEditOrganization = (orgId: string) => {
    // TODO: Implement organization editing
    console.log('Edit organization:', orgId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Quản lý thông tin cá nhân, bảo mật và tổ chức của bạn
          </p>
        </div>

        {/* Email Verification Banner */}
        <EmailVerificationBanner
          emailVerified={emailVerified}
          email={profile?.email}
          onResendVerification={resendVerification}
          loading={profileLoading}
        />

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          emailVerified={emailVerified}
          onEditClick={handleEditClick}
          onAvatarChange={handleAvatarChange}
          loading={profileLoading}
        />

        {/* Profile Edit Form */}
        {editMode && (
          <ProfileEditForm
            form={form}
            onSave={updateProfile}
            onCancel={handleCancelEdit}
            loading={profileLoading}
            message={message}
            onFormChange={setForm}
          />
        )}

        {/* Security Section */}
        <SecuritySection />

        {/* Organization Section */}
        <OrganizationSection
          organizations={organizations}
          loading={orgLoading}
          error={orgError}
          onCreateOrganization={() => setShowCreateOrg(true)}
          onEditOrganization={handleEditOrganization}
        />

        {/* Modals */}
        <CreateOrganizationModal
          isOpen={showCreateOrg}
          onClose={() => setShowCreateOrg(false)}
          onSubmit={handleCreateOrganization}
          loading={orgLoading}
          error={orgError}
        />

        {showAvatarUpload && (
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            onAvatarChange={handleAvatarUpdate}
            onClose={() => setShowAvatarUpload(false)}
            loading={profileLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 