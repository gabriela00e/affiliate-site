import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="seal">404</span>
      <h1 className="font-display text-3xl sm:text-4xl">We couldn't find that page</h1>
      <p className="max-w-md text-onyx/60 dark:text-pearl/60">
        The page you're looking for may have been moved, renamed, or never existed.
        Try searching instead, or head back to the homepage.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-gold">Back to homepage</Link>
        <Link href="/search" className="btn-outline">Search products</Link>
      </div>
    </div>
  );
}
