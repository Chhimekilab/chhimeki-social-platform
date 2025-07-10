-- Migration: 001_initial_schema
-- Description: Initial database schema for Chhimeki Social Platform
-- Author: Chhimeki Team
-- Date: 2025-01-11

-- Create migrations tracking table first
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_by VARCHAR(100) DEFAULT current_user,
  checksum VARCHAR(64),
  execution_time_ms INTEGER,
  rollback_sql TEXT
);

-- Enable RLS on migrations table
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

-- Create policy for migrations table (read-only for authenticated users)
CREATE POLICY "Anyone can view migrations" ON public.schema_migrations
  FOR SELECT USING (true);

-- Insert this migration record
INSERT INTO public.schema_migrations (version, name, description) VALUES 
('001', 'initial_schema', 'Initial database schema for Chhimeki Social Platform')
ON CONFLICT (version) DO NOTHING;

-- Create application version tracking table
CREATE TABLE IF NOT EXISTS public.app_versions (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  release_notes TEXT,
  git_hash VARCHAR(40),
  build_number INTEGER,
  environment VARCHAR(20) DEFAULT 'production',
  is_active BOOLEAN DEFAULT false,
  schema_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100) DEFAULT current_user
);

-- Enable RLS on app versions table
ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;

-- Create policy for app versions table
CREATE POLICY "Anyone can view app versions" ON public.app_versions
  FOR SELECT USING (true);

-- Create index on version and environment
CREATE INDEX IF NOT EXISTS idx_app_versions_version ON public.app_versions(version);
CREATE INDEX IF NOT EXISTS idx_app_versions_environment ON public.app_versions(environment);
CREATE INDEX IF NOT EXISTS idx_app_versions_active ON public.app_versions(is_active);

-- Insert initial version
INSERT INTO public.app_versions (
  version, 
  release_notes, 
  git_hash, 
  environment, 
  is_active, 
  schema_version
) VALUES (
  '1.0.0',
  'Initial release of Chhimeki Social Platform with Supabase integration',
  'initial',
  'development',
  true,
  '001'
) ON CONFLICT DO NOTHING;

-- Create function to get current schema version
CREATE OR REPLACE FUNCTION get_schema_version()
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN (
    SELECT version 
    FROM public.schema_migrations 
    ORDER BY applied_at DESC 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current app version
CREATE OR REPLACE FUNCTION get_app_version(env VARCHAR(20) DEFAULT 'production')
RETURNS TABLE(
  version VARCHAR(50),
  release_date TIMESTAMP WITH TIME ZONE,
  git_hash VARCHAR(40),
  schema_version VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    av.version,
    av.release_date,
    av.git_hash,
    av.schema_version
  FROM public.app_versions av
  WHERE av.environment = env AND av.is_active = true
  ORDER BY av.release_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to register new app version
CREATE OR REPLACE FUNCTION register_app_version(
  p_version VARCHAR(50),
  p_release_notes TEXT DEFAULT NULL,
  p_git_hash VARCHAR(40) DEFAULT NULL,
  p_environment VARCHAR(20) DEFAULT 'production',
  p_schema_version VARCHAR(50) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_schema_ver VARCHAR(50);
BEGIN
  -- Get current schema version if not provided
  IF p_schema_version IS NULL THEN
    current_schema_ver := get_schema_version();
  ELSE
    current_schema_ver := p_schema_version;
  END IF;

  -- Deactivate previous versions in the same environment
  UPDATE public.app_versions 
  SET is_active = false 
  WHERE environment = p_environment AND is_active = true;

  -- Insert new version
  INSERT INTO public.app_versions (
    version,
    release_notes,
    git_hash,
    environment,
    is_active,
    schema_version
  ) VALUES (
    p_version,
    p_release_notes,
    p_git_hash,
    p_environment,
    true,
    current_schema_ver
  );

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for version compatibility
CREATE OR REPLACE VIEW public.version_compatibility AS
SELECT 
  av.version as app_version,
  av.environment,
  av.release_date,
  av.is_active,
  av.schema_version,
  sm.name as schema_name,
  sm.applied_at as schema_applied_at,
  CASE 
    WHEN av.schema_version = get_schema_version() THEN 'compatible'
    WHEN av.schema_version < get_schema_version() THEN 'needs_migration'
    ELSE 'future_schema'
  END as compatibility_status
FROM public.app_versions av
LEFT JOIN public.schema_migrations sm ON av.schema_version = sm.version
ORDER BY av.release_date DESC;

-- Grant necessary permissions
GRANT SELECT ON public.schema_migrations TO authenticated;
GRANT SELECT ON public.app_versions TO authenticated;
GRANT SELECT ON public.version_compatibility TO authenticated;
GRANT EXECUTE ON FUNCTION get_schema_version() TO authenticated;
GRANT EXECUTE ON FUNCTION get_app_version(VARCHAR) TO authenticated;