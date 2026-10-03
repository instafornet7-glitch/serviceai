"use client";

import Link from "next/link";
import { useSitePreferences } from "@/components/site-preferences-provider";
import { FooterSocialLinks } from "@/components/footer-social-links";

function FooterHref({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return null;
  if (href.startsWith("/") && !href.startsWith("//")) return <Link href={href}>{children}</Link>;
  if (/^#[A-Za-z0-9_-]+$/.test(href)) return <a href={href}>{children}</a>;
  if (/^https:\/\//i.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
  return null;
}

export function SiteFooterContent() {
  const { preferences } = useSitePreferences();
  const brand = preferences.branding;
  const exploreLinks: { label: string; href: string }[] = [
    { label: brand.footerExploreToolsLabel, href: brand.footerExploreToolsHref },
    { label: brand.footerExploreBlogLabel, href: brand.footerExploreBlogHref },
    { label: brand.footerExploreAboutLabel, href: brand.footerExploreAboutHref },
  ];
  const infoLinks: { label: string; href: string }[] = [
    { label: brand.footerInfoContactLabel, href: brand.footerInfoContactHref },
    { label: brand.footerPrivacyLabel, href: brand.footerPrivacyHref },
    { label: brand.footerTermsLabel, href: brand.footerTermsHref },
  ];

  return (
    <>
      <div className="footer-brand-col">
        <SiteBrand className="brand brand-footer" />
        <p>{brand.footerDescription}</p>
        <FooterHref href={brand.footerContactHref}>
          <span className="footer-email">{brand.footerContactLabel} <span aria-hidden="true">↗</span></span>
        </FooterHref>
        <FooterSocialLinks />
      </div>
      <div className="footer-column">
        <h2>{brand.footerExploreHeading}</h2>
        {exploreLinks.map((item) => <FooterHref href={item.href} key={item.label}>{item.label}</FooterHref>)}
      </div>
      <div className="footer-column">
        <h2>{brand.footerInfoHeading}</h2>
        {infoLinks.map((item) => <FooterHref href={item.href} key={item.label}>{item.label}</FooterHref>)}
      </div>
      <div className="footer-note">
        <span className="footer-note-icon">✦</span>
        <h2>{brand.footerCallout}</h2>
        <FooterHref href={brand.footerCalloutLinkHref}>{brand.footerCalloutLinkLabel} <span aria-hidden="true">←</span></FooterHref>
      </div>
    </>
  );
}

export function SiteFooterBottom() {
  const { preferences } = useSitePreferences();
  const brand = preferences.branding;
  return (
    <>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {brand.siteName}. {brand.footerCopyright}</span>
        <span className="footer-made">{brand.footerMadeWith} <span aria-hidden="true">♥</span></span>
        <FooterHref href={brand.footerBackToTopHref}>{brand.footerBackToTopLabel}</FooterHref>
      </div>
    </>
  );
}

export function SiteBrand({ className = "brand" }: { className?: string }) {
  const { preferences } = useSitePreferences();
  return (
    <Link className={className} href="/" aria-label={`${preferences.branding.siteName}، الصفحة الرئيسية`}>
      <span className="brand-mark" aria-hidden="true">{preferences.branding.logoMark}</span>
      <span>{preferences.branding.siteName}</span>
    </Link>
  );
}

export function SiteNameText() {
  const { preferences } = useSitePreferences();
  return <>{preferences.branding.siteName}</>;
}

export function HomeHeroCopy() {
  const { preferences } = useSitePreferences();
  const brand = preferences.branding;
  return (
    <>
      <span className="eyebrow"><span className="eyebrow-dot" />{brand.heroEyebrow}</span>
      <h1>{brand.heroTitle}<br /><span className="text-gradient">{brand.heroHighlight}</span></h1>
      <p className="hero-description">{brand.heroDescription}</p>
      <div className="hero-actions">
        <Link className="button" href="/tools">{brand.heroPrimaryButton} <span aria-hidden="true">←</span></Link>
        <Link className="text-link" href="#why-serviceai">اكتشف كيف نساعدك <span aria-hidden="true">↓</span></Link>
      </div>
      <div className="hero-proof"><div className="avatar-stack" aria-hidden="true"><span>م</span><span>س</span><span>ن</span><span>+</span></div><p><strong>رحلتك المهنية،</strong> تبدأ بقرار واحد</p></div>
    </>
  );
}
