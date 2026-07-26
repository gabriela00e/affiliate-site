import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: "Affiliate Disclosure" };

export default function AffiliateDisclosurePage() {
  return (
    <div className="container-lux max-w-3xl py-14 prose prose-sm dark:prose-invert">
      <h1 className="font-display text-3xl">Affiliate Disclosure</h1>
      <p className="text-onyx/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        {SITE_NAME} is a participant in the Amazon Services LLC Associates Program, an affiliate
        advertising program designed to provide a means for sites to earn advertising fees by
        advertising and linking to Amazon.com.
      </p>

      <p>
        This means that when you click a "Buy Now" link or any other Amazon link on this site and
        make a qualifying purchase, we may earn a small commission — at no additional cost to you.
      </p>

      <h2>Editorial independence</h2>
      <p>
        Our recommendations are based on genuine research and, where possible, hands-on testing.
        Commission potential never determines whether or how a product is featured.
      </p>

      <h2>Pricing and availability</h2>
      <p>
        Prices and availability shown on this site are accurate as of the date of publication and are
        subject to change. Always check the current price and details on Amazon before purchasing.
      </p>

      <p>Thank you for supporting {SITE_NAME} — it's how we keep the lights on and the reviews honest.</p>
    </div>
  );
}
