"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Stats = {
  productCount: number;
  subscriberCount: number;
  reviewCount: number;
  totalClicks: number;
  topProducts: { id: string; name: string; slug: string; click_count: number; image_url: string }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  const cards = stats
    ? [
        { label: "Products", value: stats.productCount },
        { label: "Affiliate clicks", value: stats.totalClicks },
        { label: "Reviews", value: stats.reviewCount },
        { label: "Newsletter subscribers", value: stats.subscriberCount },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card-lux p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-onyx/40 dark:text-pearl/40">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </div>
        ))}
        {!stats &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-lux h-24 animate-pulse p-6" />
          ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl">Top clicked products</h2>
        <div className="card-lux divide-y divide-onyx/5 dark:divide-pearl/10">
          {stats?.topProducts.map((product, i) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center gap-4 p-4 hover:bg-champagne/30 dark:hover:bg-onyx"
            >
              <span className="w-6 text-sm text-onyx/40">{i + 1}</span>
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-champagne/40">
                <Image src={product.image_url} alt={product.name} fill sizes="48px" className="object-cover" />
              </div>
              <span className="flex-1 text-sm font-medium">{product.name}</span>
              <span className="font-mono text-sm text-gold-dark">{product.click_count} clicks</span>
            </Link>
          ))}
          {stats && stats.topProducts.length === 0 && (
            <p className="p-6 text-sm text-onyx/50">No click data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
