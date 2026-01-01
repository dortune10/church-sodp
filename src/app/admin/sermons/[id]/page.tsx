"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditSermonPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sermon, setSermon] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchSermon() {
            const { data, error } = await supabase
                .from("sermons")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                // Format date for input[type="date"]
                const formattedSermon = {
                    ...data,
                    preached_at: data.preached_at ? data.preached_at.split('T')[0] : "",
                };
                setSermon(formattedSermon);
            }
            setLoading(false);
        }

        if (id) fetchSermon();
    }, [id, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase
            .from("sermons")
            .update({
                title: data.title,
                preacher_name: data.preacherName || null,
                series: data.series || null,
                description: data.description || null,
                audio_url: data.audioUrl || null,
                video_url: data.videoUrl || null,
                preached_at: data.preachedAt,
            })
            .eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/sermons");
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this sermon?")) return;

        setSaving(true);
        const { error } = await supabase.from("sermons").delete().eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/sermons");
            router.refresh();
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading sermon details...</div>;
    if (!sermon) return <div className="p-8 text-center text-muted-foreground">Sermon not found.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex-1">
                    <Link
                        href="/admin/sermons"
                        className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                    >
                        &larr; Back to Sermons
                    </Link>
                    <h1 className="text-3xl font-bold text-primary">Edit Sermon</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-800 underline underline-offset-4"
                >
                    Delete Sermon
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
                            Sermon Title *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={sermon.title}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Preacher Name
                            </label>
                            <input
                                name="preacherName"
                                type="text"
                                defaultValue={sermon.preacher_name || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Sermon Series
                            </label>
                            <input
                                name="series"
                                type="text"
                                defaultValue={sermon.series || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Date Preached *
                        </label>
                        <input
                            name="preachedAt"
                            type="date"
                            required
                            defaultValue={sermon.preached_at}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description / Scripture Reference
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={sermon.description || ""}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-sm font-bold text-foreground">Media Links</h3>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Audio URL (MP3)
                            </label>
                            <input
                                name="audioUrl"
                                type="url"
                                defaultValue={sermon.audio_url || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Video URL (YouTube/Vimeo)
                            </label>
                            <input
                                name="videoUrl"
                                type="url"
                                defaultValue={sermon.video_url || ""}
                                className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/admin/sermons"
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
