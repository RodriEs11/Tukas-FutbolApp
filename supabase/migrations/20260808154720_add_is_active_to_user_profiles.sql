ALTER TABLE public.user_profiles
ADD COLUMN is_active boolean DEFAULT true NOT NULL;
