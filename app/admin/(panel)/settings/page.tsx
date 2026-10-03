import type { Metadata } from "next";
import { AdminNotice } from "@/components/admin-forms";
import { SiteSettingsForm } from "@/components/site-settings-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "إعدادات الموقع" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_preferences")
    .select("key,value")
    .eq("key", "adsense");

  const preferencesData = Object.fromEntries(
    (data ?? [])
      .filter((row) => typeof row.key === "string")
      .map((row) => [row.key, row.value]),
  );

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading">
        <div><span className="admin-kicker">تخصيص الموقع</span><h1>إعدادات الموقع</h1><p>تحكم بمعرّف الناشر ومواضع إعلانات Google AdSense.</p></div>
      </div>
      {error && <div className="admin-alert" role="alert">تعذر تحميل الإعدادات المحفوظة. يمكنك تعديلها أدناه، وتأكد من تهيئة جدول <code>site_preferences</code> في Supabase.</div>}
      <SiteSettingsForm preferences={parseSitePreferences(preferencesData)} />
    </div>
  );
}
