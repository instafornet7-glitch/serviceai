export const AD_PLACEMENTS = [
  { id: "resume-builder-guide", label: "منشئ السيرة الذاتية · بين الأداة والدليل", description: "أسفل محرر السيرة الذاتية وقبل المحتوى الإرشادي." },
  { id: "resume-builder-bottom", label: "منشئ السيرة الذاتية · أسفل الصفحة", description: "بعد المحتوى التعليمي في صفحة منشئ السيرة الذاتية." },
  { id: "resume-analyzer-intro", label: "محلل السيرة الذاتية · بعد المقدمة", description: "بين مقدمة الأداة ونموذج التحليل." },
  { id: "resume-analyzer-results", label: "محلل السيرة الذاتية · بعد الأداة", description: "بعد أداة التحليل وقبل الدليل التعليمي." },
  { id: "resume-analyzer-inline", label: "محلل السيرة الذاتية · داخل الدليل", description: "ضمن المحتوى الإرشادي وقبل الأسئلة الشائعة." },
  { id: "resume-analyzer-bottom", label: "محلل السيرة الذاتية · أسفل الصفحة", description: "بعد المحتوى التعليمي في صفحة محلل السيرة الذاتية." },
  { id: "ats-keywords-intro", label: "كلمات ATS · بعد المقدمة", description: "بين مقدمة الأداة ونموذج تحليل الإعلان." },
  { id: "ats-keywords-results", label: "كلمات ATS · بعد التحليل", description: "بعد النموذج وقبل الدليل التعليمي." },
  { id: "ats-keywords-inline", label: "كلمات ATS · داخل الدليل", description: "ضمن المحتوى الإرشادي وقبل الأسئلة الشائعة." },
  { id: "ats-keywords-bottom", label: "كلمات ATS · أسفل الصفحة", description: "بعد المحتوى التعليمي في صفحة كلمات ATS." },
  { id: "cover-letter-intro", label: "رسالة التقديم · بعد المقدمة", description: "بين مقدمة الأداة ونموذج كتابة الرسالة." },
  { id: "cover-letter-results", label: "رسالة التقديم · بعد الأداة", description: "بعد النموذج وقبل الدليل التعليمي." },
  { id: "cover-letter-inline", label: "رسالة التقديم · داخل الدليل", description: "ضمن المحتوى الإرشادي وقبل الأسئلة الشائعة." },
  { id: "cover-letter-bottom", label: "رسالة التقديم · أسفل الصفحة", description: "بعد المحتوى التعليمي في صفحة رسالة التقديم." },
  { id: "interview-questions-intro", label: "أسئلة المقابلة · بعد المقدمة", description: "بين مقدمة الأداة ونموذج الأسئلة." },
  { id: "interview-questions-results", label: "أسئلة المقابلة · بعد الأداة", description: "بعد نموذج المقابلة وقبل الدليل التعليمي." },
  { id: "interview-questions-inline", label: "أسئلة المقابلة · داخل الدليل", description: "ضمن المحتوى الإرشادي وقبل الأسئلة الشائعة." },
  { id: "interview-questions-bottom", label: "أسئلة المقابلة · أسفل الصفحة", description: "بعد المحتوى التعليمي في صفحة المقابلات." },
  { id: "blog-article", label: "المقالات · داخل صفحة المقال", description: "بعد محتوى المقال وقبل المقالات ذات الصلة." },
] as const;

export type AdPlacementId = (typeof AD_PLACEMENTS)[number]["id"];
export type AdSlotPreference = { enabled: boolean; slotId: string };
export type SocialPreferences = {
  whatsapp: string;
  instagram: string;
  facebook: string;
  x: string;
  linkedin: string;
  youtube: string;
};

export type SiteBranding = {
  siteName: string;
  logoMark: string;
  contactEmail: string;
  primaryColor: string;
  accentColor: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryButton: string;
  footerDescription: string;
  footerContactLabel: string;
  footerContactHref: string;
  footerExploreHeading: string;
  footerExploreToolsLabel: string;
  footerExploreToolsHref: string;
  footerExploreBlogLabel: string;
  footerExploreBlogHref: string;
  footerExploreAboutLabel: string;
  footerExploreAboutHref: string;
  footerInfoHeading: string;
  footerInfoContactLabel: string;
  footerInfoContactHref: string;
  footerPrivacyLabel: string;
  footerPrivacyHref: string;
  footerTermsLabel: string;
  footerTermsHref: string;
  footerCallout: string;
  footerCalloutLinkLabel: string;
  footerCalloutLinkHref: string;
  footerCopyright: string;
  footerMadeWith: string;
  footerBackToTopLabel: string;
  footerBackToTopHref: string;
};

