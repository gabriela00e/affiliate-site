"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({
  url,
  title,
  image,
}: {
  url: string;
  title: string;
  image?: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedImage = image ? encodeURIComponent(image) : "";

  const links = [
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodedImage}`,
      bg: "bg-[#E60023]",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "bg-[#1877F2]",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      bg: "bg-[#25D366]",
    },
  ];

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${link.bg} transition-transform hover:scale-110`}
        >
          {link.label[0]}
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-onyx/10 text-onyx/70 transition-transform hover:scale-110 dark:border-pearl/20 dark:text-pearl/70"
      >
        {copied ? <Check className="h-4 w-4 text-gold-dark" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
