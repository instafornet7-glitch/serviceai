import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site";
import { sanitizeArticleHtml } from "@/lib/content";
import { getPage } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/contact");
  return {
    title: page?.title ?? "تواصل معنا",
    description: "تواصل مع فريق ServiceAI للاستفسارات والملاحظات والاقتراحات.",
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const page = await getPage("/contact");
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-hero contact-page-hero">
          <div className="container page-hero-inner">
            <div>
              <span className="eyebrow"><span className="eyebrow-dot" />نحن هنا لأجلك</span>
              <h1>{page?.title ?? "تواصل معنا"}</h1>
              <p>يسعدنا تواصلك ومساعدتك في كل ما يتعلق بـ ServiceAI.</p>
            </div>
            <div className="page-hero-art contact-hero-art" aria-hidden="true">
              <div className="contact-orbit" />
              <div className="contact-envelope"><span>✉</span><i>✦</i></div>
              <span className="contact-art-dot" />
            </div>
          </div>
        </section>
        <section className="section contact-section">
          <div className="container contact-layout">
            <div className="contact-info">
              <span className="eyebrow">تواصل معنا</span>
              <h2>دعنا نبدأ <span className="text-gradient">حوارًا.</span></h2>
              <div className="legal-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page?.content ?? "") }} />
            </div>
            <div className="contact-form contact-message">
              <span className="contact-info-icon">✦</span>
              <h2>نرحب برسالتك.</h2>
              <p>يسعدنا استقبال استفساراتك واقتراحاتك عبر البريد الإلكتروني.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
