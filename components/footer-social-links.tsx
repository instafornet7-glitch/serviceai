"use client";

import { useSitePreferences } from "@/components/site-preferences-provider";
import { SocialBrandIcon } from "@/components/social-brand-icon";
import type { SocialPreferences } from "@/lib/site-preferences";

export function FooterSocialLinks() {
  const { preferences } = useSitePreferences();
  const { socialLinks } = preferences;
  const links = [
    {
      label: "WhatsApp",
      href: socialLinks.whatsapp.replace(/\D/g, "")
        ? `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}`
        : "",
      platform: "whatsapp",
    },
    { label: "Instagram", href: socialLinks.instagram, platform: "instagram" },
    { label: "Facebook", href: socialLinks.facebook, platform: "facebook" },
    { label: "X", href: socialLinks.x, platform: "x" },
    { label: "LinkedIn", href: socialLinks.linkedin, platform: "linkedin" },
    { label: "YouTube", href: socialLinks.youtube, platform: "youtube" },
  ] satisfies { label: string; href: string; platform: keyof SocialPreferences }[];

  return (
    <nav className="footer-social-links" aria-label="حسابات ServiceAI على مواقع التواصل">
      {links.map((item) => {
        const isConfigured = /^https:\/\//i.test(item.href);
        const content = <SocialBrandIcon platform={item.platform} size={17} />;

        return isConfigured
          ? <a href={item.href} key={item.label} target="_blank" rel="noopener noreferrer" aria-label={item.label} title={item.label}>{content}</a>
          : <span className="footer-social-link-unconfigured" key={item.label} aria-label={`${item.label} — أضف الرابط من لوحة التحكم`} title={`${item.label} — أضف الرابط من لوحة التحكم`}>{content}</span>;
      })}
    </nav>
  );
}
