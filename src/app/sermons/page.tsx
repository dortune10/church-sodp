import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";
import EmptyState from "@/components/ui/EmptyState";
import PaginationControl from "@/components/ui/PaginationControl";
import Search from "@/components/ui/Search";

export const revalidate = 60;

export default async function SermonsPage({
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
        .from("sermons")
        .select("*", { count: 'exact', head: true });

    if (query) {
        countQuery = countQuery.or(`title.ilike.%${query}%,preacher_name.ilike.%${query}%,series.ilike.%${query}%`);
    }

    const { count } = await countQuery;

    let dataQuery = supabase
        .from("sermons")
        .select("*")
        .order("preached_at", { ascending: false })
        .range(from, to);

    if (query) {
        dataQuery = dataQuery.or(`title.ilike.%${query}%,preacher_name.ilike.%${query}%,series.ilike.%${query}%`);
    }

    const { data: sermons } = await dataQuery;

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Sermon Library</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Listen to teachings, discover series, and grow in your faith.
                    </p>
                    <div className="max-w-md mx-auto">
                        <Search placeholder="Search sermons..." />
                    </div>
                </div>
            </section>

            {/* Sermons List */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid gap-8">
                        {sermons && sermons.length > 0 ? (
                            <>
                                {sermons.map((sermon) => {
                                    const preachedAt = new Date(sermon.preached_at);
                                    return (
                                        <Link
                                            key={sermon.id}
                                            href={`/sermons/${sermon.id}`}
                                            className="group block p-8 bg-background border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-3">
                                                        <span>{preachedAt.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="w-1 h-1 bg-border rounded-full"></span>
                                                        <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">
                                                            {sermon.series || "Standalone"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                                                        {sermon.title}
                                                    </h3>
                                                    <p className="text-lg text-foreground font-medium">
                                                        {sermon.preacher_name || "Guest Speaker"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
                                                    {sermon.audio_url && (
                                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {sermon.video_url && (
                                                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                <PaginationControl currentPage={currentPage} totalPages={totalPages} baseUrl="/sermons" />
                            </>
                        ) : (
                            <EmptyState
                                title="No sermons found"
                                description={query ? `No sermons found matching "${query}".` : "We haven't uploaded any sermons yet. Check back soon for new messages."}
                                actionLabel={query ? "Clear search" : undefined}
                                actionHref={query ? "/sermons" : undefined}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                    </svg>
                                }
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
