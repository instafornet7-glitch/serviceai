import type { Metadata } from "next";
import { CoverLetterGenerator } from "@/components/cover-letter-generator";
import { AdSlot } from "@/components/ad-slot";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "مولد رسالة التقديم المجاني | Cover Letter Generator",
  description: "أنشئ رسالة تقديم مخصصة للوظيفة باللغة الإنجليزية أو العربية أو الفرنسية أو الإسبانية أو الألمانية. عدّل النص وانسخه أو نزّله PDF وDOCX مجانًا.",
  keywords: ["إنشاء Cover Letter", "رسالة تقديم وظيفة", "Cover Letter Generator", "خطاب التقديم", "رسالة تقديم بالإنجليزية"],
  alternates: { canonical: "/tools/cover-letter-generator" },
  openGraph: {
    type: "website",
    title: "أنشئ رسالة تقديم احترافية ومخصصة | ServiceAI",
    description: "اكتب رسالة تقديم للوظيفة التي تستهدفها، خصص لغتها وأسلوبها، ثم حرّرها وحمّلها.",
  },
};

const faqs = [
  ["هل استخدام مولد رسالة التقديم مجاني؟", "نعم، الأداة متاحة مجانًا دون إنشاء حساب أو اشتراك."],
  ["هل يتم حفظ بياناتي أو إرسالها؟", "في النسخة الحالية تُنشأ الرسالة محليًا داخل المتصفح ولا تُرسل إلى مزود ذكاء اصطناعي أو قاعدة بيانات. تُزال بيانات الصفحة من الذاكرة عند مغادرتها أو تحديثها."],
  ["هل يستخدم المولد الذكاء الاصطناعي؟", "لا يتصل الإصدار الحالي بنموذج ذكاء اصطناعي خارجي. ينشئ مسودة متعددة اللغات بقوالب وقواعد صياغة اعتمادًا على المعلومات التي تدخلها، ويمكنك تحرير النتيجة يدويًا."],
  ["هل يخترع المولد مهارات أو خبرات؟", "لا. يقتصر على المهارات والإنجازات التي تدخلها. إذا كانت بعض المعلومات اختيارية وتركتها فارغة، لن نضيف تفاصيل شخصية غير مقدمة."],
  ["هل يمكنني تعديل الرسالة قبل إرسالها؟", "نعم، النتيجة قابلة للتحرير بالكامل. راجعها وعدّلها للتأكد من أنها دقيقة ومناسبة للوظيفة."],
  ["كيف أحفظ الرسالة بصيغة PDF؟", "اضغط تحميل PDF ثم اختر «حفظ بصيغة PDF» من نافذة الطباعة. يمكن تنزيل ملف DOCX مباشرة من الزر المخصص."],
  ["هل تضمن درجة الجودة الحصول على مقابلة؟", "لا. الدرجة مؤشر إرشادي لخصائص المسودة فقط ولا تضمن قبولًا أو مقابلة. راجع محتوى الرسالة وملاءمته بنفسك."],
];

