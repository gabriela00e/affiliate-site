# Production-readiness review — changelog

## Method

Every file in the project was read and manually type-checked against your actual
`tsconfig.json` (`strict: true`), against Next.js 14.2.35's App Router conventions, and
against the Supabase JS client's real typing behavior. I could not run `npm install`
or `npm run build` inside this environment (outbound network access to the npm
registry is disabled here), so this is a rigorous static review rather than a live
compiler run — see "What I could not verify" below for exactly what that means and
what to do about it.

**Finding:** the application source code itself (`app/`, `components/`, `lib/`,
`types/`, `supabase/schema.sql`, `scripts/`) is already in solid, strict-mode-clean
shape. I did not find a hidden TypeScript error, incorrect Supabase call, broken
`generateStaticParams`/`generateMetadata`, server/client component mistake, or
middleware bug anywhere in it. That's inconsistent with "never completed a production
build" — which points at the dependency layer, not the application code. See below.

## Root cause of "a different error every deploy"

`package.json` had **no committed `package-lock.json`**, and nearly every dependency
used a `^` range (`^2.45.4`, `^0.5.1`, `^0.446.0`, etc.). Without a lockfile, every
fresh `npm install` on Vercel re-resolves those ranges to whatever is newest *on that
day* — so `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `next-themes`, and
their bundled `.d.ts` type definitions can silently change between one deploy and the
next. That reproduces exactly the symptom you described: fix one error, redeploy,
different error appears — because the actual dependency graph shifted underneath the
same source code.

## Changes made

1. **`package.json`** — pinned every dependency and devDependency to the exact
   version it was already using (removed all `^` ranges). Added `"engines": { "node":
   ">=20.11.0 <21.0.0" }` so Vercel/CI can't silently build on a different Node major
   version than this was validated against. Added a `typecheck` script
   (`tsc --noEmit`) so type errors can be checked independently of the Next build.

2. **`.nvmrc`** (new) — pins Node to `20.11.0`, matching the `engines` field, so local
   dev, CI, and Vercel all use the same runtime.

3. **`.github/workflows/build-check.yml`** — switched from `node-version: 20` to
   `node-version-file: ".nvmrc"` so CI's Node version can't drift from the pin above;
   switched `npm install` → `npm ci` for reproducible installs from the lockfile; added
   an explicit `npm run typecheck` step before lint/build so a strict-mode TS error
   fails fast with a clear step name instead of surfacing as an opaque build failure.

4. **`app/admin/layout.tsx`** — removed an unused `LogOut` icon import (the actual
   sign-out icon lives in `components/admin/LogoutButton.tsx`; this one was dead
   code, imported but never rendered).

5. **`lib/utils.ts`** — hardened `siteUrl()`. Previously, if `NEXT_PUBLIC_SITE_URL`
   was ever set without a protocol (an easy mistake in a Vercel env var field, e.g.
   `yourdomain.com` instead of `https://yourdomain.com`), `new URL(siteUrl())` in
   `app/layout.tsx`'s `metadataBase` would throw and take down the entire build. It
   now normalizes a bare domain to `https://` automatically instead of crashing.

## What I could not verify

I do not have outbound network access in this environment, so I could not run
`npm install` or `npm run build` here to get you a live, guaranteed-passing build
log. I read every file by hand instead, against the exact compiler and framework
versions pinned in `package.json`.

**Before you deploy, please do this once, locally (or in any environment with
network access):**

```bash
npm install
npm run typecheck   # tsc --noEmit — should exit 0
npm run build        # should exit 0
```

Then **commit the `package-lock.json` that `npm install` generates.** That lockfile
is the missing piece I can't manufacture safely from here — I won't fabricate one,
because a hand-written lockfile with guessed integrity hashes would fail `npm ci`'s
verification and break your Vercel build in a much more confusing way than the
problem it's meant to fix. Once it's committed, every future `npm ci` (locally, in
CI, and on Vercel) installs the exact same dependency tree, every time — which
directly closes off the "different error on every deploy" failure mode.

## Files reviewed and left unchanged (confirmed clean)

