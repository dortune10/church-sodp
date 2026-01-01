import { createServerComponentClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const supabase = await createServerComponentClient();

        const { error } = await supabase.from("prayer_requests").insert([
            {
                full_name: data.fullName,
                request: data.request,
                share_publicly: data.sharePublicly === "on" ? false : true, // Note: the checkbox 'checked' sends "on" or null
            },
        ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
