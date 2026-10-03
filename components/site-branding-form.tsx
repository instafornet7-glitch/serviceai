"use client";

import { useActionState, useEffect, useState } from "react";
import { saveSiteBrandingAction, type ActionState } from "@/lib/admin-actions";
import type { SiteBranding } from "@/lib/site-preferences";

const initialState: ActionState = {};

const identityAndHeroFields: { key: "siteName" | "logoMark" | "heroEyebrow" | "heroTitle" | "heroHighlight" | "heroPrimaryButton" | "heroDescription"; label: string; multiline?: boolean; wide?: boolean }[] = [
  { key: "siteName", label: "اسم الموقع" },
  { key: "logoMark", label: "الحرف أو الرمز داخل الشعار" },
  { key: "heroEyebrow", label: "عبارة المقدمة أعلى العنوان" },
  { key: "heroTitle", label: "عنوان الصفحة الرئيسية" },
  { key: "heroHighlight", label: "الجزء المميز من العنوان" },
  { key: "heroPrimaryButton", label: "نص الزر الرئيسي" },
  { key: "heroDescription", label: "وصف الصفحة الرئيسية", multiline: true, wide: true },
];

const footerTextFields: { key: Exclude<keyof SiteBranding, "primaryColor" | "accentColor" | "siteName" | "logoMark" | "heroEyebrow" | "heroTitle" | "heroHighlight" | "heroDescription" | "heroPrimaryButton" | "footerContactHref" | "footerExploreToolsHref" | "footerExploreBlogHref" | "footerExploreAboutHref" | "footerInfoContactHref" | "footerPrivacyHref" | "footerTermsHref" | "footerCalloutLinkHref" | "footerBackToTopHref">; label: string; multiline?: boolean }[] = [
  { key: "footerDescription", label: "وصف الموقع في التذييل", multiline: true },
  { key: "footerContactLabel", label: "نص رابط التواصل" },
  { key: "footerExploreHeading", label: "عنوان عمود الاستكشاف" },
  { key: "footerExploreToolsLabel", label: "اسم رابط الأدوات" },
  { key: "footerExploreBlogLabel", label: "اسم رابط المدونة" },
  { key: "footerExploreAboutLabel", label: "اسم رابط من نحن" },
  { key: "footerInfoHeading", label: "عنوان عمود المعلومات" },
  { key: "footerInfoContactLabel", label: "اسم رابط تواصل معنا" },
  { key: "footerPrivacyLabel", label: "اسم رابط سياسة الخصوصية" },
  { key: "footerTermsLabel", label: "اسم رابط شروط الاستخدام" },
  { key: "footerCallout", label: "العبارة الرئيسية في بطاقة التذييل", multiline: true },
  { key: "footerCalloutLinkLabel", label: "نص رابط بطاقة التذييل" },
  { key: "footerCopyright", label: "نص حقوق النشر" },
  { key: "footerMadeWith", label: "عبارة صنع الموقع" },
  { key: "footerBackToTopLabel", label: "نص رابط العودة للأعلى" },
];

const footerHrefFields: { key: "footerContactHref" | "footerExploreToolsHref" | "footerExploreBlogHref" | "footerExploreAboutHref" | "footerInfoContactHref" | "footerPrivacyHref" | "footerTermsHref" | "footerCalloutLinkHref" | "footerBackToTopHref"; label: string }[] = [
  { key: "footerContactHref", label: "رابط التواصل" },
  { key: "footerExploreToolsHref", label: "رابط الأدوات" },
  { key: "footerExploreBlogHref", label: "رابط المدونة" },
  { key: "footerExploreAboutHref", label: "رابط من نحن" },
  { key: "footerInfoContactHref", label: "رابط تواصل معنا" },
  { key: "footerPrivacyHref", label: "رابط سياسة الخصوصية" },
  { key: "footerTermsHref", label: "رابط شروط الاستخدام" },
  { key: "footerCalloutLinkHref", label: "رابط بطاقة التذييل" },
  { key: "footerBackToTopHref", label: "رابط العودة للأعلى" },
];

