"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase.from("events").insert([
            {
                title: data.title,
                description: data.description || null,
                start_at: data.startAt,
                end_at: data.endAt || null,
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Location
                            </label>
                            <input
                                name="location"
                                type="text"
                                placeholder="e.g. Main Sanctuary, Online"
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            >
                                <option value="General">General</option>
                                <option value="Worship">Worship</option>
                                <option value="Outreach">Outreach</option>
                                <option value="Youth">Youth</option>
                                <option value="Training">Training</option>
                            </select>
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
