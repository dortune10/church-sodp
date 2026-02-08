import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const supabase = await createServerComponentClient();
    const { data: posts } = await supabase
        .from("blog_posts")
        .select("*, profiles(full_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Church Blog</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stories of faith, community updates, and reflections from our leadership.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group block bg-background border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col"
                                >
                                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                                        {post.thumbnail_url ? (
                                            <Image
                                                src={post.thumbnail_url}
                                                alt={post.title}
                                                fill
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 opacity-20">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm shadow-sm rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                                            {new Date(post.published_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                                            {post.excerpt || "Read our latest post and join the conversation about faith and community."}
                                        </p>
                                        <div className="flex items-center gap-3 pt-6 border-t border-border">
                                            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black text-[10px]">
                                                {post.profiles?.full_name?.charAt(0) || "A"}
                                            </div>
                                            <span className="text-sm font-bold opacity-70">
                                                {post.profiles?.full_name || "Church Team"}
                                            </span>
                                            <span className="ml-auto text-primary font-black text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-3xl">
                                <p className="text-xl text-muted-foreground">No blog posts yet. We&apos;re writing something for you!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
