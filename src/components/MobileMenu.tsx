"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Sermons", href: "/sermons" },
    { name: "Events", href: "/events" },
    { name: "Give", href: "/give" },
    { name: "Media", href: "/media" },
    { name: "Contact", href: "/contact" },
  ];

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
        className={`fixed inset-0 z-40 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
        <nav className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-background p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-lg font-bold text-primary">RCCG SODP</Link>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block text-lg font-medium text-muted-foreground hover:text-primary">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
