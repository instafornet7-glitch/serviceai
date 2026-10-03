import type { Metadata } from "next";
import { AdminNotice } from "@/components/admin-forms";
import { SiteBrandingForm } from "@/components/site-branding-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "هوية ومظهر الموقع" };

export default async function AdminAppearancePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_preferences")
    .select("value")
    .eq("key", "branding")
    .maybeSingle();

  const branding = parseSitePreferences({ branding: data?.value }).branding;

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading">
        <div><span className="admin-kicker">تخصيص الواجهة</span><h1>هوية ومظهر الموقع</h1><p>عدّل اسم الموقع وألوانه ونصوص الصفحة الرئيسية والتذييل.</p></div>
      </div>
      {error && <div className="admin-alert" role="alert">تعذر تحميل الهوية المحفوظة. يمكنك تحديثها أدناه، وتأكد من إعداد جدول <code>site_preferences</code>.</div>}
      <SiteBrandingForm branding={branding} />
    </div>
  );
}
