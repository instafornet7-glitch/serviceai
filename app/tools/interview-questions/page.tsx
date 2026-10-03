import type { Metadata } from "next";
import { InterviewQuestionGenerator } from "@/components/interview-question-generator";
import { AdSlot } from "@/components/ad-slot";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "مولد أسئلة مقابلات العمل المجاني | Interview Questions Generator",
  description: "أنشئ أسئلة مقابلة عمل مخصصة للوظيفة ومستوى الخبرة، مع إجابات إرشادية ونصائح STAR بالعربية والإنجليزية والفرنسية والإسبانية والألمانية.",
  keywords: ["أسئلة مقابلة عمل", "Interview Questions Generator", "أسئلة مقابلات HR", "أسئلة مقابلة تقنية", "طريقة STAR"],
  alternates: { canonical: "/tools/interview-questions" },
  openGraph: {
    type: "website",
    title: "استعد لمقابلة العمل بأسئلة مخصصة | ServiceAI",
    description: "تدرّب على أسئلة مقابلة عامة وتقنية وسلوكية وإدارية، مع إجابات قابلة للتخصيص ونصائح عملية.",
  },
};

const faqs = [
  ["هل أداة أسئلة مقابلات العمل مجانية؟", "نعم، الأداة متاحة مجانًا ودون إنشاء حساب."],
  ["هل الأسئلة مولدة بذكاء اصطناعي؟", "لا يتصل الإصدار الحالي بنموذج ذكاء اصطناعي خارجي. تُنشأ الأسئلة محليًا بقوالب وقواعد مرتبطة بالمسمى والوصف ومستوى الخبرة ونوع المقابلة."],
  ["هل تحفظون المسمى أو وصف الوظيفة؟", "لا. تتم المعالجة محليًا داخل الصفحة ولا تُرسل المعلومات إلى خادم أو تحفظ في قاعدة بيانات."],
  ["هل الإجابات المقترحة تجارب حقيقية لمتقدم؟", "لا. الإجابات هياكل إرشادية تتضمن مواضع بين أقواس لتضيف تفاصيلك الحقيقية. لا تنسب الأمثلة أو النتائج إلى نفسك قبل تخصيصها."],
  ["ما هي طريقة STAR؟", "هي طريقة لترتيب الإجابة السلوكية إلى الموقف Situation، والمهمة Task، والإجراء Action، والنتيجة Result. استخدم نتيجة حقيقية أو اشرح ما تعلمته إن لم توجد نتيجة قابلة للقياس."],
  ["هل الأسئلة التقنية تتغير حسب الوظيفة؟", "تخصص الأداة بعض الأسئلة بحسب مؤشرات المسمى والوصف، مثل React وJavaScript لوظائف الواجهات أو SEO وGoogle Ads للتسويق. تظل الأسئلة إرشادية، فراجعها وفق متطلبات الجهة."],
  ["هل يمكنني تنزيل الأسئلة؟", "نعم، يمكنك نسخ الأسئلة والإجابات أو فتح نافذة الطباعة واختيار «حفظ بصيغة PDF»."],
];

