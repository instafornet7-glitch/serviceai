import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site";
import { sanitizeArticleHtml } from "@/lib/content";
import { getPage } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/about");
  return { title: page?.title ?? "من نحن", description: "تعرّف على ServiceAI ورسالتنا في تمكين الباحثين عن عمل بأدوات ومصادر مهنية واضحة.", alternates: { canonical: "/about" } };
}

export default async function AboutPage() {
  const page = await getPage("/about");
  return <><SiteHeader active="/about" /><main id="main">
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />عن ServiceAI</span><h1>{page?.title ?? "من نحن"}</h1><div className="legal-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page?.content ?? "") }} /></div><div className="page-hero-art about-hero-art" aria-hidden="true"><div className="about-art-sun">✦</div><div className="about-art-card"><span>طموحك</span><b>يستحق أن<br />يراه العالم.</b><i>ServiceAI</i></div><span className="about-art-star">✳</span></div></div></section>
    <section className="section about-mission"><div className="container about-mission-grid"><div><span className="eyebrow">رسالتنا</span><h2>نجعل الطريق إلى الفرصة المناسبة <span className="text-gradient">أوضح وأسهل.</span></h2></div><div className="mission-copy"><p>البحث عن عمل رحلة مليئة بالأسئلة والقرارات. نؤمن بأن الوصول إلى الخطوة التالية يصبح أسهل عندما تتوفر لك الأدوات المناسبة والمعلومة الواضحة في الوقت المناسب.</p><p>لهذا نعمل على بناء ServiceAI — منصة تجمع مصادر عملية وأدوات مهنية في تجربة بسيطة تضع احتياجات الباحث عن عمل في المقدمة.</p><Link className="text-link" href="/tools">اكتشف ما نعمل عليه <span aria-hidden="true">←</span></Link></div></div></section>
    <section className="section about-values"><div className="container"><div className="section-heading centered"><span className="eyebrow">ما نؤمن به</span><h2>قيم توجه <span className="text-gradient">كل خطوة.</span></h2></div><div className="benefit-grid"><article className="benefit-card"><div className="icon-box icon-blue"><span>◎</span></div><h3>الإنسان أولًا</h3><p>نصمم كل تجربة حول احتياجاتك وأهدافك ونحترم اختلاف مساراتك المهنية.</p></article><article className="benefit-card"><div className="icon-box icon-green"><span>✦</span></div><h3>الوضوح والعملية</h3><p>نؤمن بالمعلومات المفهومة والخطوات القابلة للتطبيق التي تمنحك صورة أوضح.</p></article><article className="benefit-card"><div className="icon-box icon-lilac"><span>↗</span></div><h3>نمو مستمر</h3><p>نطوّر خدماتنا ومصادرنا باستمرار لتواكب احتياجات الباحثين عن عمل.</p></article></div></div></section>
    <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow eyebrow-light">نحن في بداية الرحلة</span><h2>يسعدنا أن تكون جزءًا منها.</h2><p>استكشف الموقع وشاركنا أفكارك حول ما تحتاجه في مسيرتك.</p></div><Link className="button button-white" href="/contact">تواصل معنا <span aria-hidden="true">←</span></Link><span className="cta-decoration" aria-hidden="true">✦</span></div></section>
  </main><SiteFooter /></>;
}
