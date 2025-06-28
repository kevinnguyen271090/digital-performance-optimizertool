-- Digital Performance Optimizer - Database Setup Script (Simple Version)
-- Chạy script này trong Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analytics_data CASCADE;
DROP TABLE IF EXISTS imported_data CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

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

-- Bảng error_logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50),
  error_message TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Database setup completed! 