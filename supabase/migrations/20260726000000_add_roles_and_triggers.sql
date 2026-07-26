-- Step 1: Add role column to profiles table with CHECK constraint
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL CHECK (role IN ('admin', 'team_member', 'volunteer', 'user')) DEFAULT 'user';

-- Step 2: Create trigger function to automatically create public.profiles row on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, bio, location, website)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = excluded.email,
    full_name = COALESCE(excluded.full_name, public.profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Bind the trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Re-evaluate and tighten Row Level Security (RLS) on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to all profiles" ON public.profiles;

-- Owner can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Owner can update their own profile fields
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to prevent users from changing their own role (only admin can change role)
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS trigger AS $$
BEGIN
  -- If the update is initiated by a client (auth.uid() is not null) and they are not an admin
  IF auth.uid() IS NOT NULL AND NEW.role <> OLD.role AND COALESCE((
    SELECT role FROM public.profiles WHERE id = auth.uid()
  ), 'user') <> 'admin' THEN
    NEW.role = OLD.role; -- Revert role change
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS before_profile_role_update ON public.profiles;
CREATE TRIGGER before_profile_role_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_update();

-- Admin policies
CREATE POLICY "Admins have full access to all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()), 'user') = 'admin'
  );
