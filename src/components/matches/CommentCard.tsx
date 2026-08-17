'use client';

import { useState } from 'react';
import { Trash2, User, Clock, MessageSquare, CornerDownRight, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/helpers';
import { CommentMediaPreview } from './CommentMediaPreview';
import type { MatchComment } from '@/lib/types/database';

interface CommentCardProps {
  comment: MatchComment;
  isAdmin: boolean;
  onDelete?: (commentId: string) => void;
  onReplyAdded?: (parentId: string, reply: MatchComment) => void;
  onReplyDeleted?: (parentId: string, replyId: string) => void;
}

export function CommentCard({
  comment,
  isAdmin,
  onDelete,
  onReplyAdded,
  onReplyDeleted,
}: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyNickname, setReplyNickname] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Replies visibility toggle
  const replies = comment.replies || [];
  const [showReplies, setShowReplies] = useState(false);

  // Deleting specific reply
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete?.(comment.id);
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError(null);

    if (!replyNickname.trim() || !replyContent.trim()) {
      setReplyError('Completá el apodo y la respuesta.');
      return;
    }

    setIsSubmittingReply(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: comment.match_id,
          parentId: comment.id,
          nickname: replyNickname.trim(),
          content: replyContent.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al responder');
      }

      const data = await res.json();
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true); // Automatically expand replies

      if (onReplyAdded && data.comment) {
        onReplyAdded(comment.id, data.comment);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al responder.';
      setReplyError(msg);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    setDeletingReplyId(replyId);
    try {
      const res = await fetch(`/api/comments/${replyId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onReplyDeleted?.(comment.id, replyId);
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar respuesta');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setDeletingReplyId(null);
    }
  };

  return (
    <div className="bg-card/85 backdrop-blur-sm border border-border/80 rounded-2xl p-4 sm:p-5 animate-fade-in shadow-sm">
      {/* Header: nickname + date + delete */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
            <User size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {comment.nickname}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={11} />
              <span>{formatDateTime(comment.created_at)}</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex-shrink-0">
            {showConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-destructive text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-2 py-1 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Eliminar comentario"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="mt-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
        {comment.content}
      </p>

      {/* Media Attachments */}
      {comment.comment_media && comment.comment_media.length > 0 && (
        <CommentMediaPreview media={comment.comment_media} />
      )}

      {/* Footer bar: Full-width clickable Reply Button (hidden when replies are expanded) + Replies counter toggle */}
      <div className="flex items-center justify-between gap-3 mt-3.5 pt-2 border-t border-border/40 text-xs">
        {/* Only show top Responder button when replies list is NOT expanded */}
        {!showReplies && (
          <button
            type="button"
            onClick={() => {
              if (replies.length > 0) {
                // If there are already replies, expand the list directly
                setShowReplies(true);
              } else {
                setShowReplyForm((prev) => !prev);
              }
              setReplyError(null);
            }}
            className={`flex-1 flex items-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition-all duration-200 cursor-pointer text-left ${
              showReplyForm
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <CornerDownRight size={13} className="flex-shrink-0" />
            <span>Responder</span>
          </button>
        )}

        {replies.length > 0 && (
          <button
            type="button"
            onClick={() => setShowReplies((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              showReplies
                ? 'w-full justify-between bg-muted/40 text-foreground font-semibold'
                : 'flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <MessageSquare size={13} className="text-accent/80" />
              <span>
                {replies.length} {replies.length === 1 ? 'respuesta' : 'respuestas'}
              </span>
            </div>
            {showReplies ? (
              <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1">
                Ocultar <ChevronUp size={13} />
              </span>
            ) : (
              <ChevronDown size={13} />
            )}
          </button>
        )}
      </div>

      {/* Inline Reply Form (Shown when there are no replies, or when reply form is explicitly triggered without expanding) */}
      {showReplyForm && (!showReplies || replies.length === 0) && (
        <form
          onSubmit={handleReplySubmit}
          className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-background/80 border border-border/80 space-y-3 animate-fade-in shadow-inner"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <CornerDownRight size={13} className="text-accent" />
              Respondiendo a <strong className="text-foreground">{comment.nickname}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="Tu apodo"
              value={replyNickname}
              onChange={(e) => setReplyNickname(e.target.value)}
              maxLength={30}
              className="
                w-full sm:w-48 px-3 py-2 text-xs rounded-xl
                bg-background border border-border text-foreground
                placeholder:text-muted-foreground/60
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
              "
            />
            <div className="relative">
              <textarea
                placeholder="Escribí tu respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                maxLength={300}
                rows={3}
                className="
                  w-full px-3.5 py-2 text-xs rounded-xl resize-none
                  bg-background border border-border text-foreground
                  placeholder:text-muted-foreground/60
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                "
              />
              <span className="absolute bottom-2 right-2.5 text-[10px] text-muted-foreground/70 font-mono">
                {replyContent.length}/300
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!replyNickname.trim() || !replyContent.trim() || isSubmittingReply}
              className="
                inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold
                bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95
              "
            >
              <CornerDownRight size={13} />
              {isSubmittingReply ? 'Enviando...' : 'Responder'}
            </button>
          </div>

          {replyError && (
            <p className="text-[11px] text-destructive">{replyError}</p>
          )}
        </form>
      )}

      {/* Nested Replies List (Collapsible) */}
      {showReplies && replies.length > 0 && (
        <div className="mt-3.5 pt-2 space-y-2.5 pl-3 sm:pl-4 border-l-2 border-accent/30 animate-fade-in">
          {/* History of replies */}
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-background/40 hover:bg-background/70 border border-border/50 rounded-xl p-2.5 sm:p-3 transition-colors text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
                    {reply.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-foreground truncate">
                    {reply.nickname}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {formatDateTime(reply.created_at)}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteReply(reply.id)}
                    disabled={deletingReplyId === reply.id}
                    className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Eliminar respuesta"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <p className="text-foreground/90 whitespace-pre-wrap break-words pl-7">
                {reply.content}
              </p>
            </div>
          ))}

          {/* Form placed directly at the bottom of the replies history */}
          <form
            onSubmit={handleReplySubmit}
            className="pt-2 p-3 sm:p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2.5 animate-fade-in shadow-inner"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <CornerDownRight size={12} className="text-accent" />
                Dejar una respuesta
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tu apodo"
                value={replyNickname}
                onChange={(e) => setReplyNickname(e.target.value)}
                maxLength={30}
                className="
                  w-full sm:w-48 px-3 py-1.5 text-xs rounded-xl
                  bg-background border border-border text-foreground
                  placeholder:text-muted-foreground/60
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                "
              />
              <div className="relative">
                <textarea
                  placeholder="Escribí tu respuesta..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="
                    w-full px-3.5 py-2 text-xs rounded-xl resize-none
                    bg-background border border-border text-foreground
                    placeholder:text-muted-foreground/60
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                  "
                />
                <span className="absolute bottom-2 right-2.5 text-[10px] text-muted-foreground/70 font-mono">
                  {replyContent.length}/300
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-0.5">
              <button
                type="submit"
                disabled={!replyNickname.trim() || !replyContent.trim() || isSubmittingReply}
                className="
                  inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold
                  bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-sm
                  disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95
                "
              >
                <CornerDownRight size={13} />
                {isSubmittingReply ? 'Enviando...' : 'Responder'}
              </button>
            </div>

            {replyError && (
              <p className="text-[11px] text-destructive">{replyError}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

