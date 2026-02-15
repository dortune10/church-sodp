import { createServerComponentClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Photo } from '@/types/database';
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerComponentClient();
    const { id } = await params;

    const { data: album, error } = await supabase
        .from('photo_albums')
        .select(`
      *,
      photos (*)
    `)
        .eq('id', id)
        .single();

    if (error || !album) {
        return notFound();
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { label: "Gallery", href: "/gallery" },
                            { label: album.title },
                        ]}
                    />
                    <h1 className="text-4xl font-bold text-gray-900">{album.title}</h1>
                    {album.description && (
                        <p className="mt-4 text-xl text-gray-600">{album.description}</p>
                    )}
                </div>

                {(album.photos && album.photos.length > 0) ? (
                    <GalleryGrid photos={album.photos} albumTitle={album.title} />
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">This album is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
