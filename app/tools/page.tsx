import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site";
import { sanitizeArticleHtml } from "@/lib/content";
import { getPage } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/tools");
  return {
    title: page?.title ?? "الأدوات المهنية",
    description: "استخدم أدوات ServiceAI المجانية لإنشاء وتحليل سيرتك الذاتية، واستخراج كلمات ATS، وكتابة رسائل التقديم والتدرب على المقابلات.",
    alternates: { canonical: "/tools" },
  };
}

const tools = [
  {
    id: "resume-builder",
    href: "/tools/resume-builder",
    icon: "▤",
    iconClass: "tool-icon-blue",
    title: "منشئ السيرة الذاتية",
    description: "أنشئ سيرة ذاتية احترافية، راجعها مباشرة، وحمّلها بصيغة PDF مجانًا.",
    action: "ابدأ إنشاء سيرتك الذاتية",
  },
  {
    id: "resume-analyzer",
    href: "/tools/resume-analyzer",
    icon: "✓",
    iconClass: "tool-icon-green",
    title: "محلل السيرة الذاتية وATS",
    description: "افحص وضوح سيرتك الذاتية وقارن الكلمات المفتاحية مع وصف الوظيفة مجانًا.",
    action: "حلل سيرتك الذاتية",
  },
  {
    id: "interview-prep",
    href: "/tools/interview-questions",
    icon: "▱",
    iconClass: "tool-icon-green",
    title: "الاستعداد للمقابلات",
    description: "أنشئ أسئلة وإجابات تدريبية مرتبطة بمسمّاك وخبرتك ووصف الوظيفة.",
    action: "أنشئ أسئلة المقابلة",
  },
  {
    id: "career-guidance",
    href: "/tools/career-guidance",
    icon: "↗",
    iconClass: "tool-icon-peach",
    title: "موجّهك المهني",
    description: "استكشف خياراتك المهنية، وحدد أهدافًا واضحة تدعم نموك على المدى الطويل.",
    action: "أنشئ خطة مهنية",
  },
  {
    id: "cover-letter",
    href: "/tools/cover-letter-generator",
    icon: "✉",
    iconClass: "tool-icon-lilac",
    title: "خطاب التقديم",
    description: "جهّز خطاب تقديم يوضح اهتمامك بالدور ويبرز ما يجعلك مرشحًا مناسبًا.",
    action: "أنشئ رسالة التقديم",
  },
  {
    id: "ats-keywords",
    href: "/tools/ats-keywords",
    icon: "⌕",
    iconClass: "tool-icon-teal",
    title: "ATS Keyword Generator",
    description: "استخرج الكلمات والمهارات المهمة من إعلان الوظيفة وقارنها اختياريًا بسيرتك الذاتية.",
    action: "استخرج كلمات ATS",
  },
  {
    id: "job-search",
    href: "/tools/job-search",
    icon: "⌕",
    iconClass: "tool-icon-teal",
    title: "منظّم البحث عن عمل",
    description: "رتّب طلبات التوظيف ومواعيد المتابعة وتفاصيل الفرص في مكان واحد.",
    action: "نظّم طلباتك",
  },
  {
    id: "linkedin-profile",
    href: "/tools/linkedin-profile",
    icon: "◎",
    iconClass: "tool-icon-gold",
    title: "مراجع الملف المهني",
    description: "اكتشف كيف تجعل ملفك المهني أكثر اكتمالًا ووضوحًا لأصحاب العمل.",
    action: "راجع ملفك المهني",
  },
];

export default async function ToolsPage() {
  const page = await getPage("/tools");
  const availableCount = tools.filter((tool) => tool.href).length;

  return <>
    <SiteHeader active="/tools" />
    <main id="main">
      <section className="page-hero">
        <div className="container page-hero-inner">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />مهنتك، بأدوات أذكى</span>
            <h1>{page?.title ?? "الأدوات المهنية"}<br /><span className="text-gradient">لخطوتك القادمة.</span></h1>
            <p>أنشئ سيرتك الذاتية، حلل الكلمات المفتاحية، واكتب رسالة تقديم واستعد للمقابلة بأدوات مجانية دون حساب.</p>
          </div>
          <div className="page-hero-art tool-hero-art" aria-hidden="true">
            <span className="hero-art-shape shape-tool-one">✦</span><span className="hero-art-shape shape-tool-two">✓</span>
            <div className="tool-hero-sheet"><span /><span /><span /><span /><b>مهنتك<br />تستحق الأفضل</b></div>
          </div>
        </div>
      </section>
      <section className="section tools-page-section">
        <div className="container">
          <div className="legal-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page?.content ?? "") }} />
          <div className="notice-banner"><span className="notice-icon" aria-hidden="true">✦</span><p><strong>{availableCount} أدوات مهنية متاحة الآن.</strong> يمكنك استخدامها مجانًا ودون إنشاء حساب.</p></div>
          <div className="tools-grid tools-grid-page">
            {tools.map((tool) => {
              const content = <>
                <div className={`tool-icon ${tool.iconClass}`}><span aria-hidden="true">{tool.icon}</span></div>
                <span className="tool-status tool-status-live">مجاني · متاح الآن</span>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                <span className="card-link">{tool.href ? tool.action : "نعمل عليها"} <b aria-hidden="true">{tool.href ? "←" : "✦"}</b></span>
              </>;

              return <Link className={`tool-card tool-card-static tool-card-available${tool.id === "ats-keywords" ? " ats-keyword-tool-card" : ""}`} href={tool.href} id={tool.id} key={tool.id}>{content}</Link>;
            })}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <div className="container final-cta-inner">
          <div><span className="eyebrow eyebrow-light">كل خطوة تصنع فرقًا</span><h2>واصل رحلتك المهنية مع مقالاتنا.</h2><p>تصفّح نصائح عملية تدعم استعدادك لخطوتك القادمة.</p></div>
          <Link className="button button-white" href="/blog">اقرأ المقالات <span aria-hidden="true">←</span></Link>
          <span className="cta-decoration" aria-hidden="true">✦</span>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
