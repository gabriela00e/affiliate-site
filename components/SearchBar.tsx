"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  // Prefill from the current query string on mount, client-side only. This
  // deliberately avoids next/navigation's useSearchParams() hook — the hook
  // itself is what forces Next to treat this component as needing a
  // Suspense/dynamic-render boundary during prerendering, and that
  // requirement has proven unreliable for the legacy "/404" static export
  // pass on this project. Reading window.location.search directly gives the
  // same value without depending on that hook at all. Both the server render
  // and the first client render use the same initial "" value, so there is
  // no hydration mismatch — this effect only updates it after mount.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setValue(q);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-onyx/40 dark:text-pearl/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-full border border-onyx/10 bg-white py-2 pl-9 pr-4 text-sm outline-none
          transition-colors focus:border-gold dark:border-pearl/10 dark:bg-onyx2 dark:text-pearl"
      />
    </form>
  );
}
