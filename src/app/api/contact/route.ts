import { createServerComponentClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const supabase = await createServerComponentClient();

        const { error } = await supabase.from("contact_messages").insert([
            {
                full_name: data.fullName,
                email: data.email,
                subject: data.subject,
                message: data.message,
            },
        ]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
