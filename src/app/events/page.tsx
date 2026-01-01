import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
    const supabase = await createServerComponentClient();
    const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true });

    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Upcoming Events</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stay connected with what&apos;s happening in our church family.
                    </p>
                </div>
            </section>

            {/* Events List */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="space-y-8">
                        {events && events.length > 0 ? (
                            events.map((event) => {
                                const startDate = new Date(event.starts_at);
                                return (
                                    <div
                                        key={event.id}
                                        className="flex flex-col md:flex-row gap-8 items-start p-8 bg-background border border-border rounded-2xl hover:shadow-md transition-shadow"
                                    >
                                        {/* Date Block */}
                                        <div className="flex md:flex-col items-center justify-center min-w-[100px] h-[100px] bg-primary rounded-xl text-primary-foreground p-4">
                                            <span className="text-3xl font-black">{startDate.getDate()}</span>
                                            <span className="text-xs uppercase font-bold tracking-widest">
                                                {startDate.toLocaleDateString([], { month: 'short' })}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-primary px-2 py-1 rounded">
                                                    {event.category}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span>Time:</span>
                                                    <span className="text-foreground">
                                                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>Location:</span>
                                                    <span className="text-foreground">{event.location || "Online"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="w-full md:w-auto self-center lg:self-start pt-6 md:pt-0">
                                            <Link
                                                href={`/events/${event.id}`}
                                                className="block text-center bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors"
                                            >
                                                {event.registration_required ? "Register" : "Details"}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-20 text-center border border-dashed border-border rounded-2xl">
                                <p className="text-xl text-muted-foreground">No upcoming events at the moment.</p>
                                <p className="mt-2 text-muted-foreground">Please check back again soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
