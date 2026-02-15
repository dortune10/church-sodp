import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import { createServerComponentClient } from "@/lib/supabase/server";

import { navLinks } from "@/lib/nav";

export default async function Header() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="RCCG Logo" width={40} height={40} className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm" />
            <span className="hidden sm:block text-xl font-bold text-primary">
              RCCG SODP
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            link.children ? (
              <div
                key={link.name}
                className="relative group"
                tabIndex={0}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  <Link href={link.href}>
                    {link.name}
                  </Link>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 transition-transform group-hover:rotate-180">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {/* Dropdown: visible on hover or focus-within, uses smooth scale/opacity transition */}
                <div className="absolute left-0 mt-2 w-56 opacity-0 scale-95 transform transition-all duration-200 origin-top-left pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 z-50">
                  <div className="bg-background border border-border rounded-md shadow-md overflow-hidden p-1">
                    <div role="menu" aria-label={`${link.name} submenu`}>
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-sm transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <MobileMenu />
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
