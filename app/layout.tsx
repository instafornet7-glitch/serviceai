import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { SitePreferencesProvider } from "@/components/site-preferences-provider";
import "../styles.css";
import "./admin.css";

const baseMetadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "ServiceAI — خطوتك الذكية نحو وظيفة أحلامك", template: "%s — ServiceAI" },
  description: "تقدم ServiceAI أدوات ومصادر مهنية تساعد الباحثين عن عمل على التقدم بثقة، خطوة بخطوة.",
  applicationName: "ServiceAI",
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "ServiceAI",
    title: "ServiceAI — أدوات مهنية تساعدك على خطوتك القادمة",
    description: "أنشئ سيرتك الذاتية، حلل توافقها مع الوظائف، واستعد للتقديم والمقابلات بأدوات مجانية.",
    url: new URL("/", getSiteUrl()),
  },
  twitter: {
    card: "summary",
    title: "ServiceAI — أدوات مهنية تساعدك على خطوتك القادمة",
    description: "أنشئ سيرتك الذاتية، حلل توافقها مع الوظائف، واستعد للتقديم والمقابلات بأدوات مجانية.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" data-scroll-behavior="smooth"><body><SitePreferencesProvider>{children}</SitePreferencesProvider></body></html>;
}
