-- ==============================================================================
-- PGT GLOBAL NETWORK • EXECUTIVE EMAIL STUDIO AUDIT LOGS MIGRATION
-- Table: pgt_email_logs
-- Purpose: Complete archival store of all outbound corporate HTML email dispatches
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pgt_email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text,
  cc text,
  bcc text,
  subject text NOT NULL,
  headline text,
  body_paragraphs text NOT NULL,
  cta_text text,
  cta_url text,
  template_used text DEFAULT 'Custom',
  sender_name text DEFAULT 'PGT Global Network Team',
  sender_role text DEFAULT 'Executive Management Office',
  company_name text DEFAULT 'PGT Global Network',
  website_url text DEFAULT 'https://pgtglobalnetwork.com',
  footer_note text,
  rendered_html text,
  status text DEFAULT 'Delivered',
  provider_message_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pgt_email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can insert email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can delete email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Allow anon all on email logs" ON public.pgt_email_logs;

-- Permissive policy for admin portal operations
CREATE POLICY "Allow anon all on email logs"
  ON public.pgt_email_logs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Index for fast queries by timestamp
CREATE INDEX IF NOT EXISTS idx_pgt_email_logs_created_at
  ON public.pgt_email_logs (created_at DESC);

-- RPC helper to fetch email logs safely bypassing RLS restrictions
CREATE OR REPLACE FUNCTION public.get_admin_email_logs()
RETURNS SETOF public.pgt_email_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.pgt_email_logs ORDER BY created_at DESC;
$$;
