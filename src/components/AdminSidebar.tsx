"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type AdminSidebarProps = {
    userEmail?: string | null;
};

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const adminLinks = [
        { name: "Dashboard", href: "/admin" },
        { name: "Members", href: "/admin/members" },
        { name: "Ministries", href: "/admin/ministries" },
        { name: "Events", href: "/admin/events" },
        { name: "Sermons", href: "/admin/sermons" },
        { name: "Blog", href: "/admin/blog" },
        { name: "Gallery", href: "/admin/gallery" },
        { name: "Messages", href: "/admin/messages" },
        { name: "Prayer Requests", href: "/admin/prayer-requests" },
        { name: "Users", href: "/admin/users" },
        { name: "Settings", href: "/admin/settings" },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                aria-label="Toggle Admin Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 md:top-16 left-0 z-40 h-full md:h-[calc(100vh-4rem)]
                w-64 border-r border-border bg-card flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 border-b border-border flex flex-col items-center gap-2">
                    <Image src="/logo.jpg" alt="RCCG Logo" width={64} height={64} className="h-16 w-16 rounded-full object-contain bg-white p-1 shadow-sm" />
                    <span className="font-bold text-primary text-center leading-tight">
                        RCCG SODP Admin
                    </span>
                    {userEmail && (
                        <span className="text-xs text-muted-foreground truncate w-full text-center mt-1">
                            {userEmail}
                        </span>
                    )}
                </div>
                <nav className="flex-1 flex flex-col p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {adminLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-primary"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
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
        </>
    );
}
