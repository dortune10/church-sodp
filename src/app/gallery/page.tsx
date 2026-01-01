import { createServerComponentClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
    title: 'Gallery | Our Church',
    description: 'Moments and memories from our church life and events.',
};

export default async function GalleryPage() {
    const supabase = await createServerComponentClient();

    // Fetch albums with their first photo for the cover
    const { data: albums, error } = await supabase
        .from('photo_albums')
        .select(`
      *,
      photos (
        storage_path
      )
    `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching albums:', error);
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Photo Gallery</h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Glimpses into our community, worship, and events.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums?.map((album) => (
                        <Link
                            key={album.id}
                            href={`/gallery/${album.id}`}
                            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden h-64">
                                {album.photos?.[0] ? (
                                    <img
                                        src={album.photos[0].storage_path}
                                        alt={album.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <span className="text-white text-sm font-medium">
                                        {album.photos?.length || 0} Photos
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-church-brown transition-colors">
                                    {album.title}
                                </h3>
                                {album.description && (
                                    <p className="mt-2 text-gray-600 line-clamp-2">
                                        {album.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {(!albums || albums.length === 0) && (
                    <div className="text-center py-24 bg-white rounded-xl shadow-inner mt-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-4 text-gray-500 text-lg">Our gallery is currently being curated. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
