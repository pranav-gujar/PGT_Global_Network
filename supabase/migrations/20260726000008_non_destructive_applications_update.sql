-- Non-destructive migration to transition applications table to new schema
-- Preserves all existing candidate data
-- Idempotency and re-execution safe

-- 1. Create sequence for application IDs starting at 1 if not exists
CREATE SEQUENCE IF NOT EXISTS application_seq START WITH 1;

-- 2. Add new columns to applications table if they do not exist
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS application_id text,
  ADD COLUMN IF NOT EXISTS applicant_details jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resume_url text;

-- 3. Populate applicant_details from legacy application_data (if it exists)
-- Uses dynamic SQL to prevent PostgreSQL compile-time errors after application_data has been dropped.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'applications' 
      AND column_name = 'application_data'
  ) THEN
    EXECUTE 'UPDATE public.applications SET applicant_details = COALESCE(application_data, ''{}''::jsonb) WHERE applicant_details = ''{}''::jsonb OR applicant_details IS NULL';
  END IF;
END $$;

-- 4. Assign unique application IDs for existing records to satisfy uniqueness constraint
UPDATE public.applications 
  SET application_id = 'PGT-2026-' || LPAD(nextval('application_seq')::text, 4, '0') 
  WHERE application_id IS NULL;

-- 5. Enforce constraints on new columns
-- Set default value for new application_ids
ALTER TABLE public.applications 
  ALTER COLUMN application_id SET DEFAULT ('PGT-2026-' || LPAD(nextval('application_seq')::text, 4, '0'));

-- Set application_id to NOT NULL
ALTER TABLE public.applications 
  ALTER COLUMN application_id SET NOT NULL;

-- Make application_id unique (drop first to prevent duplicate constraint error on re-run)
ALTER TABLE public.applications 
  DROP CONSTRAINT IF EXISTS applications_application_id_key;
ALTER TABLE public.applications 
  ADD CONSTRAINT applications_application_id_key UNIQUE (application_id);

-- 6. Transition application status and casing values safely
UPDATE public.applications SET status = 'Submitted' WHERE status = 'pending';
UPDATE public.applications SET status = 'Reviewed' WHERE status = 'reviewed';
UPDATE public.applications SET status = 'Accepted' WHERE status = 'accepted';
UPDATE public.applications SET status = 'Rejected' WHERE status = 'rejected';

-- Set default status to 'Submitted'
ALTER TABLE public.applications ALTER COLUMN status SET DEFAULT 'Submitted';

-- Drop the old status check constraints (checks both potential standard names)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS status_check;

-- Add new status check constraint
ALTER TABLE public.applications 
  ADD CONSTRAINT applications_status_check CHECK (status IN ('Submitted', 'Reviewed', 'Accepted', 'Rejected'));

-- 7. Clean up legacy columns that are no longer used
ALTER TABLE public.applications DROP COLUMN IF EXISTS position_type;
ALTER TABLE public.applications DROP COLUMN IF EXISTS application_data;

-- 8. Create storage bucket for resumes if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage Policies for Resumes
-- 1. SELECT: Anyone can read public resumes via link
DROP POLICY IF EXISTS "Public Select Resumes" ON storage.objects;
CREATE POLICY "Public Select Resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- 2. INSERT: Authenticated users can upload resumes under their user ID folder
DROP POLICY IF EXISTS "Authenticated Insert Resumes" ON storage.objects;
CREATE POLICY "Authenticated Insert Resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. UPDATE: Authenticated users can update resumes under their user ID folder
DROP POLICY IF EXISTS "Authenticated Update Resumes" ON storage.objects;
CREATE POLICY "Authenticated Update Resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. DELETE: Authenticated users can delete resumes under their user ID folder
DROP POLICY IF EXISTS "Authenticated Delete Resumes" ON storage.objects;
CREATE POLICY "Authenticated Delete Resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
