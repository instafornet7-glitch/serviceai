insert into public.site_preferences (key, value)
values (
  'branding',
  '{
    "siteName": "ServiceAI",
    "logoMark": "S",
    "primaryColor": "#3978e6",
    "accentColor": "#29a984",
    "heroEyebrow": "مستقبلك المهني يبدأ هنا",
    "heroTitle": "فرصتك القادمة",
    "heroHighlight": "تبدأ بخطوة أذكى.",
    "heroDescription": "كل ما تحتاجه لتتقدم بثقة في رحلتك المهنية. أدوات ومصادر تساعدك على إبراز أفضل ما لديك والوصول إلى الفرصة التي تستحقها.",
    "heroPrimaryButton": "اكتشف أدواتك",
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
set value = public.site_preferences.value || excluded.value;
