-- Allow anonymous (guest) read access to public tables

CREATE POLICY "Anon can view fields" ON public.fields
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can view match_players" ON public.match_players
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can view matches" ON public.matches
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can view profiles" ON public.user_profiles
  FOR SELECT
  TO anon
  USING (true);
