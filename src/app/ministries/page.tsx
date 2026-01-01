import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MinistriesPage() {
    const supabase = await createServerComponentClient();
    const { data: ministries } = await supabase
        .from("ministries")
        .select("*")
        .order("name");

    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Ministries</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Find a place to connect, grow, and serve with our community.
                    </p>
                </div>
            </section>

            {/* Directory Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ministries && ministries.length > 0 ? (
                            ministries.map((ministry) => (
                                <Link
                                    key={ministry.id}
                                    href={`/ministries/${ministry.slug}`}
                                    className="group block p-8 bg-background border border-border rounded-2xl hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                            {ministry.name}
                                        </h3>
                                        <span className="text-[10px] uppercase font-bold tracking-widest bg-muted group-hover:bg-primary/10 px-2 py-1 rounded">
                                            {ministry.category || "Connect"}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground mb-6 line-clamp-3">
                                        {ministry.description || "Learn more about this ministry and how you can get involved."}
                                    </p>
                                    <div className="flex items-center text-primary font-bold">
                                        View Ministry Details <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground italic">
                                No ministries listed at this time. Please check back later!
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
