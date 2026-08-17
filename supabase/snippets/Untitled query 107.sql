-- Add parent_id to match_comments to support nested replies / threads
ALTER TABLE public.match_comments
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.match_comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_match_comments_parent_id ON public.match_comments(parent_id);