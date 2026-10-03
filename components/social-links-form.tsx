"use client";

import { useActionState, useEffect } from "react";
import { saveSocialLinksAction, type ActionState } from "@/lib/admin-actions";
import type { SocialPreferences } from "@/lib/site-preferences";
import { SocialBrandIcon } from "@/components/social-brand-icon";

const initialState: ActionState = {};

const socialFields = [
  { key: "whatsapp", label: "WhatsApp", placeholder: "+966 5X XXX XXXX", hint: "أدخل رقمًا بصيغة دولية؛ سيُنشأ رابط wa.me تلقائيًا." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-account" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page" },
  { key: "x", label: "X", placeholder: "https://x.com/your-account" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/your-page" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel" },
] as const;

export function SocialLinksForm({ socialLinks }: { socialLinks: SocialPreferences }) {
  const [state, action, pending] = useActionState(saveSocialLinksAction, initialState);

  useEffect(() => {
    if (state.success) window.dispatchEvent(new Event("site-preferences-updated"));
  }, [state.success]);

  return (
    <form action={action} className="site-settings-form">
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      {state.success && <p className="admin-success" role="status">{state.success}</p>}

      <section className="admin-panel-card site-settings-card">
        <div className="admin-card-heading">
          <div><h2>حسابات التواصل</h2><p>تظهر أيقونات المنصات في التذييل، وتصبح قابلة للنقر بعد إضافة رابط الحساب هنا.</p></div>
        </div>
        <div className="social-settings-grid">
          {socialFields.map((social) => {
            return (
              <label className="site-settings-field social-settings-field" key={social.key} htmlFor={`social-${social.key}`}>
                <span className="social-settings-label"><SocialBrandIcon platform={social.key} size={17} />{social.label}</span>
                <input
                  id={`social-${social.key}`}
                  name={`social.${social.key}`}
                  type={social.key === "whatsapp" ? "tel" : "url"}
                  dir="ltr"
                  defaultValue={socialLinks[social.key]}
                  placeholder={social.placeholder}
                  maxLength={500}
                />
                {"hint" in social && <small>{social.hint}</small>}
              </label>
            );
          })}
        </div>
      </section>

      <div className="site-settings-submit">
        <p>تُحفظ هذه الروابط بشكل مستقل عن إعدادات الموقع والإعلانات.</p>
        <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
          {pending ? "جارٍ حفظ الروابط..." : "حفظ روابط التواصل"}
        </button>
      </div>
    </form>
  );
}
