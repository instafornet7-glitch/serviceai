import type { Metadata } from "next";
import { CareerGuidanceTool } from "@/components/additional-tools";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "موجّهك المهني | ServiceAI",
  description: "أنشئ خطة مهنية أولية بخطوات عملية تناسب المجال والهدف الذي تستهدفه.",
  alternates: { canonical: "/tools/career-guidance" },
};

export default function CareerGuidancePage() {
  return <><SiteHeader active="/tools" /><main id="main">
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />تخطيط مهني عملي</span><h1>خطوتك المهنية<br /><span className="text-gradient">تبدأ بهدف واضح.</span></h1><p>حوّل هدفك المهني إلى خطوات قابلة للتنفيذ، بإرشادات عامة تُنشأ داخل متصفحك.</p></div><div className="page-hero-art tool-hero-art" aria-hidden="true"><div className="tool-hero-sheet"><span /><span /><span /><b>خطة<br />مهنية</b></div></div></div></section>
    <CareerGuidanceTool />
  </main><SiteFooter /></>;
}
