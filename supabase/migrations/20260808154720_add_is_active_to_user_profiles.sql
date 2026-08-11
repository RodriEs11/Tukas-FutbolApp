ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;
