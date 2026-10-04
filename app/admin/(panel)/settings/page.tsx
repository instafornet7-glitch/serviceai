"use client";

import { SiteSettingsForm } from "@/components/site-settings-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { LOCAL_DB_KEYS } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

export default function AdminSettingsPage() {
  const stored = useLocalDBValue<Record<string, unknown>>(LOCAL_DB_KEYS.preferences, {});
  return <div className="admin-page">
    <div className="admin-page-heading"><div><span className="admin-kicker">تخصيص الموقع</span><h1>إعدادات الموقع</h1><p>تُحفظ مواضع الإعلانات محليًا على هذا المتصفح فقط.</p></div></div>
    <SiteSettingsForm key={JSON.stringify(stored)} preferences={parseSitePreferences(stored)} />
  </div>;
}
