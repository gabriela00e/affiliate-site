"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Scale, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { SearchBarLazy } from "@/components/SearchBarLazy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLists } from "@/components/providers/ListsProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const { wishlist, compare } = useLists();

  return (
    <header className="sticky top-0 z-50 border-b border-onyx/5 bg-pearl/90 backdrop-blur-md dark:border-pearl/10 dark:bg-onyx/90">
      <div className="container-lux flex h-20 items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          {SITE_NAME.split(" ")[0]}
          <span className="text-gold">.</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden max-w-xs flex-1 md:block">
          <SearchBarLazy />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/compare" className="relative hidden sm:block" aria-label="Compare products">
            <Scale className="h-5 w-5" />
            {compare.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-onyx">
                {compare.length}
              </span>
            )}
          </Link>
          <Link href="/wishlist" className="relative" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-onyx">
                {wishlist.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-onyx/5 px-4 pb-6 pt-4 lg:hidden dark:border-pearl/10">
          <div className="mb-4">
            <SearchBarLazy />
          </div>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
