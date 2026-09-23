-- ==============================================================================
-- PGT GLOBAL NETWORK • ADD ATTACHMENTS TO EXECUTIVE EMAIL STUDIO LOGS
-- Table: pgt_email_logs
-- Purpose: Support storing attached files metadata and content
-- ==============================================================================

ALTER TABLE public.pgt_email_logs 
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Re-create or replace the RPC helper so returned records include attachments
CREATE OR REPLACE FUNCTION public.get_admin_email_logs()
RETURNS SETOF public.pgt_email_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.pgt_email_logs ORDER BY created_at DESC;
$$;
