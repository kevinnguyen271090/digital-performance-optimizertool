import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({ isOpen, onClose, userId }) => {
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!orgName.trim()) {
      setError('Vui lòng nhập tên tổ chức');
      setIsLoading(false);
      return;
    }

    try {
      // Bước 1: Tạo organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ 
          name: orgName.trim(),
          description: orgDescription.trim() || null,  // Thêm description
          owner_id: userId  // Thêm owner_id
        })
        .select()
        .single();

      if (orgError || !org) {
        console.error('Organization creation error:', orgError);
        setError(orgError?.message || 'Lỗi tạo tổ chức');
        return;
      }

      // Thành viên owner sẽ được thêm tự động bằng trigger ở backend

      setSuccess(true);
      console.log('Organization created successfully:', org);
      
             // Reset form
       setOrgName('');
       setOrgDescription('');
      
      // Close modal sau 2 giây
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reload page để refresh dashboard
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Create organization exception:', err);
      setError('Không thể tạo tổ chức');
    } finally {
      setIsLoading(false);
    }
  };

     const handleClose = () => {
     if (!isLoading) {
       setOrgName('');
       setOrgDescription('');
       setError('');
       setSuccess(false);
       onClose();
     }
   };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tạo tổ chức mới</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Đóng modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Tạo tổ chức thành công!
                </p>
              </div>
            </div>
          </div>
        ) : (
                     <form onSubmit={handleCreateOrganization} className="space-y-4">
             <div>
               <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                 Tên tổ chức
               </label>
               <input
                 id="orgName"
                 name="orgName"
                 type="text"
                 required
                 className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                 placeholder="Nhập tên tổ chức"
                 value={orgName}
                 onChange={(e) => setOrgName(e.target.value)}
               />
             </div>

             <div>
               <label htmlFor="orgDescription" className="block text-sm font-medium text-gray-700">
                 Mô tả tổ chức
               </label>
               <textarea
                 id="orgDescription"
                 name="orgDescription"
                 rows={3}
                 className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                 placeholder="Mô tả về tổ chức (tùy chọn)"
                 value={orgDescription}
                 onChange={(e) => setOrgDescription(e.target.value)}
               />
             </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading || !orgName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Đang tạo...' : 'Tạo tổ chức'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateOrganizationModal; 