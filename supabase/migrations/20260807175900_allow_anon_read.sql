-- Allow anonymous (guest) read access to public tables

DROP POLICY IF EXISTS "Anon can view fields" ON public.fields;
CREATE POLICY "Anon can view fields" ON public.fields
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Anon can view match_players" ON public.match_players;
CREATE POLICY "Anon can view match_players" ON public.match_players
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Anon can view matches" ON public.matches;
CREATE POLICY "Anon can view matches" ON public.matches
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Anon can view profiles" ON public.user_profiles;
CREATE POLICY "Anon can view profiles" ON public.user_profiles
  FOR SELECT
  TO anon
  USING (true);
