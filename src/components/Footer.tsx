import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Footer() {
    const supabase = await createServerComponentClient();
    const { data: settings } = await supabase.from("settings").select("*");

    const settingsMap = new Map(settings?.map(s => [s.key, s.value]));

    return (
        <footer className="w-full border-t border-border bg-muted/50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">RCCG SODP</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {settingsMap.get('address') || '1520 Commercial Park Dr\nLakeland, FL'}
                            <br />
                            Phone: {settingsMap.get('phone') || '863-698-7899'}<br />
                            Email: {settingsMap.get('email') || 'rccgsodp@gmail.com'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Service Times</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                            {settingsMap.get('service_times') || 'Sunday Morning: 9:00 AM & 11:00 AM\nWednesday Evening: 7:00 PM'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary">
                                    Who We Are
                                </Link>
                            </li>
                            <li>
                                <Link href="/ministries" className="text-muted-foreground hover:text-primary">
                                    Ministries
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                                    Prayer Request
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RCCG SODP. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
