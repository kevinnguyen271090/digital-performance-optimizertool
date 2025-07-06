import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Tạo SSL certificates tự động nếu chưa có
const createSSL = () => {
  const certPath = path.resolve(__dirname, 'server.cert');
  const keyPath = path.resolve(__dirname, 'server.key');
  
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.log('🔐 Tạo SSL certificates cho localhost...');
    
    // Tạo self-signed certificate
    const { execSync } = require('child_process');
    try {
      execSync(`openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.cert -days 365 -nodes -subj "/CN=localhost"`, { cwd: __dirname });
      console.log('✅ SSL certificates đã được tạo');
    } catch (error) {
      console.log('⚠️ Không thể tạo SSL certificates, sử dụng HTTP');
      return false;
    }
  }
  return true;
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    https: createSSL() ? {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.cert')),
    } : undefined
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}); 