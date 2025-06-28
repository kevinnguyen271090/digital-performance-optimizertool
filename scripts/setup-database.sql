-- Digital Performance Optimizer - Database Setup Script
-- Chạy script này trong Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Function để kiểm tra bảng tồn tại
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  );
END;
$$ LANGUAGE plpgsql;

-- Drop existing tables if they exist (for clean setup)
DO $$
BEGIN
  -- Drop tables in reverse dependency order
  IF table_exists('error_logs') THEN
    DROP TABLE error_logs CASCADE;
    RAISE NOTICE 'Dropped table: error_logs';
  END IF;
  
  IF table_exists('audit_logs') THEN
    DROP TABLE audit_logs CASCADE;
    RAISE NOTICE 'Dropped table: audit_logs';
  END IF;
  
  IF table_exists('analytics_data') THEN
    DROP TABLE analytics_data CASCADE;
    RAISE NOTICE 'Dropped table: analytics_data';
  END IF;
  
  IF table_exists('imported_data') THEN
    DROP TABLE imported_data CASCADE;
    RAISE NOTICE 'Dropped table: imported_data';
  END IF;
  
  IF table_exists('connections') THEN
    DROP TABLE connections CASCADE;
    RAISE NOTICE 'Dropped table: connections';
  END IF;
  
  IF table_exists('organization_members') THEN
    DROP TABLE organization_members CASCADE;
    RAISE NOTICE 'Dropped table: organization_members';
  END IF;
  
  IF table_exists('organizations') THEN
    DROP TABLE organizations CASCADE;
    RAISE NOTICE 'Dropped table: organizations';
  END IF;
END $$;

-- Bảng organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  domain VARCHAR(100),
  plan VARCHAR(50) DEFAULT 'free',
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: organizations';
END $$;

-- Bảng organization_members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: organization_members';
END $$;

-- Bảng connections
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  service VARCHAR(100),
  credentials JSONB NOT NULL,
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'connected',
  last_sync TIMESTAMP,
  sync_frequency VARCHAR(20) DEFAULT 'hourly',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: connections';
END $$;

-- Bảng imported_data
CREATE TABLE imported_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  data_source_id UUID REFERENCES connections(id),
  table_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  schema_definition JSONB,
  row_count INTEGER DEFAULT 0,
  imported_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: imported_data';
END $$;

-- Bảng analytics_data (cho real-time data)
CREATE TABLE analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  service VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  metrics JSONB NOT NULL,
  dimensions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: analytics_data';
END $$;

-- Bảng audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: audit_logs';
END $$;

-- Bảng error_logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50),
  error_message TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

DO $$ BEGIN
  RAISE NOTICE 'Created table: error_logs';
END $$;

-- Cleanup function
DROP FUNCTION IF EXISTS table_exists(text);

DO $$ BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
END $$; 