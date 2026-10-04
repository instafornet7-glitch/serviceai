"use client";

import { SiteBrandingForm } from "@/components/site-branding-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { LOCAL_DB_KEYS } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

export default function AdminAppearancePage() {
  const stored = useLocalDBValue<Record<string, unknown>>(LOCAL_DB_KEYS.preferences, {});
  const { branding } = parseSitePreferences(stored);
  return <div className="admin-page">
    <div className="admin-page-heading"><div><span className="admin-kicker">تخصيص الواجهة</span><h1>هوية ومظهر الموقع</h1><p>تُحفظ هذه الإعدادات على هذا المتصفح فقط.</p></div></div>
    <SiteBrandingForm key={JSON.stringify(branding)} branding={branding} />
  </div>;
}
