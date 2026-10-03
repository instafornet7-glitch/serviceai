import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, PageHero, SiteFooter, SiteHeader } from "@/components/site";
import { CmsSchemaNotReadyError, getPublishedArticles, type ArticleCardData } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "المدونة المهنية",
  description: "مقالات ونصائح مهنية عملية حول السيرة الذاتية، مقابلات العمل، وتطوير مسيرتك المهنية.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const cmsConfigured = isSupabaseConfigured();
  let articles: ArticleCardData[] = [];
  let cmsSchemaNotReady = false;
  if (cmsConfigured) {
    try {
      articles = await getPublishedArticles();
    } catch (error) {
      if (!(error instanceof CmsSchemaNotReadyError)) throw error;
      console.error(error.message, error.cause);
      cmsSchemaNotReady = true;
    }
  }
  return <>
    <SiteHeader active="/blog" />
    <main id="main">
      <PageHero eyebrow="مدونة ServiceAI" title="أفكار تساعدك" highlight="على التقدّم." description="نصائح واضحة، وأدلة عملية، وأفكار مهنية تساعدك في كل خطوة من رحلتك." />
      <section className="section blog-page-section"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">دليلك المهني</span><h2>مقالاتنا <span className="text-gradient">الأخيرة.</span></h2></div><span className="results-label">{articles.length} مقال منشور</span></div>
        {!cmsConfigured && <p className="cms-setup-notice">أكمل إعداد متغيرات Supabase في <code>.env.local</code> لعرض المقالات المنشورة.</p>}
        {cmsSchemaNotReady && <p className="cms-setup-notice">شغّل ترحيل قاعدة بيانات المدونة لعرض المقالات المنشورة.</p>}
        {articles.length ? <div className="blog-grid blog-grid-page">{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <div className="blog-empty"><span aria-hidden="true">✦</span><h2>{cmsSchemaNotReady ? "قاعدة بيانات المدونة غير جاهزة بعد." : cmsConfigured ? "نجهّز مقالات جديدة لك." : "قاعدة بيانات المدونة غير مهيأة بعد."}</h2><p>{cmsSchemaNotReady ? "شغّل ملف الترحيل الموجود في مجلد Supabase لإكمال إعداد نظام المقالات." : cmsConfigured ? "ستظهر هنا المقالات المنشورة قريبًا." : "ستظهر المقالات بعد إضافة إعدادات Supabase وتشغيل الترحيل."}</p></div>}
      </div></section>
      <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow eyebrow-light">خطوة أذكى تبدأ بفكرة</span><h2>حوّل المعرفة إلى خطوة عملية.</h2><p>استكشف الأدوات المجانية المتاحة لمساعدتك في رحلتك المهنية.</p></div><Link className="button button-white" href="/tools">استكشف الأدوات <span aria-hidden="true">←</span></Link><span className="cta-decoration" aria-hidden="true">✦</span></div></section>
    </main><SiteFooter />
  </>;
}
