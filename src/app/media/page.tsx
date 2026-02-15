import Link from "next/link";
import { Mic2, BookOpen, Camera, Radio } from "lucide-react";

export const metadata = {
  title: "Media & Resources | Our Church",
  description: "Explore our sermons, blog posts, and photo gallery.",
};

export default function MediaPage() {
  const resources = [
    {
      title: "Sermons",
      description: "Listen to past messages and sermon series.",
      href: "/sermons",
      icon: Mic2,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Blog",
      description: "Read articles, updates, and devotionals.",
      href: "/blog",
      icon: BookOpen,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Gallery",
      description: "View photos from our events and community life.",
      href: "/gallery",
      icon: Camera,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    // {
    //     title: "Livestream",
    //     description: "Join us live on Sundays.",
    //     href: "/live",
    //     icon: Radio,
    //     color: "text-red-500",
    //     bg: "bg-red-50",
    // },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Media & Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Grow in your faith with our collection of digital resources.
        </p>
      </section>

      <section className="py-20 px-4 container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group p-8 rounded-2xl border border-border bg-background hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-full ${resource.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <resource.icon className={`w-8 h-8 ${resource.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{resource.title}</h2>
              <p className="text-muted-foreground">{resource.description}</p>
              <span className="mt-6 text-primary font-medium group-hover:underline underline-offset-4">
                Browse {resource.title} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
