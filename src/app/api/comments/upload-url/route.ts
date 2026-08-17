import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/s3-client';
import { randomUUID } from 'crypto';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType, fileSize, matchId } = await request.json();

    if (!fileName || !contentType || !fileSize || !matchId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WebP, GIF) y videos (MP4, WebM, MOV, AVI).' },
        { status: 400 }
      );
    }

    if (isImage && fileSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'La imagen no puede superar los 10MB.' },
        { status: 400 }
      );
    }

    if (isVideo && fileSize > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: 'El video no puede superar los 50MB.' },
        { status: 400 }
      );
    }

    // Generate unique file key
    const ext = fileName.split('.').pop() || 'bin';
    const fileKey = `comments/${matchId}/${randomUUID()}.${ext}`;

    const uploadUrl = await getPresignedUploadUrl(fileKey, contentType);

    return NextResponse.json({
      uploadUrl,
      fileKey,
      fileType: isImage ? 'image' : 'video',
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
