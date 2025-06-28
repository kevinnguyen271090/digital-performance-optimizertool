-- Sửa lỗi infinite recursion trong RLS policies
-- Chạy script này trong Supabase SQL Editor

-- Drop existing policies có vấn đề
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners can manage members" ON organization_members;

-- Tạo policy đơn giản hơn để tránh recursion
CREATE POLICY "Users can view their organization members" 
ON organization_members FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert themselves to organization" 
ON organization_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Policy cho organizations
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON organizations;

CREATE POLICY "Users can view their organizations" 
ON organizations FOR SELECT 
USING (id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create organizations" 
ON organizations FOR INSERT 
WITH CHECK (true);

-- Policy cho connections
DROP POLICY IF EXISTS "Users can view their connections" ON connections;
DROP POLICY IF EXISTS "Users can create connections" ON connections;
DROP POLICY IF EXISTS "Users can update their connections" ON connections;
DROP POLICY IF EXISTS "Users can delete their connections" ON connections;

CREATE POLICY "Users can manage their connections" 
ON connections FOR ALL 
USING (user_id = auth.uid());

-- Policy cho analytics_data
DROP POLICY IF EXISTS "Users can view analytics data" ON analytics_data;
DROP POLICY IF EXISTS "System can insert analytics data" ON analytics_data;

CREATE POLICY "Users can view their analytics data" 
ON analytics_data FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert analytics data" 
ON analytics_data FOR INSERT 
WITH CHECK (true);

-- Policy cho audit_logs
DROP POLICY IF EXISTS "Users can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

CREATE POLICY "Users can view their audit logs" 
ON audit_logs FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert audit logs" 
ON audit_logs FOR INSERT 
WITH CHECK (true);

-- Policy cho error_logs
DROP POLICY IF EXISTS "Users can view error logs" ON error_logs;
DROP POLICY IF EXISTS "System can insert error logs" ON error_logs;

CREATE POLICY "Users can view their error logs" 
ON error_logs FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert error logs" 
ON error_logs FOR INSERT 
WITH CHECK (true);

-- Policy cho imported_data
DROP POLICY IF EXISTS "Users can view imported data" ON imported_data;
DROP POLICY IF EXISTS "Users can create imported data" ON imported_data;
DROP POLICY IF EXISTS "Users can update imported data" ON imported_data;
DROP POLICY IF EXISTS "Users can delete imported data" ON imported_data;

CREATE POLICY "Users can manage their imported data" 
ON imported_data FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

-- Kiểm tra policies đã tạo
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 