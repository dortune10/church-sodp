export default function AdminPage() {
    const stats = [
        { name: "Total Members", value: "0" },
        { name: "Active Ministries", value: "3" },
        { name: "Upcoming Events", value: "0" },
        { name: "Published Sermons", value: "0" },
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
                        <button className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                            Add Event
                        </button>
                        <button className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                            New Sermon
                        </button>
                        <button className="rounded-md bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20 transition-colors">
                            Add Member
                        </button>
                        <button className="rounded-md bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary hover:bg-secondary/20 transition-colors">
                            New Blog Post
                        </button>
                    </div>
                </section>

                <section className="rounded-lg border border-border p-6 bg-background">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Recent Activity</h2>
                    <div className="text-sm text-muted-foreground">
                        No recent activity to show.
                    </div>
                </section>
            </div>
        </div>
    );
}
