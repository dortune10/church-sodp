import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSermonsPage() {
    const supabase = await createServerComponentClient();
    const { data: sermons, error } = await supabase
        .from("sermons")
        .select("*")
        .order("preached_at", { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">Sermons</h1>
                <Link
                    href="/admin/sermons/new"
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
                >
                    Add Sermon
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md text-sm">
                    Error loading sermons: {error.message}
                </div>
            )}

            <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Sermon Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Preacher
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Series
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                        {sermons && sermons.length > 0 ? (
                            sermons.map((sermon) => (
                                <tr key={sermon.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-foreground">{sermon.title}</div>
                                        <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                                            {sermon.audio_url && <span className="bg-primary/10 text-primary px-1 rounded">Audio</span>}
                                            {sermon.video_url && <span className="bg-secondary/10 text-secondary px-1 rounded">Video</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {sermon.preacher_name || "Guest Speaker"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(sermon.preached_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {sermon.series || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/sermons/${sermon.id}`}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    No sermons found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
