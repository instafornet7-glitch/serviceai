insert into public.site_preferences (key, value)
values (
  'branding',
  '{
    "footerDescription": "رفيقك الذكي في رحلة البحث عن عمل. نساعدك على التقدم بثقة، خطوة بخطوة.",
    "footerContactLabel": "يسعدنا التواصل معك",
    "footerContactHref": "/contact",
    "footerExploreHeading": "استكشف",
    "footerExploreToolsLabel": "الأدوات",
    "footerExploreToolsHref": "/tools",
    "footerExploreBlogLabel": "المدونة",
    "footerExploreBlogHref": "/blog",
    "footerExploreAboutLabel": "من نحن",
    "footerExploreAboutHref": "/about",
    "footerInfoHeading": "معلومات",
    "footerInfoContactLabel": "تواصل معنا",
    "footerInfoContactHref": "/contact",
    "footerPrivacyLabel": "سياسة الخصوصية",
    "footerPrivacyHref": "/privacy",
    "footerTermsLabel": "شروط الاستخدام",
    "footerTermsHref": "/terms",
    "footerCallout": "خطوتك القادمة تبدأ من هنا.",
    "footerCalloutLinkLabel": "اكتشف ServiceAI",
    "footerCalloutLinkHref": "/tools",
    "footerCopyright": "جميع الحقوق محفوظة.",
    "footerMadeWith": "صُنع بعناية لدعم رحلتك المهنية",
    "footerBackToTopLabel": "العودة للأعلى ↑",
    "footerBackToTopHref": "#main"
  }'::jsonb
)
on conflict (key) do update
set value = excluded.value || public.site_preferences.value;
