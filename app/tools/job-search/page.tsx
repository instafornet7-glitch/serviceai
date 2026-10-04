import type { Metadata } from "next";
import { JobSearchOrganizer } from "@/components/additional-tools";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "منظّم البحث عن عمل | ServiceAI",
  description: "نظّم طلبات التوظيف والشركات والحالات ومواعيد المتابعة محليًا في متصفحك.",
  alternates: { canonical: "/tools/job-search" },
};

export default function JobSearchPage() {
  return <><SiteHeader active="/tools" /><main id="main">
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />بحث أوضح عن الفرص</span><h1>نظّم طلباتك<br /><span className="text-gradient">وتابع تقدمك.</span></h1><p>سجّل الفرص التي تقدمت إليها وحدّث حالتها وموعد المتابعة. تبقى البيانات على هذا الجهاز.</p></div><div className="page-hero-art tool-hero-art" aria-hidden="true"><div className="tool-hero-sheet"><span /><span /><span /><b>فرصتك<br />القادمة</b></div></div></div></section>
    <JobSearchOrganizer />
  </main><SiteFooter /></>;
}
