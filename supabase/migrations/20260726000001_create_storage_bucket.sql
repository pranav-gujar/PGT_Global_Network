-- Step 1: Create storage bucket for avatars if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled by default on storage.objects in all Supabase projects.
-- We omit the ALTER TABLE command as it requires superuser ownership privileges.

-- Step 2: Create RLS policies for avatars bucket
-- 1. SELECT: Anyone can read public avatar images
DROP POLICY IF EXISTS "Public Select Avatars" ON storage.objects;
CREATE POLICY "Public Select Avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 2. INSERT: Authenticated users can upload avatars only under their user ID folder
DROP POLICY IF EXISTS "Authenticated Insert Avatars" ON storage.objects;
CREATE POLICY "Authenticated Insert Avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. UPDATE: Authenticated users can update avatars only under their user ID folder
DROP POLICY IF EXISTS "Authenticated Update Avatars" ON storage.objects;
CREATE POLICY "Authenticated Update Avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. DELETE: Authenticated users can delete avatars only under their user ID folder
DROP POLICY IF EXISTS "Authenticated Delete Avatars" ON storage.objects;
CREATE POLICY "Authenticated Delete Avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
