-- SQL migration to create the contact_messages table and notification triggers
-- Safe to run multiple times (idempotent)

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL,
  subject text, -- nullable, only used when category = 'Other'
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow anyone (both anonymous visitors and logged in users) to insert/submit contact messages
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow only administrators to view/read contact messages
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 4. Bind the INSERT trigger to fire the notifications via pg_net and our send-emails Edge Function
DROP TRIGGER IF EXISTS tr_new_contact_message_notification ON public.contact_messages;
CREATE TRIGGER tr_new_contact_message_notification
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_application_notification();
