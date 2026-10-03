export type ResumeCheck = {
  title: string;
  good: boolean;
  detail: string;
};

export type ResumeAnalysis = {
  score: number;
  rating: string;
  checks: ResumeCheck[];
  strengths: string[];
  improvements: string[];
  keywordScore: number | null;
  matchedKeywords: string[];
  missingKeywords: string[];
  wordCount: number;
};

const STOP_WORDS = new Set([
  "about", "after", "also", "and", "are", "for", "from", "have", "into",
  "more", "our", "that", "the", "their", "this", "with", "will", "your",
  "we", "need", "skills", "skill", "required", "requirements", "candidate",
  "position", "job", "role", "work", "ability", "strong", "excellent", "you",
  "من", "في", "على", "إلى", "عن", "مع", "هذا", "هذه", "التي", "الذي",
  "لدى", "لدي", "ضمن", "كما", "أو", "وهو", "وهي", "مطلوب", "مهارات",
  "خبرة", "القدرة", "المتقدم", "الوظيفة", "العمل",
]);

const COMMON_SKILLS = [
  "seo", "google ads", "google analytics", "excel", "microsoft office",
  "project management", "communication", "leadership", "python", "javascript",
  "sql", "data analysis", "marketing", "sales", "design", "photoshop",
  "digital marketing", "software engineer", "graphic design", "content marketing",
  "customer service", "conversion optimization", "paid media", "إدارة المشاريع",
  "تحليل البيانات", "التسويق الرقمي", "التسويق", "التواصل", "القيادة",
  "إكسل", "البرمجة", "التصميم",
];
const WORD_PATTERN = /[a-z][a-z0-9+#]*(?:[.-][a-z0-9+#]+)*|[\u0600-\u06ff]{3,}/g;

function extractKeywords(text: string): string[] {
  const normalized = text.toLocaleLowerCase();
  const phrases = COMMON_SKILLS
    .filter((phrase) => {
      const pattern = phrase.match(/^[a-z]/i)
        ? new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}\\b`, "i")
        : null;
      return pattern ? pattern.test(normalized) : normalized.includes(phrase);
    })
    .filter((phrase, index, found) => !found.some((other, otherIndex) => otherIndex !== index && other.length > phrase.length && other.includes(phrase)));
  const coveredTokens = new Set(phrases.flatMap((phrase) => phrase.match(WORD_PATTERN) ?? []));
  const tokens = normalized.match(WORD_PATTERN) ?? [];
  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (!STOP_WORDS.has(token) && !coveredTokens.has(token) && !/^\d+$/.test(token)) counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...phrases, ...[...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word]) => word)
  ].slice(0, 60);
}

function ratingFor(score: number): string {
  if (score >= 90) return "ممتاز";
  if (score >= 75) return "جيد جدًا";
  if (score >= 60) return "يحتاج إلى تحسين";
  return "يحتاج إلى تحسين كبير";
}

export function analyzeResume(text: string, jobDescription: string): ResumeAnalysis {
  const normalized = text.toLocaleLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const hasPhone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);
  const hasLocation = /(?:location|address|city|المدينة|الموقع|العنوان)/i.test(text);
  const hasSummaryHeading = /(?:professional\s+summary|summary|profile|نبذة|ملخص|الملف\s+الشخصي)/i.test(text);
  const summaryMatch = text.match(/(?:professional\s+summary|summary|profile|نبذة(?:\s+مهنية)?|ملخص(?:\s+مهني)?|الملف\s+الشخصي)\s*[:：-]?\s*([\s\S]*?)(?=\n\s*(?:professional\s+experience|experience|employment|work\s+history|education|skills|الخبرات|الخبرة|التعليم|المهارات)(?:\s|[:：-]|$)|$)/i);
  const summaryWordCount = summaryMatch?.[1].trim().split(/\s+/).filter(Boolean).length ?? 0;
  const experienceHeading = /(?:experience|employment|work\s+history|الخبرات|الخبرة|العمل\s+السابق)/i.test(text);
  const educationHeading = /(?:education|academic|التعليم|المؤهل|الدراسة)/i.test(text);
  const skillsHeading = /(?:skills|competencies|المهارات|الكفاءات)/i.test(text);
  const hasDates = /\b(?:19|20)\d{2}\b/.test(text);
  const hasBullets = /(?:^|\n)\s*(?:[•●▪◦*-]|\d+[.)])\s+/m.test(text);
  const hasMetrics = /(?:\b\d+(?:[.,]\d+)?\s*%|\b(?:increased|reduced|improved|delivered|managed|achieved|generated|grew|saved|حققت|زادت|خفضت|حسنت|أدرت|أنجزت)\b[^.\n]{0,80}\d+|\b\d+(?:[.,]\d+)?\s*(?:users|clients|customers|projects|campaigns|revenue|sales|hours|teams|المستخدمين|العملاء|مشروعًا|حملة|حملات|ريال|دولار)\b)/i.test(text);
  const skillHits = COMMON_SKILLS.filter((skill) => normalized.includes(skill.toLocaleLowerCase()));

  const checks: ResumeCheck[] = [
    { title: "المعلومات الشخصية", good: hasEmail && hasPhone, detail: hasEmail && hasPhone ? "يظهر بريد إلكتروني ورقم هاتف يمكن لأصحاب العمل استخدامهما للتواصل." : `أضف بريدًا إلكترونيًا ورقم هاتف واضحين.${hasLocation ? "" : " ويُستحسن إضافة المدينة أيضًا."}` },
    { title: "Professional Summary", good: hasSummaryHeading && summaryWordCount >= 20 && summaryWordCount <= 120, detail: hasSummaryHeading && summaryWordCount >= 20 && summaryWordCount <= 120 ? "عُثر على نبذة مهنية بطول مناسب مبدئيًا." : "أضف قسمًا بعنوان واضح ونبذة موجزة مخصصة للوظيفة المستهدفة، في حدود 3–5 أسطر." },
    { title: "الخبرات المهنية", good: experienceHeading && hasDates, detail: experienceHeading && hasDates ? "عُثر على قسم خبرات وتواريخ تساعد على توضيح التسلسل المهني." : "استخدم عنوانًا واضحًا للخبرات وأضف أسماء المناصب والشركات والتواريخ." },
    { title: "التعليم", good: educationHeading, detail: educationHeading ? "عُثر على قسم مخصص للتعليم أو المؤهلات." : "أضف قسم التعليم مع الشهادة والمؤسسة وسنة التخرج." },
    { title: "المهارات", good: skillsHeading && skillHits.length >= 3, detail: skillsHeading && skillHits.length >= 3 ? "يظهر قسم مهارات يحتوي على مصطلحات مهنية معروفة." : "أضف قسم مهارات واضحًا واختر المهارات المرتبطة بالوظيفة." },
    { title: "الكلمات المفتاحية", good: jobDescription.trim().length > 0 ? false : skillHits.length >= 3, detail: jobDescription.trim().length > 0 ? "قارن الكلمات أدناه بوصف الوظيفة، وأضف ما ينطبق على خبرتك فقط." : "أضف وصف الوظيفة للحصول على مقارنة مخصصة للكلمات المفتاحية." },
    { title: "التنسيق", good: lines.length >= 5 && hasBullets, detail: lines.length >= 5 && hasBullets ? "النص يتضمن أسطرًا ونقاطًا تسهّل على الأنظمة قراءة المعلومات." : "استخدم عناوين أقسام مألوفة ونقاطًا نصية بسيطة. لا يستطيع هذا الفحص رؤية تخطيط الملف أو الصور." },
    { title: "طول السيرة الذاتية", good: wordCount >= 180 && wordCount <= 1200, detail: wordCount < 180 ? "المحتوى المستخرج قصير؛ أضف تفاصيل ذات صلة دون حشو." : wordCount > 1200 ? "النص طويل؛ اختصر المعلومات غير المرتبطة بالوظيفة." : `الطول مناسب مبدئيًا (${wordCount} كلمة مستخرجة).` },
    { title: "وضوح المحتوى", good: hasBullets && hasMetrics, detail: hasBullets && hasMetrics ? "توجد نقاط تعداد وإشارات إلى نتائج أو أرقام." : "استخدم نقاطًا قصيرة، واذكر نتائج أو أرقامًا حقيقية كلما أمكن." },
  ];

  const weights = [12, 12, 14, 9, 11, 12, 10, 10, 10];
  const score = Math.round(checks.reduce((total, check, index) => total + (check.good ? weights[index] : weights[index] * 0.4), 0));
  const strengths = checks.filter((check) => check.good).map((check) => check.detail);
  const improvements = checks.filter((check) => !check.good).map((check) => check.detail);
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordScore: number | null = null;

  if (jobDescription.trim()) {
    const resumeWords = new Set(extractKeywords(text));
    const jobWords = extractKeywords(jobDescription).slice(0, 15);
    matchedKeywords = jobWords.filter((keyword) => resumeWords.has(keyword));
    missingKeywords = jobWords.filter((keyword) => !resumeWords.has(keyword));
    keywordScore = jobWords.length ? Math.round((matchedKeywords.length / jobWords.length) * 100) : 0;
  }

  if (!hasMetrics) improvements.unshift("أضف أرقامًا ونتائج قابلة للقياس إلى خبراتك، مع الالتزام بما حققته فعلًا.");
  if (hasSummaryHeading && wordCount <= 80) improvements.push("وسّع النبذة المهنية لتلخص تخصصك وخبرتك وأبرز نقاط قوتك في 3–5 أسطر.");
  if (missingKeywords.length) improvements.unshift(`راجع إضافة الكلمات ${missingKeywords.slice(0, 4).join("، ")} إذا كانت تعكس خبرتك الحقيقية.`);

  return {
    score,
    rating: ratingFor(score),
    checks,
    strengths: strengths.length ? strengths : ["لم تظهر نقاط مكتملة وفق المؤشرات الحالية؛ أكمل الأقسام الأساسية ثم أعد التحليل."],
    improvements: [...new Set(improvements)],
    keywordScore,
    matchedKeywords,
    missingKeywords,
    wordCount,
  };
}

export async function extractResumeText(file: File): Promise<string> {
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("حجم الملف أكبر من الحد المسموح (12 ميغابايت). اختر ملفًا أصغر.");
  }

  const extension = file.name.split(".").pop()?.toLocaleLowerCase();
  if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const text = result.value.trim();
    if (!text) throw new Error("لم نعثر على نص قابل للقراءة في ملف DOCX. تحقق من الملف وحاول مجددًا.");
    return text;
  }

  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
    const loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
    try {
      const document = await loadingTask.promise;
      if (document.numPages > 40) throw new Error("الملف يتجاوز 40 صفحة. اختر نسخة أقصر لتحليلها.");
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
      }
      const text = pages.join("\n").trim();
      if (!text) throw new Error("لم نعثر على نص داخل ملف PDF. قد يكون الملف ممسوحًا ضوئيًا كصورة؛ جرّب نسخة نصية أو DOCX.");
      return text;
    } finally {
      await loadingTask.destroy();
    }
  }

  throw new Error("صيغة الملف غير مدعومة. اختر ملف PDF أو DOCX.");
}
