"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EventDetailPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchEvent() {
            const { data } = await supabase
                .from("events")
                .select("*")
                .eq("id", id)
                .single();

            setEvent(data);
            setLoading(false);
        }
        if (id) fetchEvent();
    }, [id, supabase]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegistering(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase.from("event_registrations").insert([
            {
                event_id: id,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone || null,
                notes: data.notes || null,
            },
        ]);

        if (error) {
            setError(error.message);
            setRegistering(false);
        } else {
            setSuccess(true);
            setRegistering(false);
        }
    };

    if (loading) return <div className="py-20 text-center">Loading event...</div>;
    if (!event) return <div className="py-20 text-center">Event not found.</div>;

    const startDate = new Date(event.starts_at);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto px-4">
                    <Link
                        href="/events"
                        className="text-sm font-medium opacity-80 hover:opacity-100 mb-6 inline-block"
                    >
                        &larr; All Events
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">{event.title}</h1>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <div className="flex flex-wrap gap-8 mb-12">
                                <div>
                                    <h4 className="text-xs uppercase font-black text-primary/60 tracking-widest mb-2">When</h4>
                                    <p className="text-lg font-bold">{startDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-muted-foreground">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase font-black text-primary/60 tracking-widest mb-2">Where</h4>
                                    <p className="text-lg font-bold">{event.location || "Online"}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase font-black text-primary/60 tracking-widest mb-2">Category</h4>
                                    <p className="text-lg font-bold">{event.category}</p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-primary mb-6">About the Event</h2>
                            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {event.description || "No description available for this event."}
                            </div>
                        </div>

                        <div>
                            {event.registration_required ? (
                                <div className="bg-muted p-8 rounded-2xl border border-border sticky top-24">
                                    <h3 className="text-xl font-bold mb-6">Event Registration</h3>

                                    {success ? (
                                        <div className="p-6 bg-green-100 text-green-800 rounded-xl text-center font-bold">
                                            Registration Successful! See you there.
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    type="text"
                                                    required
                                                    className="w-full rounded-lg border-border bg-background p-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Email</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="w-full rounded-lg border-border bg-background p-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    className="w-full rounded-lg border-border bg-background p-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Notes</label>
                                                <textarea
                                                    name="notes"
                                                    rows={3}
                                                    className="w-full rounded-lg border-border bg-background p-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={registering}
                                                className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50 mt-4"
                                            >
                                                {registering ? "Registering..." : "Complete Registration"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-muted p-8 rounded-2xl border border-border text-center">
                                    <p className="text-lg font-bold text-primary mb-2">No Registration Required</p>
                                    <p className="text-muted-foreground text-sm">Simply join us at the scheduled time and location.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
