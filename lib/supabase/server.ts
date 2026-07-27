import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Stateless anon-key client for server-side public reads — used in Server
// Components, Route Handlers, AND build-time functions like
// generateStaticParams and sitemap.ts.
//
// Deliberately NOT built on @supabase/ssr's cookie-syncing client: this app
// has no Supabase Auth user sessions (public reads are always anonymous, and
// admin auth is a separate signed-cookie JWT — see lib/auth.ts), so there is
// no cookie state to sync. A cookie-based client also calls next/headers
// cookies(), which throws when called outside a request scope — exactly
// what generateStaticParams and sitemap.ts are (they run at build time).
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
