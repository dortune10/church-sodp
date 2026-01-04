import { createServerSupabaseClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerSupabaseClient(request, response);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        console.log("Middleware check for /admin:", { user: user?.email });
        if (!user) {
            console.log("No user found, redirecting to login");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        // Role check
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        console.log("Profile check details:", { profile, profileError });

        if (!profile || !["admin", "editor", "leader"].includes(profile.role)) {
            console.log("Access denied. Reason:",
                !profile ? "No profile found" :
                    `Insufficient role: ${profile.role}`
            );
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Redirect logged-in users away from auth pages
    if (user && (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/register"))) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/auth/:path*"],
};
