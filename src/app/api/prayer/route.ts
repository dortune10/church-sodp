import { createServerComponentClient } from '@/lib/supabase/server';
import { NextResponse } from "next/server";
import { prayerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Server-side validation
        const result = prayerSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map(i => ({
                field: i.path[0],
                message: i.message,
            }));
            return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
        }

        const supabase = await createServerComponentClient();

        const { error } = await supabase.from("prayer_requests").insert([
            {
                full_name: result.data.fullName,
                request: result.data.request,
                share_publicly: result.data.sharePublicly === "on" ? false : true,
            },
        ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
