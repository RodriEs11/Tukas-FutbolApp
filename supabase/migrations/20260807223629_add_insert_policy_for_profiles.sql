CREATE POLICY "Admins can insert profiles" ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
