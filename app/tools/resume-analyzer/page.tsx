import type { Metadata } from "next";
import { ResumeAnalyzer } from "@/components/resume-analyzer";
import { AdSlot } from "@/components/ad-slot";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "محلل السيرة الذاتية وATS مجانًا",
  description: "حلل سيرتك الذاتية مجانًا واعرف مدى وضوحها وتوافقها الأولي مع ATS. ارفع PDF أو DOCX، وقارن الكلمات المفتاحية مع وصف الوظيفة دون إنشاء حساب.",
  keywords: ["تحليل السيرة الذاتية", "ATS Resume Checker", "فحص CV", "تحليل ATS", "كلمات مفتاحية للسيرة الذاتية"],
  alternates: { canonical: "/tools/resume-analyzer" },
  openGraph: {
    type: "website",
    title: "حلل سيرتك الذاتية مجانًا واعرف مدى توافقها مع ATS | ServiceAI",
    description: "ارفع سيرتك الذاتية PDF أو DOCX واحصل على مؤشرات عملية لتحسينها ومقارنة كلماتها مع متطلبات الوظيفة.",
  },
};

const faqs = [
  ["هل أداة تحليل السيرة الذاتية مجانية؟", "نعم، يمكنك رفع ملف PDF أو DOCX وتحليل النص ومقارنة الكلمات المفتاحية مجانًا ودون إنشاء حساب."],
  ["هل يتم رفع سيرتي الذاتية أو حفظها؟", "لا. يجري استخراج النص والتحليل محليًا في متصفحك، ولا يُرسل الملف إلى خادم أو يُحفظ في قاعدة بيانات. عند إغلاق الصفحة أو تحديثها تُزال بياناتها من الذاكرة."],
  ["ما أنواع الملفات المدعومة؟", "تدعم الأداة ملفات PDF وDOCX النصية حتى 12 ميغابايت. ملفات PDF الممسوحة ضوئيًا كصور قد لا تحتوي على نص قابل للاستخراج."],
  ["هل تضمن النتيجة اجتياز أنظمة ATS؟", "لا. النتيجة مؤشر إرشادي مبني على قواعد بسيطة للنص المستخرج، وتختلف أنظمة التوظيف وإعداداتها. استخدمها للمراجعة ولا تعتبرها ضمانًا للقبول."],
  ["كيف تتم مقارنة الكلمات المفتاحية؟", "عند لصق وصف الوظيفة، تقارن الأداة المصطلحات النصية الظاهرة فيه مع الكلمات المستخرجة من السيرة. أضف الكلمات المناسبة فقط إذا كانت تعبّر عن خبرتك الحقيقية."],
  ["لماذا لا تظهر نتيجة لملف PDF؟", "قد يكون الملف صورة ممسوحة ضوئيًا أو محميًا أو غير صالح. جرّب تصدير نسخة PDF قابلة لتحديد النص أو رفع DOCX."],
];

