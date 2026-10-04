"use client";

import { SocialLinksForm } from "@/components/social-links-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { LOCAL_DB_KEYS } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

export default function AdminSocialPage() {
  const stored = useLocalDBValue<Record<string, unknown>>(LOCAL_DB_KEYS.preferences, {});
  const { socialLinks } = parseSitePreferences(stored);
  return <div className="admin-page">
    <div className="admin-page-heading"><div><span className="admin-kicker">التواصل مع الزوار</span><h1>روابط التواصل</h1><p>تُحفظ روابط الحسابات على هذا المتصفح فقط.</p></div></div>
    <SocialLinksForm key={JSON.stringify(socialLinks)} socialLinks={socialLinks} />
  </div>;
}
