import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function UserDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const supabase = await createServerComponentClient();

    // Fetch user profile
    const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !user) {
        notFound();
    }

    async function updateRole(formData: FormData) {
        "use server";
        const role = formData.get("role") as string;
        const supabase = await createServerComponentClient();

        const { error } = await supabase
            .from("profiles")
            .update({ role })
            .eq("id", id);

        if (error) {
            console.error("Error updating role:", error.message);
            return;
        }

        redirect("/admin/users");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/users"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Users
                </Link>
                <h1 className="text-3xl font-bold text-primary">Edit User Role</h1>
                <p className="text-muted-foreground">Manage permissions for {user.full_name || user.email}</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                    {user.avatar_url ? (
                        <Image src={user.avatar_url} alt="" width={80} height={80} className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{user.full_name || "Name not set"}</h2>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1 underline">UID: {user.id}</p>
                    </div>
                </div>

                <form action={updateRole} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Account Role
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['member', 'leader', 'editor', 'admin'].map((role) => (
                                <label
                                    key={role}
                                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${user.role === role
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-muted-foreground/30"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        defaultChecked={user.role === role}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold capitalize ${user.role === role ? "text-primary" : "text-foreground"}`}>
                                            {role}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {role === 'admin' && 'Full system access.'}
                                            {role === 'editor' && 'Can manage most content.'}
                                            {role === 'leader' && 'Standard staff permissions.'}
                                            {role === 'member' && 'Public site access.'}
                                        </span>
                                    </div>
                                    {user.role === role && (
                                        <div className="ml-auto text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-border">
                        <Link
                            href="/admin/users"
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-8 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
