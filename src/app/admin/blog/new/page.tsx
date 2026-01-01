"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        }
        getUser();
    }, [supabase]);

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

        const { error } = await supabase.from("blog_posts").insert([
            {
                title: data.title,
                slug: slug,
                excerpt: data.excerpt || null,
                content: data.content || null,
                featured_image: data.featuredImage || null,
                status: data.status || "draft",
                author_id: userId,
                published_at: data.status === "published" ? new Date().toISOString() : null,
            },
        ]);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/admin/blog");
            router.refresh();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/blog"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Blog
                </Link>
                <h1 className="text-3xl font-bold text-primary">Create New Post</h1>
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
                            Post Title *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="Enter a catchy title"
                            className="w-full rounded-md border-border bg-background px-4 py-2 text-lg font-bold ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Excerpt / Short Description
                        </label>
                        <textarea
                            name="excerpt"
                            rows={2}
                            placeholder="A brief summary for the blog feed"
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Featured Image URL
                        </label>
                        <input
                            name="featuredImage"
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Content
                        </label>
                        <textarea
                            name="content"
                            rows={15}
                            placeholder="Write your post here..."
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-base ring-1 ring-border focus:ring-2 focus:ring-primary outline-none font-sans"
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Status:</label>
                            <select
                                name="status"
                                className="rounded-md border-border bg-background px-3 py-1.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/admin/blog"
                                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Saving..." : "Create Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
