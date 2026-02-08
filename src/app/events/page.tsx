import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
    const supabase = await createServerComponentClient();
    const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true });

    // Generate weekly schedule for 2025 (weeks starting on Sunday)
    function generateWeeklySchedule(year: number) {
        const weeks: Array<{ weekStart: Date; days: Record<string, Date | null> }> = [];
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);

        // find first Sunday on or after Jan 1
        const firstSunday = new Date(start);
        const day = firstSunday.getDay();
        if (day !== 0) {
            firstSunday.setDate(firstSunday.getDate() + (7 - day));
        }

        for (let d = new Date(firstSunday); d <= end; d.setDate(d.getDate() + 7)) {
            const sunday = new Date(d);
            const days: Record<string, Date | null> = {
                Sunday: new Date(sunday),
                Tuesday: null,
                Wednesday: null,
                Thursday: null,
                Friday: null,
            };

            const tuesday = new Date(sunday);
            tuesday.setDate(tuesday.getDate() + 2);
            const wednesday = new Date(sunday);
            wednesday.setDate(wednesday.getDate() + 3);
            const thursday = new Date(sunday);
            thursday.setDate(thursday.getDate() + 4);
            const friday = new Date(sunday);
            friday.setDate(friday.getDate() + 5);

            if (tuesday.getFullYear() === year) days.Tuesday = tuesday;
            if (wednesday.getFullYear() === year) days.Wednesday = wednesday;
            if (thursday.getFullYear() === year) days.Thursday = thursday;
            if (friday.getFullYear() === year) days.Friday = friday;

            weeks.push({ weekStart: new Date(sunday), days });
        }

        return weeks;
    }

    const weekly2025 = generateWeeklySchedule(2025);

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
                    {/* Weekly 2025 Schedule */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">Weekly Schedule — 2025</h2>
                        <p className="text-muted-foreground mb-6">Below are the weekly service dates for 2025. Use these as a reference for recurring weekly activities.</p>
                        <div className="space-y-6">
                            {weekly2025.map((w, idx) => (
                                <div key={idx} className="p-4 border border-border rounded-lg bg-background">
                                    <h3 className="font-semibold">Week of {w.weekStart.toLocaleDateString()}</h3>
                                    <ul className="mt-2 text-muted-foreground space-y-1">
                                        <li>
                                            <strong>Sunday</strong> — {w.days.Sunday ? w.days.Sunday.toLocaleDateString() : w.weekStart.toLocaleDateString()} — Sunday (Online/Onsite) 10:00 AM
                                        </li>
                                        {w.days.Tuesday && (
                                            <li><strong>Tuesday</strong> — {w.days.Tuesday.toLocaleDateString()} — Liberation Hour 10:00 AM</li>
                                        )}
                                        {w.days.Wednesday && (
                                            <li><strong>Wednesday</strong> — {w.days.Wednesday.toLocaleDateString()} — Online Bible Study 7:00 PM</li>
                                        )}
                                        {w.days.Thursday && (
                                            <li><strong>Thursday</strong> — {w.days.Thursday.toLocaleDateString()} — Liberation Hour 8:00 PM</li>
                                        )}
                                        {w.days.Friday && (
                                            <li><strong>Friday</strong> — {w.days.Friday.toLocaleDateString()} — Online Prayer Meeting 7:00 PM</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        {events && events.length > 0 ? (
                            events.map((event) => {
                                const startDate = new Date(event.start_at);
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
