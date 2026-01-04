import { createServerComponentClient } from "@/lib/supabase/server";

export default async function AboutPage() {
    const supabase = await createServerComponentClient();

    // In a real app, this would be fetched from the `pages` table
    const pageContent = {
        mission: "Our mission is to lead people into a growing relationship with Jesus Christ. We seek to be a lighthouse in our community, sharing hope and love with everyone we meet.",
        story: "Founded in [Year], Church Name began with a small group of faithful believers dedicated to making a difference. Today, we continue that legacy by fostering a welcoming environment for all to worship and grow.",
        beliefs: [
            { point: "We believe in the authority and inspiration of Scripture." },
            { point: "We believe in one God, existing in three persons: Father, Son, and Holy Spirit." },
            { point: "We believe in the dignity of every human being as made in God's image." }
        ]
    };

    const { data: leaders } = await supabase
        .from("profiles")
        .select("*, members(*)")
        .eq("role", "leader")
        .limit(3);

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
                                {pageContent.mission}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {pageContent.story}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-6">What We Believe</h2>
                            <ul className="space-y-4 text-lg text-muted-foreground">
                                {pageContent.beliefs.map((belief, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="text-secondary font-bold">{index + 1}.</span>
                                        <span>{belief.point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Times Section */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-primary mb-12 text-center">Service Times</h2>

                    {/* Weekly Services */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-primary mb-6">Weekly Services</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-4 px-4 font-bold">Day</th>
                                        <th className="text-left py-4 px-4 font-bold">Service</th>
                                        <th className="text-left py-4 px-4 font-bold">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold" rowSpan={2}>Sunday</td>
                                        <td className="py-4 px-4">Sunday School</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4">Sunday Worship</td>
                                        <td className="py-4 px-4">11:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Tuesday</td>
                                        <td className="py-4 px-4">Liberation Hour (Counselling, Deliverance and Prayers)</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Wednesday</td>
                                        <td className="py-4 px-4">Bible Study (Digging Deep)</td>
                                        <td className="py-4 px-4">7:00 PM - 8:30 PM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Thursday</td>
                                        <td className="py-4 px-4">
                                            Liberation Hour (Teleconference)<br />
                                            <span className="text-sm italic">Prayer Line: 515-606-5197, Access Code: 970438#</span>
                                        </td>
                                        <td className="py-4 px-4">8:00 PM - 9:00 PM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Friday</td>
                                        <td className="py-4 px-4">Prayer Meeting (Fire on the Altar)</td>
                                        <td className="py-4 px-4">7:00 PM - 8:30 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Monthly Services */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-6">Monthly Services</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-4 px-4 font-bold">Day</th>
                                        <th className="text-left py-4 px-4 font-bold">Service</th>
                                        <th className="text-left py-4 px-4 font-bold">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold" rowSpan={3}>Sunday</td>
                                        <td className="py-4 px-4">Thanksgiving Sunday - Every 1st Sunday of the Month</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4">Youth Sunday - Every 3rd Sunday of the Month</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4">Anointing Service - Every Last Sunday of the Month</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Friday</td>
                                        <td className="py-4 px-4">Vigil Service - Last Friday of the Month</td>
                                        <td className="py-4 px-4">10:00 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-12">Our Leadership</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {leaders && leaders.length > 0 ? (
                            leaders.map((leader) => (
                                <div key={leader.id} className="p-8 border border-border rounded-xl bg-background">
                                    <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                                        {leader.avatar_url ? (
                                            <img src={leader.avatar_url} alt={leader.full_name || ""} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-muted-foreground">Photo</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{leader.full_name}</h3>
                                    <p className="text-muted-foreground">{leader.role}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-muted-foreground">
                                Leadership information coming soon.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
