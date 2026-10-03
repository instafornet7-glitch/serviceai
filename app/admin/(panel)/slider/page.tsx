import type { Metadata } from "next";
import { AdminNotice } from "@/components/admin-forms";
import { HomeSliderForm } from "@/components/home-slider-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "سلايدر الصفحة الرئيسية" };

export default async function AdminSliderPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_preferences")
    .select("value")
    .eq("key", "home_slider")
    .maybeSingle();

  const { homeSlider } = parseSitePreferences({ home_slider: data?.value });

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading">
        <div><span className="admin-kicker">محتوى الصفحة الرئيسية</span><h1>سلايدر الصور</h1><p>أضف الصور التي تظهر بجانب مقدمة الصفحة الرئيسية، وعدّل ترتيبها ونصوصها وروابطها.</p></div>
      </div>
      {error && <div className="admin-alert" role="alert">تعذر تحميل إعدادات السلايدر. يمكنك تعديلها أدناه، وتأكد من صلاحيات جدول <code>site_preferences</code>.</div>}
      <HomeSliderForm initialSlides={homeSlider} />
    </div>
  );
}
