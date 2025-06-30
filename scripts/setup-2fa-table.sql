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

-- Thêm comment cho bảng
COMMENT ON TABLE user_2fa IS 'Bảng lưu thông tin 2FA của user';
COMMENT ON COLUMN user_2fa.secret IS 'Secret key để tạo TOTP token';
COMMENT ON COLUMN user_2fa.enabled IS 'Trạng thái bật/tắt 2FA'; 