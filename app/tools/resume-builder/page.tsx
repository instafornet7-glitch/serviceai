import type { Metadata } from "next";
import { ResumeBuilder } from "@/components/resume-builder";
import { AdSlot } from "@/components/ad-slot";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "منشئ السيرة الذاتية مجانًا | Resume Builder",
  description: "أنشئ سيرة ذاتية احترافية متوافقة مع أنظمة ATS مجانًا. أضف بياناتك وخبراتك وشاهد معاينة مباشرة، ثم احفظ سيرتك الذاتية بصيغة PDF دون تسجيل أو تخزين بياناتك.",
  keywords: ["منشئ السيرة الذاتية", "إنشاء CV", "سيرة ذاتية PDF", "ATS", "CV builder مجاني"],
  alternates: { canonical: "/tools/resume-builder" },
  openGraph: {
    type: "website",
    title: "منشئ السيرة الذاتية مجانًا | ServiceAI",
    description: "أنشئ سيرة ذاتية احترافية بقالب بسيط مناسب لأنظمة ATS، دون حساب أو حفظ بيانات.",
  },
};

export default function ResumeBuilderPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "منشئ السيرة الذاتية من ServiceAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "أداة مجانية لإنشاء سيرة ذاتية احترافية ومعاينتها وحفظها PDF دون إنشاء حساب.",
  };

  return <>
    <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
    <SiteHeader active="/tools" />
    <main id="main" className="resume-builder-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="page-hero resume-page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />أداة مجانية — دون تسجيل</span><h1>أنشئ سيرتك الذاتية<br /><span className="text-gradient">بسهولة وثقة.</span></h1><p>أدخل خبراتك ومهاراتك، راجع المعاينة مباشرة، ثم احفظ سيرة ذاتية احترافية مناسبة للطباعة والتقديم للوظائف.</p><span className="resume-privacy-badge"><span aria-hidden="true">✓</span> بياناتك تبقى في متصفحك</span></div><div className="page-hero-art tool-hero-art" aria-hidden="true"><span className="hero-art-shape shape-tool-one">✦</span><span className="hero-art-shape shape-tool-two">✓</span><div className="tool-hero-sheet"><span /><span /><span /><span /><b>سيرتك الذاتية<br />بأسلوبك</b></div></div></div></section>
      <section className="section resume-tool-section"><div className="container"><div className="resume-editor-intro"><div><span className="eyebrow">خطوة بخطوة</span><h2>سيرتك الذاتية، <span className="text-gradient">كما تستحق.</span></h2><p>أكمل الحقول التي تنطبق عليك. يمكنك إضافة خبرات ومؤهلات متعددة وتحديث معاينتك في أي وقت.</p></div><span className="resume-free-mark"><span>✓</span> مجاني ودون حساب</span></div><ResumeBuilder /></div></section>
      <AdSlot id="resume-builder-guide" className="container resume-page-ad" description="موضع هادئ بين الأداة والمحتوى الإرشادي." />
      <section className="resume-seo-section"><div className="container">
        <div className="section-heading centered"><span className="eyebrow">دليلك المهني</span><h2>اكتب CV احترافيًا، <span className="text-gradient">يعكس خبرتك.</span></h2><p>السيرة الذاتية المنظمة تمنحك فرصة لعرض مهاراتك وخبراتك بوضوح. إليك إرشادات تساعدك على إعداد سيرة ذاتية مهنية متوافقة مع متطلبات التوظيف.</p></div>
        <div className="resume-content-grid">
          <article className="resume-guide-section"><span className="resume-guide-number">01</span><h2>ما هي السيرة الذاتية؟</h2><p>السيرة الذاتية (CV) وثيقة مهنية موجزة تعرض معلومات التواصل، والنبذة المهنية، والخبرات، والتعليم، والمهارات. تساعد أصحاب العمل على فهم خلفيتك ومدى ملاءمتك للدور. السيرة الفعّالة تختار المعلومات الأكثر صلة بالوظيفة وتعرضها بوضوح بدلًا من سرد كل تفاصيل المسار المهني.</p></article>
          <article className="resume-guide-section"><span className="resume-guide-number">02</span><h2>كيفية إنشاء CV احترافي</h2><ol><li>اكتب بيانات تواصل محدثة ومسمى وظيفيًا واضحًا.</li><li>لخّص خبرتك وتخصصك في نبذة قصيرة ومباشرة.</li><li>رتّب الخبرات والمؤهلات من الأحدث إلى الأقدم.</li><li>صف إنجازاتك بأمثلة ونتائج واقعية عند توفرها.</li><li>اختر المهارات ذات الصلة بالدور وراجع دقة المعلومات.</li><li>احفظ نسخة PDF وتحقق من وضوح النص قبل إرسالها.</li></ol></article>
          <article className="resume-guide-section"><span className="resume-guide-number">03</span><h2>أهم أقسام السيرة الذاتية</h2><div className="resume-guide-topics"><div><h3>المعلومات الشخصية</h3><p>الاسم ومعلومات تواصل مهنية وروابط مفيدة.</p></div><div><h3>النبذة المهنية</h3><p>ملخص موجز لتخصصك وأبرز نقاط قوتك.</p></div><div><h3>الخبرات المهنية</h3><p>المناصب والشركات والمسؤوليات والإنجازات.</p></div><div><h3>التعليم والمهارات</h3><p>المؤهلات والمهارات واللغات المرتبطة بالدور.</p></div></div></article>
          <article className="resume-guide-section"><span className="resume-guide-number">04</span><h2>نصائح لإنشاء CV متوافق مع ATS</h2><ul><li>استخدم تنسيقًا بسيطًا بعناوين أقسام واضحة وتسلسل قراءة منطقي.</li><li>تجنب الجداول المعقدة والأعمدة المتعددة والصور التي تحتوي معلومات مهمة.</li><li>اكتب المسميات والتواريخ ومعلومات التواصل كنص قابل للتحديد.</li><li>استخدم كلمات من وصف الوظيفة عندما تعكس خبرتك الحقيقية.</li><li>راجع أن نص PDF قابل للبحث والنسخ وأن معلومات التواصل ظاهرة.</li></ul></article>
        </div>
        <section className="resume-seo-faq"><div className="section-heading"><span className="eyebrow">أسئلة شائعة</span><h2>إجابات مفيدة <span className="text-gradient">لبداية أسهل.</span></h2></div><div className="faq-list"><details className="faq-item"><summary>هل إنشاء السيرة الذاتية مجاني؟<span className="faq-plus" aria-hidden="true" /></summary><p>نعم، يمكن استخدام الأداة مجانًا دون اشتراك أو إنشاء حساب.</p></details><details className="faq-item"><summary>هل أحتاج إلى إنشاء حساب؟<span className="faq-plus" aria-hidden="true" /></summary><p>لا. الأداة متاحة لجميع الزوار، ولا تتطلب تسجيل الدخول.</p></details><details className="faq-item"><summary>هل تُحفظ بياناتي الشخصية؟<span className="faq-plus" aria-hidden="true" /></summary><p>لا. تعمل المعاينة على جهازك وتبقى البيانات في ذاكرة الصفحة فقط. لا تُرسل إلى قاعدة بيانات ولا تُحفظ بعد مغادرة الصفحة أو إعادة تحميلها.</p></details><details className="faq-item"><summary>كيف أنزّل السيرة الذاتية PDF؟<span className="faq-plus" aria-hidden="true" /></summary><p>اضغط زر التحميل واختر «حفظ بصيغة PDF» من نافذة الطباعة. اختر حجم A4، وأوقف رؤوس المتصفح وتذييلاته للحصول على نسخة نظيفة.</p></details><details className="faq-item"><summary>هل ستكتب الذكاء الاصطناعي النبذة أو يقترح المهارات؟<span className="faq-plus" aria-hidden="true" /></summary><p>أزرار ميزات الذكاء الاصطناعي معروضة كميزات مستقبلية قيد التطوير. لن تُرسل بياناتك إلى خدمة ذكاء اصطناعي في هذه النسخة.</p></details></div></section>
      </div>      </section>
      <AdSlot id="resume-builder-bottom" className="container resume-page-ad resume-page-ad-bottom" description="موضع اختياري أسفل الصفحة." />
    </main>
    <SiteFooter />
  </>;
}
