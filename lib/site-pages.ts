export type ManagedPage = {
  path: string;
  label: string;
  title: string;
  contentHtml: string;
};

export const MANAGEABLE_SITE_PAGES: ManagedPage[] = [
  { path: "/", label: "الرئيسية", title: "خطوتك الذكية نحو وظيفة أحلامك", contentHtml: "<p>أدوات ومصادر مهنية تساعد الباحثين عن عمل على التقدم بثقة.</p>" },
  { path: "/tools", label: "الأدوات", title: "الأدوات المهنية", contentHtml: "<p>استخدم أدوات ServiceAI لإنشاء وتحليل سيرتك الذاتية والاستعداد للتقديم والمقابلات.</p>" },
  { path: "/blog", label: "المدونة", title: "المدونة المهنية", contentHtml: "<p>مقالات ونصائح مهنية عملية حول السيرة الذاتية ومقابلات العمل وتطوير المسار المهني.</p>" },
  { path: "/contact", label: "تواصل معنا", title: "تواصل معنا", contentHtml: "<p>تواصل مع فريق ServiceAI للاستفسارات والملاحظات والاقتراحات.</p>" },
  { path: "/about", label: "من نحن", title: "من نحن", contentHtml: "<p>تعرّف على ServiceAI ورسالتنا في تمكين الباحثين عن عمل بأدوات ومصادر مهنية واضحة.</p>" },
  { path: "/privacy", label: "سياسة الخصوصية", title: "سياسة الخصوصية", contentHtml: "<p>سياسة خصوصية ServiceAI ومعلومات التعامل مع بيانات زوار الموقع.</p>" },
  { path: "/terms", label: "شروط الاستخدام", title: "شروط الاستخدام", contentHtml: "<p>الشروط الأساسية لاستخدام موقع ServiceAI ومحتواه المهني.</p>" },
  { path: "/tools/resume-builder", label: "منشئ السيرة الذاتية", title: "منشئ السيرة الذاتية", contentHtml: "<p>أنشئ سيرة ذاتية احترافية تناسب خبراتك ومهاراتك.</p>" },
  { path: "/tools/resume-analyzer", label: "محلل السيرة الذاتية", title: "محلل السيرة الذاتية وATS", contentHtml: "<p>حلل سيرتك الذاتية وقارنها بمتطلبات الوظيفة.</p>" },
  { path: "/tools/interview-questions", label: "أسئلة المقابلات", title: "الاستعداد للمقابلات", contentHtml: "<p>استعد لمقابلة العمل بأسئلة تدريبية وإرشادات عملية.</p>" },
  { path: "/tools/cover-letter-generator", label: "رسائل التقديم", title: "خطاب التقديم", contentHtml: "<p>اكتب رسالة تقديم احترافية تناسب الوظيفة التي تتقدم إليها.</p>" },
  { path: "/tools/ats-keywords", label: "كلمات ATS", title: "مولد كلمات ATS", contentHtml: "<p>استخرج الكلمات المفتاحية المهمة من إعلان الوظيفة.</p>" },
];
