import { createServerComponentClient } from "@/lib/supabase/server";
import EventsCalendar from "@/components/EventsCalendar";

export const revalidate = 60;

export default async function EventsPage() {
    const supabase = await createServerComponentClient();
    const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true });

    // Generate weekly schedule (weeks starting on Sunday)
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

    // Generate synthetic 2024 recurring events from schedule

    function generateSyntheticEventsForYear(year: number) {
        interface SyntheticEvent {
            id: string;
            title: string;
            start_at: string;
            description?: string;
            category: string;
            location: string;
            registration_required: boolean;
        }
        const items: SyntheticEvent[] = [];

        // Weekly services times
        const times: Record<string, string> = {
            Sunday: '10:00',
            Tuesday: '10:00',
            Wednesday: '19:00',
            Thursday: '20:00',
            Friday: '19:00',
        };

        const weeks = generateWeeklySchedule(year);
        weeks.forEach((w) => {
            Object.entries(w.days).forEach(([dayName, dt]) => {
                if (!dt) return;
                const time = times[dayName];
                const [hh, mm] = time.split(':').map(Number);
                const date = new Date(dt);
                date.setHours(hh, mm, 0, 0);
                const titles: Record<string, string> = {
                    Sunday: 'Sunday Service (Online/Onsite)',
                    Tuesday: 'Liberation Hour',
                    Wednesday: 'Online Bible Study',
                    Thursday: 'Liberation Hour',
                    Friday: 'Online Prayer Meeting',
                };
                items.push({
                    id: `synthetic-${dayName.toLowerCase()}-${date.toISOString().slice(0, 10)}`,
                    title: titles[dayName],
                    start_at: date.toISOString(),
                    description: dayName === 'Sunday' ? 'Sunday (Online/Onsite)' : undefined,
                    category: 'Recurring',
                    location: dayName === 'Sunday' ? 'Online / Onsite' : 'Online',
                    registration_required: false,
                });
            });
        });

        // Monthly services
        // For each month, add 1st Sunday (Thanksgiving), 3rd Sunday (Youth), Last Friday (Vigil/Communion), Last Sunday (Anointing), 2nd Saturday (Yoruba Libration Hour)
        for (let m = 0; m < 12; m++) {
            const firstOfMonth = new Date(year, m, 1);
            const lastOfMonth = new Date(year, m + 1, 0);

            // 1st Sunday
            const firstSunday = new Date(firstOfMonth);
            const day = firstSunday.getDay();
            if (day !== 0) firstSunday.setDate(firstSunday.getDate() + (7 - day));
            firstSunday.setHours(10, 0, 0, 0);
            if (firstSunday.getMonth() === m) {
                items.push({ id: `monthly-thanksgiving-${firstSunday.toISOString().slice(0, 10)}`, title: 'Thanksgiving', start_at: firstSunday.toISOString(), category: 'Monthly', location: 'Online / Onsite', registration_required: false });
            }

            // 3rd Sunday (approx day 15-21)
            const thirdSunday = new Date(firstSunday);
            thirdSunday.setDate(thirdSunday.getDate() + 14);
            thirdSunday.setHours(10, 0, 0, 0);
            if (thirdSunday.getMonth() === m) {
                items.push({ id: `monthly-youth-${thirdSunday.toISOString().slice(0, 10)}`, title: 'Youth Sunday', start_at: thirdSunday.toISOString(), category: 'Monthly', location: 'Online / Onsite', registration_required: false });
            }

            // Last Friday
            const lastFriday = new Date(lastOfMonth);
            // move back to Friday
            while (lastFriday.getDay() !== 5) lastFriday.setDate(lastFriday.getDate() - 1);
            lastFriday.setHours(22, 0, 0, 0);
            items.push({ id: `monthly-vigil-${lastFriday.toISOString().slice(0, 10)}`, title: 'Vigil / Communion', start_at: lastFriday.toISOString(), category: 'Monthly', location: 'Online / Onsite', registration_required: false });

            // Last Sunday (Anointing)
            const lastSunday = new Date(lastOfMonth);
            while (lastSunday.getDay() !== 0) lastSunday.setDate(lastSunday.getDate() - 1);
            lastSunday.setHours(10, 0, 0, 0);
            items.push({ id: `monthly-anointing-${lastSunday.toISOString().slice(0, 10)}`, title: 'Anointing', start_at: lastSunday.toISOString(), category: 'Monthly', location: 'Online / Onsite', registration_required: false });

            // 2nd Saturday - Yoruba Libration Hour (Online) 6:00 AM
            const secondSaturday = new Date(firstOfMonth);
            // move to first Saturday
            while (secondSaturday.getDay() !== 6) secondSaturday.setDate(secondSaturday.getDate() + 1);
            // add 7 days to reach second Saturday
            secondSaturday.setDate(secondSaturday.getDate() + 7);
            secondSaturday.setHours(6, 0, 0, 0);
            if (secondSaturday.getMonth() === m) {
                items.push({ id: `monthly-yoruba-${secondSaturday.toISOString().slice(0, 10)}`, title: 'Yoruba Libration Hour', start_at: secondSaturday.toISOString(), category: 'Monthly', location: 'Online', registration_required: false });
            }
        }

        return items;
    }

    const synthetic2024 = generateSyntheticEventsForYear(2024);

    const mergedEvents = [...(events || []), ...synthetic2024];

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
                    {/* Calendar for current month */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">Calendar — This Month</h2>
                        <p className="text-muted-foreground mb-6">Select a day to view activities for the current month.</p>
                        <div className="space-y-6">
                            {/** EventsCalendar is a client component that receives serialized events **/}
                            <EventsCalendar events={mergedEvents ? JSON.parse(JSON.stringify(mergedEvents)) : []} />
                        </div>
                    </div>
                    <div className="space-y-8" />
                </div>
            </section>
        </div>
    );
}
