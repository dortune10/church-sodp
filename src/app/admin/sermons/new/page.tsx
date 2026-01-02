"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSermonPage() {
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

        const slug = (data.title as string)
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");

        const { error } = await supabase.from("sermons").insert([
            {
                title: data.title,
                slug: slug,
                preacher_name: data.preacherName || null,
                series: data.series || null,
                description: data.description || null,
                audio_url: data.audioUrl || null,
                video_url: data.videoUrl || null,
                preached_at: data.preachedAt || new Date().toISOString(),
            },
        ]);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/sermons");
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/sermons"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Sermons
                </Link>
                <h1 className="text-3xl font-bold text-primary">Add New Sermon</h1>
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
                                placeholder="e.g. Pastor John Doe"
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
                                placeholder="e.g. Walking in Faith"
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
                            defaultValue={new Date().toISOString().split('T')[0]}
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
                            placeholder="e.g. Romans 8:1-11 - A message about hope."
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
                                placeholder="https://example.com/audio.mp3"
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
                                placeholder="https://youtube.com/watch?v=..."
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
                            disabled={loading}
                            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Saving..." : "Create Sermon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
