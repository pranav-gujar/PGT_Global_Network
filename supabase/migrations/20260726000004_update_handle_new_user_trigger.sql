-- Update the trigger function to support raw OAuth metadata fields like 'name', 'avatar_url', and 'picture'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, bio, location, website)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    'user',
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      ''
    ),
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = excluded.email,
    full_name = COALESCE(excluded.full_name, public.profiles.full_name),
    avatar_url = COALESCE(excluded.avatar_url, public.profiles.avatar_url);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
