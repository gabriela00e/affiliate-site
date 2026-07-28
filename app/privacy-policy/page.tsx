import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-lux max-w-3xl py-14 prose prose-sm dark:prose-invert">
      <h1 className="font-display text-3xl">Privacy Policy</h1>
      <p className="text-onyx/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        {SITE_NAME} ("we", "us") respects your privacy. This policy explains what information we
        collect when you visit this site and how we use it.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Email address, if you subscribe to our newsletter.</li>
        <li>Name and any comments you submit with a product review.</li>
        <li>Anonymous usage data such as pages visited and links clicked, used to improve our recommendations.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use collected information to send newsletters (if subscribed), display product reviews,
        and understand which products readers find most useful. We do not sell personal information
        to third parties.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies for essential site functionality (such as remembering your theme preference)
        and, where enabled, for analytics via Google Analytics.
      </p>

      <h2>Third-party links</h2>
      <p>
        This site contains affiliate links to Amazon. When you click these links, Amazon may collect
        information according to its own privacy policy. We are not responsible for the privacy
        practices of third-party sites.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request deletion of your email from our newsletter list at any time by contacting us,
        or by using the unsubscribe link in any email we send.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be sent to the contact address listed in our footer.</p>
    </div>
  );
}
