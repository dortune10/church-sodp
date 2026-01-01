"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditPostPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [post, setPost] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setPost(data);
            }
            setLoading(false);
        }

        if (id) fetchPost();
    }, [id, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const updateData: any = {
            title: data.title,
            excerpt: data.excerpt || null,
            content: data.content || null,
            featured_image: data.featuredImage || null,
            status: data.status,
        };

        // If changing from draft to published, set published_at
        if (post.status === "draft" && data.status === "published") {
            updateData.published_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from("blog_posts")
            .update(updateData)
            .eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/blog");
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setSaving(true);
        const { error } = await supabase.from("blog_posts").delete().eq("id", id);

        if (error) {
            setError(error.message);
            setSaving(false);
        } else {
            router.push("/admin/blog");
            router.refresh();
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading post details...</div>;
    if (!post) return <div className="p-8 text-center text-muted-foreground">Post not found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex-1">
                    <Link
                        href="/admin/blog"
                        className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                    >
                        &larr; Back to Blog
                    </Link>
                    <h1 className="text-3xl font-bold text-primary">Edit Blog Post</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-800 underline underline-offset-4"
                >
                    Delete Post
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
                            Post Title *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={post.title}
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
                            defaultValue={post.excerpt || ""}
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
                            defaultValue={post.featured_image || ""}
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
                            defaultValue={post.content || ""}
                            className="w-full rounded-md border-border bg-background px-3 py-2 text-base ring-1 ring-border focus:ring-2 focus:ring-primary outline-none font-sans"
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Status:</label>
                            <select
                                name="status"
                                defaultValue={post.status}
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
                                disabled={saving}
                                className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
