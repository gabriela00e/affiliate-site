"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, authorName, rating, comment }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-xl bg-champagne/50 p-4 text-sm text-gold-dark">
        Thanks for sharing your review! It'll appear shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-onyx/10 p-5 dark:border-pearl/10">
      <h4 className="font-display text-lg">Write a review</h4>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} onClick={() => setRating(i)} aria-label={`Rate ${i} stars`}>
            <Star className={cn("h-6 w-6", i <= rating ? "fill-gold text-gold" : "text-onyx/20 dark:text-pearl/20")} />
          </button>
        ))}
      </div>
      <input
        required
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product…"
        rows={3}
        className="w-full rounded-lg border border-onyx/10 bg-white px-3 py-2 text-sm outline-none focus:border-gold dark:border-pearl/10 dark:bg-onyx2"
      />
      <button type="submit" disabled={status === "loading"} className="btn-gold">
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>
      {status === "error" && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
    </form>
  );
}
