-- =====================================================================
-- PGT GLOBAL NETWORK: ADMIN PORTAL CHANNELS & PERMISSIONS MIGRATION
-- Run this in your Supabase Project -> SQL Editor
-- Safe to execute multiple times (idempotent)
-- =====================================================================

-- 1. Ensure contact_messages table exists with all tracking columns
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

-- Add is_read or admin_notes if table already existed without them
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS admin_notes text;

-- 2. Enable Row Level Security (RLS) on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated visitors to submit contact forms
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow administrative / portal read access
DROP POLICY IF EXISTS "Portal can view contact messages" ON public.contact_messages;
CREATE POLICY "Portal can view contact messages"
  ON public.contact_messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow administrative update (e.g. mark as read, add admin notes)
DROP POLICY IF EXISTS "Portal can update contact messages" ON public.contact_messages;
CREATE POLICY "Portal can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow administrative delete
DROP POLICY IF EXISTS "Portal can delete contact messages" ON public.contact_messages;
CREATE POLICY "Portal can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO anon, authenticated
  USING (true);

-- 3. Ensure profiles table has portal read permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Portal can view profiles" ON public.profiles;
CREATE POLICY "Portal can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Ensure applications table (Careers & Team) has all needed columns & portal permissions
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_title text NOT NULL,
  position_type text DEFAULT 'job',
  applicant_details jsonb DEFAULT '{}'::jsonb,
  application_data jsonb DEFAULT '{}'::jsonb,
  resume_url text,
  status text DEFAULT 'Submitted',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure all columns exist regardless of whether the table was created previously
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS applicant_details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS application_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS resume_url text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS application_id text;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon candidates to submit applications
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.applications;
CREATE POLICY "Anyone can insert applications"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow administrative / portal viewing
DROP POLICY IF EXISTS "Portal can view applications" ON public.applications;
CREATE POLICY "Portal can view applications"
  ON public.applications FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow administrative status update
DROP POLICY IF EXISTS "Portal can update applications" ON public.applications;
CREATE POLICY "Portal can update applications"
  ON public.applications FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow administrative deletion
DROP POLICY IF EXISTS "Portal can delete applications" ON public.applications;
CREATE POLICY "Portal can delete applications"
  ON public.applications FOR DELETE
  TO anon, authenticated
  USING (true);

-- 5. High performance RPC functions (Security Definer) for instant data retrieval
CREATE OR REPLACE FUNCTION public.get_admin_contact_messages()
RETURNS SETOF public.contact_messages
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.contact_messages ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_registered_profiles()
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.profiles ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_applications()
RETURNS SETOF public.applications
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.applications ORDER BY created_at DESC;
$$;
