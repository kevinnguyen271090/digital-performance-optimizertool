import React, { useState, useEffect } from 'react'
import { Lock, Shield, Eye, EyeOff, CheckCircle, History } from 'lucide-react'
import { useProfileSecurity } from '../../hooks/useProfileSecurity'

export const SecuritySection: React.FC = () => {
  const {
    loading,
    securityState,
    message,
    messageType,
    isChangingPassword,
    changePassword,
    twoFactorStatus,
    isSettingUp2FA,
    isVerifying2FA,
    isDisabling2FA,
    setup2FA,
    verify2FA,
    disable2FA,
    getLoginHistory,
    clearMessage,
    check2FAStatus
  } = useProfileSecurity()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [show2FAToken, setShow2FAToken] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [show2FAForm, setShow2FAForm] = useState(false)

  useEffect(() => {
    check2FAStatus()
    getLoginHistory()
  }, [check2FAStatus, getLoginHistory])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, clearMessage])

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      // Error handled by hook
    }
  }

  const handle2FASetup = async () => {
    try {
      await setup2FA()
      setShow2FAForm(true)
    } catch (error) {
      // Error handled by hook
    }
  }

  const handle2FAVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!twoFactorToken) return

    try {
      await verify2FA(twoFactorToken)
      setTwoFactorToken('')
      setShow2FAForm(false)
    } catch (error) {
      // Error handled by hook
    }
  }

  const handle2FADisable = async () => {
    try {
      await disable2FA()
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg border ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          <div className="flex items-center gap-2">
            <CheckCircle className={`h-4 w-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Password Security */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Bảo mật mật khẩu</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">Mật khẩu</p>
            <p className="text-sm text-gray-600">
              Cập nhật lần cuối: {securityState.lastPasswordChange ? new Date(securityState.lastPasswordChange).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            </p>
          </div>
          <button 
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            Thay đổi mật khẩu
          </button>
        </div>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium">Mật khẩu hiện tại</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-sm text-red-600">Mật khẩu xác nhận không khớp</p>
            )}
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isChangingPassword}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
              >
                {isChangingPassword ? 'Đang thay đổi...' : 'Cập nhật mật khẩu'}
              </button>
              <button 
                type="button" 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="  bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Xác thực hai yếu tố (2FA)</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Bảo vệ tài khoản bằng mã xác thực từ ứng dụng di động</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="font-medium">Trạng thái 2FA</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${twoFactorStatus.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{twoFactorStatus.enabled ? 'Đã bật' : 'Chưa bật'}</span>
          </div>
          {!twoFactorStatus.enabled ? (
            <button 
              onClick={handle2FASetup}
              disabled={isSettingUp2FA}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
            >
              {isSettingUp2FA ? 'Đang thiết lập...' : 'Bật 2FA'}
            </button>
          ) : (
            <button 
              onClick={handle2FADisable}
              disabled={isDisabling2FA}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium"
            >
              {isDisabling2FA ? 'Đang tắt...' : 'Tắt 2FA'}
            </button>
          )}
        </div>
        {twoFactorStatus.qrCode && (
          <div className="p-4 border rounded-lg bg-gray-50 mb-4">
            <p className="text-sm font-medium mb-2">Quét mã QR bằng ứng dụng xác thực:</p>
            <div className="flex items-center gap-4">
              <img 
                src={twoFactorStatus.qrCode} 
                alt="QR Code" 
                className="w-32 h-32 border rounded"
              />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Sử dụng ứng dụng như Google Authenticator, Authy, hoặc Microsoft Authenticator
                </p>
                <p className="text-sm text-gray-600">
                  Secret: <code className="bg-gray-200 px-1 rounded text-xs">{twoFactorStatus.secret}</code>
                </p>
              </div>
            </div>
          </div>
        )}
        {show2FAForm && (
          <form onSubmit={handle2FAVerification} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <label htmlFor="twoFactorToken" className="block text-sm font-medium">Mã xác thực 6 số</label>
              <div className="relative">
                <input
                  id="twoFactorToken"
                  type={show2FAToken ? 'text' : 'password'}
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShow2FAToken(!show2FAToken)}
                >
                  {show2FAToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isVerifying2FA}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
              >
                {isVerifying2FA ? 'Đang xác thực...' : 'Xác thực'}
              </button>
              <button 
                type="button" 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setShow2FAForm(false)
                  setTwoFactorToken('')
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Login History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Lịch sử đăng nhập</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Theo dõi các hoạt động đăng nhập gần đây</p>
        {loading ? (
          <p className="text-gray-600">Đang tải lịch sử...</p>
        ) : (
          <div className="space-y-3">
            {securityState.loginHistory.map((login, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{login.device}</p>
                  <p className="text-sm text-gray-600">{login.location}</p>
                  <p className="text-xs text-gray-500">IP: {login.ip}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(login.timestamp).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(login.timestamp).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 