export default function ResumeAnalyzerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "محلل السيرة الذاتية وATS من ServiceAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "أداة مجانية لفحص النص المستخرج من السيرة الذاتية ومقارنته بالكلمات المفتاحية لوصف الوظيفة محليًا في المتصفح.",
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return <>
    <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
    <SiteHeader active="/tools" />
    <main id="main" className="analyzer-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c") }} />
      <section className="page-hero analyzer-page-hero">
        <div className="container page-hero-inner">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />أداة مجانية — دون تسجيل</span>
            <h1>حلل سيرتك الذاتية مجانًا<br /><span className="text-gradient">واعرف مدى توافقها مع ATS.</span></h1>
            <p>ارفع سيرتك الذاتية واحصل على تقرير يساعدك على اكتشاف نقاط القوة وفرص التحسين ومقارنة الكلمات المفتاحية مع الوظيفة المستهدفة.</p>
            <span className="analyzer-privacy-badge"><span aria-hidden="true">✓</span> تحليل محلي وخصوصية أفضل</span>
          </div>
          <div className="page-hero-art tool-hero-art" aria-hidden="true"><span className="hero-art-shape shape-tool-one">✓</span><span className="hero-art-shape shape-tool-two">✦</span><div className="tool-hero-sheet analyzer-hero-sheet"><span /><span /><span /><span /><b>ATS<br />Resume Check</b></div></div>
        </div>
      </section>

      <AdSlot id="resume-analyzer-intro" className="container analyzer-page-ad analyzer-intro-ad" description="موضع غير مزعج أسفل مقدمة الأداة." />
      <section className="section analyzer-tool-section"><div className="container">
        <div className="analyzer-tool-intro"><div><span className="eyebrow">ارفع، حلل، وحسّن</span><h2>ابدأ بخطوة <span className="text-gradient">واضحة.</span></h2><p>تعمل الأداة بقواعد فحص محلية للنص القابل للاستخراج، ولا تستبدل المراجعة البشرية أو تضمن قرار أنظمة التوظيف.</p></div><span className="analyzer-supported-files">PDF <span>·</span> DOCX</span></div>
        <ResumeAnalyzer />
      </div></section>

      <AdSlot id="resume-analyzer-results" className="container analyzer-page-ad analyzer-results-ad" description="موضع اختياري بعد الأداة وقبل الدليل." />
      <section className="analyzer-seo-section"><div className="container">
        <div className="section-heading centered"><span className="eyebrow">دليل أنظمة التوظيف</span><h2>افهم ATS، <span className="text-gradient">وقدّم سيرتك بوضوح.</span></h2><p>تعرّف على طريقة قراءة أنظمة تتبع المتقدمين للسير الذاتية، وما يمكنك فعله لتحسين وضوح مستندك وملاءمته للوظيفة.</p></div>
        <div className="analyzer-guide-grid">
          <article className="analyzer-guide-card"><span>01</span><h2>ما هو ATS؟</h2><p>نظام تتبع المتقدمين (Applicant Tracking System) برنامج تستخدمه بعض جهات التوظيف لتنظيم طلبات المرشحين والبحث في بياناتها. تختلف خصائص الأنظمة وإعداداتها من جهة إلى أخرى، ولا يعمل كل نظام بالطريقة نفسها.</p></article>
          <article className="analyzer-guide-card"><span>02</span><h2>كيف تعمل أنظمة ATS؟</h2><p>تستخرج الأنظمة عادةً معلومات مثل الاسم والمهارات والخبرات والتعليم من المستند، ثم تتيح لمسؤولي التوظيف تنظيم الطلبات والبحث فيها. التنسيق الواضح والعناوين الشائعة يساعدان على جعل المحتوى أسهل في القراءة الآلية والبشرية.</p></article>
          <article className="analyzer-guide-card"><span>03</span><h2>لماذا قد لا تظهر بعض السير في البحث؟</h2><p>قد يصعب استخراج نص من ملف ممسوح كصورة، أو من تخطيط معقد، أو من خطوط ورموز غير مألوفة. كما قد لا تتطابق مصطلحات السيرة مع متطلبات الوظيفة. القرار لا يعتمد دائمًا على ATS وحده؛ فقد تراجع جهات التوظيف طلبات المرشحين بطرق مختلفة.</p></article>
          <article className="analyzer-guide-card"><span>04</span><h2>كيفية تحسين CV لأنظمة ATS</h2><ul><li>استخدم عناوين مألوفة مثل الخبرات والتعليم والمهارات.</li><li>اختر تصميمًا بسيطًا ونصًا يمكن تحديده ونسخه.</li><li>استخدم نقاطًا قصيرة بدل الفقرات الطويلة.</li><li>راجع أن تواريخك ومعلومات التواصل ظاهرة بوضوح.</li><li>خصص سيرتك للوظيفة مع الحفاظ على الدقة والصدق.</li></ul></article>
          <article className="analyzer-guide-card"><span>05</span><h2>أهم الكلمات المفتاحية في السيرة</h2><p>تتغير الكلمات المناسبة حسب الوظيفة. قد تشمل المسمى الوظيفي، والمهارات التقنية، والبرامج، والشهادات، والمنهجيات المذكورة في الإعلان. اذكر المصطلحات التي تنطبق على خبرتك ضمن سياقها؛ لا تضف كلمات لمجرد رفع نتيجة المطابقة.</p><div className="analyzer-example-keywords"><span>المسمى الوظيفي</span><span>مهارات وأدوات</span><span>شهادات مهنية</span><span>منهجيات</span></div></article>
          <article className="analyzer-guide-card"><span>06</span><h2>أخطاء ينبغي تجنبها</h2><ul><li>استخدام صور أو جداول معقدة لعرض معلومات أساسية.</li><li>إضافة كلمات مفتاحية لا تعبّر عن خبرتك.</li><li>ترك تواريخ أو معلومات اتصال ناقصة.</li><li>استخدام أوصاف عامة بلا أمثلة أو نتائج دقيقة.</li><li>الاعتماد على درجة آلية كضمان للقبول.</li></ul></article>
        </div>
        <AdSlot id="resume-analyzer-inline" className="analyzer-inline-ad" description="موضع اختياري داخل الدليل التعليمي." />
        <section className="analyzer-faq-section"><div className="section-heading"><span className="eyebrow">أسئلة شائعة</span><h2>إجابات تساعدك على <span className="text-gradient">استخدام الفحص.</span></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span className="faq-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      </div></section>
      <AdSlot id="resume-analyzer-bottom" className="container analyzer-page-ad analyzer-bottom-ad" description="موضع اختياري أسفل الصفحة." />
    </main>
    <SiteFooter />
  </>;
}
