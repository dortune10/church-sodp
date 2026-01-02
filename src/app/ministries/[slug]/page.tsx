import { createServerComponentClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MinistryDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createServerComponentClient();
    const { data: ministry } = await supabase
        .from("ministries")
        .select("*, members(full_name)")
        .eq("slug", slug)
        .single();

    if (!ministry) {
        notFound();
    }

    return (
        <div className="flex flex-col">
            {/* Page Header / Hero */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto px-4">
                    <Link
                        href="/ministries"
                        className="text-sm font-medium opacity-80 hover:opacity-100 mb-6 inline-block"
                    >
                        &larr; All Ministries
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full mb-4 inline-block">
                                {ministry.category || "Ministry"}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold">{ministry.name}</h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">
                                {ministry.members?.full_name?.charAt(0) || "L"}
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold opacity-60">Led By</p>
                                <p className="font-bold underline decoration-secondary underline-offset-4 decoration-2">
                                    {ministry.members?.full_name || "Volunteer Team"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-bold text-primary mb-8">About This Ministry</h2>
                            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                                {ministry.description ? (
                                    ministry.description.split('\n').map((para: string, i: number) => (
                                        <p key={i}>{para}</p>
                                    ))
                                ) : (
                                    <p>Detailed information about this ministry is coming soon.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-muted p-8 rounded-2xl border border-border">
                                <h3 className="text-xl font-bold mb-6">Gathering Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs uppercase font-black text-primary/60 tracking-widest mb-2">Schedule</h4>
                                        <p className="font-semibold text-lg">{ministry.schedule || "Contact for schedule"}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs uppercase font-black text-primary/60 tracking-widest mb-2">How to Join</h4>
                                        <p className="text-muted-foreground italic border-l-4 border-secondary pl-4">
                                            Simply show up at our next gathering or contact the leader for more information. Everyone is welcome!
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <Link
                                        href="/contact"
                                        className="block text-center bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                        Ask a Question
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
