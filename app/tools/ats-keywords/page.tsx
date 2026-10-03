import type { Metadata } from "next";
import { AtsKeywordGenerator } from "@/components/ats-keyword-generator";
import { AdSlot } from "@/components/ad-slot";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "مولد الكلمات المفتاحية ATS مجانًا | ATS Keyword Generator",
  description: "استخرج الكلمات المفتاحية والمهارات والأدوات والمتطلبات من وصف الوظيفة، وقارنها اختياريًا بسيرتك الذاتية محليًا ومجانًا.",
  keywords: ["ATS Keyword Generator", "كلمات مفتاحية للسيرة الذاتية", "استخراج كلمات الوظيفة", "Resume Match", "تحسين CV لأنظمة ATS"],
  alternates: { canonical: "/tools/ats-keywords" },
  openGraph: {
    type: "website",
    title: "استخرج كلمات ATS من إعلان الوظيفة | ServiceAI",
    description: "حلل وصف الوظيفة، اكتشف أهم الكلمات والمهارات، وقارن سيرتك الذاتية دون إرسال ملفاتك إلى خادم.",
  },
};

const faqs = [
  ["ما هي الكلمات المفتاحية في إعلان الوظيفة؟", "هي أسماء المهارات والأدوات والشهادات والمسؤوليات والمؤهلات التي يذكرها صاحب العمل في وصف الدور."],
  ["هل يجب رفع السيرة الذاتية لاستخدام الأداة؟", "لا. يمكنك تحليل إعلان الوظيفة وحده. رفع PDF أو DOCX اختياري للمقارنة النصية."],
  ["هل يتم إرسال سيرتي الذاتية أو إعلان الوظيفة إلى خادم؟", "لا. يجري استخراج النص والتحليل في متصفحك، ولا يُحفظ الملف أو وصف الوظيفة بشكل دائم."],
  ["هل الملخص منشأ بواسطة ذكاء اصطناعي؟", "لا يتصل الإصدار الحالي بمزوّد ذكاء اصطناعي. يُنشأ ملخص قصير محليًا اعتمادًا على المصطلحات والسياق النصي المستخرج."],
  ["كيف تحدد الأداة أهمية الكلمة؟", "تستخدم الأداة تكرار المصطلح ومؤشرات سياقية في الإعلان، مثل متطلبات أساسية أو تفضيلات. يظل التصنيف آليًا وتقريبيًا، لذا راجع الإعلان الأصلي."],
  ["هل يجب إضافة كل كلمة مفقودة إلى سيرتي؟", "لا. أضف المصطلح فقط إذا كان يعكس مهارة أو خبرة حقيقية لديك، وضعه في قسم مناسب مع سياق صادق."],
  ["ما الملفات التي يمكن رفعها؟", "تدعم المقارنة ملفات PDF وDOCX النصية حتى 12 ميغابايت. قد يتعذر استخراج النص من ملفات PDF الممسوحة كصور."],
  ["هل تضمن درجة Resume Match اجتياز ATS؟", "لا. هي مقارنة نصية إرشادية للكلمات المستخرجة فقط، ولا تمثل طريقة عمل نظام توظيف محدد أو تضمن القبول."],
];

