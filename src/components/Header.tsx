import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { createServerComponentClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Ministries", href: "/ministries" },
    { name: "Sermons", href: "/sermons" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="RCCG Logo" className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm" />
            <span className="hidden sm:block text-xl font-bold text-primary">
              RCCG SODP
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:block text-sm text-muted-foreground truncate max-w-[150px]">
                {user.email}
              </span>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Login
            </Link>
          )}
          {/* Mobile Menu Toggle would go here */}
        </div>
      </div>
    </header>
  );
}