export default function CoverLetterGeneratorPage() {
  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "مولد رسالة التقديم من ServiceAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    inLanguage: ["ar", "en", "fr", "es", "de"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "أداة مجانية لإنشاء رسالة تقديم متعددة اللغات اعتمادًا على معلومات المستخدم، وتحريرها وتنزيلها.",
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
    <main id="main" className="cover-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }} />
      <section className="page-hero cover-page-hero">
        <div className="container page-hero-inner">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" />مجاني — دون حساب</span>
            <h1>اكتب رسالة تقديم<br /><span className="text-gradient">تناسب الوظيفة التي تريدها.</span></h1>
            <p>أدخل معلوماتك والوظيفة المستهدفة، واختر اللغة والأسلوب. أنشئ مسودة قابلة للتعديل والتنزيل لمراجعتها قبل التقديم.</p>
            <span className="cover-privacy-badge"><span aria-hidden="true">✓</span> تفاصيلك تبقى في متصفحك</span>
          </div>
          <div className="page-hero-art tool-hero-art" aria-hidden="true"><span className="hero-art-shape shape-tool-one">✉</span><span className="hero-art-shape shape-tool-two">✓</span><div className="tool-hero-sheet cover-hero-sheet"><span /><span /><span /><span /><b>Cover Letter<br />لخطوتك القادمة</b></div></div>
        </div>
      </section>

      <AdSlot id="cover-letter-intro" className="container cover-page-ad cover-intro-ad" description="موضع اختياري بعد مقدمة الأداة." />
      <section className="section cover-tool-section"><div className="container">
        <div className="cover-section-intro"><div><span className="eyebrow">خصّص رسالتك</span><h2>من معلوماتك إلى <span className="text-gradient">مسودة جاهزة للمراجعة.</span></h2><p>قدّم المعلومات التي تريد إبرازها؛ لا نضيف إلى الرسالة خبرات أو مهارات لم تدخلها.</p></div><span className="cover-lang-mark">5 لغات <b>·</b> PDF وDOCX</span></div>
        <CoverLetterGenerator />
      </div></section>
      <AdSlot id="cover-letter-results" className="container cover-page-ad cover-before-guide-ad" description="موضع اختياري بين الأداة والدليل." />

      <section className="cover-seo-section"><div className="container">
        <div className="section-heading centered"><span className="eyebrow">دليل كتابة رسائل التقديم</span><h2>قدّم قصتك المهنية <span className="text-gradient">بوضوح وصدق.</span></h2><p>رسالة التقديم مساحة لشرح اهتمامك بفرصة محددة وربط خلفيتك بمتطلباتها. استخدم هذا الدليل لتخصيص الرسالة ومراجعتها قبل الإرسال.</p></div>
        <div className="cover-guide-grid">
          <article className="cover-guide-card"><span>01</span><h2>ما هي Cover Letter؟</h2><p>رسالة التقديم خطاب موجّه إلى جهة التوظيف يرافق السيرة الذاتية عادةً. يشرح بإيجاز الوظيفة التي تستهدفها، وخلفيتك المرتبطة بها، وسبب اهتمامك بالفرصة، ويدعو إلى متابعة التواصل.</p></article>
          <article className="cover-guide-card"><span>02</span><h2>هل ما زالت Cover Letter مهمة؟</h2><p>تختلف أهمية الرسالة باختلاف الوظيفة والجهة. عندما تُطلب أو تتيح لك إضافة سياق مفيد، يمكن لرسالة موجزة ومخصصة أن تساعد القارئ على فهم دوافعك والروابط بين خبرتك والدور، لكنها لا تعوّض سيرة ذاتية مناسبة.</p></article>
          <article className="cover-guide-card"><span>03</span><h2>كيفية كتابة رسالة تقديم احترافية</h2><ol><li>وجّه الرسالة إلى مسؤول التوظيف إن عرفت اسمه.</li><li>اذكر الوظيفة واسم الشركة بوضوح في البداية.</li><li>اختر خبرة أو مهارة حقيقية ترتبط بمتطلبات الإعلان.</li><li>اشرح اهتمامك بالدور بإشارة محددة إلى مسؤولياته.</li><li>اختم بشكر مهني ودعوة مناسبة لمتابعة التواصل.</li><li>راجع الأسماء والتهجئة وبيانات الاتصال قبل الإرسال.</li></ol></article>
          <article className="cover-guide-card"><span>04</span><h2>الفرق بين CV وCover Letter</h2><p>السيرة الذاتية تعرض خبراتك ومهاراتك ومؤهلاتك بصورة منظمة، بينما تركز رسالة التقديم على فرصة واحدة وتشرح لماذا تقدمت لها وكيف ترتبط خلفيتك بما تحتاجه. يفترض أن تكمل الرسالة السيرة، لا أن تكررها حرفيًا.</p></article>
          <article className="cover-guide-card"><span>05</span><h2>أخطاء شائعة في رسائل التقديم</h2><ul><li>إرسال نص واحد عام إلى جهات ووظائف مختلفة.</li><li>تكرار محتوى السيرة دون توضيح سبب ملاءمته.</li><li>ادعاء مهارات أو إنجازات لا يمكن إثباتها.</li><li>إطالة الرسالة أو استخدام عبارات مبالغ فيها.</li><li>نسيان تعديل اسم الشركة أو المسمى الوظيفي.</li></ul></article>
          <article className="cover-guide-card"><span>06</span><h2>كيف تخصّص الرسالة لكل وظيفة؟</h2><p>اقرأ الإعلان وحدد المسؤوليات التي تتوافق فعلًا مع خبرتك. اذكر المسمى والجهة بدقة، ثم اختر مثالًا واقعيًا يوضح مساهمتك. استخدم كلمات الإعلان عندما تصف مهاراتك الحقيقية، ولا تضع مصطلحات غير مرتبطة بسجلك المهني.</p></article>
          <article className="cover-guide-card"><span>07</span><h2>أمثلة ونصائح عامة</h2><p>بدلًا من كتابة «أنا مجتهد ومتحمس»، اذكر ما فعلته فعلًا: «أدرت حملات بريدية أسبوعية» أو «نسّقت إطلاق منتج مع ثلاثة فرق» إذا كان ذلك صحيحًا. أضف نتيجة رقمية فقط عندما تكون موثوقة، واختصر الرسالة لتسهيل قراءتها.</p></article>
          <article className="cover-guide-card cover-guide-tip"><span>✓</span><h2>استخدم المولد كبداية، لا كنص نهائي</h2><p>راجع كل جملة وتأكد من دقتها ومن ملاءمة نبرتها للجهة. أزل أي تفاصيل لا تنطبق عليك، واطلب مراجعة شخص تثق به عند الحاجة.</p></article>
        </div>
        <AdSlot id="cover-letter-inline" className="cover-inline-ad" description="موضع اختياري داخل المحتوى التعليمي." />
        <section className="cover-faq-section"><div className="section-heading"><span className="eyebrow">أسئلة شائعة</span><h2>إجابات لرسالة تقديم <span className="text-gradient">أوضح.</span></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span className="faq-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      </div></section>
      <AdSlot id="cover-letter-bottom" className="container cover-page-ad cover-bottom-ad" description="موضع اختياري أسفل الصفحة." />
    </main>
    <SiteFooter />
  </>;
}
