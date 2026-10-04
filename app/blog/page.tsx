import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SiteFooter, SiteHeader } from "@/components/site";
import { LocalBlogIndex } from "@/components/local-blog";
import { sanitizeArticleHtml } from "@/lib/content";
import { getPage } from "@/lib/pages";
import { getPublishedArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/blog");
  return {
    title: page?.title ?? "المدونة المهنية",
    description: "مقالات ونصائح مهنية عملية حول السيرة الذاتية، مقابلات العمل، وتطوير مسيرتك المهنية.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const page = await getPage("/blog");
  const initialArticles = getPublishedArticles();
  return <>
    <SiteHeader active="/blog" />
    <main id="main">
      <PageHero eyebrow="مدونة ServiceAI" title={page?.title ?? "المدونة المهنية"} highlight="على التقدّم." description="نصائح واضحة، وأدلة عملية، وأفكار مهنية تساعدك في كل خطوة من رحلتك." />
      <section className="container legal-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page?.content ?? "") }} />
      <section className="section blog-page-section"><div className="container"><LocalBlogIndex initialArticles={initialArticles} /></div></section>
      <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow eyebrow-light">خطوة أذكى تبدأ بفكرة</span><h2>حوّل المعرفة إلى خطوة عملية.</h2><p>استكشف الأدوات المجانية المتاحة لمساعدتك في رحلتك المهنية.</p></div><Link className="button button-white" href="/tools">استكشف الأدوات <span aria-hidden="true">←</span></Link><span className="cta-decoration" aria-hidden="true">✦</span></div></section>
    </main><SiteFooter />
  </>;
}
