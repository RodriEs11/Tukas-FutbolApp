'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlus, X, MessageSquare } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface FilePreview {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}

interface CommentFormProps {
  matchId: string;
  onCommentAdded: () => void;
}

const MAX_FILES = 3;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function CommentForm({ matchId, onCommentAdded }: CommentFormProps) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    setError(null);
    const newFiles: FilePreview[] = [];

    for (let i = 0; i < selected.length; i++) {
      if (files.length + newFiles.length >= MAX_FILES) {
        setError(`Máximo ${MAX_FILES} archivos por comentario.`);
        break;
      }

      let file = selected[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setError('Solo se permiten imágenes y videos.');
        continue;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        setError('Las imágenes no pueden superar los 10MB.');
        continue;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setError('Los videos no pueden superar los 50MB.');
        continue;
      }

      // Compress images
      if (isImage) {
        try {
          file = await imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
        } catch (err) {
          console.error('Compression error:', err);
          // Continue with original file if compression fails
        }
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        file,
        previewUrl,
        type: isImage ? 'image' : 'video',
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim() || !content.trim()) {
      setError('El apodo y el comentario son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const mediaItems: { fileKey: string; fileType: string; fileName: string; fileSize: number; mimeType: string }[] = [];

      // Upload files via presigned URLs
      if (files.length > 0) {
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
          const f = files[i];

          // 1. Get presigned URL
          const urlRes = await fetch('/api/comments/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: f.file.name,
              contentType: f.file.type,
              fileSize: f.file.size,
              matchId,
            }),
          });

          if (!urlRes.ok) {
            const data = await urlRes.json();
            throw new Error(data.error || 'Error al obtener URL de subida');
          }

          const { uploadUrl, fileKey, fileType } = await urlRes.json();

          // 2. Upload directly to S3/R2
          const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            body: f.file,
            headers: {
              'Content-Type': f.file.type,
            },
          });

          if (!uploadRes.ok) {
            throw new Error('Error al subir el archivo');
          }

          mediaItems.push({
            fileKey,
            fileType,
            fileName: f.file.name,
            fileSize: f.file.size,
            mimeType: f.file.type,
          });

          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        }
      }

      // 3. Create comment with media references
      const commentRes = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          nickname: nickname.trim(),
          content: content.trim(),
          media: mediaItems,
        }),
      });

      if (!commentRes.ok) {
        const data = await commentRes.json();
        throw new Error(data.error || 'Error al publicar');
      }

      // Success — reset form
      setContent('');
      setFiles([]);
      setUploadProgress(0);
      onCommentAdded();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al publicar el comentario.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="space-y-3">
        {/* Nickname Input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Tu Apodo
          </label>
          <input
            type="text"
            placeholder="Ej: El Pichichi, Rodrigo..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            className="
              w-full sm:w-64 px-3.5 py-2.5 rounded-xl text-sm
              bg-background border border-border text-foreground
              placeholder:text-muted-foreground/60
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
              hover:border-border-hover
            "
          />
        </div>

        {/* Comment text */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Comentario
          </label>
          <div className="relative">
            <textarea
              placeholder="¿Qué te pareció el partido? Dejá tu opinión, fotos o videos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={3}
              className="
                w-full px-3.5 py-2.5 rounded-xl text-sm resize-none
                bg-background border border-border text-foreground
                placeholder:text-muted-foreground/60
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                hover:border-border-hover
              "
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/70 font-mono">
              {content.length}/500
            </span>
          </div>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mt-3 pt-3 border-t border-border/50">
          {files.map((f, idx) => (
            <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted/40 shadow-sm">
              {f.type === 'image' ? (
                <img
                  src={f.previewUrl}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center bg-black/60 text-white">
                  <video
                    src={f.previewUrl}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                    preload="metadata"
                    muted
                  />
                  <span className="relative z-10 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/70 uppercase">
                    Video
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/90 text-white flex items-center justify-center shadow hover:bg-destructive transition-colors cursor-pointer"
                title="Eliminar archivo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-3">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Subiendo archivos... {uploadProgress}%</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40 gap-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="comment-file-input"
          />

          {/* Eye-catching Add Photo/Video Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_FILES || isSubmitting}
            className="
              inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
              bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 hover:border-accent/50
              transition-all duration-200 shadow-sm cursor-pointer active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent/10
            "
            title={files.length >= MAX_FILES ? 'Máximo 3 archivos' : 'Adjuntar fotos o videos'}
          >
            <ImagePlus size={16} className="text-accent" />
            <span>Agregar fotos o videos</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono font-bold">
              {files.length}/{MAX_FILES}
            </span>
          </button>
        </div>

        <Button
          type="submit"
          size="md"
          disabled={!nickname.trim() || !content.trim() || isSubmitting}
          isLoading={isSubmitting}
          className="px-5 font-semibold"
        >
          <MessageSquare size={15} />
          Comentar
        </Button>
      </div>
    </form>
  );
}
