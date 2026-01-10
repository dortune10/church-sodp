import { createServerComponentClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AdminGalleryPage() {
    const supabase = await createServerComponentClient();

    const { data: albums, error } = await supabase
        .from('photo_albums')
        .select('*, photos(count)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching albums:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <Link
                    href="/admin/gallery/new"
                    className="bg-church-brown text-white px-4 py-2 rounded-md hover:bg-church-brown/90 transition-colors"
                >
                    Create New Album
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {albums?.map((album) => (
                        <li key={album.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                <Link href={`/admin/gallery/${album.id}`} className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-church-brown truncate">
                                        {album.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {album.description || 'No description'}
                                    </p>
                                    <div className="mt-2 flex items-center text-xs text-gray-400">
                                        <span>{format(new Date(album.created_at), 'MMM d, yyyy')}</span>
                                        <span className="mx-2">•</span>
                                        <span>{album.photos?.[0]?.count || 0} photos</span>
                                        {!album.is_public && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <span className="text-red-500">Private</span>
                                            </>
                                        )}
                                    </div>
                                </Link>
                                <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                                    <Link
                                        href={`/admin/gallery/new?albumId=${album.id}`}
                                        className="text-church-brown hover:bg-church-brown/10 p-2 rounded-full transition-colors group"
                                        title="Quick Upload Photos"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </Link>
                                    <Link href={`/admin/gallery/${album.id}`}>
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                    {(!albums || albums.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No albums found. Create your first one to get started!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
