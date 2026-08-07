-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP EXTENSION pg_net;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, nickname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nickname', '')
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;

GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;

GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;

CREATE FUNCTION public.is_admin (
  user_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
$function$;

GRANT ALL ON FUNCTION public.is_admin(uuid) TO anon;

GRANT ALL ON FUNCTION public.is_admin(uuid) TO authenticated;

GRANT ALL ON FUNCTION public.is_admin(uuid) TO service_role;

CREATE FUNCTION public.update_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

GRANT ALL ON FUNCTION public.update_updated_at() TO anon;

GRANT ALL ON FUNCTION public.update_updated_at() TO authenticated;

GRANT ALL ON FUNCTION public.update_updated_at() TO service_role;

CREATE TABLE public.fields (
  id           uuid                     DEFAULT gen_random_uuid() NOT NULL,
  name         text                     NOT NULL,
  location     text                     DEFAULT ''::text,
  surface_type text                     DEFAULT 'césped'::text,
  description  text                     DEFAULT ''::text,
  is_active    boolean                  DEFAULT true NOT NULL,
  created_by   uuid,
  created_at   timestamp with time zone DEFAULT now() NOT NULL,
  updated_at   timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.fields
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.fields
  ADD CONSTRAINT fields_pkey PRIMARY KEY (id);

ALTER TABLE public.fields
  ADD CONSTRAINT fields_surface_type_check CHECK (surface_type = ANY (ARRAY['césped'::text, 'sintético'::text, 'tierra'::text, 'cemento'::text, 'otro'::text]));

GRANT ALL ON public.fields TO anon;

GRANT ALL ON public.fields TO authenticated;

GRANT ALL ON public.fields TO service_role;

CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON public.fields
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE POLICY "Admins can delete fields" ON public.fields
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert fields" ON public.fields
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update fields" ON public.fields
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view fields" ON public.fields
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE public.match_players (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  match_id   uuid                     NOT NULL,
  player_id  uuid                     NOT NULL,
  team       text                     NOT NULL,
  goals      integer                  DEFAULT 0 NOT NULL,
  attended   boolean                  DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.match_players
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.match_players
  ADD CONSTRAINT match_players_match_id_player_id_key UNIQUE (match_id, player_id);

ALTER TABLE public.match_players
  ADD CONSTRAINT match_players_pkey PRIMARY KEY (id);

ALTER TABLE public.match_players
  ADD CONSTRAINT match_players_team_check CHECK (team = ANY (ARRAY['A'::text, 'B'::text]));

GRANT ALL ON public.match_players TO anon;

GRANT ALL ON public.match_players TO authenticated;

GRANT ALL ON public.match_players TO service_role;

CREATE INDEX idx_match_players_match_id ON public.match_players (match_id);

CREATE INDEX idx_match_players_player_id ON public.match_players (player_id);

CREATE POLICY "Admins can delete match_players" ON public.match_players
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert match_players" ON public.match_players
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update match_players" ON public.match_players
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view match_players" ON public.match_players
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE public.matches (
  id           uuid                     DEFAULT gen_random_uuid() NOT NULL,
  field_id     uuid,
  match_date   timestamp with time zone NOT NULL,
  status       text                     DEFAULT 'scheduled'::text NOT NULL,
  score_team_a integer                  DEFAULT 0,
  score_team_b integer                  DEFAULT 0,
  notes        text                     DEFAULT ''::text,
  created_by   uuid,
  created_at   timestamp with time zone DEFAULT now() NOT NULL,
  updated_at   timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.matches
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.matches
  ADD CONSTRAINT matches_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL;

ALTER TABLE public.matches
  ADD CONSTRAINT matches_pkey PRIMARY KEY (id);

ALTER TABLE public.match_players
  ADD CONSTRAINT match_players_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;

ALTER TABLE public.matches
  ADD CONSTRAINT matches_status_check CHECK (status = ANY (ARRAY['scheduled'::text, 'played'::text, 'cancelled'::text]));

GRANT ALL ON public.matches TO anon;

GRANT ALL ON public.matches TO authenticated;

GRANT ALL ON public.matches TO service_role;

CREATE INDEX idx_matches_status ON public.matches (status);

CREATE INDEX idx_matches_match_date ON public.matches (match_date DESC);

CREATE INDEX idx_matches_field_id ON public.matches (field_id);

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE POLICY "Admins can delete matches" ON public.matches
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert matches" ON public.matches
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update matches" ON public.matches
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view matches" ON public.matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE public.user_profiles (
  id         uuid                     NOT NULL,
  first_name text                     DEFAULT ''::text NOT NULL,
  last_name  text                     DEFAULT ''::text NOT NULL,
  nickname   text                     DEFAULT ''::text,
  role       text                     DEFAULT 'player'::text NOT NULL,
  avatar_url text                     DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.user_profiles
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.fields
  ADD CONSTRAINT fields_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.match_players
  ADD CONSTRAINT match_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.matches
  ADD CONSTRAINT matches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_role_check CHECK (role = ANY (ARRAY['player'::text, 'admin'::text]));

GRANT ALL ON public.user_profiles TO anon;

GRANT ALL ON public.user_profiles TO authenticated;

GRANT ALL ON public.user_profiles TO service_role;

CREATE INDEX idx_user_profiles_role ON public.user_profiles (ROLE);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING ((auth.uid() = id))
  WITH CHECK ((auth.uid() = id));

CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);
