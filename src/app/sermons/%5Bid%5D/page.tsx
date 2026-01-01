import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SermonDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();
    const { data: sermon } = await supabase
        .from("sermons")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!sermon) {
        notFound();
    }

    const preachedAt = new Date(sermon.preached_at);

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto px-4">
                    <Link
                        href="/sermons"
                        className="text-sm font-medium opacity-80 hover:opacity-100 mb-6 inline-block"
                    >
                        &larr; Back to Library
                    </Link>
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 text-sm font-medium opacity-80 mb-6">
                            <span>{preachedAt.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                            <span className="uppercase tracking-widest text-xs font-black bg-white/10 px-2 py-1 rounded">
                                {sermon.series || "Standalone Message"}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {sermon.title}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium opacity-90 border-l-4 border-secondary pl-6">
                            {sermon.preacher_name || "Guest Speaker"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Media & Content */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            {/* Media Players */}
                            <div className="space-y-12 mb-16">
                                {sermon.audio_url && (
                                    <div className="p-8 bg-muted rounded-3xl border border-border">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                            </svg>
                                            Listen to Sermon
                                        </h3>
                                        <audio controls className="w-full">
                                            <source src={sermon.audio_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <div className="mt-4 flex justify-end">
                                            <a href={sermon.audio_url} download className="text-sm font-bold text-primary hover:underline">Download MP3</a>
                                        </div>
                                    </div>
                                )}

                                {sermon.video_url && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-primary">Watch Sermon Video</h3>
                                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-border">
                                            {/* This would normally be an iframe for YouTube/Vimeo */}
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-br from-zinc-800 to-zinc-950">
                                                <p className="text-xl font-bold mb-4">Video Link Provided</p>
                                                <a
                                                    href={sermon.video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                                                >
                                                    Watch on Video Platform
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-background">
                                <h2 className="text-3xl font-bold text-primary mb-8 underline decoration-secondary decoration-4 underline-offset-8">Description & Notes</h2>
                                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {sermon.description || "The message description and scripture references are being updated."}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Additional Info */}
                        <div className="space-y-8">
                            <div className="p-8 bg-muted/50 rounded-2xl border border-border">
                                <h3 className="text-xl font-bold mb-6">Series Information</h3>
                                <p className="text-muted-foreground mb-6">
                                    This sermon is part of the <span className="text-foreground font-bold">{sermon.series || "Standalone Message"}</span> series.
                                </p>
                                <Link
                                    href="/sermons"
                                    className="text-primary font-bold hover:underline"
                                >
                                    View All Sermons in Series &rarr;
                                </Link>
                            </div>

                            <div className="p-8 bg-muted/50 rounded-2xl border border-border">
                                <h3 className="text-xl font-bold mb-6">Scripture References</h3>
                                <p className="text-muted-foreground italic">
                                    Check the description for specific verse references mentioned during this teaching.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
