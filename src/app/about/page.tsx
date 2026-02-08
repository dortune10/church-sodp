import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function AboutPage() {
    const supabase = await createServerComponentClient();

    // In a real app, this would be fetched from the `pages` table
    const pageContent = {
        mission: "Our mission is to lead people into a growing relationship with Jesus Christ. We seek to be a lighthouse in our community, sharing hope and love with everyone we meet.",
        story: "Founded in 2012, Sanctuary of Double Perfection began with a small group of faithful believers dedicated to making a difference. Today, we continue that legacy by fostering a welcoming environment for all to worship and grow.",
            motto: "Achieving God’s purpose in life through prayer and evangelism.",
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

    const { data: ministries } = await supabase
        .from("ministries")
        .select("*")
        .order("name");

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
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Motto</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed italic">
                                {pageContent.motto}
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

            {/* Ministries Section (moved from /ministries) */}
            <section className="py-16 bg-muted/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">Our Ministries</h2>
                    <div className="grid gap-10">
                        <div>
                            <h3 className="text-2xl font-bold text-primary mb-4">The Men Ministry</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The men ministry of SODP is called the Excellent Men Fellowship. It comprises all married men, widowers, and adult single men.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-primary mb-4">The Women Ministry</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The women ministry of SODP is called Sisters of Grace Fellowship (SOGF). It comprises all married women, widows, single mothers and adult single sisters. The central focus of the fellowship is to foster love, unity, and progress amongst the women in the church. The women organize two outreaches tagged “Love without measure” annually during Easter and Christmas.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-primary mb-4">The Youth &amp; Singles Ministry</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The youth and singles ministry of SODP is called Youth Aflame. They organize a monthly program tagged “Keeping fit for Jesus” whereby they run round the lake to keep fit. They break into their natural groups to go on outings mostly after the church service on Sunday to familiarize with one another.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-primary mb-4">The Children Ministry</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The children ministry of SODP is called the Future Ambassadors. It comprises children from age zero (0) to seventeen (17). We organize age-appropriate Bible study for the children, take them out once a month and during the summer, and join other children on the continent during the annual children weekend, convention, and for the continent’s summer program.
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Ministries Directory */}
                    {ministries && ministries.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Ministries Directory</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {ministries.map((ministry) => (
                                    <Link
                                        key={ministry.id}
                                        href={`/ministries/${ministry.slug}`}
                                        className="group block p-6 bg-background border border-border rounded-2xl hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{ministry.name}</h4>
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-muted px-2 py-1 rounded">{ministry.category || "Connect"}</span>
                                        </div>
                                        <p className="text-muted-foreground line-clamp-3">{ministry.description || "Learn more about this ministry and how you can get involved."}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
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
                                        <td className="py-4 px-4 font-semibold">Sunday</td>
                                        <td className="py-4 px-4">Sunday (Online/Onsite)</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Tuesday</td>
                                        <td className="py-4 px-4">Liberation Hour</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Wednesday</td>
                                        <td className="py-4 px-4">Online Bible Study</td>
                                        <td className="py-4 px-4">7:00 PM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Thursday</td>
                                        <td className="py-4 px-4">Liberation Hour</td>
                                        <td className="py-4 px-4">8:00 PM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Friday</td>
                                        <td className="py-4 px-4">Online Prayer Meeting</td>
                                        <td className="py-4 px-4">7:00 PM</td>
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
                                        <td className="py-4 px-4 font-semibold">1st Sunday</td>
                                        <td className="py-4 px-4">Thanksgiving (Online/Onsite)</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">3rd Sunday</td>
                                        <td className="py-4 px-4">Youth Sunday (Online/Onsite)</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Last Friday</td>
                                        <td className="py-4 px-4">Vigil / Communion (Online/Onsite)</td>
                                        <td className="py-4 px-4">10:00 PM</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-4 px-4 font-semibold">Last Sunday</td>
                                        <td className="py-4 px-4">Anointing (Online/Onsite)</td>
                                        <td className="py-4 px-4">10:00 AM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    
                    {/* Church Office Hours */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-primary mb-4">Church Office Hours</h3>
                        <p className="text-lg text-muted-foreground">Tuesday – Friday 10:00 AM – 4:00 PM</p>
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