export type HomeSliderSlide = {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  href: string;
};

export type SitePreferences = {
  adsenseClient: string;
  adSlots: Record<AdPlacementId, AdSlotPreference>;
  socialLinks: SocialPreferences;
  branding: SiteBranding;
  homeSlider: HomeSliderSlide[];
};

export const DEFAULT_SITE_BRANDING: SiteBranding = {
  siteName: "ServiceAI",
  logoMark: "S",
  contactEmail: "serviceai.102026@gmail.com",
  primaryColor: "#3978e6",
  accentColor: "#29a984",
  heroEyebrow: "مستقبلك المهني يبدأ هنا",
  heroTitle: "فرصتك القادمة",
  heroHighlight: "تبدأ بخطوة أذكى.",
  heroDescription: "كل ما تحتاجه لتتقدم بثقة في رحلتك المهنية. أدوات ومصادر تساعدك على إبراز أفضل ما لديك والوصول إلى الفرصة التي تستحقها.",
  heroPrimaryButton: "اكتشف أدواتك",
  footerDescription: "رفيقك الذكي في رحلة البحث عن عمل. نساعدك على التقدم بثقة، خطوة بخطوة.",
  footerContactLabel: "يسعدنا التواصل معك",
  footerContactHref: "/contact",
  footerExploreHeading: "استكشف",
  footerExploreToolsLabel: "الأدوات",
  footerExploreToolsHref: "/tools",
  footerExploreBlogLabel: "المدونة",
  footerExploreBlogHref: "/blog",
  footerExploreAboutLabel: "من نحن",
  footerExploreAboutHref: "/about",
  footerInfoHeading: "معلومات",
  footerInfoContactLabel: "تواصل معنا",
  footerInfoContactHref: "/contact",
  footerPrivacyLabel: "سياسة الخصوصية",
  footerPrivacyHref: "/privacy",
  footerTermsLabel: "شروط الاستخدام",
  footerTermsHref: "/terms",
  footerCallout: "خطوتك القادمة تبدأ من هنا.",
  footerCalloutLinkLabel: "اكتشف ServiceAI",
  footerCalloutLinkHref: "/tools",
  footerCopyright: "جميع الحقوق محفوظة.",
  footerMadeWith: "صُنع بعناية لدعم رحلتك المهنية",
  footerBackToTopLabel: "العودة للأعلى ↑",
  footerBackToTopHref: "#main",
};

export const DEFAULT_HOME_SLIDES: HomeSliderSlide[] = [
  {
    id: "serviceai-career-slide",
    imageUrl: "/images/slider-career.svg",
    alt: "شخص يخطط لخطوته المهنية القادمة",
    caption: "خطوتك المهنية القادمة تبدأ بخطة واضحة.",
    href: "/tools/career-guidance",
  },
  {
    id: "serviceai-resume-slide",
    imageUrl: "/images/slider-resume.svg",
    alt: "سيرة ذاتية احترافية جاهزة للتطوير",
    caption: "قدّم خبراتك بثقة مع أدوات السيرة الذاتية.",
    href: "/tools/resume-builder",
  },
  {
    id: "serviceai-interview-slide",
    imageUrl: "/images/slider-interview.svg",
    alt: "الاستعداد لمقابلة عمل بثقة",
    caption: "استعد لمقابلتك القادمة بخطوات عملية.",
    href: "/tools/interview-questions",
  },
];

