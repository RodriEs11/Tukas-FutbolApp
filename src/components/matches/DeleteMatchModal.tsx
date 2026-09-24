'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function DeleteMatchModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  error,
}: DeleteMatchModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border animate-slide-up overflow-hidden p-6 z-10">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} />
        </div>

        <h3 className="text-lg font-bold text-foreground text-center mb-2">
          ¿Eliminar partido?
        </h3>

        <p className="text-sm text-muted-foreground text-center mb-6">
          Esta acción es permanente e irreversible. El partido y todos sus datos o alineaciones asociadas serán eliminados definitivamente de la base de datos.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
