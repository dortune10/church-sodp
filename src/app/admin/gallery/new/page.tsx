'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PhotoAlbum } from '@/types/database';

function NewAlbumForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const existingAlbumId = searchParams.get('albumId');
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingAlbum, setExistingAlbum] = useState<PhotoAlbum | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        is_public: true,
    });

    useEffect(() => {
        if (existingAlbumId) {
            const fetchAlbum = async () => {
                const { data } = await supabase
                    .from('photo_albums')
                    .select('*')
                    .eq('id', existingAlbumId)
                    .single();
                if (data) {
                    setExistingAlbum(data);
                    setFormData({
                        title: data.title,
                        description: data.description || '',
                        is_public: data.is_public,
                    });
                }
            };
            fetchAlbum();
        }
    }, [existingAlbumId, supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let album = existingAlbum;
            let slug = album?.slug;

            if (!album) {
                // 1. Create the album record
                slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                const { data: newAlbum, error: albumError } = await supabase
                    .from('photo_albums')
                    .insert([{
                        title: formData.title,
                        slug,
                        description: formData.description,
                        is_public: formData.is_public,
                    }])
                    .select()
                    .single();

                if (albumError) throw albumError;
                album = newAlbum;
            }

            // 2. Upload each file via our local API
            if (!album) throw new Error('Failed to create or find album.');

            for (const file of files) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('albumId', album.id);
                uploadFormData.append('folderName', slug || '');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
                    throw new Error(`Upload failed: ${errorData.error || `HTTP status ${response.status}`}`);
                }

                const uploadData = await response.json();

                // 3. Create photo record in database
                const { error: photoError } = await supabase
                    .from('photos')
                    .insert([{
                        album_id: album.id,
                        storage_path: uploadData.path,
                        caption: file.name,
                    }]);

                if (photoError) throw photoError;
            }

            router.push('/admin/gallery');
            router.refresh();
        } catch (error) {
            console.error('Error handling gallery action:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            alert(`Error processing request: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {existingAlbumId ? `Add Photos to: ${existingAlbum?.title || 'Loading...'}` : 'Create New Photo Album'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                {!existingAlbumId && (
                    <>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Album Title</label>
                            <input
                                type="text"
                                id="title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_public"
                                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                            />
                            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 font-medium">
                                Make album public
                            </label>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                    <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-lg hover:border-secondary transition-all bg-gray-50/50">
                        <div className="space-y-4 text-center">
                            <div className="flex justify-center">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <svg className="h-8 w-8 text-secondary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-secondary text-white py-2 px-6 rounded-md font-semibold hover:bg-secondary/90 focus-within:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors shadow-sm mb-2">
                                    <span>Browse Files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                                </label>
                                <p className="text-sm text-gray-600">or drag and drop images here</p>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">PNG, JPG, GIF up to 10MB per file</p>
                        </div>
                    </div>
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || files.length === 0}
                        className="px-8 py-2.5 bg-secondary text-white rounded-lg text-sm font-bold hover:bg-secondary/90 disabled:bg-secondary/50 shadow-lg shadow-secondary/20 transition-all flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span>{existingAlbumId ? 'Add & Upload Photos' : 'Upload & Create Album'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function NewAlbumPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-12">Loading...</div>}>
            <NewAlbumForm />
        </Suspense>
    );
}
