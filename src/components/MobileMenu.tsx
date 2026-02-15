"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/nav";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <div className="md:hidden">
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md bg-muted/20 hover:bg-muted transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-40 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <nav className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-background p-6 shadow-2xl border-l border-border overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-black text-primary tracking-tight">Menu</span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name} className="border-b border-border/50 last:border-0 pb-2">
                {link.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(link.name)}
                      className="flex items-center justify-between w-full py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${expanded === link.name ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${expanded === link.name ? 'max-h-48' : 'max-h-0'}`}>
                      <ul className="pl-4 space-y-2 py-2 bg-muted/30 rounded-lg mt-2">
                        {link.children.map(child => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block py-2 px-2 text-base text-muted-foreground hover:text-primary"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
