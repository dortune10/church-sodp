import Link from "next/link";
import { getSettings } from "@/lib/getSettings";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Footer() {
    const settingsMap = await getSettings();
    const supabase = await createServerComponentClient();

    const { data: events } = await supabase
        .from("events")
        .select("id, title, start_at")
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true })
        .limit(3);

    return (
        <footer className="w-full border-t border-border bg-muted/50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">RCCG SODP</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {settingsMap.get('address') || '1520 Commercial Park Dr\nLakeland, FL'}
                            <br />
                            Phone: {settingsMap.get('phone') || '863-698-7899'}<br />
                            Email: {settingsMap.get('email') || 'rccgsodp@gmail.com'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Upcoming Events</h3>
                        {events && events.length > 0 ? (
                            <ul className="space-y-3">
                                {events.map((event) => (
                                    <li key={event.id}>
                                        <Link href={`/events/${event.id}`} className="group flex items-baseline gap-2">
                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
                                                {event.title}
                                            </span>
                                            <span className="text-muted-foreground text-xs whitespace-nowrap">
                                                - {new Date(event.start_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">
                                No upcoming events scheduled.<br />
                                <Link href="/events" className="text-primary hover:underline">View all events</Link>
                            </p>
                        )}
                        {events && events.length > 0 && (
                            <div className="mt-4">
                                <Link href="/events" className="text-primary hover:underline font-medium">
                                    View Calendar &rarr;
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary">
                                    Who We Are
                                </Link>
                            </li>
                            <li>
                                <Link href="/about#ministries" className="text-muted-foreground hover:text-primary">
                                    Ministries
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                                    Prayer Request
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RCCG SODP. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
