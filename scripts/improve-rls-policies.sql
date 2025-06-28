-- Cải thiện RLS Policies với granular permissions
-- Chạy script này trong Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can only access their organization data" ON organizations;
DROP POLICY IF EXISTS "Users can only access their organization data" ON organization_members;
DROP POLICY IF EXISTS "Users can only access their organization data" ON connections;
DROP POLICY IF EXISTS "Users can only access their organization data" ON imported_data;
DROP POLICY IF EXISTS "Users can only access their organization data" ON analytics_data;
DROP POLICY IF EXISTS "Users can only access their organization data" ON audit_logs;
DROP POLICY IF EXISTS "Users can only access their organization data" ON error_logs;

-- Organizations policies
CREATE POLICY "Users can view their organizations" 
ON organizations FOR SELECT 
USING (id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Organization owners can update their organizations" 
ON organizations FOR UPDATE 
USING (id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND role = 'owner'
));

-- Organization members policies
CREATE POLICY "Users can view organization members" 
ON organization_members FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Organization owners can manage members" 
ON organization_members FOR ALL 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND role = 'owner'
));

-- Connections policies
CREATE POLICY "Users can view their connections" 
ON connections FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create connections" 
ON connections FOR INSERT 
WITH CHECK (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their connections" 
ON connections FOR UPDATE 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete their connections" 
ON connections FOR DELETE 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

-- Imported data policies
CREATE POLICY "Users can view imported data" 
ON imported_data FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create imported data" 
ON imported_data FOR INSERT 
WITH CHECK (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update imported data" 
ON imported_data FOR UPDATE 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete imported data" 
ON imported_data FOR DELETE 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

-- Analytics data policies
CREATE POLICY "Users can view analytics data" 
ON analytics_data FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert analytics data" 
ON analytics_data FOR INSERT 
WITH CHECK (true); -- Allow system inserts via service role

-- Audit logs policies
CREATE POLICY "Users can view audit logs" 
ON audit_logs FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert audit logs" 
ON audit_logs FOR INSERT 
WITH CHECK (true); -- Allow system inserts via service role

-- Error logs policies
CREATE POLICY "Users can view error logs" 
ON error_logs FOR SELECT 
USING (organization_id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "System can insert error logs" 
ON error_logs FOR INSERT 
WITH CHECK (true); -- Allow system inserts via service role

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