# Hướng dẫn triển khai 2FA với Supabase

## Tổng quan

Hướng dẫn này sẽ giúp bạn triển khai xác thực hai yếu tố (2FA) sử dụng TOTP (Time-based One-Time Password) với Supabase Edge Functions.

## Bước 1: Tạo bảng user_2fa

Chạy script SQL sau trong Supabase SQL Editor:

```sql
-- Tạo bảng user_2fa để lưu thông tin 2FA
CREATE TABLE IF NOT EXISTS user_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);

-- Tạo RLS policies
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;

-- Policy cho phép user chỉ đọc/sửa dữ liệu của chính mình
CREATE POLICY "Users can manage their own 2FA" ON user_2fa
  FOR ALL USING (auth.uid() = user_id);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_user_2fa_updated_at
  BEFORE UPDATE ON user_2fa
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Bước 2: Tạo Edge Function

### 2.1. Tạo thư mục Edge Function

```bash
cd supabase/functions
mkdir two-factor-auth
cd two-factor-auth
```

### 2.2. Tạo file index.ts

Tạo file `supabase/functions/two-factor-auth/index.ts` với nội dung đã được cung cấp.

### 2.3. Tạo file deno.json

Tạo file `supabase/functions/two-factor-auth/deno.json`:

```json
{
  "imports": {
    "std/": "https://deno.land/std@0.168.0/"
  },
  "tasks": {
    "start": "deno run --allow-net --allow-env index.ts"
  }
}
```

## Bước 3: Triển khai Edge Function

### 3.1. Cài đặt Supabase CLI (nếu chưa có)

```bash
npm install -g supabase
```

### 3.2. Đăng nhập vào Supabase

```bash
supabase login
```

### 3.3. Liên kết project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3.4. Triển khai Edge Function

```bash
supabase functions deploy two-factor-auth
```

## Bước 4: Cấu hình Environment Variables

Đảm bảo các biến môi trường sau được cấu hình trong Supabase:

- `SUPABASE_URL`: URL của project Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (tự động có sẵn)

## Bước 5: Test Edge Function

### 5.1. Test Setup 2FA

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/two-factor-auth/setup" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 5.2. Test Verify 2FA

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/two-factor-auth/verify" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token": "123456"}'
```

### 5.3. Test Disable 2FA

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/two-factor-auth/disable" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Bước 6: Cập nhật Frontend

### 6.1. Cập nhật Environment Variables

Thêm vào file `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
```

### 6.2. Cập nhật SecuritySection Component

Component đã được cập nhật để sử dụng Edge Function thực tế.

### 6.3. Cập nhật useProfileSecurity Hook

Hook đã được cập nhật để gọi API thực tế thay vì mock data.

## Bước 7: Sử dụng 2FA

### 7.1. Thiết lập 2FA

1. User đăng nhập vào ứng dụng
2. Vào trang Profile > Security Section
3. Click "Bật 2FA"
4. Quét mã QR bằng ứng dụng xác thực (Google Authenticator, Authy, etc.)
5. Nhập mã 6 số để xác thực
6. 2FA được kích hoạt

### 7.2. Xác thực khi đăng nhập

Khi user đăng nhập với 2FA đã bật:
1. Nhập email/password
2. Nhập mã 6 số từ ứng dụng xác thực
3. Đăng nhập thành công

### 7.3. Tắt 2FA

1. Vào trang Profile > Security Section
2. Click "Tắt 2FA"
3. Xác nhận hành động

## Troubleshooting

### Lỗi thường gặp

1. **401 Unauthorized**: Kiểm tra JWT token và authorization header
2. **500 Internal Server Error**: Kiểm tra logs của Edge Function
3. **QR Code không hiển thị**: Kiểm tra response từ setup endpoint
4. **Mã xác thực không đúng**: Đảm bảo thời gian đồng bộ giữa server và app

### Debug

1. Kiểm tra logs Edge Function:
```bash
supabase functions logs two-factor-auth
```

2. Kiểm tra database:
```sql
SELECT * FROM user_2fa WHERE user_id = 'USER_ID';
```

3. Test với Postman hoặc curl để debug API

## Bảo mật

### Best Practices

1. **Rate Limiting**: Thêm rate limiting cho các endpoint 2FA
2. **Audit Logs**: Log tất cả các hoạt động 2FA
3. **Backup Codes**: Cung cấp backup codes cho user
4. **Session Management**: Quản lý session sau khi bật/tắt 2FA

### Security Considerations

1. **Secret Storage**: Secret được mã hóa trong database
2. **Token Validation**: Validate token với window time
3. **User Consent**: User phải xác nhận khi bật/tắt 2FA
4. **Recovery Process**: Cung cấp quy trình khôi phục tài khoản

## Monitoring

### Metrics cần theo dõi

1. Số lượng user bật 2FA
2. Tỷ lệ thành công/thất bại khi xác thực
3. Thời gian response của Edge Function
4. Số lượng lỗi authentication

### Alerts

1. Edge Function downtime
2. High error rate
3. Unusual authentication patterns

## Kết luận

Với hướng dẫn này, bạn đã có thể triển khai 2FA hoàn chỉnh với Supabase. Hệ thống bao gồm:

- ✅ Database schema với RLS
- ✅ Edge Function với 3 endpoints
- ✅ Frontend integration
- ✅ Security best practices
- ✅ Monitoring và troubleshooting

Hệ thống 2FA này cung cấp bảo mật cao cho ứng dụng của bạn và tuân thủ các tiêu chuẩn bảo mật hiện đại. 