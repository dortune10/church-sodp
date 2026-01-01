import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-muted/50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Church Name</h3>
                        <p className="text-muted-foreground">
                            Address Line 1<br />
                            City, State, Zip<br />
                            Phone: (555) 123-4567<br />
                            Email: info@church.com
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Service Times</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>Sunday Morning: 9:00 AM & 11:00 AM</li>
                            <li>Wednesday Evening: 7:00 PM</li>
                        </ul>
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
                    <p>&copy; {new Date().getFullYear()} Church Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
