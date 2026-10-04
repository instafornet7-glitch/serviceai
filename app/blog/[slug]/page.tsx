import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site";
import { LocalArticlePage } from "@/components/local-blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "مقال مهني | ServiceAI",
    description: "مقال ونصائح مهنية من مدونة ServiceAI.",
    alternates: { canonical: `/blog/${encodeURIComponent(slug)}` },
    robots: { index: false, follow: true },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <><SiteHeader active="/blog" /><main id="main"><article className="article-page"><LocalArticlePage slug={slug} /></article></main><SiteFooter /></>;
}
