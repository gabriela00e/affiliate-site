"use client";

import dynamic from "next/dynamic";
import { SearchBarSkeleton } from "@/components/SearchBarSkeleton";

// SearchBar.tsx does not call useSearchParams() (verified — see the comment
// in that file); this wrapper is deliberate defense-in-depth on top of that:
// ssr:false guarantees the component is excluded from every server and
// static render pass outright, rather than relying on a <Suspense> boundary
// being correctly honored during every one of Next's prerender passes
// (including the legacy "/404" static-export pass, which has been
// unreliable about this in past builds of this project).
export const SearchBarLazy = dynamic(
  () => import("@/components/SearchBar").then((mod) => mod.SearchBar),
  {
    ssr: false,
    loading: () => <SearchBarSkeleton />,
  }
);
