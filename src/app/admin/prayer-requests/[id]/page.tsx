import { createServerComponentClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminPrayerRequestDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createServerComponentClient();

    const { data: request, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !request) {
        notFound();
    }

    // Mark as praying if new
    if (request.status === 'new' || !request.status) {
        await supabase
            .from('prayer_requests')
            .update({ status: 'praying' })
            .eq('id', id);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/prayer-requests"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back to Prayer Requests
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Prayer Request
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                From: <span className="font-medium">{request.full_name || 'Anonymous'}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {request.share_publicly && (
                                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                                    Public
                                </span>
                            )}
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${request.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : request.status === 'praying'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {request.status || 'praying'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                        {request.request}
                    </p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Submitted: {format(new Date(request.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                    </p>
                </div>

                {request.email && (
                    <div className="px-6 py-4 border-t border-gray-200 flex space-x-4">
                        <a
                            href={`mailto:${request.email}?subject=Re: Your Prayer Request`}
                            className="bg-church-brown text-white px-6 py-2 rounded-md hover:bg-church-brown/90 transition-colors font-medium"
                        >
                            Reply via Email
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
