import type { Metadata } from "next";
import { ProfileReviewTool } from "@/components/additional-tools";
import { SiteFooter, SiteHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "مراجع الملف المهني | ServiceAI",
  description: "راجع نبذتك المهنية واحصل على مؤشرات عملية لتحسين وضوح ملفك لأصحاب العمل.",
  alternates: { canonical: "/tools/linkedin-profile" },
};

export default function LinkedInProfilePage() {
  return <><SiteHeader active="/tools" /><main id="main">
    <section className="page-hero"><div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />حضور مهني أوضح</span><h1>اجعل ملفك المهني<br /><span className="text-gradient">يعكس خبرتك.</span></h1><p>راجع نبذتك المهنية باختبار محلي بسيط يساعدك على ملاحظة ما يمكن توضيحه.</p></div><div className="page-hero-art tool-hero-art" aria-hidden="true"><div className="tool-hero-sheet"><span /><span /><span /><b>ملف<br />مهني</b></div></div></div></section>
    <ProfileReviewTool />
  </main><SiteFooter /></>;
}
