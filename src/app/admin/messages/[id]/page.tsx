import { createServerComponentClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminMessageDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createServerComponentClient();

    const { data: message, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !message) {
        notFound();
    }

    // Mark as read if unread
    if (message.status === 'unread' || !message.status) {
        await supabase
            .from('contact_messages')
            .update({ status: 'read' })
            .eq('id', id);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/messages"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back to Messages
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {message.subject || 'No Subject'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                From: <span className="font-medium">{message.full_name}</span> ({message.email})
                            </p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${message.status === 'unread'
                            ? 'bg-blue-100 text-blue-800'
                            : message.status === 'replied'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {message.status || 'read'}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Received: {format(new Date(message.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                    </p>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex space-x-4">
                    <a
                        href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your Message'}`}
                        className="bg-church-brown text-white px-6 py-2 rounded-md hover:bg-church-brown/90 transition-colors font-medium"
                    >
                        Reply via Email
                    </a>
                </div>
            </div>
        </div>
    );
}
