"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York");
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Helper to convert local time + timezone to ISO string
        const formatWithTimezone = (localStr: string | null) => {
            if (!localStr) return null;
            // Create a date object from the YYYY-MM-DDTHH:mm string
            const date = new Date(localStr);
            // We use the selected timezone to calculate the correct UTC time
            // For a robust implementation, we format the local string as an ISO string with the selected offset
            // However, since we're in the browser, many libs or standard methods are available.
            // A simple reliable way:
            try {
                // Actually, the easiest way for Supabase (TIMESTAMPTZ) is just as follows:
                return new Date(date.toLocaleString('en-US', { timeZone: timezone })).toISOString();
            } catch {
                return new Date(localStr).toISOString();
            }
        };

        const getRecurringDates = (startDate: Date, frequency: string, endDate: Date) => {
            const dates = [];
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                if (frequency === "daily") {
                    currentDate.setDate(currentDate.getDate() + 1);
                } else if (frequency === "weekly") {
                    currentDate.setDate(currentDate.getDate() + 7);
                } else if (frequency === "monthly") {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
            }

            return dates;
        };

        if (isRecurring) {
            const recurringDates = getRecurringDates(
                new Date(data.startsAt as string),
                data.frequency as string,
                new Date(data.recurrenceEndDate as string)
            );

            const eventsToInsert = recurringDates.map((date) => ({
                title: data.title,
                description: data.description || null,
                start_at: formatWithTimezone(date.toISOString()),
                end_at: data.endsAt ? formatWithTimezone(new Date(data.endsAt as string).toISOString()) : null,
                location: data.location || null,
                registration_enabled: data.registrationEnabled === "on",
                capacity: data.maxRegistrations ? parseInt(data.maxRegistrations as string) : null,
            }));

            const { error } = await supabase.from("events").insert(eventsToInsert);

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push("/admin/events");
                router.refresh();
            }
        } else {
            const { error } = await supabase.from("events").insert([
                {
                    title: data.title,
                    description: data.description || null,
                    start_at: formatWithTimezone(data.startsAt as string),
                    end_at: formatWithTimezone(data.endsAt as string),
                    location: data.location || null,
                    registration_enabled: data.registrationEnabled === "on",
                    capacity: data.maxRegistrations ? parseInt(data.maxRegistrations as string) : null,
                },
            ]);

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push("/admin/events");
                router.refresh();
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/events"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Events
                </Link>
                <h1 className="text-3xl font-bold text-primary">Create New Event</h1>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Event Title *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Event Timezone (Church Local Time)
                        </label>
                        <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Phoenix">Mountain Time - no DST (AZ)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Anchorage">Alaska Time</option>
                            <option value="America/Adak">Hawaii-Aleutian Time</option>
                            <option value="Pacific/Honolulu">Hawaii Time</option>
                            <option value="Europe/London">London / GMT / BST</option>
                            <option value="Africa/Lagos">Lagos / WAT</option>
                        </select>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Entering a time below will be interpreted as being in this timezone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Start Date & Time *
                            </label>
                            <input
                                name="startsAt"
                                type="datetime-local"
                                required
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                End Date & Time
                            </label>
                            <input
                                name="endsAt"
                                type="datetime-local"
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <input
                                id="isRecurring"
                                name="isRecurring"
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="isRecurring" className="text-sm font-medium text-foreground">
                                This is a recurring event
                            </label>
                        </div>
                        {isRecurring && (
                            <div id="recurring-options" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Frequency
                                    </label>
                                    <select
                                        name="frequency"
                                        className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Recurrence End Date
                                    </label>
                                    <input
                                        name="recurrenceEndDate"
                                        type="date"
                                        className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <input
                                id="registrationEnabled"
                                name="registrationEnabled"
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="registrationEnabled" className="text-sm font-medium text-foreground">
                                Registration Enabled
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Max Registrations (Optional)
                            </label>
                            <input
                                name="maxRegistrations"
                                type="number"
                                placeholder="No limit"
                                className="w-32 rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/admin/events"
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
