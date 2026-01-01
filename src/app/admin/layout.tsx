import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Sidebar links
    const adminLinks = [
        { name: "Dashboard", href: "/admin" },
        { name: "Members", href: "/admin/members" },
        { name: "Ministries", href: "/admin/ministries" },
        { name: "Events", href: "/admin/events" },
        { name: "Sermons", href: "/admin/sermons" },
        { name: "Blog", href: "/admin/blog" },
        { name: "Gallery", href: "/admin/gallery" },
        { name: "Users", href: "/admin/users" },
        { name: "Settings", href: "/admin/settings" },
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] border-t border-border">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-muted/30 flex flex-col">
                <div className="p-6 border-b border-border flex flex-col items-center gap-2">
                    <img src="/logo.jpg" alt="RCCG Logo" className="h-16 w-16 rounded-full object-contain bg-white p-1 shadow-sm" />
                    <span className="font-bold text-primary text-center leading-tight">
                        RCCG SODP Admin
                    </span>
                    {user?.email && (
                        <span className="text-xs text-muted-foreground truncate w-full text-center mt-1">
                            {user.email}
                        </span>
                    )}
                </div>
                <nav className="flex-1 flex flex-col p-4">
                    <ul className="space-y-2">
                        {adminLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="block rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto pt-4 border-t border-border">
                        <form action="/auth/logout" method="post">
                            <button
                                type="submit"
                                className="w-full text-left rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-background">
                <div className="max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
