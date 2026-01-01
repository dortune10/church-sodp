import { createServerComponentClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface EditAlbumPageProps {
    params: {
        id: string;
    };
}

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Link href="/admin/gallery" className="text-church-brown hover:text-church-brown/80 text-sm flex items-center mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Gallery
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Album: {album.title}</h1>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                        Delete Album
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Album Photos ({album.photos?.length || 0})</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {album.photos?.map((photo: any) => (
                            <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden group">
                                <img
                                    src={photo.storage_path}
                                    alt={photo.caption || ''}
                                    className="w-full h-full object-cover"
                                />
                                <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <Link
                            href={`/admin/gallery/new?albumId=${album.id}`}
                            className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square hover:border-church-brown hover:text-church-brown transition-colors group"
                        >
                            <svg className="w-8 h-8 text-gray-400 group-hover:text-church-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs mt-2 font-medium">Add Photos</span>
                        </Link>
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h2 className="text-xl font-semibold mb-4">Album Details</h2>
                    <form className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                defaultValue={album.title}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-church-brown focus:ring-church-brown"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={3}
                                defaultValue={album.description}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-church-brown focus:ring-church-brown"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                defaultChecked={album.is_public}
                                className="h-4 w-4 text-church-brown focus:ring-church-brown border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Publicly visible</label>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-church-brown text-white px-6 py-2 rounded-md hover:bg-church-brown/90 transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
