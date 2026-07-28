/**
 * Throws a precise, actionable error naming exactly which environment
 * variable is missing, instead of letting @supabase/supabase-js's generic
 * "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL." surface on its
 * own. That message doesn't say *why* the URL is invalid or *where* to fix
 * it — this does.
 *
 * Note: NEXT_PUBLIC_* variables are inlined at `next build` time, not read
 * at request time. If this throws during a Vercel build, the fix is in
 * Vercel Project Settings → Environment Variables — make sure the variable
 * is attached to the Build step for the environment being deployed
 * (Production/Preview), then trigger a new deployment. Adding an env var
 * does not retroactively apply to a build already queued or cached.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Set it in Vercel ` +
        `Project Settings → Environment Variables (for the Build step of ` +
        `whichever environment you're deploying — Production/Preview), then ` +
        `redeploy. Locally, set it in .env.local.`
    );
  }
  return value;
}
