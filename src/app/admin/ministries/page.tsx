import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminMinistriesPage() {
    const supabase = await createServerComponentClient();
    const { data: ministries, error } = await supabase
        .from("ministries")
        .select("*, members(full_name)")
        .order("name", { ascending: true });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">Ministries</h1>
                <Link
                    href="/admin/ministries/new"
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 shadow-sm"
                >
                    New Ministry
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                    Error loading ministries: {error.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministries && ministries.length > 0 ? (
                    ministries.map((ministry) => (
                        <div
                            key={ministry.id}
                            className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-foreground">{ministry.name}</h3>
                                <span className="text-[10px] uppercase font-bold tracking-widest bg-muted px-2 py-1 rounded">
                                    {ministry.category || "General"}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                {ministry.description || "No description provided."}
                            </p>
                            <div className="text-sm mb-4">
                                <p className="font-semibold text-foreground">Leader:</p>
                                <p className="text-muted-foreground">
                                    {ministry.members?.full_name || "Unassigned"}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-border flex justify-end">
                                <Link
                                    href={`/admin/ministries/${ministry.id}`}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Manage Settings &rarr;
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground italic border border-dashed border-border rounded-lg">
                        No ministries found. Click &quot;New Ministry&quot; to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
