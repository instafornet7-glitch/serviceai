import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site";
import { sanitizeArticleHtml } from "@/lib/content";
import { getPage } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/terms");
  return { title: page?.title ?? "شروط الاستخدام", description: "الشروط الأساسية لاستخدام موقع ServiceAI ومحتواه المهني.", alternates: { canonical: "/terms" } };
}

export default async function TermsPage() {
  const page = await getPage("/terms");
  return <>
    <SiteHeader />
    <main id="main">
      <section className="page-hero compact-page-hero"><div className="container"><span className="eyebrow"><span className="eyebrow-dot" />معلومات قانونية</span><h1>{page?.title ?? "شروط الاستخدام"}</h1><p>يرجى قراءة الشروط لفهم طبيعة الموقع والخدمات المتاحة.</p></div></section>
      <section className="section legal-section">
        <article className="container legal-content">
          {page?.content
            ? <div dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page.content) }} />
            : <>
              <div className="legal-updated">آخر تحديث: ٢ أكتوبر ٢٠٢٦</div>
              <div className="legal-callout"><strong>الزوار لا يحتاجون إلى حساب</strong><p>قراءة المقالات المنشورة واستخدام الأدوات العامة متاحان للجميع. لوحة إدارة المحتوى خاصة بالمدير المخوّل وحده.</p></div>
              <h2>١. استخدام الموقع</h2><p>باستخدام صفحات ServiceAI، توافق على هذه الشروط وعلى استخدام الموقع بما يتوافق مع القوانين المعمول بها.</p>
              <h2>٢. المحتوى والإرشادات المهنية</h2><p>المقالات والمخرجات التي تنتجها الأدوات معلومات وإرشادات عامة، ولا تضمن الحصول على وظيفة أو اجتياز نظام توظيف أو نتيجة محددة. راجع المعلومات وخصصها بما يعكس مؤهلاتك الحقيقية قبل استخدامها.</p>
              <h2>٣. الأدوات ومعالجة المعلومات</h2><p>تعمل الأدوات العامة الحالية بقواعد محلية داخل المتصفح ولا تتصل بمزوّد ذكاء اصطناعي خارجي. لا تُرسل مدخلات الأدوات أو ملفات السيرة الذاتية إلى خادم ServiceAI ولا تُحفظ بشكل دائم. تعتمد نتيجة المقارنة على النصوص والمصطلحات التي يمكن استخراجها، وقد لا تمثل طريقة عمل نظام توظيف بعينه.</p>
              <h2>٤. الملكية الفكرية</h2><p>لا يجوز نسخ محتوى الموقع أو استغلاله تجاريًا دون إذن مسبق، مع احترام حقوق أصحاب المواد التي قد تتم الإشارة إليها.</p>
              <h2>٥. التوفر والتعديلات</h2><p>قد يتغير محتوى الموقع أو يتوقف مؤقتًا لأغراض الصيانة والتطوير. قد نحدّث هذه الشروط عند إضافة خصائص جديدة.</p>
              <h2>٦. التواصل</h2><p>للاستفسار عن الشروط، يرجى زيارة <Link href="/contact">صفحة التواصل</Link>.</p>
            </>}
        </article>
      </section>
    </main>
    <SiteFooter />
  </>;
}
