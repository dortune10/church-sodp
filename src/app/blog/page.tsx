import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";
import EmptyState from "@/components/ui/EmptyState";
import PaginationControl from "@/components/ui/PaginationControl";
import Search from "@/components/ui/Search";

export const revalidate = 60;

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    const { page, query } = await searchParams;
    const currentPage = Number(page) || 1;
    const pageSize = 12;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createServerComponentClient();

    // Get count first
    let countQuery = supabase
        .from("blog_posts")
        .select("*", { count: 'exact', head: true })
        .eq("status", "published");

    if (query) {
        countQuery = countQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
    }

    const { count } = await countQuery;

    let dataQuery = supabase
        .from("blog_posts")
        .select("*, profiles(full_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range(from, to);

    if (query) {
        dataQuery = dataQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
    }

    const { data: posts } = await dataQuery;

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Church Blog</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Stories of faith, community updates, and reflections from our leadership.
                    </p>
                    <div className="max-w-md mx-auto">
                        <Search placeholder="Search articles..." />
                    </div>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts && posts.length > 0 ? (
                            <>
                                {posts.map((post) => (
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
                                ))}
                            </>
                        ) : (
                            <div className="col-span-full">
                                <EmptyState
                                    title="No blog posts"
                                    description={query ? `No posts found matching "${query}".` : "We're currently writing new content for you. Please check back later."}
                                    actionLabel={query ? "Clear search" : undefined}
                                    actionHref={query ? "/blog" : undefined}
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    }
                                />
                            </div>
                        )}
                    </div>
                    {posts && posts.length > 0 && (
                        <PaginationControl currentPage={currentPage} totalPages={totalPages} baseUrl="/blog" />
                    )}
                </div>
            </section>
        </div>
    );
}
