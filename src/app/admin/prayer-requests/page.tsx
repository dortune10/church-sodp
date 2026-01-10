import { createServerComponentClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function AdminPrayerRequestsPage() {
    const supabase = await createServerComponentClient();

    const { data: requests, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching prayer requests:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Prayer Requests</h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {requests?.map((request) => (
                        <li key={request.id}>
                            <Link
                                href={`/admin/prayer-requests/${request.id}`}
                                className="block hover:bg-gray-50 transition-colors"
                            >
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-church-brown truncate">
                                                {request.full_name || 'Anonymous'}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                                            {request.share_publicly && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    Public
                                                </span>
                                            )}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.status === 'new'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : request.status === 'praying'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                {request.status || 'new'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {request.request}
                                        </p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {(!requests || requests.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No prayer requests yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