export default function AtsKeywordsPage() {
  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "مولد الكلمات المفتاحية ATS من ServiceAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "أداة مجانية لاستخراج مصطلحات إعلانات الوظائف ومقارنة نص السيرة الذاتية محليًا في المتصفح.",
  };
  const faqData = {
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
    <main id="main" className="ats-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }} />

      <section className="page-hero ats-page-hero">
        <div className="container page-hero-inner">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />أداة مجانية — دون حساب</span>
            <h1>اكتشف الكلمات المفتاحية<br /><span className="text-gradient">المهمة في إعلان الوظيفة.</span></h1>
            <p>حلل المهارات والأدوات والمتطلبات في وصف الوظيفة، وقارنها اختياريًا بنص سيرتك الذاتية لتعرف ما يستحق إبرازه.</p>
            <span className="ats-privacy-badge"><span aria-hidden="true">✓</span> تحليل محلي وخصوصية أفضل</span>
          </div>
          <div className="page-hero-art tool-hero-art" aria-hidden="true"><span className="hero-art-shape shape-tool-one">⌕</span><span className="hero-art-shape shape-tool-two">✓</span><div className="tool-hero-sheet ats-hero-sheet"><span /><span /><span /><span /><b>ATS<br />Keywords</b></div></div>
        </div>
      </section>

      <AdSlot id="ats-keywords-intro" className="container ats-page-ad ats-intro-ad" description="موضع غير مزعج أسفل مقدمة الأداة." />
      <section className="section ats-tool-section"><div className="container">
        <div className="ats-tool-intro"><div><span className="eyebrow">حلل الإعلان وقارن سيرتك</span><h2>حوّل وصف الوظيفة إلى <span className="text-gradient">خطوات واضحة.</span></h2><p>الصق الإعلان للبدء. تحليل السيرة الذاتية اختياري، وتتم معالجة الملفات والنصوص محليًا دون حفظها.</p></div><span className="ats-supported-files">PDF <span>·</span> DOCX <small>اختياري</small></span></div>
        <AtsKeywordGenerator />
      </div></section>

      <AdSlot id="ats-keywords-results" className="container ats-page-ad ats-results-ad" description="موضع اختياري بعد نتائج التحليل وقبل الدليل." />

      <section className="ats-seo-section"><div className="container">
        <div className="section-heading centered"><span className="eyebrow">دليل الكلمات المفتاحية وATS</span><h2>اجعل خبرتك <span className="text-gradient">أوضح في سيرتك.</span></h2><p>استخدم الكلمات الواردة في الإعلان لفهم متطلباته وتقديم خبرتك ذات الصلة بوضوح وصدق، لا لحشو السيرة بمصطلحات لا تمثلك.</p></div>
        <div className="ats-guide-grid">
          <article className="ats-guide-card"><span>01</span><h2>ما هو ATS؟</h2><p>نظام تتبع المتقدمين (Applicant Tracking System) يساعد جهات التوظيف على تنظيم طلبات العمل والبحث في بياناتها. تختلف الأنظمة وإعداداتها؛ لذلك لا توجد درجة واحدة تضمن المرور في جميعها.</p></article>
          <article className="ats-guide-card"><span>02</span><h2>ما هي ATS Keywords؟</h2><p>هي المصطلحات المرتبطة بالدور، مثل المهارات التقنية والشخصية والأدوات والشهادات والتعليم والمسؤوليات. تظهر عادةً في الوصف الوظيفي، ويبحث مسؤولو التوظيف عن مدى ارتباط خبرات المرشح بها.</p></article>
          <article className="ats-guide-card"><span>03</span><h2>لماذا الكلمات المفتاحية مهمة؟</h2><p>تساعد المصطلحات الواضحة على وصف خبرتك بلغة قريبة من متطلبات الوظيفة وتسهّل البحث عن المهارات ذات الصلة. الأهم أن تستخدمها في سياق يشرح ما فعلته، بدل سرد قائمة غير مدعومة بأمثلة.</p></article>
          <article className="ats-guide-card"><span>04</span><h2>كيف تستخرج الكلمات من Job Description؟</h2><ol><li>راجع المسؤوليات والمؤهلات كلًّا على حدة.</li><li>دوّن الأدوات والشهادات والمهارات المتكررة.</li><li>ميّز بين الشروط الإلزامية والميزات المفضلة.</li><li>تحقق من الكلمات التي تتوافق مع خبرتك فعلًا.</li></ol></article>
          <article className="ats-guide-card"><span>05</span><h2>أين تضع الكلمات في السيرة الذاتية؟</h2><p>ضع الأدوات والمهارات في قسم المهارات، واشرح استخدامها ضمن نقاط الخبرة والإنجازات. أضف الشهادات في قسم مستقل والتعليم في قسم المؤهلات. يمكن أن تلخص النبذة المهنية ارتباط خبرتك بالدور دون تكرار آلي.</p></article>
          <article className="ats-guide-card"><span>06</span><h2>هل تنسخ كل كلمات إعلان الوظيفة؟</h2><p>لا. أضف فقط الكلمات التي تصف مهاراتك وخبرتك الحقيقية. لا تنسب لنفسك شهادة أو مستوى خبرة أو أداة لم تستخدمها؛ قد تُناقش هذه الادعاءات أثناء المقابلة أو التحقق من المؤهلات.</p></article>
          <article className="ats-guide-card ats-guide-warning"><span>07</span><h2>تجنب Keyword Stuffing</h2><p>تكرار كلمات بلا سياق يجعل السيرة صعبة القراءة ويقلل الثقة. اكتب جملًا طبيعية تشرح مساهمتك وأدواتك ونتائجك، واستعمل المصطلح عند الحاجة فقط. لا تخفِ كلمات أو تستخدم نصًا غير مرئي.</p></article>
          <article className="ats-guide-card ats-guide-tip"><span>08</span><h2>كيف تحسن Resume Match؟</h2><p>ابدأ بمقارنة المؤهلات المطلوبة مع سيرتك، ثم حسّن العناوين والعبارات لتكون محددة ومفهومة. اربط المهارة بمثال حقيقي، واستخدم تنسيقًا بسيطًا وعناوين مألوفة، وأعد قراءة النسخة النهائية بنفسك.</p></article>
        </div>
        <AdSlot id="ats-keywords-inline" className="ats-inline-ad" description="موضع اختياري داخل الدليل التعليمي." />
        <section className="ats-faq-section"><div className="section-heading"><span className="eyebrow">أسئلة شائعة</span><h2>استفسارات حول <span className="text-gradient">الكلمات المفتاحية.</span></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span className="faq-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      </div></section>
      <AdSlot id="ats-keywords-bottom" className="container ats-page-ad ats-bottom-ad" description="موضع اختياري أسفل الصفحة." />
    </main>
    <SiteFooter />
  </>;
}
