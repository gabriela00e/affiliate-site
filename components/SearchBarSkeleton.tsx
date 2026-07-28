// No "use client" directive and no hooks of any kind — purely presentational,
// so it can be used as a next/dynamic loading fallback with zero risk of
// pulling in anything from SearchBar.tsx during a server/static render pass.
export function SearchBarSkeleton() {
  return (
    <div
      aria-hidden
      className="h-9 w-full rounded-full border border-onyx/10 bg-white dark:border-pearl/10 dark:bg-onyx2"
    />
  );
}
