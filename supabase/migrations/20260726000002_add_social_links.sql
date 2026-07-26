-- Step 1: Add social media link columns to profiles table if they do not exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS linkedin text,
ADD COLUMN IF NOT EXISTS youtube text,
ADD COLUMN IF NOT EXISTS facebook text;