function BrandColorField({ name, label, value }: { name: "primaryColor" | "accentColor"; label: string; value: string }) {
  const [color, setColor] = useState(value);
  return (
    <label className="site-settings-field" htmlFor={`brand-${name}`}>
      <span>{label}</span>
      <div className="branding-color-row">
        <input value={color} readOnly aria-label={`${label} بصيغة HEX`} />
        <input id={`brand-${name}`} type="color" name={name} value={color} aria-label={label} onChange={(event) => setColor(event.currentTarget.value)} />
      </div>
    </label>
  );
}

export function SiteBrandingForm({ branding }: { branding: SiteBranding }) {
  const [state, action, pending] = useActionState(saveSiteBrandingAction, initialState);

  useEffect(() => {
    if (state.success) window.dispatchEvent(new Event("site-preferences-updated"));
  }, [state.success]);

  return (
    <form action={action} className="site-settings-form">
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      {state.success && <p className="admin-success" role="status">{state.success}</p>}

      <section className="admin-panel-card site-settings-card">
        <div className="admin-card-heading">
          <div><h2>هوية العلامة التجارية</h2><p>غيّر اسم الموقع وألوانه الأساسية. تُطبّق الألوان على عناصر الهوية والأزرار في الواجهة.</p></div>
        </div>
        <div className="branding-field-grid">
          <label className="site-settings-field" htmlFor="brand-siteName">
            <span>اسم الموقع</span>
            <input id="brand-siteName" name="siteName" defaultValue={branding.siteName} maxLength={40} required />
          </label>
          {([
            ["primaryColor", "اللون الأساسي"],
            ["accentColor", "اللون المساعد"],
          ] as const).map(([key, label]) => (
            <BrandColorField key={key} name={key} label={label} value={branding[key]} />
          ))}
        </div>
      </section>

      <section className="admin-panel-card site-settings-card">
        <div className="admin-card-heading">
          <div><h2>محتوى الصفحة الرئيسية والتذييل</h2><p>عدّل النصوص الظاهرة للزوار مع الحفاظ على بنية وتصميم الموقع.</p></div>
        </div>
        <div className="branding-field-grid">
          {identityAndHeroFields.map(({ key, label, multiline, wide }) => (
            <label className={`site-settings-field${wide ? " branding-field-wide" : ""}`} htmlFor={`brand-${key}`} key={key}>
              <span>{label}</span>
              {multiline
                ? <textarea id={`brand-${key}`} name={key} defaultValue={branding[key]} maxLength={key === "heroDescription" ? 400 : 250} rows={3} required />
                : <input id={`brand-${key}`} name={key} defaultValue={branding[key]} maxLength={key === "heroPrimaryButton" ? 40 : 100} required />}
            </label>
          ))}
        </div>
      </section>

      <section className="admin-panel-card site-settings-card">
        <div className="admin-card-heading">
          <div><h2>إعدادات التذييل</h2><p>عدّل عناوين ونصوص التذييل وروابط كل عنصر. اترك الرابط فارغًا لإخفاء ذلك الرابط.</p></div>
        </div>
        <div className="branding-field-grid">
          {footerTextFields.map(({ key, label, multiline }) => (
            <label className={`site-settings-field${multiline ? " branding-field-wide" : ""}`} htmlFor={`brand-${key}`} key={key}>
              <span>{label}</span>
              {multiline
                ? <textarea id={`brand-${key}`} name={key} defaultValue={branding[key]} maxLength={250} rows={3} required />
                : <input id={`brand-${key}`} name={key} defaultValue={branding[key]} maxLength={150} required />}
            </label>
          ))}
          {footerHrefFields.map(({ key, label }) => (
            <label className="site-settings-field" htmlFor={`brand-${key}`} key={key}>
              <span>{label}</span>
              <input id={`brand-${key}`} name={key} type="text" dir="ltr" defaultValue={branding[key]} placeholder="/مسار-داخلي أو https://example.com" maxLength={500} />
            </label>
          ))}
        </div>
      </section>

      <div className="site-settings-submit">
        <p>تظهر التغييرات للزوار بعد الحفظ.</p>
        <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
          {pending ? "جارٍ حفظ الهوية..." : "حفظ إعدادات الهوية"}
        </button>
      </div>
    </form>
  );
}
