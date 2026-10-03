"use client";

import { useActionState, useEffect } from "react";
import { saveSiteSettingsAction, type ActionState } from "@/lib/admin-actions";
import { AD_PLACEMENTS, type SitePreferences } from "@/lib/site-preferences";

const initialState: ActionState = {};

export function SiteSettingsForm({ preferences }: { preferences: SitePreferences }) {
  const [state, action, pending] = useActionState(saveSiteSettingsAction, initialState);

  useEffect(() => {
    if (state.success) window.dispatchEvent(new Event("site-preferences-updated"));
  }, [state.success]);

  return (
    <form action={action} className="site-settings-form">
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      {state.success && <p className="admin-success" role="status">{state.success}</p>}

      <section className="admin-panel-card site-settings-card">
        <div className="admin-card-heading">
          <div><h2>Google AdSense</h2><p>فعّل مواضع الإعلانات وأدخل معرّف الناشر ورقم الوحدة لكل موضع.</p></div>
        </div>
        <label className="site-settings-field" htmlFor="adsense-client">
          <span>معرّف الناشر (Publisher ID)</span>
          <input id="adsense-client" name="adsense_client" defaultValue={preferences.adsenseClient} placeholder="ca-pub-0000000000000000" pattern="ca-pub-[0-9]{16}" />
          <small>انسخ القيمة التي تبدأ بـ ca-pub- من AdSense. بعد الحفظ يضعها الموقع في HTML الأولي داخل &lt;head&gt; بهذا الشكل: &lt;meta name=&quot;google-adsense-account&quot; content=&quot;ca-pub-...&quot;&gt;. لا تضع الشفرة البرمجية كاملة في هذا الحقل.</small>
        </label>
        <p className="adsense-admin-help">لكل موضع، أنشئ وحدة إعلانية في AdSense ثم انسخ قيمة data-ad-slot الرقمية إلى الحقل المقابل. لن يظهر إعلان إلا عند تفعيل موضع وإدخال معرّف الناشر ورقم الوحدة.</p>
        <div className="ad-placement-list">
          {AD_PLACEMENTS.map((placement) => {
            const slot = preferences.adSlots[placement.id];
            return (
              <article className="ad-placement-row" key={placement.id}>
                <div className="ad-placement-copy"><strong>{placement.label}</strong><small>{placement.description}</small></div>
                <label className="ad-placement-toggle">
                  <input type="checkbox" name={`slot.${placement.id}.enabled`} defaultChecked={slot.enabled} />
                  <span>تفعيل الإعلان</span>
                </label>
                <label className="site-settings-field ad-slot-input" htmlFor={`slot-${placement.id}`}>
                  <span>رقم الوحدة (data-ad-slot)</span>
                  <input id={`slot-${placement.id}`} name={`slot.${placement.id}.slot_id`} inputMode="numeric" pattern="[0-9]{1,32}" maxLength={32} defaultValue={slot.slotId} placeholder="مثال: 1234567890" />
                </label>
              </article>
            );
          })}
        </div>
      </section>

      <div className="site-settings-submit">
        <p>تُحفظ إعدادات إعلانات Google AdSense بشكل مستقل.</p>
        <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
          {pending ? "جارٍ حفظ الإعدادات..." : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}
