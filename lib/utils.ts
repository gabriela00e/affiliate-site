import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number | null, currency = "USD") {
  if (price === null || price === undefined) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function siteUrl(path = "") {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const withProtocol = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  const base = withProtocol || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}
