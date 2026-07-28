import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/queries";

export const metadata = { title: "Blog", description: "Beauty guides, roundups, and honest reviews." };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container-lux py-10">
      <h1 className="font-display text-3xl">The Journal</h1>
      <p className="mt-2 text-onyx/60 dark:text-pearl/60">Guides, roundups, and honest first impressions.</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card-lux overflow-hidden">
            {post.cover_image && (
              <div className="relative aspect-video">
                <Image src={post.cover_image} alt={post.title} fill loading="lazy" sizes="33vw" className="object-cover" />
              </div>
            )}
            <div className="p-5">
              <h2 className="font-display text-lg">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-sm text-onyx/60 dark:text-pearl/60">{post.excerpt}</p>}
              <p className="mt-3 text-xs text-onyx/40">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-onyx/15 py-20 text-center text-onyx/50">
            No posts published yet.
          </p>
        )}
      </div>
    </div>
  );
}
