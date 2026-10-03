import type { Metadata } from "next";
import { AdminNotice } from "@/components/admin-forms";
import { SocialLinksForm } from "@/components/social-links-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "روابط التواصل" };

export default async function AdminSocialPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_preferences")
    .select("key,value")
    .in("key", ["contact", "social"]);

  const preferencesData = Object.fromEntries(
    (data ?? [])
      .filter((row) => typeof row.key === "string")
      .map((row) => [row.key, row.value]),
  );

  const preferences = parseSitePreferences(preferencesData);

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading">
        <div><span className="admin-kicker">التواصل مع الزوار</span><h1>روابط التواصل</h1><p>أدر حسابات التواصل التي تظهر في تذييل واجهة الموقع.</p></div>
      </div>
      {error && <div className="admin-alert" role="alert">تعذر تحميل الروابط المحفوظة. يمكنك تعديلها أدناه، وتأكد من صلاحيات جدول <code>site_preferences</code>.</div>}
      <SocialLinksForm socialLinks={preferences.socialLinks} />
    </div>
  );
}
