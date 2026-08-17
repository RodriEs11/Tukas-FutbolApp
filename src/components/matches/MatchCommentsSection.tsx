'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentCard } from './CommentCard';
import type { MatchComment } from '@/lib/types/database';

interface MatchCommentsSectionProps {
  matchId: string;
  isAdmin: boolean;
}

const PAGE_SIZE = 10;

export function MatchCommentsSection({ matchId, isAdmin }: MatchCommentsSectionProps) {
  const [comments, setComments] = useState<MatchComment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchComments = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/comments?matchId=${matchId}&page=${targetPage}&pageSize=${PAGE_SIZE}`
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchComments(page);
  }, [page, fetchComments]);

  const handleCommentAdded = () => {
    setPage(1);
    fetchComments(1);
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setTotal((prev) => prev - 1);
  };

  const handleReplyAdded = (parentId: string, newReply: MatchComment) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          const currentReplies = c.replies || [];
          return {
            ...c,
            replies: [...currentReplies, newReply],
          };
        }
        return c;
      })
    );
  };

  const handleReplyDeleted = (parentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: (c.replies || []).filter((r) => r.id !== replyId),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="mt-8 animate-slide-up delay-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-accent" />
        <h2 className="text-lg font-semibold text-foreground">
          Comentarios
        </h2>
        {total > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {total}
          </span>
        )}
      </div>

      {/* Comment Form */}
      <div className="mb-6">
        <CommentForm matchId={matchId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card/80 border border-border rounded-2xl p-4 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="w-20 h-3 bg-muted rounded" />
                  <div className="w-28 h-2 bg-muted rounded" />
                </div>
              </div>
              <div className="w-3/4 h-3 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare size={32} className="mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onReplyAdded={handleReplyAdded}
                onReplyDeleted={handleReplyDeleted}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
