import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog – Sportzfy | IPTV Guides, Football & Streaming Tips",
  description:
    "Read guides and articles about free IPTV streaming, how to watch football online, the best live sports channels, and more.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Guide: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Football: "text-green-400 bg-green-500/10 border-green-500/20",
  Channels: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Education: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="📝"
        title="Blog"
        description="Guides, tips, and articles about free IPTV, live sports streaming, and watching football online."
        badge={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            {BLOG_POSTS.length} articles
          </span>
        }
      />

      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-10 block overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-2.5 py-0.5 font-semibold text-xs ${CATEGORY_COLORS[featured.category] ?? "border-white/10 bg-white/5 text-muted-foreground"}`}
              >
                {featured.category}
              </span>
              <span className="text-2xl">{featured.emoji}</span>
              <span className="ml-auto flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="h-3.5 w-3.5" />
                {featured.readTime}
              </span>
            </div>
            <h2 className="font-bold text-foreground text-xl transition-colors group-hover:text-primary sm:text-2xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {featured.excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                {formatDate(featured.date)}
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 font-semibold text-primary text-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                Read article <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Article grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.05] hover:shadow-primary/5 hover:shadow-xl"
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-semibold text-[10px] ${CATEGORY_COLORS[post.category] ?? "border-white/10 bg-white/5 text-muted-foreground"}`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xl">{post.emoji}</span>
                </div>
                <h3 className="flex-1 font-bold text-foreground text-sm leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between border-white/[0.06] border-t pt-3">
                  <span className="text-muted-foreground text-xs">
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
