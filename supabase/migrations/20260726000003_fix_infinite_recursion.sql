-- Step 1: Create a SECURITY DEFINER function to check if a user is an admin.
-- Since it runs with the security definer context, it bypasses RLS checks on public.profiles,
-- thereby eliminating the infinite recursion loop.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE((
    SELECT role = 'admin' 
    FROM public.profiles 
    WHERE id = user_id
  ), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop the recursive Admin policy
DROP POLICY IF EXISTS "Admins have full access to all profiles" ON public.profiles;

-- Step 3: Recreate the policy using the secure bypass helper function
CREATE POLICY "Admins have full access to all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    public.is_admin(auth.uid())
  );
