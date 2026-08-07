-- Remove foreign key constraint
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Make ID default to a generated UUID
ALTER TABLE public.user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add new columns for players
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS preferred_foot text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS position text;
