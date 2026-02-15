import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex min-h-[calc(100vh-4rem)] border-t border-border">
            {/* Sidebar */}
            <AdminSidebar userEmail={user?.email} />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-background">
                <div className="max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
