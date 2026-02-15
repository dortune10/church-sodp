import { createServerComponentClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

import { Metadata } from "next";

export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createServerComponentClient();
    const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, thumbnail_url")
        .eq("slug", slug)
        .single();

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | RCCG SODP Blog`,
        description: post.excerpt || `Read ${post.title} on our blog.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on our blog.`,
            images: post.thumbnail_url ? [post.thumbnail_url] : [],
        },
    };
}

export default async function BlogPostDetailPage({
    params,
}: Props) {
    const { slug } = await params;
    const supabase = await createServerComponentClient();
    const { data: post } = await supabase
        .from("blog_posts")
        .select("*, profiles(full_name)")
        .eq("slug", slug)
        .single();

    if (!post) {
        notFound();
    }

    const publishedAt = post.published_at ? new Date(post.published_at) : null;

    return (
        <article className="flex flex-col">
            {/* Article Header */}
            <section className="bg-background pt-20 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Breadcrumbs
                        items={[
                            { label: "Blog", href: "/blog" },
                            { label: post.title },
                        ]}
                    />
                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-6">
                        {publishedAt && (
                            <span>{publishedAt.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        )}
                        <span className="w-1 h-1 bg-border rounded-full"></span>
                        <span className="uppercase tracking-widest text-xs font-black text-secondary">Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-primary mb-8 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-black text-sm">
                            {post.profiles?.full_name?.charAt(0) || "A"}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Written By</p>
                            <p className="font-bold text-lg">{post.profiles?.full_name || "Church Member"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {post.thumbnail_url && (
                <section className="container mx-auto px-4 max-w-5xl mb-16">
                    <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl border border-border">
                        <Image
                            src={post.thumbnail_url}
                            alt={post.title}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>
            )}

            {/* Article Content */}
            <section className="pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="prose prose-lg md:prose-xl max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-serif">
                        {post.body || "This post has no content yet."}
                    </div>

                    <hr className="my-16 border-border" />

                    {/* Comments Section Placeholder */}
                    <div className="bg-muted/20 p-8 rounded-3xl border border-border">
                        <h3 className="text-2xl font-bold text-primary mb-6">Join the Conversation</h3>
                        <div className="p-8 text-center text-muted-foreground italic border border-dashed border-border rounded-2xl">
                            Comments system coming soon. Register an account to participate in the conversation!
                        </div>
                    </div>
                </div>
            </section>
        </article>
    );
}
