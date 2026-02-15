"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/types/database";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryGridProps {
    photos: Photo[];
    albumTitle: string;
}

export default function GalleryGrid({ photos, albumTitle }: GalleryGridProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const showNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
    }, [photos.length]);

    const showPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
    }, [photos.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, showNext, showPrev]);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-muted"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={photo.storage_path}
                            alt={photo.caption || albumTitle}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        {photo.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs truncate text-center">{photo.caption}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                        aria-label="Close lightbox"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={showPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-50 hidden md:block"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <button
                        onClick={showNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-50 hidden md:block"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div
                        className="relative w-full max-w-5xl max-h-[85vh] h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={photos[selectedIndex].storage_path}
                            alt={photos[selectedIndex].caption || albumTitle}
                            fill
                            className="object-contain"
                            priority
                            sizes="100vw"
                        />
                        {photos[selectedIndex].caption && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
                                <p className="text-white text-sm font-medium">{photos[selectedIndex].caption}</p>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 text-white/50 text-sm font-medium">
                        {selectedIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    );
}
