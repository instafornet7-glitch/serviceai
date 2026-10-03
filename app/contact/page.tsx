import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = { title: "تواصل معنا", description: "تواصل مع فريق ServiceAI للاستفسارات والملاحظات والاقتراحات.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <><SiteHeader /><main id="main">
    <section className="page-hero contact-page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />نحن هنا لأجلك</span><h1>يسعدنا أن<br /><span className="text-gradient">نسمع منك.</span></h1><p>سؤال، فكرة، أو ملاحظة؟ يسعدنا تواصلك ومساعدتك في كل ما يتعلق بـ ServiceAI.</p></div><div className="page-hero-art contact-hero-art" aria-hidden="true"><div className="contact-orbit" /><div className="contact-envelope"><span>✉</span><i>✦</i></div><span className="contact-art-dot" /></div></div></section>
    <section className="section contact-section"><div className="container contact-layout"><div className="contact-info"><span className="eyebrow">تواصل معنا</span><h2>دعنا نبدأ <span className="text-gradient">حوارًا.</span></h2><p>نحن نجهز الموقع وقنوات التواصل الرسمية. سنعلن عن وسيلة التواصل هنا عند توفرها.</p><div className="contact-info-card"><span className="contact-info-icon">✉</span><div><strong>البريد الإلكتروني</strong><span>سيتم الإعلان عن قناة التواصل قريبًا</span></div></div><div className="contact-info-card"><span className="contact-info-icon contact-info-green">◷</span><div><strong>الاستفسارات</strong><span>شكرًا لاهتمامك وصبرك خلال تجهيز الخدمة.</span></div></div></div><div className="contact-form contact-coming-soon"><span className="contact-info-icon">✦</span><h2>قريبًا، نكون على تواصل.</h2><p>ستتوفر هنا قناة التواصل المباشر بعد إعدادها. لا تُرسل معلوماتك الشخصية إلى أن يظهر نموذج آمن ومفعّل.</p></div></div></section>
  </main><SiteFooter /></>;
}
