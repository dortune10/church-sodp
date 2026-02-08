import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MediaPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Media</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore sermons, photos, and other media from Sanctuary of Double Perfection.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Link href="/blog" className="p-8 border border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <h3 className="text-2xl font-bold mb-2">Blog</h3>
              <p className="text-muted-foreground">Read announcements, stories, and devotionals from our church community.</p>
            </Link>

            <Link href="/gallery" className="p-8 border border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <h3 className="text-2xl font-bold mb-2">Gallery</h3>
              <p className="text-muted-foreground">Browse photos from services, events, and outreach activities.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