export default function InterviewQuestionsPage() {
  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "مولد أسئلة المقابلات من ServiceAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: ["ar", "en", "fr", "es", "de"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "أداة مجانية لإعداد أسئلة تدريب مقابلات العمل وإجابات إرشادية متعددة اللغات محليًا في المتصفح.",
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
    <main id="main" className="interview-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }} />
      <section className="page-hero interview-page-hero">
        <div className="container page-hero-inner">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />أداة تدريب مجانية — دون حساب</span>
            <h1>استعد لمقابلتك<br /><span className="text-gradient">بأسئلة تناسب الوظيفة.</span></h1>
            <p>أنشئ مجموعة أسئلة مقابلة مرتبطة بالمسمى والخبرة والوصف الوظيفي، وراجع إجابات إرشادية ونصائح تساعدك على التحضير.</p>
            <span className="interview-privacy-badge"><span aria-hidden="true">✓</span> لا نحفظ بياناتك</span>
          </div>
          <div className="page-hero-art tool-hero-art" aria-hidden="true"><span className="hero-art-shape shape-tool-one">?</span><span className="hero-art-shape shape-tool-two">✓</span><div className="tool-hero-sheet interview-hero-sheet"><span /><span /><span /><span /><b>Interview<br />Practice</b></div></div>
        </div>
      </section>
      <AdSlot id="interview-questions-intro" className="container interview-page-ad interview-intro-ad" description="موضع هادئ بعد مقدمة الأداة." />
      <section className="section interview-tool-section"><div className="container">
        <div className="interview-section-intro"><div><span className="eyebrow">تدرّب بخطة واضحة</span><h2>أسئلة وإجابات <span className="text-gradient">للمقابلة القادمة.</span></h2><p>اختر نوع المقابلة واللغة، وأضف الوصف الوظيفي لربط التدريب بمتطلبات الإعلان.</p></div><span className="interview-free-mark">5–20 سؤالًا <b>·</b> 5 لغات</span></div>
        <InterviewQuestionGenerator />
      </div></section>
      <AdSlot id="interview-questions-results" className="container interview-page-ad interview-results-ad" description="موضع اختياري بعد نتائج الأسئلة." />
      <section className="interview-seo-section"><div className="container">
        <div className="section-heading centered"><span className="eyebrow">دليل الاستعداد للمقابلات</span><h2>ادخل المقابلة <span className="text-gradient">مستعدًا وواثقًا.</span></h2><p>التحضير الجيد لا يعني حفظ إجابات جاهزة؛ بل فهم الدور والاستعداد لشرح خبرتك بأمثلة دقيقة ومناسبة.</p></div>
        <div className="interview-guide-grid">
          <article className="interview-guide-card"><span>01</span><h2>كيفية الاستعداد لمقابلة العمل</h2><p>راجع وصف الوظيفة وحدد المسؤوليات والمهارات الأساسية. ابحث عن الشركة من مصادر موثوقة، وحضّر أمثلة حقيقية توضح ما قمت به وما تعلمته. اختبر الاتصال أو خط سيرك، وجهّز أسئلة مناسبة لطرحها في نهاية اللقاء.</p></article>
          <article className="interview-guide-card"><span>02</span><h2>أشهر أسئلة مقابلات العمل</h2><ul><li>حدثني عن نفسك ومسارك المهني.</li><li>لماذا تقدمت لهذه الوظيفة؟</li><li>ما نقطة قوة تستخدمها في العمل؟</li><li>حدثني عن تحدٍ تعاملت معه.</li><li>ما الذي تود معرفته عن الفريق أو الدور؟</li></ul></article>
          <article className="interview-guide-card"><span>03</span><h2>كيف تجيب عن «حدثني عن نفسك»؟</h2><p>قدّم ملخصًا مهنيًا موجزًا: تخصصك أو خبرتك ذات الصلة، مثالًا أو مجالًا عملت فيه فعلًا، ثم ما الذي تبحث عنه في الدور الحالي. تجنب سرد السيرة كاملة، واربط الإجابة بالوظيفة التي تتقدم لها.</p><div className="interview-example">«أعمل في [مجال حقيقي]، وركزت مؤخرًا على [مسؤولية أو مهارة]. أبحث عن فرصة أستفيد فيها من [خبرة حقيقية] في [جانب من الوظيفة].»</div></article>
          <article className="interview-guide-card"><span>04</span><h2>أهم أسئلة HR</h2><p>قد تتناول دوافعك، وبيئة العمل التي تناسبك، والتعامل مع الملاحظات، والتوقعات المهنية، وأمثلة التعاون. أجب بصدق وهدوء، واطلب توضيح السؤال إذا احتجت إلى ذلك.</p></article>
          <article className="interview-guide-card interview-star-card"><span>05</span><h2>ما هي طريقة STAR؟</h2><p>طريقة تساعدك على ترتيب إجابة الأسئلة السلوكية دون إطالة أو تعميم. اشرح الموقف والسياق، ثم مسؤوليتك، والإجراءات التي قمت بها أنت، وأخيرًا النتيجة الفعلية أو الدرس المستفاد.</p><div className="interview-star-steps"><span><b>S</b> Situation · الموقف</span><span><b>T</b> Task · المهمة</span><span><b>A</b> Action · الإجراء</span><span><b>R</b> Result · النتيجة</span></div></article>
          <article className="interview-guide-card"><span>06</span><h2>أخطاء تجنبها في المقابلة</h2><ul><li>اختلاق خبرة أو نتيجة أو مهارة.</li><li>إجابات طويلة لا تجيب عن السؤال.</li><li>انتقاد زملاء أو جهات سابقة بدل شرح الوقائع.</li><li>استخدام مثال محفوظ لا يناسب السؤال.</li><li>عدم طرح أي سؤال عن الدور أو الفريق.</li></ul></article>
          <article className="interview-guide-card"><span>07</span><h2>ماذا تسأل مسؤول التوظيف؟</h2><p>يمكنك السؤال عن معايير النجاح في الأشهر الأولى، أو أولويات الفريق وتحدياته الحالية، أو كيفية التعاون والتعلم في الدور. اختر أسئلة لم تُجب عنها المقابلة بعد وتساعدك على فهم الفرصة.</p></article>
          <article className="interview-guide-card interview-guide-tip"><span>✓</span><h2>راجع الإجابات بصوتك أنت</h2><p>استخدم الإجابات المقترحة كهيكل فقط. استبدل الأقواس بتفاصيل صحيحة من تجربتك، ولا تحفظ صياغة حرفية قد لا تبدو طبيعية.</p></article>
        </div>
        <AdSlot id="interview-questions-inline" className="interview-inline-ad" description="موضع اختياري داخل الدليل التعليمي." />
        <section className="interview-faq-section"><div className="section-heading"><span className="eyebrow">أسئلة شائعة</span><h2>استفسارات حول <span className="text-gradient">التدريب للمقابلات.</span></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span className="faq-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      </div></section>
      <AdSlot id="interview-questions-bottom" className="container interview-page-ad interview-bottom-ad" description="موضع اختياري أسفل الصفحة." />
    </main>
    <SiteFooter />
  </>;
}
