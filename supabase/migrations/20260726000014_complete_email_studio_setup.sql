-- ==============================================================================
-- PGT GLOBAL NETWORK • ALL-IN-ONE CONSOLIDATED EMAIL STUDIO AUDIT LOGS SETUP
-- Run this in your Supabase Dashboard -> SQL Editor to enable full multi-device
-- cloud persistence for outbound emails & attachment metadata.
-- ==============================================================================

-- 1. Create table with all required columns
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
  attachments jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'Delivered',
  provider_message_id text,
  created_at timestamptz DEFAULT now()
);

-- 2. Ensure attachments column exists if table was previously created
ALTER TABLE public.pgt_email_logs 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- 3. Enable Row Level Security
ALTER TABLE public.pgt_email_logs ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any previous policies
DROP POLICY IF EXISTS "Public can view email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can insert email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can delete email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Allow anon all on email logs" ON public.pgt_email_logs;

-- 5. Create permissive policy for administrative operations
CREATE POLICY "Allow anon all on email logs"
  ON public.pgt_email_logs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 6. Create high-performance timestamp index
CREATE INDEX IF NOT EXISTS idx_pgt_email_logs_created_at
  ON public.pgt_email_logs (created_at DESC);

-- 7. High-reliability SECURITY DEFINER RPC function for direct querying
CREATE OR REPLACE FUNCTION public.get_admin_email_logs()
RETURNS SETOF public.pgt_email_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.pgt_email_logs ORDER BY created_at DESC;
$$;
