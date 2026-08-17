-- Add match comments and comment media tables

CREATE TABLE IF NOT EXISTS public.match_comments (
  id          uuid DEFAULT gen_random_uuid() NOT NULL,
  match_id    uuid NOT NULL,
  nickname    text NOT NULL,
  content     text NOT NULL,
  ip_address  inet,
  created_at  timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.match_comments
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.match_comments
  ADD CONSTRAINT match_comments_pkey PRIMARY KEY (id);

ALTER TABLE public.match_comments
  ADD CONSTRAINT match_comments_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;

ALTER TABLE public.match_comments
  ADD CONSTRAINT match_comments_nickname_length CHECK (char_length(nickname) BETWEEN 1 AND 30);

ALTER TABLE public.match_comments
  ADD CONSTRAINT match_comments_content_length CHECK (char_length(content) BETWEEN 1 AND 500);

GRANT ALL ON public.match_comments TO anon;
GRANT ALL ON public.match_comments TO authenticated;
GRANT ALL ON public.match_comments TO service_role;

CREATE INDEX idx_match_comments_match_id ON public.match_comments(match_id);
CREATE INDEX idx_match_comments_created_at ON public.match_comments(created_at DESC);

CREATE POLICY "Anyone can view comments" ON public.match_comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert comments" ON public.match_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete comments" ON public.match_comments
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Comment media table

CREATE TABLE IF NOT EXISTS public.comment_media (
  id          uuid DEFAULT gen_random_uuid() NOT NULL,
  comment_id  uuid NOT NULL,
  file_key    text NOT NULL,
  file_type   text NOT NULL,
  file_name   text NOT NULL,
  file_size   integer NOT NULL,
  mime_type   text NOT NULL,
  created_at  timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.comment_media
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.comment_media
  ADD CONSTRAINT comment_media_pkey PRIMARY KEY (id);

ALTER TABLE public.comment_media
  ADD CONSTRAINT comment_media_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.match_comments(id) ON DELETE CASCADE;

ALTER TABLE public.comment_media
  ADD CONSTRAINT comment_media_file_type_check CHECK (file_type = ANY (ARRAY['image'::text, 'video'::text]));

GRANT ALL ON public.comment_media TO anon;
GRANT ALL ON public.comment_media TO authenticated;
GRANT ALL ON public.comment_media TO service_role;

CREATE INDEX idx_comment_media_comment_id ON public.comment_media(comment_id);

CREATE POLICY "Anyone can view media" ON public.comment_media
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert media" ON public.comment_media
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete media" ON public.comment_media
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));
