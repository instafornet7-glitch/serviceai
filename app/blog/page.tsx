import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SiteFooter, SiteHeader } from "@/components/site";
import { LocalBlogIndex } from "@/components/local-blog";

export const metadata: Metadata = {
  title: "المدونة المهنية",
  description: "مقالات ونصائح مهنية عملية حول السيرة الذاتية، مقابلات العمل، وتطوير مسيرتك المهنية.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <>
    <SiteHeader active="/blog" />
    <main id="main">
      <PageHero eyebrow="مدونة ServiceAI" title="أفكار تساعدك" highlight="على التقدّم." description="نصائح واضحة، وأدلة عملية، وأفكار مهنية تساعدك في كل خطوة من رحلتك." />
      <section className="section blog-page-section"><div className="container"><LocalBlogIndex /></div></section>
      <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow eyebrow-light">خطوة أذكى تبدأ بفكرة</span><h2>حوّل المعرفة إلى خطوة عملية.</h2><p>استكشف الأدوات المجانية المتاحة لمساعدتك في رحلتك المهنية.</p></div><Link className="button button-white" href="/tools">استكشف الأدوات <span aria-hidden="true">←</span></Link><span className="cta-decoration" aria-hidden="true">✦</span></div></section>
    </main><SiteFooter />
  </>;
}
