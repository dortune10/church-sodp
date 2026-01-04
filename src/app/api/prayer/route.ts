import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set({ name, value, ...options })
                        );
                    },
                },
            }
        );

        const { error } = await supabase.from("prayer_requests").insert([
            {
                full_name: data.fullName,
                request: data.request,
                share_publicly: data.sharePublicly === "on" ? false : true, // Note: the checkbox 'checked' sends "on" or null
            },
        ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
