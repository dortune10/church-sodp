import { createServerComponentClient } from "@/lib/supabase/server";

export async function getSettings() {
    const supabase = await createServerComponentClient();
    const { data: settings } = await supabase.from("settings").select("*");

    // Return a Map for easy access
    return new Map(settings?.map(s => [s.key, s.value]));
}
