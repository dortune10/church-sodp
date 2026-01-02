import { createServerComponentClient } from "@/lib/supabase/server";

export default async function ContactInfo() {
    const supabase = await createServerComponentClient();
    const { data: settings } = await supabase.from("settings").select("*");

    const settingsMap = new Map(settings?.map(s => [s.key, s.value]));

    return (
        <div>
            <h2 className="text-3xl font-bold text-primary mb-8">Get In Touch</h2>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold mb-2">Our Location</h3>
                    <p className="text-lg text-muted-foreground whitespace-pre-line">
                        {settingsMap.get('address') || '123 Church Street\nCity, State 12345'}
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Email & Phone</h3>
                    <p className="text-lg text-muted-foreground whitespace-pre-line">
                        Email: {settingsMap.get('email') || 'info@church.com'}<br />
                        Phone: {settingsMap.get('phone') || '(555) 123-4567'}
                    </p>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                    <span className="text-muted-foreground">Map Embed Placeholder</span>
                </div>
            </div>
        </div>
    );
}
