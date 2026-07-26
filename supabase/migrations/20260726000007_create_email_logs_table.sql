-- SQL migration to create the email_logs auditing table
-- Stores lightweight tracking information for all outgoing transactional emails

CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type text NOT NULL,
  recipient text NOT NULL,
  status text NOT NULL CHECK (status IN ('Sent', 'Failed')),
  provider_message_id text,
  error_message text,
  related_id uuid, -- Reference to record (e.g. application_id, contact_msg_id, etc.)
  sent_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Allow only administrators to select/read the email logs
CREATE POLICY "Admins can view email logs"
  ON public.email_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Allow the authenticated service role to insert logs (needed by the Edge Function)
CREATE POLICY "Service role can insert email logs"
  ON public.email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
