'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Grid, Columns } from 'lucide-react';
import Image from 'next/image';

interface LightboxGalleryProps {
    images: string[];
}

export default function LightboxGallery({ images }: LightboxGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };

    const showNext = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const showPrev = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext(e);
            if (e.key === 'ArrowLeft') showPrev(e);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, showNext, showPrev]);

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|mov|webm)$/i);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
                    title="Grid View"
                >
                    <Grid size={20} />
                </button>
                <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-2 rounded ${viewMode === 'masonry' ? 'bg-stone-200' : 'hover:bg-stone-100'}`}
                    title="Masonry View"
                >
                    <Columns size={20} />
                </button>
            </div>

            <div className={viewMode === 'grid'
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
            }>
                {images.map((url, idx) => (
                    <div
                        key={idx}
                        className={`relative cursor-pointer group overflow-hidden rounded-lg bg-stone-100 ${viewMode === 'grid' ? 'aspect-square' : 'break-inside-avoid'}`}
                        onClick={() => openLightbox(idx)}
                    >
                        {isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-black/5 relative">
                                <video src={url} className="w-full h-full object-cover pointer-events-none" muted />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/50 text-white rounded-full p-3">
                                        <div className="border-l-8 border-y-8 border-y-transparent border-l-white ml-1"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={url}
                                alt={`Gallery ${idx}`}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/50 hover:text-white p-2 transition-colors z-50"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={showPrev}
                        className="absolute left-4 text-white/50 hover:text-white p-4 transition-colors z-50 hidden md:block"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isVideo(images[currentIndex]) ? (
                            <video
                                src={images[currentIndex]}
                                controls
                                autoPlay
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <img
                                src={images[currentIndex]}
                                alt="Lightbox"
                                className="max-w-full max-h-full object-contain shadow-2xl"
                            />
                        )}
                    </div>

                    <button
                        onClick={showNext}
                        className="absolute right-4 text-white/50 hover:text-white p-4 transition-colors z-50 hidden md:block"
                    >
                        <ChevronRight size={48} />
                    </button>

                    {/* Mobile Navigation Clicks (Invisible Overlay areas) */}
                    <div className="absolute inset-y-0 left-0 w-1/4 md:hidden" onClick={showPrev} />
                    <div className="absolute inset-y-0 right-0 w-1/4 md:hidden" onClick={showNext} />
                </div>
            )}
        </div>
    );
}
