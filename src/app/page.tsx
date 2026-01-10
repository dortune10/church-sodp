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

      {/* About Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome Message */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
              Welcome To RCCG Sanctuary of Double Perfection
            </h2>
            <div className="text-lg text-muted-foreground leading-relaxed">
              {/* Image floated left with text wrapping */}
              <img
                src="/uploads/pastors.jpg"
                alt="Pastors of RCCG SODP"
                className="float-left mr-8 mb-4 rounded-lg shadow-lg w-64 md:w-80"
              />
              <p className="mb-6">
                We welcome you to Sanctuary of Double Perfection. RCCG, Sanctuary of Double Perfection is one of the over 800 parishes of The Redeemed Christian Church of God in North America and is under Florida Zone 4 with the headquarters in Tampa, Florida. The church started in Lakeland in January 2012.
              </p>
              <p className="mb-6">
                SODP is a church where we believe in the undiluted word of God, holiness, evangelism and the power of prayer.
              </p>
              <p className="mb-6">
                At SODP, we offer a supportive community with a wealth of opportunities for spiritual and personal growth.
              </p>
              <p className="mb-6">
                As you join us to praise and worship the Lord at SODP, we assure you that your life can never remain the same. God loves you as you are and we love you so too.
              </p>
              <p className="font-semibold text-primary italic clear-left">
                THE LORD WILL PERFECT ALL THAT CONCERNS YOU IN THE VICTORIOUS NAME OF JESUS... PSALMS 138:8. AMEN!
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="border-t border-border pt-12">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To raise disciples to build God&apos;s Kingdom, within the communities and the world at large by discipling and empowering them to maximize and perfect their God given potentials to fulfill their heavenly mandate.
              </p>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/about"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
              >
                More About Us &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times & Location */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Join Us</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Weekly Services</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span><strong>Sunday</strong> - School & Worship</span>
                      <span>10:00 AM & 11:00 AM</span>
                    </li>
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span><strong>Tuesday</strong> - Liberation Hour</span>
                      <span>10:00 AM</span>
                    </li>
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span><strong>Wednesday</strong> - Bible Study</span>
                      <span>7:00 - 8:30 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span><strong>Thursday</strong> - Liberation Hour (Teleconference)</span>
                      <span>8:00 - 9:00 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-border/50 pb-2">
                      <span><strong>Friday</strong> - Prayer Meeting</span>
                      <span>7:00 - 8:30 PM</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    Prayer Line: 515-606-5197, Access Code: 970438#
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Address</h3>
                  <p className="text-muted-foreground">
                    1520 Commercial Park Dr<br />
                    Lakeland, FL 33801
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/place/The+Redeemed+Christian+Church+of+God+Sanctuary+of+Double+Perfection/@28.0248497,-81.9272728,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-secondary font-bold hover:underline"
                >
                  Get Directions &rarr;
                </a>
              </div>
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
