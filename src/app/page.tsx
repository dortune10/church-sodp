import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createServerComponentClient();
  const { data: settings } = await supabase.from("settings").select("*");

  const settingsMap = new Map(settings?.map(s => [s.key, s.value]));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="container relative z-10 mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to RCCG SODP</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            A community seeking to follow Jesus and love our neighbors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors"
            >
              Plan a Visit
            </Link>
            <Link
              href="/sermons"
              className="bg-background text-primary px-8 py-3 rounded-md font-bold hover:bg-muted transition-colors"
            >
              Watch Latest Sermon
            </Link>
          </div>
        </div>
      </section>

      {/* Service Times & Location */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Join Us This Sunday</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">Service Times</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {settingsMap.get('service_times') || '9:00 AM & 11:00 AM'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Location</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {settingsMap.get('address') || '123 Church Street\nCity, State 12345'}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-block text-secondary font-bold hover:underline"
                >
                  Get Directions &rarr;
                </Link>
              </div>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <span className="text-muted-foreground">Map Embed Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections Placeholders */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-12">Learn More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Ministries", href: "/ministries", desc: "Find your place to belong and serve." },
              { title: "Connect", href: "/contact", desc: "New here? We'd love to meet you." },
              { title: "Sermons", href: "/sermons", desc: "Listen to recent teachings and series." },
              { title: "About Us", href: "/about", desc: "Our mission, beliefs, and leadership." },
            ].map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group p-8 border border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/80 mb-4">
                  {section.desc}
                </p>
                <span className="font-semibold transition-transform group-hover:translate-x-1 inline-block">
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