export function createDefaultSitePreferences(): SitePreferences {
  return {
    adsenseClient: "",
    adSlots: Object.fromEntries(AD_PLACEMENTS.map(({ id }) => [id, { enabled: false, slotId: "" }])) as Record<AdPlacementId, AdSlotPreference>,
    socialLinks: { whatsapp: "", instagram: "", facebook: "", x: "", linkedin: "", youtube: "" },
    branding: { ...DEFAULT_SITE_BRANDING },
    homeSlider: DEFAULT_HOME_SLIDES.map((slide) => ({ ...slide })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseSitePreferences(row: Record<string, unknown>): SitePreferences {
  const defaults = createDefaultSitePreferences();
  const branding = isRecord(row.branding) ? row.branding : {};
  const slider = isRecord(row.home_slider) ? row.home_slider : {};
  const adsense = isRecord(row.adsense) ? row.adsense : {};
  const contact = isRecord(row.contact) ? row.contact : {};
  const social = isRecord(row.social) ? row.social : {};
  const adSlotsValue = row.ad_slots ?? adsense.slots ?? adsense.ad_slots;
  const socialLinksValue = row.social_links ?? social.links ?? social;
  const adSlots = isRecord(adSlotsValue) ? adSlotsValue : {};
  const socialLinks = isRecord(socialLinksValue) ? socialLinksValue : {};

  const parsedSlots = Object.fromEntries(AD_PLACEMENTS.map(({ id }) => {
    const slot = isRecord(adSlots[id]) ? adSlots[id] : {};
    return [id, {
      enabled: slot.enabled === true,
      slotId: typeof slot.slotId === "string" ? slot.slotId : "",
    }];
  })) as Record<AdPlacementId, AdSlotPreference>;

  const parsedSocials = Object.fromEntries(Object.keys(defaults.socialLinks).map((key) => [
    key,
    typeof (key === "whatsapp" ? contact.whatsapp ?? socialLinks[key] : socialLinks[key]) === "string"
      ? (key === "whatsapp" ? contact.whatsapp ?? socialLinks[key] : socialLinks[key])
      : "",
  ])) as SocialPreferences;
  const brandingValue = (key: keyof SiteBranding) => {
    const value = branding[key];
    return typeof value === "string" ? value : DEFAULT_SITE_BRANDING[key];
  };
  const savedSlides = Array.isArray(slider.slides)
    ? slider.slides.filter((slide): slide is Record<string, unknown> => isRecord(slide)).flatMap((slide) => {
      if (
        typeof slide.id !== "string"
        || typeof slide.imageUrl !== "string"
        || typeof slide.alt !== "string"
        || typeof slide.caption !== "string"
        || typeof slide.href !== "string"
      ) return [];
      return [{ id: slide.id, imageUrl: slide.imageUrl, alt: slide.alt, caption: slide.caption, href: slide.href }];
    })
    : [];
  const homeSlider = [...savedSlides];
  for (const defaultSlide of DEFAULT_HOME_SLIDES) {
    if (homeSlider.length >= 3) break;
    if (!homeSlider.some((slide) => slide.id === defaultSlide.id)) homeSlider.push({ ...defaultSlide });
  }

  return {
    adsenseClient: typeof row.adsense_client === "string"
      ? row.adsense_client
      : typeof adsense.client === "string"
        ? adsense.client
        : typeof adsense.adsense_client === "string" ? adsense.adsense_client : "",
    adSlots: parsedSlots,
    socialLinks: parsedSocials,
    branding: {
      siteName: brandingValue("siteName"),
      logoMark: brandingValue("logoMark"),
      contactEmail: brandingValue("contactEmail"),
      primaryColor: brandingValue("primaryColor"),
      accentColor: brandingValue("accentColor"),
      heroEyebrow: brandingValue("heroEyebrow"),
      heroTitle: brandingValue("heroTitle"),
      heroHighlight: brandingValue("heroHighlight"),
      heroDescription: brandingValue("heroDescription"),
      heroPrimaryButton: brandingValue("heroPrimaryButton"),
      footerDescription: brandingValue("footerDescription"),
      footerContactLabel: brandingValue("footerContactLabel"),
      footerContactHref: brandingValue("footerContactHref"),
      footerExploreHeading: brandingValue("footerExploreHeading"),
      footerExploreToolsLabel: brandingValue("footerExploreToolsLabel"),
      footerExploreToolsHref: brandingValue("footerExploreToolsHref"),
      footerExploreBlogLabel: brandingValue("footerExploreBlogLabel"),
      footerExploreBlogHref: brandingValue("footerExploreBlogHref"),
      footerExploreAboutLabel: brandingValue("footerExploreAboutLabel"),
      footerExploreAboutHref: brandingValue("footerExploreAboutHref"),
      footerInfoHeading: brandingValue("footerInfoHeading"),
      footerInfoContactLabel: brandingValue("footerInfoContactLabel"),
      footerInfoContactHref: brandingValue("footerInfoContactHref"),
      footerPrivacyLabel: brandingValue("footerPrivacyLabel"),
      footerPrivacyHref: brandingValue("footerPrivacyHref"),
      footerTermsLabel: brandingValue("footerTermsLabel"),
      footerTermsHref: brandingValue("footerTermsHref"),
      footerCallout: brandingValue("footerCallout"),
      footerCalloutLinkLabel: brandingValue("footerCalloutLinkLabel"),
      footerCalloutLinkHref: brandingValue("footerCalloutLinkHref"),
      footerCopyright: brandingValue("footerCopyright"),
      footerMadeWith: brandingValue("footerMadeWith"),
      footerBackToTopLabel: brandingValue("footerBackToTopLabel"),
      footerBackToTopHref: brandingValue("footerBackToTopHref"),
    },
    homeSlider,
  };
}
