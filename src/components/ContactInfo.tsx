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
                        {settingsMap.get('address') || '1520 Commercial Park Dr\nLakeland, FL'}
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Email & Phone</h3>
                    <p className="text-lg text-muted-foreground whitespace-pre-line">
                        Email: {settingsMap.get('email') || 'rccgsodp@gmail.com'}<br />
                        Phone: {settingsMap.get('phone') || '863-698-7899'}
                    </p>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden border border-border">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.8!2d-81.9547!3d28.0394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88dd3f0e9a8b0001%3A0x0!2s1520%20Commercial%20Park%20Dr%2C%20Lakeland%2C%20FL%2033801!5e0!3m2!1sen!2sus!4v1704340000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="RCCG SODP Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
