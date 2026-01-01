"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditEventPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [event, setEvent] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchEvent() {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                // Format dates for input[type="datetime-local"]
                const formattedEvent = {
                    ...data,
                    starts_at: data.starts_at ? new Date(data.starts_at).toISOString().slice(0, 16) : "",
                    ends_at: data.ends_at ? new Date(data.ends_at).toISOString().slice(0, 16) : "",
                };
                setEvent(formattedEvent);
            }
            setLoading(false);
        }

        if (id) fetchEvent();
    }, [id, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase
            .from("events")
            .update({
                title: data.title,
                description: data.description || null,
                starts_at: data.startsAt,
                ends_at: data.endsAt || null,
                location: data.location || null,
                category: data.category || "General",
                registration_required: data.registrationRequired === "on",
                max_registrations: data.maxRegistrations ? parseInt(data.maxRegistrations as string) : null,
            })
            .eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/events");
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event? This will also delete all registrations.")) return;

        setSaving(true);
        const { error } = await supabase.from("events").delete().eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/events");
            router.refresh();
        }
    };

    if (loading) return <div>Loading event...</div>;
    if (!event && !loading) return <div>Event not found.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex-1">
                    <Link
                        href="/admin/events"
                        className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                    >
                        &larr; Back to Events
                    </Link>
                    <h1 className="text-3xl font-bold text-primary">Edit Event</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-800 underline underline-offset-4"
                >
                    Delete Event
                </button>
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
                            defaultValue={event.title}
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
                                defaultValue={event.starts_at}
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
                                defaultValue={event.ends_at}
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
                                defaultValue={event.location || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                defaultValue={event.category}
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
                            defaultValue={event.description || ""}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <input
                                id="registrationRequired"
                                name="registrationRequired"
                                type="checkbox"
                                defaultChecked={event.registration_required}
                                className="rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="registrationRequired" className="text-sm font-medium text-foreground">
                                Registration Required
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Max Registrations (Optional)
                            </label>
                            <input
                                name="maxRegistrations"
                                type="number"
                                defaultValue={event.max_registrations || ""}
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
                            disabled={saving}
                            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
