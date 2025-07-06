const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Tạo SSL certificates cho localhost...');

const certPath = path.resolve(__dirname, 'server.cert');
const keyPath = path.resolve(__dirname, 'server.key');

try {
  // Tạo self-signed certificate cho localhost
  execSync(`openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.cert -days 365 -nodes -subj "/CN=localhost"`, { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('✅ SSL certificates đã được tạo thành công!');
  console.log('📁 Certificate files:');
  console.log(`   - ${certPath}`);
  console.log(`   - ${keyPath}`);
  console.log('🚀 Bây giờ bạn có thể chạy: npm run dev');
  
} catch (error) {
  console.error('❌ Lỗi khi tạo SSL certificates:');
  console.error(error.message);
  console.log('');
  console.log('💡 Giải pháp:');
  console.log('1. Cài đặt OpenSSL: https://slproweb.com/products/Win32OpenSSL.html');
  console.log('2. Hoặc sử dụng mkcert: npm install -g mkcert');
  console.log('3. Sau đó chạy lại: node create-ssl.js');
} 