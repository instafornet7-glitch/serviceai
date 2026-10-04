"use client";

import { SiteBrandingForm } from "@/components/site-branding-form";
import { SiteSettingsForm } from "@/components/site-settings-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { LOCAL_DB_KEYS } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

export default function AdminSettingsPage() {
  const stored = useLocalDBValue<Record<string, unknown>>(LOCAL_DB_KEYS.preferences, {});
  const preferences = parseSitePreferences(stored);
  return <div className="admin-page">
    <div className="admin-page-heading"><div><span className="admin-kicker">تخصيص الموقع</span><h1>إعدادات الموقع</h1><p>تُحفظ الهوية والإعلانات محليًا في هذا المتصفح، وتنعكس تغييرات الهوية على الواجهة فور حفظها.</p></div></div>
    <SiteBrandingForm key={JSON.stringify(preferences.branding)} branding={preferences.branding} />
    <SiteSettingsForm key={`ads-${JSON.stringify(stored)}`} preferences={preferences} />
  </div>;
}
