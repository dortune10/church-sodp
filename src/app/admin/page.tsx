import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function AdminPage() {
    const supabase = await createServerComponentClient();

    const { count: memberCount } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });

    const { count: ministryCount } = await supabase
        .from("ministries")
        .select("*", { count: "exact", head: true });

    const { count: eventCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("start_at", new Date().toISOString());

    const { count: sermonCount } = await supabase
        .from("sermons")
        .select("*", { count: "exact", head: true });

    const { count: messageCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

    const { count: prayerCount } = await supabase
        .from("prayer_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");

    // Recent activity: latest items across key tables
    const { data: recentPosts } = await supabase
        .from("blog_posts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

    const { data: recentSermons } = await supabase
        .from("sermons")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

    const { data: recentMessages } = await supabase
        .from("contact_messages")
        .select("id, full_name, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

    type ActivityItem = { label: string; time: string; href: string };
    const activity: ActivityItem[] = [
        ...(recentPosts || []).map((p) => ({
            label: `Blog: ${p.title}`,
            time: p.created_at,
            href: `/admin/blog`,
        })),
        ...(recentSermons || []).map((s) => ({
            label: `Sermon: ${s.title}`,
            time: s.created_at,
            href: `/admin/sermons`,
        })),
        ...(recentMessages || []).map((m) => ({
            label: `Message from ${m.full_name}${m.subject ? `: ${m.subject}` : ""}`,
            time: m.created_at,
            href: `/admin/messages`,
        })),
    ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

    const stats = [
        { name: "Total Members", value: memberCount || 0 },
        { name: "Upcoming Events", value: eventCount || 0 },
        { name: "Unread Messages", value: messageCount || 0 },
        { name: "New Prayer Requests", value: prayerCount || 0 },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="rounded-lg border border-border bg-muted/20 p-6 shadow-sm"
                    >
                        <p className="text-sm font-medium text-muted-foreground">
                            {stat.name}
                        </p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="rounded-lg border border-border p-6 bg-background">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/events/new" className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors text-center">
                            Add Event
                        </Link>
                        <Link href="/admin/sermons/new" className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors text-center">
                            New Sermon
                        </Link>
                        <Link href="/admin/members/new" className="rounded-md bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20 transition-colors text-center">
                            Add Member
                        </Link>
                        <Link href="/admin/blog/new" className="rounded-md bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20 transition-colors text-center">
                            New Blog Post
                        </Link>
                    </div>
                </section>

                <section className="rounded-lg border border-border p-6 bg-background">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Recent Activity</h2>
                    {activity.length > 0 ? (
                        <ul className="space-y-3">
                            {activity.map((item, i) => (
                                <li key={i} className="flex items-start justify-between gap-4 text-sm">
                                    <Link href={item.href} className="text-foreground hover:text-primary transition-colors truncate flex-1">
                                        {item.label}
                                    </Link>
                                    <span className="text-muted-foreground whitespace-nowrap text-xs">
                                        {new Date(item.time).toLocaleDateString([], { month: "short", day: "numeric" })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recent activity to show.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
