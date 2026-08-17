import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteObject } from '@/lib/s3-client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Solo los administradores pueden eliminar comentarios.' },
        { status: 403 }
      );
    }

    // Get media files to delete from S3
    const { data: mediaFiles, error: mediaFetchError } = await supabase
      .from('comment_media')
      .select('file_key')
      .eq('comment_id', id);

    if (mediaFetchError) {
      console.error('Error fetching media files for deletion:', mediaFetchError);
    }

    // Delete files from S3 / MinIO / R2
    if (mediaFiles && mediaFiles.length > 0) {
      console.log(`[DELETE Comment] Eliminando ${mediaFiles.length} archivos de storage para el comentario ${id}:`, mediaFiles.map(m => m.file_key));
      await Promise.allSettled(
        mediaFiles.map((m) => deleteObject(m.file_key))
      );
    }

    // Delete comment (cascade will delete comment_media rows)
    const { error } = await supabase
      .from('match_comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json(
        { error: 'Error al eliminar el comentario.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
