'use server';

import { createClient } from '@/lib/supabase/server';
import type { MatchComment } from '@/lib/types/database';

export async function getCommentsByMatch(
  matchId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ comments: MatchComment[]; total: number }> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count of root comments only
  const { count } = await supabase
    .from('match_comments')
    .select('*', { count: 'exact', head: true })
    .eq('match_id', matchId)
    .is('parent_id', null);

  // Get paginated root comments with media
  const { data: rootComments, error: rootError } = await supabase
    .from('match_comments')
    .select(`
      id,
      match_id,
      parent_id,
      nickname,
      content,
      created_at,
      comment_media(*)
    `)
    .eq('match_id', matchId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (rootError) {
    console.error('Error fetching comments:', rootError);
    return { comments: [], total: 0 };
  }

  const commentsList = (rootComments as unknown as MatchComment[]) || [];

  // Fetch replies for root comments
  if (commentsList.length > 0) {
    const parentIds = commentsList.map((c) => c.id);

    const { data: repliesData, error: repliesError } = await supabase
      .from('match_comments')
      .select(`
        id,
        match_id,
        parent_id,
        nickname,
        content,
        created_at
      `)
      .in('parent_id', parentIds)
      .order('created_at', { ascending: true });

    if (!repliesError && repliesData) {
      const repliesByParent: Record<string, MatchComment[]> = {};
      for (const reply of repliesData as unknown as MatchComment[]) {
        if (reply.parent_id) {
          if (!repliesByParent[reply.parent_id]) {
            repliesByParent[reply.parent_id] = [];
          }
          repliesByParent[reply.parent_id].push(reply);
        }
      }

      for (const comment of commentsList) {
        comment.replies = repliesByParent[comment.id] || [];
      }
    }
  }

  return {
    comments: commentsList,
    total: count || 0,
  };
}
