import React, { useState } from 'react';

interface AuthFormProps {
  isRegister: boolean;
  onSubmit: (email: string, password: string, username?: string) => void;
  onGoogleLogin: () => void;
  loading: boolean;
  error: string | null;
  switchMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegister,
  onSubmit,
  onGoogleLogin,
  loading,
  error,
  switchMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, username);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isRegister && (
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md mb-4"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              required
            />
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center font-semibold">
          {error}
        </div>
      )}
      <button
        type="submit"
        style={{ background: '#2563eb', color: '#fff', fontWeight: 600 }}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
      >
        {loading ? 'Đang tải...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
      </button>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-black hover:bg-gray-50 transition-all duration-150"
        >
          Đăng nhập bằng Google
        </button>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {isRegister ? (
            <>
              Đã có tài khoản?{' '}
              <button type="button" onClick={switchMode} className="font-medium text-accent hover:text-accent/80">Đăng nhập</button>
            </>
          ) : (
            <>
              Chưa có tài khoản?{' '}
              <button type="button" onClick={switchMode} className="font-medium text-accent hover:text-accent/80">Tạo tài khoản</button>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default AuthForm; 