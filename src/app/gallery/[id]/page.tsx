import { createServerComponentClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface AlbumPageProps {
    params: {
        id: string;
    };
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
    const supabase = await createServerComponentClient();
    const { id } = params;

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
                    <Link
                        href="/gallery"
                        className="text-church-brown hover:text-church-brown/80 flex items-center mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Gallery
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">{album.title}</h1>
                    {album.description && (
                        <p className="mt-4 text-xl text-gray-600">{album.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {album.photos?.map((photo: any) => (
                        <div
                            key={photo.id}
                            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                        >
                            <img
                                src={photo.storage_path}
                                alt={photo.caption || album.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            {photo.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-xs truncate text-center">{photo.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(!album.photos || album.photos.length === 0) && (
                    <div className="text-center py-24 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">This album is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
