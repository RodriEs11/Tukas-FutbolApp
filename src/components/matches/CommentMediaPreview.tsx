'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { CommentMedia } from '@/lib/types/database';

interface CommentMediaPreviewProps {
  media: CommentMedia[];
}

function getMediaUrl(fileKey: string): string {
  if (!fileKey) return '';
  if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
    return fileKey;
  }

  const base = (
    process.env.NEXT_PUBLIC_S3_PUBLIC_URL ||
    'http://192.168.100.174:9000/tukas-media'
  ).replace(/\/+$/, '');

  const cleanKey = fileKey.replace(/^\/+/, '');

  // Evitar duplicación de tukas-media si la base ya lo tiene y la key también
  if (base.endsWith('/tukas-media') && cleanKey.startsWith('tukas-media/')) {
    return `${base}/${cleanKey.replace(/^tukas-media\//, '')}`;
  }

  return `${base}/${cleanKey}`;
}

export function CommentMediaPreview({ media }: CommentMediaPreviewProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Zoom & Pan state
  const [zoomScale, setZoomScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Touch gesture tracking for swipe & pinch-to-zoom
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);
  const lastTouchTime = useRef<number>(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const total = media.length;

  // Mount detection for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset zoom when active index changes or modal opens/closes
  useEffect(() => {
    setZoomScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [activeIndex]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
  }, [activeIndex, total]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
  }, [activeIndex, total]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (zoomScale === 1) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handlePrev, handleNext, zoomScale]);

  // Helper distance for 2-finger touch (Pinch)
  const getPinchDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  // Touch handlers: supports Pinch-to-zoom, Pan when zoomed, Double Tap, and Swipe when scale = 1
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom start
      initialPinchDistance.current = getPinchDistance(e.touches);
      initialScale.current = zoomScale;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      // Double tap detector (< 300ms)
      if (now - lastTouchTime.current < 300) {
        if (zoomScale > 1) {
          setZoomScale(1);
          setTranslate({ x: 0, y: 0 });
        } else {
          setZoomScale(2.5);
        }
        lastTouchTime.current = 0;
        return;
      }
      lastTouchTime.current = now;

      if (zoomScale > 1) {
        // Drag / Pan when zoomed
        dragStart.current = {
          x: e.touches[0].clientX - translate.x,
          y: e.touches[0].clientY - translate.y,
        };
      } else {
        // Swipe tracking
        touchEndX.current = null;
        touchStartX.current = e.touches[0].clientX;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current) {
      // Handle pinch zoom
      const currentDistance = getPinchDistance(e.touches);
      const newScale = Math.min(
        Math.max(1, initialScale.current * (currentDistance / initialPinchDistance.current)),
        4
      );
      setZoomScale(newScale);
      if (newScale === 1) {
        setTranslate({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      if (zoomScale > 1 && dragStart.current) {
        // Pan zoomed image
        setTranslate({
          x: e.touches[0].clientX - dragStart.current.x,
          y: e.touches[0].clientY - dragStart.current.y,
        });
      } else {
        // Track swipe
        touchEndX.current = e.touches[0].clientX;
      }
    }
  };

  const onTouchEnd = () => {
    initialPinchDistance.current = null;
    dragStart.current = null;

    if (zoomScale === 1 && touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 50 && total > 1) handleNext();
      if (distance < -50 && total > 1) handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Wheel zoom on desktop
  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(prev + 0.3, 4));
    } else {
      setZoomScale((prev) => {
        const next = Math.max(prev - 0.3, 1);
        if (next === 1) setTranslate({ x: 0, y: 0 });
        return next;
      });
    }
  };

  if (!media || media.length === 0) return null;

  const currentItem = activeIndex !== null ? media[activeIndex] : null;

  return (
    <>
      {/* Media Thumbnails Grid in Comment Card */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-3">
        {media.map((item, idx) => {
          const url = getMediaUrl(item.file_key);
          const isLoaded = loadedImages[item.id];

          if (item.file_type === 'image') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="relative group w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl overflow-hidden border border-border hover:border-accent/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg bg-muted/40 flex-shrink-0"
              >
                {!isLoaded && (
                  <div className="absolute inset-0 bg-muted/70 animate-pulse flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md bg-muted-foreground/20" />
                  </div>
                )}
                <img
                  src={url}
                  alt=""
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [item.id]: true }))}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />
              </button>
            );
          }

          if (item.file_type === 'video') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="relative group w-32 h-24 sm:w-44 sm:h-32 md:w-48 md:h-36 rounded-xl overflow-hidden border border-border bg-black/80 shadow-sm hover:border-accent/60 transition-all duration-200 cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <video
                  src={url}
                  preload="metadata"
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 group-hover:bg-accent text-white flex items-center justify-center transition-all duration-200 shadow-xl group-hover:scale-110">
                  <Play size={18} className="ml-0.5" fill="currentColor" />
                </div>
              </button>
            );
          }

          return null;
        })}
      </div>

      {/* Fullscreen Slider Modal Portal */}
      {mounted &&
        activeIndex !== null &&
        currentItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] w-screen h-[100dvh] max-h-[100dvh] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-2 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:p-5 sm:pb-8 select-none animate-fade-in touch-none overflow-hidden"
            onClick={() => {
              if (zoomScale > 1) {
                setZoomScale(1);
                setTranslate({ x: 0, y: 0 });
              } else {
                setActiveIndex(null);
              }
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            {/* Top Bar: Counter & Close */}
            <div className="w-full max-w-7xl flex items-center justify-between z-30 pointer-events-auto flex-shrink-0 px-2">
              <span className="text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-md">
                {activeIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer border border-white/15 shadow-xl hover:scale-105 active:scale-95"
                title="Cerrar (Esc)"
              >
                <X size={22} />
              </button>
            </div>

            {/* Middle Container: Arrows & Media (Maximized Image Area) */}
            <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center min-h-0 my-auto overflow-hidden">
              {/* Left Navigation Arrow (hidden when zoomed) */}
              {total > 1 && zoomScale === 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-1 sm:left-3 md:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all pointer-events-auto cursor-pointer shadow-2xl hover:scale-110 border border-white/20 active:scale-95"
                  title="Anterior (←)"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* Main Media Content with Zoom Transform */}
              <div
                className="relative w-full h-full flex items-center justify-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {currentItem.file_type === 'image' ? (
                  <img
                    key={currentItem.id}
                    src={getMediaUrl(currentItem.file_key)}
                    alt=""
                    style={{
                      transform: `scale(${zoomScale}) translate3d(${translate.x / zoomScale}px, ${translate.y / zoomScale}px, 0)`,
                      transition: dragStart.current || initialPinchDistance.current ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                      transformOrigin: 'center center',
                    }}
                    className="max-w-[98vw] sm:max-w-[92vw] md:max-w-[85vw] max-h-[76dvh] sm:max-h-[82dvh] md:max-h-[86dvh] w-auto h-auto object-contain rounded-xl shadow-2xl animate-fade-in will-change-transform cursor-zoom-in"
                  />
                ) : (
                  <video
                    key={currentItem.id}
                    src={getMediaUrl(currentItem.file_key)}
                    controls
                    autoPlay
                    playsInline
                    className="max-w-[98vw] sm:max-w-[92vw] md:max-w-[85vw] max-h-[76dvh] sm:max-h-[82dvh] md:max-h-[86dvh] w-auto h-auto rounded-xl shadow-2xl bg-black animate-fade-in"
                  >
                    Tu navegador no soporta reproducción de video.
                  </video>
                )}
              </div>

              {/* Right Navigation Arrow (hidden when zoomed) */}
              {total > 1 && zoomScale === 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-1 sm:right-3 md:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all pointer-events-auto cursor-pointer shadow-2xl hover:scale-110 border border-white/20 active:scale-95"
                  title="Siguiente (→)"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip (hidden or transparent when zoomed to focus on photo) */}
            {total > 1 ? (
              <div
                className={`z-30 flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/80 backdrop-blur-md pointer-events-auto max-w-[92vw] md:max-w-xl overflow-x-auto border border-white/15 flex-shrink-0 shadow-2xl transition-opacity duration-200 ${
                  zoomScale > 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {media.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-zinc-900 ${
                      activeIndex === idx
                        ? 'border-accent scale-105 shadow-lg shadow-accent/30 ring-2 ring-accent/40'
                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    {item.file_type === 'image' ? (
                      <img
                        src={getMediaUrl(item.file_key)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white">
                        <Play size={14} fill="currentColor" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-1 flex-shrink-0" />
            )}
          </div>,
          document.body
        )}
    </>
  );
}
