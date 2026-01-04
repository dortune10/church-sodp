"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Member } from "@/types/database";

export default function NewMinistryPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<Pick<Member, 'id' | 'full_name'>[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchMembers() {
            const { data } = await supabase
                .from("members")
                .select("id, full_name")
                .order("full_name");
            if (data) setMembers(data);
        }
        fetchMembers();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const slug = (data.name as string)
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");

        const { error } = await supabase.from("ministries").insert([
            {
                name: data.name as string,
                slug: slug,
                description: (data.description as string) || null,
                category: (data.category as string) || null,
                schedule: (data.schedule as string) || null,
                leader_id: (data.leaderId as string) || null,
            },
        ]);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/ministries");
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/ministries"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Ministries
                </Link>
                <h1 className="text-3xl font-bold text-primary">Create New Ministry</h1>
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
                            Ministry Name *
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Category
                            </label>
                            <input
                                name="category"
                                type="text"
                                placeholder="e.g. Outreach, Worship, Youth"
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ministry Leader
                            </label>
                            <select
                                name="leaderId"
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select a leader...</option>
                                {members.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Schedule / Meeting Time
                        </label>
                        <input
                            name="schedule"
                            type="text"
                            placeholder="e.g. Every Tuesday at 7:00 PM"
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={5}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/admin/ministries"
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Creating..." : "Create Ministry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
