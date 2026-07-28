import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-onyx/5 bg-champagne/40 dark:border-pearl/10 dark:bg-onyx2">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl">{SITE_NAME}</h3>
          <p className="mt-3 max-w-xs text-sm text-onyx/70 dark:text-pearl/60">
            Curated beauty finds, tested and reviewed, with honest picks from Amazon.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-dark">
            Join the list
          </h4>
          <p className="mb-4 text-sm text-onyx/70 dark:text-pearl/60">
            New drops and editor’s picks, once a week.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-dark">
            Information
          </h4>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-onyx/70 hover:text-gold-dark dark:text-pearl/60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-lux border-t border-onyx/5 py-6 text-xs text-onyx/50 dark:border-pearl/10 dark:text-pearl/40">
        <p>
          As an Amazon Associate, {SITE_NAME} earns from qualifying purchases. Product prices and
          availability are accurate as of the date shown and are subject to change.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
