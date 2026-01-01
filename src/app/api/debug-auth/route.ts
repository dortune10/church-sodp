import { createServerComponentClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createServerComponentClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            return NextResponse.json({ error: "Auth error", details: userError }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: "No user logged in" }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        let message = "";
        if (profileError) {
            message = `Profile fetch error: ${profileError.message}. This might mean your profile was not created on signup.`;
        } else if (!profile) {
            message = "Profile not found. The trigger might have failed.";
        } else if (profile.role === 'admin') {
            message = "You are an admin. You should have access to /admin.";
        } else {
            message = `Your role is: ${profile.role}. Admin access requires 'admin', 'editor', or 'leader' role.`;
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
            },
            profile,
            profileError,
            message
        });
    } catch (error: any) {
        return NextResponse.json({ error: "System error", details: error.message }, { status: 500 });
    }
}
