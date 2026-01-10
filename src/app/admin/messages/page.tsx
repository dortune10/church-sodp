import { createServerComponentClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function AdminMessagesPage() {
    const supabase = await createServerComponentClient();

    const { data: messages, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {messages?.map((message) => (
                        <li key={message.id}>
                            <Link
                                href={`/admin/messages/${message.id}`}
                                className="block hover:bg-gray-50 transition-colors"
                            >
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-church-brown truncate">
                                                {message.full_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {message.email}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${message.status === 'unread'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : message.status === 'read'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                {message.status || 'unread'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm font-semibold text-gray-700">
                                            {message.subject || 'No subject'}
                                        </p>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {message.message}
                                        </p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {(!messages || messages.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No contact messages yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
