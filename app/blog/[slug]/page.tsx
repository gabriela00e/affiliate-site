import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/queries";
import { ShareButtons } from "@/components/ShareButtons";
import { siteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="container-lux max-w-3xl py-10">
      <h1 className="font-display text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-onyx/40">{new Date(post.created_at).toLocaleDateString()}</p>

      {post.cover_image && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl">
          <Image src={post.cover_image} alt={post.title} fill loading="lazy" className="object-cover" />
        </div>
      )}

      <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-onyx/80 dark:text-pearl/80">
        {post.content}
      </div>

      <div className="mt-10 border-t border-onyx/10 pt-6 dark:border-pearl/10">
        <ShareButtons url={siteUrl(`/blog/${post.slug}`)} title={post.title} image={post.cover_image ?? undefined} />
      </div>
    </article>
  );
}
