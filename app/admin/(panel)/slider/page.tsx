"use client";

import { AdminNotice } from "@/components/admin-forms";
import { HomeSliderForm } from "@/components/home-slider-form";
import { parseSitePreferences } from "@/lib/site-preferences";
import { LOCAL_DB_KEYS } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

export default function AdminSliderPage() {
  const stored = useLocalDBValue<Record<string, unknown>>(LOCAL_DB_KEYS.preferences, {});
  const { homeSlider } = parseSitePreferences(stored);
  return <div className="admin-page">
    <AdminNotice />
    <div className="admin-page-heading"><div><span className="admin-kicker">محتوى الصفحة الرئيسية</span><h1>سلايدر الصور</h1><p>تُحفظ الشرائح والصور محليًا على هذا المتصفح فقط.</p></div></div>
    <HomeSliderForm key={JSON.stringify(homeSlider)} initialSlides={homeSlider} />
  </div>;
}
