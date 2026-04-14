-- LocalGenius Site Provisions Migration
-- Creates the state machine table for site provisioning lifecycle
-- Requirement: REQ-026 — Neon hosts state machine for site provisioning lifecycle
--
-- States: pending → generating → uploading → dns_configuring → provisioned → failed
--
-- Multi-tenant: organization_id + business_id enable RLS enforcement
-- All queries scoped by status for queue processing

-- Create enum for site provision status
CREATE TYPE site_provision_status AS ENUM (
  'pending',
  'generating',
  'uploading',
  'dns_configuring',
  'provisioned',
  'failed'
);

-- Create site_provisions table
CREATE TABLE site_provisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Multi-tenant identifiers for RLS enforcement
  site_id TEXT NOT NULL,
  organization_id UUID NOT NULL,
  business_id UUID NOT NULL,

  -- State Machine Fields
  status site_provision_status NOT NULL DEFAULT 'pending',
  current_step TEXT,

  -- Error Handling & Retry Logic
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_retry_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Queue index for finding provisions to process (by status)
CREATE INDEX idx_site_provisions_status ON site_provisions(status);

-- Business scoping index
CREATE INDEX idx_site_provisions_business ON site_provisions(business_id);

-- Organization scoping index
CREATE INDEX idx_site_provisions_org ON site_provisions(organization_id);

-- Composite index for retry logic
CREATE INDEX idx_site_provisions_retry ON site_provisions(status, last_retry_at);

-- Enable Row-Level Security (RLS)
ALTER TABLE site_provisions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see provisions for their organization
CREATE POLICY site_provisions_org_isolation ON site_provisions
  FOR SELECT
  USING (organization_id = current_setting('app.organization_id')::UUID);

-- RLS Policy: Users can only insert/update provisions for their organization
CREATE POLICY site_provisions_org_write ON site_provisions
  FOR INSERT
  WITH CHECK (organization_id = current_setting('app.organization_id')::UUID);

CREATE POLICY site_provisions_org_update ON site_provisions
  FOR UPDATE
  USING (organization_id = current_setting('app.organization_id')::UUID)
  WITH CHECK (organization_id = current_setting('app.organization_id')::UUID);

-- Grant appropriate permissions
-- (Adjust roles as needed for your deployment environment)
GRANT SELECT, INSERT, UPDATE ON site_provisions TO authenticated;