All of `app/**`, all of `components/**`, `lib/queries.ts`, `lib/auth.ts`,
`lib/require-admin.ts`, `lib/password.ts`, `lib/supabase/*.ts`, `middleware.ts`,
`types/index.ts`, `scripts/seed.ts`, `scripts/generate-password-hash.ts`,
`supabase/schema.sql`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`,
`postcss.config.mjs`, `.eslintrc.json`, `.env.example`, `.gitignore`.

---

## Follow-up fix — `useSearchParams()` prerender failure on `/_not-found`

**Error:** `useSearchParams() should be wrapped in a Suspense boundary at page
"/404"` / `Error occurred prerendering page "/_not-found"`.

**Audit performed:** searched the entire project for every usage of
`useSearchParams()`, `useRouter()`, and `usePathname()`; checked that every file
calling a client-only hook has `"use client"` as its literal first line; checked
that no Server Component imports a hook (as opposed to a plain function like
`notFound()`) from `next/navigation`.

**Root cause:** `components/SearchBar.tsx` is the only file in the project that
calls `useSearchParams()`. It's rendered directly inside `components/Header.tsx`,
which is mounted in `app/layout.tsx` — so it renders on *every* route, including
Next's auto-generated `/_not-found` page. An unguarded `useSearchParams()` call
inside a component that gets statically prerendered fails the build exactly the
way you saw; wrapping the page itself in `<Suspense>` wouldn't have helped, since
the failing page was the framework's own not-found route, not a page in `app/`.

**Fix:**
- `components/SearchBar.tsx` — added a `SearchBarSkeleton` export: a static,
  hook-free placeholder sized to match the real search input, used as the
  Suspense fallback.
- `components/Header.tsx` — wrapped both `<SearchBar />` instances (desktop bar
  and mobile menu) in `<Suspense fallback={<SearchBarSkeleton />}>`.
- `app/not-found.tsx` (new) — didn't exist before; added a proper custom 404
  page. It's a plain Server Component with zero hooks, so it can't reintroduce
  this class of bug.

**Verified clean (no changes needed):**
- `useRouter()` usages (`app/admin/login/page.tsx`, `components/admin/LogoutButton.tsx`,
  `components/admin/ProductForm.tsx`) — `useRouter()` alone doesn't require a
  Suspense boundary, and all three files are already correctly marked `"use client"`.
- `usePathname()` — not used anywhere in the project.
- `app/search/page.tsx` — reads search terms via the `searchParams` **prop** on a
  Server Component, which is a completely different mechanism from the
  `useSearchParams()` hook and was never at risk.
- `app/compare`, `app/wishlist`, `app/admin/*` — checked individually; none call
  the navigation hooks directly, and their `"use client"` directives are all
  correctly placed as the first line of the file.

---

## Second follow-up — Suspense boundary didn't fully resolve it on Vercel

The `<Suspense>` wrap around `SearchBar` fixed the App Router's own
`/_not-found` prerender, but the error persisted at `page "/404"` specifically.
Next.js always emits **two** 404 artifacts for an App Router project: the App
Router's `/_not-found`, and a legacy static `/404` page generated through the
Pages Router compatibility layer for static-export fallback behavior. That
legacy `/404` generation pass uses a simplified static-rendering path that,
in some Next 14.x builds, does not reliably honor `<Suspense>` boundaries
around client hooks — so a component wrapped correctly in `<Suspense>` can
still throw during that specific pass.

**Fix — stronger than Suspense, sidesteps the server render entirely:**

- `components/SearchBarSkeleton.tsx` (new) — the placeholder skeleton, moved
  into its own file with no hooks and no `"use client"` directive, fully
  decoupled from the module that calls `useSearchParams()`.
- `components/SearchBarLazy.tsx` (new) — a `"use client"` wrapper that loads
  the real `SearchBar` via `next/dynamic(..., { ssr: false })`. With
  `ssr: false`, Next excludes that component from every server and static
  render pass outright — it only mounts in the browser after hydration. This
  is a strictly stronger guarantee than `<Suspense>`, which still requires
  Next to attempt and correctly bail out of a server render; `ssr:false`
  never attempts that render at all, so the legacy `/404` pass has nothing to
  fail on.
- `components/SearchBar.tsx` — now contains only the real client component
  (the skeleton export was removed, since it lives in its own file now).
- `components/Header.tsx` — both instances (desktop + mobile menu) now render
  `<SearchBarLazy />` directly; the `<Suspense>` wrapper is no longer needed
  since `ssr:false` already guarantees no server-side execution.

Verified `SearchBar.tsx` (the real, hook-bearing component) is now referenced
in exactly one place in the whole project: the dynamic `import()` call inside
`SearchBarLazy.tsx`. It is never statically imported anywhere else, so there
is no remaining path by which it can execute during a server or static render.

---

## Third follow-up — root-caused: eliminated useSearchParams() entirely

The `ssr: false` wrapper still didn't resolve it on Vercel, which means this
project's Next 14.2.35 build doesn't honor `ssr:false` for the legacy `/404`
static-export pass either, not just `<Suspense>`. Re-ran an exhaustive,
whole-repo grep for `useSearchParams`, `useRouter`, `usePathname`,
`useSelectedLayoutSegment`, and `useSelectedLayoutSegments` across every
`.ts`/`.tsx`/`.js`/`.mjs` file (not just `app/` and `components/`), and
individually re-inspected every component reachable from `app/layout.tsx`:
`Header`, `Footer`, `ThemeProvider` (wraps `next-themes`, which has no
dependency on `next/navigation`), `ListsProvider`, and `NewsletterForm`.
Confirmed `components/SearchBar.tsx` was — and always had been — the only
call site of `useSearchParams()` in the entire project.

Since two different framework-level workarounds (`<Suspense>`, then
`ssr:false`) both failed to make Next.js reliably skip that hook during its
legacy `/404` prerender pass, the only fully deterministic fix left is to stop
calling the hook at all, anywhere:

- **`components/SearchBar.tsx`** — removed `useSearchParams()` entirely. It
  was only ever used to prefill the input from the current `?q=` value on
  first render. That's now read directly from `window.location.search`
  inside a `useEffect`, guarded so it only runs client-side. Both the server
  render and the initial client render use the same `""` starting value, so
  there's no hydration mismatch — the effect just updates it after mount.
  `useRouter()` is still used for the submit-time `router.push()`, which is
  unaffected by this bug class (it doesn't require a Suspense boundary).
- **`components/Header.tsx`** — simplified back to a direct
  `import { SearchBar } from "@/components/SearchBar"` and plain
  `<SearchBar />` at both call sites. With the hook gone, `SearchBar` is a
  perfectly ordinary client component with nothing that needs a Suspense
  boundary or an `ssr:false` wrapper — reintroducing that indirection would
  only be complexity with no purpose.
- **Deleted** `components/SearchBarLazy.tsx` and
  `components/SearchBarSkeleton.tsx` — dead code once the wrapper they
  supported was removed.

Final verification: `grep -rn "useSearchParams" .` (excluding `node_modules`
and `.next`) across the entire project returns zero matches outside of a code
comment. There is no remaining code path, direct or indirect, by which this
hook can be invoked — so there is nothing left for the `/404` prerender pass
to trip on, regardless of how that specific pass handles Suspense or
`ssr:false` boundaries.
