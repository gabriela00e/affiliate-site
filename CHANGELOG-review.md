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
