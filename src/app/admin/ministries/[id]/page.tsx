"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditMinistryPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ministry, setMinistry] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const [{ data: mData, error: mError }, { data: pData }] = await Promise.all([
                supabase.from("ministries").select("*").eq("id", id).single(),
                supabase.from("members").select("id, full_name").order("full_name")
            ]);

            if (mError) {
                setError(mError.message);
            } else {
                setMinistry(mData);
            }
            if (pData) setMembers(pData);
            setLoading(false);
        }

        if (id) fetchData();
    }, [id, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase
            .from("ministries")
            .update({
                name: data.name,
                description: data.description || null,
                category: data.category || null,
                schedule: data.schedule || null,
                leader_id: data.leaderId || null,
            })
            .eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/ministries");
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this ministry? This action cannot be undone.")) return;

        setSaving(true);
        const { error } = await supabase.from("ministries").delete().eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/ministries");
            router.refresh();
        }
    };

    if (loading) return <div>Loading ministry...</div>;
    if (!ministry && !loading) return <div>Ministry not found.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex-1">
                    <Link
                        href="/admin/ministries"
                        className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                    >
                        &larr; Back to Ministries
                    </Link>
                    <h1 className="text-3xl font-bold text-primary">Edit Ministry Settings</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-800 underline underline-offset-4"
                >
                    Delete Ministry
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
                            Ministry Name *
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={ministry.name}
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
                                defaultValue={ministry.category || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ministry Leader
                            </label>
                            <select
                                name="leaderId"
                                defaultValue={ministry.leader_id || ""}
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
                            defaultValue={ministry.schedule || ""}
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
                            defaultValue={ministry.description || ""}
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
