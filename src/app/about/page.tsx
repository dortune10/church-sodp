export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Page Header */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Who We Are</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover our story, mission, and the heart behind what we do.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid gap-16">
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our mission is to lead people into a growing relationship with Jesus Christ. We seek to be a lighthouse in our community, sharing hope and love with everyone we meet.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Founded in [Year], Church Name began with a small group of faithful believers dedicated to making a difference. Today, we continue that legacy by fostering a welcoming environment for all to worship and grow.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">What We Believe</h2>
                            <ul className="space-y-4 text-lg text-muted-foreground">
                                <li className="flex gap-4">
                                    <span className="text-secondary font-bold">1.</span>
                                    <span>We believe in the authority and inspiration of Scripture.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-secondary font-bold">2.</span>
                                    <span>We believe in one God, existing in three persons: Father, Son, and Holy Spirit.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-secondary font-bold">3.</span>
                                    <span>We believe in the dignity of every human being as made in God&apos;s image.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section Placeholder */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-12">Our Leadership</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "John Doe", role: "Lead Pastor" },
                            { name: "Jane Smith", role: "Worship Pastor" },
                            { name: "Robert Brown", role: "Youth Leader" },
                        ].map((leader) => (
                            <div key={leader.name} className="p-8 border border-border rounded-xl bg-background">
                                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <span className="text-muted-foreground">Photo</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                                <p className="text-muted-foreground">{leader.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
