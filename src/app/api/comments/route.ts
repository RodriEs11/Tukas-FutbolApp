import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { MatchComment } from '@/lib/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId es requerido.' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: 'Error al obtener comentarios.' },
        { status: 500 }
      );
    }

    const commentsList = (rootComments as unknown as MatchComment[]) || [];

    // If there are root comments, fetch replies for them
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

    return NextResponse.json({
      comments: commentsList,
      total: count || 0,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_COMMENTS_PER_WINDOW = 5;
const MAX_MEDIA_PER_COMMENT = 3;

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_COMMENTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados comentarios. Esperá un momento antes de publicar otro.' },
        { status: 429 }
      );
    }

    const { matchId, nickname, content, media, parentId } = await request.json();

    // Validate required fields
    if (!matchId || !nickname?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'El apodo y el comentario son obligatorios.' },
        { status: 400 }
      );
    }

    const trimmedNickname = nickname.trim();
    const trimmedContent = content.trim();

    if (trimmedNickname.length > 30) {
      return NextResponse.json(
        { error: 'El apodo no puede superar los 30 caracteres.' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 500) {
      return NextResponse.json(
        { error: 'El comentario no puede superar los 500 caracteres.' },
        { status: 400 }
      );
    }

    if (media && media.length > MAX_MEDIA_PER_COMMENT) {
      return NextResponse.json(
        { error: `Máximo ${MAX_MEDIA_PER_COMMENT} archivos por comentario.` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify match exists
    const { data: match } = await supabase
      .from('matches')
      .select('id')
      .eq('id', matchId)
      .single();

    if (!match) {
      return NextResponse.json(
        { error: 'Partido no encontrado.' },
        { status: 404 }
      );
    }

    // If parentId provided, verify parent comment exists
    if (parentId) {
      const { data: parentComment } = await supabase
        .from('match_comments')
        .select('id, match_id')
        .eq('id', parentId)
        .single();

      if (!parentComment || parentComment.match_id !== matchId) {
        return NextResponse.json(
          { error: 'Comentario original no encontrado.' },
          { status: 404 }
        );
      }
    }

    // Insert comment or reply
    const insertPayload: Record<string, unknown> = {
      match_id: matchId,
      nickname: trimmedNickname,
      content: trimmedContent,
      ip_address: ip,
    };

    if (parentId) {
      insertPayload.parent_id = parentId;
    }

    const { data: comment, error: commentError } = await supabase
      .from('match_comments')
      .insert(insertPayload)
      .select()
      .single();

    if (commentError) {
      console.error('Error inserting comment:', commentError);
      return NextResponse.json(
        { error: 'Error al publicar el comentario.' },
        { status: 500 }
      );
    }

    // Insert media only if this is a root comment (not a reply) and has media
    if (!parentId && media && media.length > 0) {
      const mediaPayload = media.map((m: { fileKey: string; fileType: string; fileName: string; fileSize: number; mimeType: string }) => ({
        comment_id: comment.id,
        file_key: m.fileKey,
        file_type: m.fileType,
        file_name: m.fileName,
        file_size: m.fileSize,
        mime_type: m.mimeType,
      }));

      const { error: mediaError } = await supabase
        .from('comment_media')
        .insert(mediaPayload as Record<string, unknown>[]);

      if (mediaError) {
        console.error('Error inserting media:', mediaError);
      }
    }

    return NextResponse.json({
      success: true,
      commentId: comment.id,
      comment: {
        id: comment.id,
        match_id: matchId,
        parent_id: parentId || null,
        nickname: trimmedNickname,
        content: trimmedContent,
        created_at: comment.created_at || new Date().toISOString(),
        replies: [],
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

