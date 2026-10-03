export type AtsKeywordCategory =
  | "technical"
  | "soft"
  | "tools"
  | "certifications"
  | "responsibilities"
  | "experience"
  | "domain";

export type AtsKeywordPriority = "high" | "medium" | "additional";

export type AtsKeyword = {
  term: string;
  category: AtsKeywordCategory;
  priority: AtsKeywordPriority;
  occurrences: number;
  recommendation: string;
};

export type AtsKeywordGroup = {
  id: AtsKeywordCategory;
  title: string;
  keywords: AtsKeyword[];
};

export type JobRequirements = {
  experience: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  tools: string[];
  skills: string[];
};

export type AtsKeywordAnalysis = {
  keywords: AtsKeyword[];
  groups: AtsKeywordGroup[];
  topKeywords: AtsKeyword[];
  summary: string[];
  requirements: JobRequirements;
  match: null | {
    score: number;
    matched: AtsKeyword[];
    missing: AtsKeyword[];
  };
  recommendations: string[];
};

type KeywordDefinition = {
  term: string;
  category: AtsKeywordCategory;
  aliases?: string[];
};

const DEFINITIONS: KeywordDefinition[] = [
  { term: "SEO", category: "technical", aliases: ["search engine optimization", "تحسين محركات البحث"] },
  { term: "PPC", category: "technical", aliases: ["pay per click", "الدفع لكل نقرة"] },
  { term: "Google Ads", category: "tools", aliases: ["google adwords", "إعلانات جوجل"] },
  { term: "Digital Marketing", category: "domain", aliases: ["التسويق الرقمي"] },
  { term: "Google Analytics", category: "tools", aliases: ["google analytics 4", "ga4", "تحليلات جوجل"] },
  { term: "Meta Ads", category: "tools", aliases: ["facebook ads", "إعلانات ميتا", "إعلانات فيسبوك"] },
  { term: "Conversion Optimization", category: "technical", aliases: ["conversion rate optimization", "cro", "تحسين التحويل"] },
  { term: "Email Marketing", category: "technical", aliases: ["التسويق عبر البريد الإلكتروني"] },
  { term: "Content Marketing", category: "technical", aliases: ["التسويق بالمحتوى"] },
  { term: "Social Media Marketing", category: "technical", aliases: ["التسويق عبر وسائل التواصل الاجتماعي"] },
  { term: "Marketing Automation", category: "technical", aliases: ["أتمتة التسويق"] },
  { term: "Campaign Management", category: "responsibilities", aliases: ["إدارة الحملات"] },
  { term: "ROAS", category: "technical", aliases: ["return on ad spend", "العائد على الإنفاق الإعلاني"] },
  { term: "CRM", category: "tools", aliases: ["customer relationship management", "إدارة علاقات العملاء"] },
  { term: "HubSpot", category: "tools" },
  { term: "Salesforce", category: "tools" },
  { term: "Google Search Console", category: "tools" },
  { term: "Looker Studio", category: "tools", aliases: ["data studio"] },
  { term: "A/B Testing", category: "technical", aliases: ["split testing", "اختبار أ/ب"] },
  { term: "Keyword Research", category: "technical", aliases: ["البحث عن الكلمات المفتاحية"] },
  { term: "Lead Generation", category: "technical", aliases: ["توليد العملاء المحتملين"] },
  { term: "JavaScript", category: "technical", aliases: ["javascript"] },
  { term: "TypeScript", category: "technical" },
  { term: "React", category: "technical" },
  { term: "Next.js", category: "technical" },
  { term: "Node.js", category: "technical" },
  { term: "Python", category: "technical" },
  { term: "Java", category: "technical" },
  { term: "C++", category: "technical" },
  { term: "C#", category: "technical" },
  { term: "SQL", category: "technical" },
  { term: "PostgreSQL", category: "tools" },
  { term: "MongoDB", category: "tools" },
  { term: "REST APIs", category: "technical", aliases: ["restful api", "rest api"] },
  { term: "GraphQL", category: "technical" },
  { term: "HTML", category: "technical" },
  { term: "CSS", category: "technical" },
  { term: "Git", category: "tools" },
  { term: "AWS", category: "tools", aliases: ["amazon web services"] },
  { term: "Azure", category: "tools", aliases: ["microsoft azure"] },
  { term: "Docker", category: "tools" },
  { term: "Kubernetes", category: "tools" },
  { term: "CI/CD", category: "technical", aliases: ["continuous integration", "continuous deployment"] },
  { term: "Machine Learning", category: "technical", aliases: ["التعلم الآلي"] },
  { term: "Data Analysis", category: "technical", aliases: ["تحليل البيانات"] },
  { term: "Power BI", category: "tools" },
  { term: "Tableau", category: "tools" },
  { term: "Microsoft Excel", category: "tools", aliases: ["excel", "مايكروسوفت إكسل", "إكسل"] },
  { term: "Microsoft Office", category: "tools", aliases: ["مايكروسوفت أوفيس"] },
  { term: "Project Management", category: "technical", aliases: ["إدارة المشاريع"] },
  { term: "Agile", category: "technical", aliases: ["أجايل"] },
  { term: "Scrum", category: "technical" },
  { term: "Jira", category: "tools" },
  { term: "Figma", category: "tools" },
  { term: "Adobe Photoshop", category: "tools", aliases: ["photoshop", "فوتوشوب"] },
  { term: "Adobe Illustrator", category: "tools", aliases: ["illustrator", "إليستريتور"] },
  { term: "UI/UX Design", category: "technical", aliases: ["user experience", "user interface", "تصميم تجربة المستخدم"] },
  { term: "Graphic Design", category: "technical", aliases: ["التصميم الجرافيكي"] },
  { term: "Financial Reporting", category: "responsibilities", aliases: ["التقارير المالية"] },
  { term: "Financial Analysis", category: "technical", aliases: ["التحليل المالي"] },
  { term: "Accounting", category: "technical", aliases: ["المحاسبة"] },
  { term: "Accounts Payable", category: "technical", aliases: ["الحسابات الدائنة"] },
  { term: "Accounts Receivable", category: "technical", aliases: ["الحسابات المدينة"] },
  { term: "Budgeting", category: "responsibilities", aliases: ["إعداد الميزانية"] },
  { term: "Forecasting", category: "technical", aliases: ["التنبؤ المالي"] },
  { term: "Auditing", category: "technical", aliases: ["التدقيق"] },
  { term: "Customer Service", category: "technical", aliases: ["خدمة العملاء"] },
  { term: "Sales", category: "domain", aliases: ["المبيعات"] },
  { term: "Recruitment", category: "responsibilities", aliases: ["التوظيف"] },
  { term: "Human Resources", category: "domain", aliases: ["موارد بشرية", "الموارد البشرية"] },
  { term: "Supply Chain", category: "domain", aliases: ["سلسلة الإمداد"] },
  { term: "Quality Assurance", category: "technical", aliases: ["qa", "ضمان الجودة"] },
  { term: "Cybersecurity", category: "technical", aliases: ["الأمن السيبراني", "أمن المعلومات"] },
  { term: "Risk Management", category: "technical", aliases: ["إدارة المخاطر"] },
  { term: "Compliance", category: "technical", aliases: ["الامتثال"] },
  { term: "Communication", category: "soft", aliases: ["التواصل", "مهارات التواصل"] },
  { term: "Leadership", category: "soft", aliases: ["القيادة", "مهارات القيادة"] },
  { term: "Problem Solving", category: "soft", aliases: ["حل المشكلات", "حل المشكلات"] },
  { term: "Teamwork", category: "soft", aliases: ["العمل الجماعي", "العمل ضمن فريق"] },
  { term: "Collaboration", category: "soft", aliases: ["التعاون"] },
  { term: "Critical Thinking", category: "soft", aliases: ["التفكير النقدي"] },
  { term: "Time Management", category: "soft", aliases: ["إدارة الوقت"] },
  { term: "Attention to Detail", category: "soft", aliases: ["الاهتمام بالتفاصيل", "دقة الملاحظة"] },
  { term: "Adaptability", category: "soft", aliases: ["المرونة", "القدرة على التكيف"] },
  { term: "Analytical Skills", category: "soft", aliases: ["مهارات تحليلية"] },
  { term: "Negotiation", category: "soft", aliases: ["التفاوض"] },
  { term: "Presentation Skills", category: "soft", aliases: ["مهارات العرض والتقديم"] },
  { term: "Customer Focus", category: "soft", aliases: ["التركيز على العميل"] },
  { term: "CPA", category: "certifications", aliases: ["certified public accountant"] },
  { term: "CFA", category: "certifications", aliases: ["chartered financial analyst"] },
  { term: "PMP", category: "certifications", aliases: ["project management professional"] },
  { term: "CIPD", category: "certifications" },
  { term: "SHRM", category: "certifications" },
  { term: "CISSP", category: "certifications" },
  { term: "AWS Certified", category: "certifications" },
  { term: "Google Ads Certification", category: "certifications" },
  { term: "Bachelor's Degree", category: "domain", aliases: ["bachelor degree", "bachelor's", "درجة البكالوريوس", "بكالوريوس"] },
  { term: "Master's Degree", category: "domain", aliases: ["master degree", "master's", "درجة الماجستير", "ماجستير"] },
  { term: "PhD", category: "domain", aliases: ["doctorate", "دكتوراه"] },
  { term: "English", category: "domain", aliases: ["اللغة الإنجليزية", "الإنجليزية"] },
  { term: "Arabic", category: "domain", aliases: ["اللغة العربية", "العربية"] },
  { term: "French", category: "domain", aliases: ["اللغة الفرنسية", "الفرنسية"] },
  { term: "Spanish", category: "domain", aliases: ["اللغة الإسبانية", "الإسبانية"] },
  { term: "German", category: "domain", aliases: ["اللغة الألمانية", "الألمانية"] },
  { term: "Manage Projects", category: "responsibilities", aliases: ["project delivery", "إدارة المشاريع"] },
  { term: "Develop Strategies", category: "responsibilities", aliases: ["develop strategy", "تطوير الاستراتيجيات"] },
  { term: "Analyze Data", category: "responsibilities", aliases: ["data analysis", "تحليل البيانات"] },
  { term: "Prepare Reports", category: "responsibilities", aliases: ["reporting", "إعداد التقارير"] },
  { term: "Support Customers", category: "responsibilities", aliases: ["customer support", "دعم العملاء"] },
];

const CATEGORY_TITLES: Record<AtsKeywordCategory, string> = {
  technical: "المهارات التقنية",
  soft: "المهارات الشخصية",
  tools: "الأدوات والبرامج",
  certifications: "الشهادات",
  responsibilities: "المسؤوليات",
  experience: "الخبرات المطلوبة",
  domain: "كلمات المجال والتعليم واللغات",
};

const REQUIRED_CONTEXT = /\b(required|must|required qualification|minimum|essential|mandatory|need to|at least|you will|responsible for|must have)\b|مطلوب|يشترط|شرط أساسي|مسؤول عن|الحد الأدنى|يجب أن|خبرة لا تقل|على الأقل/i;
const PREFERRED_CONTEXT = /\b(preferred|desirable|a plus|nice to have|bonus|ideally)\b|يفضل|ميزة إضافية|من المستحسن/i;
const SENTENCE_SPLIT = /(?<=[.!?؟؛;])\s+|\n+/;
const EXPERIENCE_PATTERN = /\b(?:(?:at least|minimum(?: of)?|over|more than|up to)\s+)?\d{1,2}\s*\+?\s*(?:years?|yrs?)(?:\s+of\s+(?:relevant\s+)?experience|\s+experience)?\b|(?:خبرة|سنوات الخبرة)(?:\s+لا\s+تقل\s+عن)?\s*\d{1,2}\s*\+?\s*(?:سنوات?|أعوام?)/gi;
const STOP_WORDS = new Set([
  "and", "the", "with", "for", "from", "this", "that", "you", "your", "will",
  "have", "has", "are", "our", "their", "into", "about", "work", "team",
  "role", "job", "candidate", "skills", "ability", "experience", "years",
  "required", "qualifications", "preferred", "minimum", "relevant", "degree",
  "certification", "certifications", "bachelor", "bachelors", "master", "masters",
  "position", "responsibilities", "responsible", "looking", "seeking", "apply",
  "in", "s",
  "من", "في", "على", "إلى", "عن", "مع", "هذا", "هذه", "التي", "الذي",
  "لدى", "ضمن", "كما", "أو", "وهو", "وهي", "مطلوب", "المطلوب", "الوظيفة",
  "العمل", "خبرة", "سنوات", "مهارات", "القدرة", "الشركة", "فريق",
]);
const CATEGORY_IDS = Object.keys(CATEGORY_TITLES) as AtsKeywordCategory[];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function occurrenceCount(text: string, value: string): number {
  const normalized = value.toLocaleLowerCase();
  if (!/[a-z]/i.test(normalized)) return text.toLocaleLowerCase().split(normalized).length - 1;
  const pattern = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(normalized).replace(/\s+/g, "\\s+")}(?=$|[^a-z0-9])`, "gi");
  return [...text.matchAll(pattern)].length;
}

function contextFor(text: string, term: string): string {
  const sentences = text.split(SENTENCE_SPLIT);
  return sentences
    .filter((sentence) => occurrenceCount(sentence, term) > 0)
    .join(" ");
}

function priorityFor(text: string, term: string, count: number, context = contextFor(text, term)): AtsKeywordPriority {
  if (REQUIRED_CONTEXT.test(context) || count >= 3) return "high";
  if (count >= 2 || (PREFERRED_CONTEXT.test(context) && count > 0)) return "medium";
  return "additional";
}

function recommendedSection(category: AtsKeywordCategory): string {
  switch (category) {
    case "soft": return "الخبرة المهنية أو النبذة المهنية";
    case "tools": return "المهارات + الخبرة المهنية";
    case "certifications": return "الشهادات";
    case "responsibilities": return "الخبرة المهنية والإنجازات";
    case "experience": return "الخبرة المهنية";
    case "domain": return "التعليم أو اللغات أو النبذة المهنية";
    default: return "المهارات + الخبرة المهنية";
  }
}

function matchesTerm(text: string, term: string): boolean {
  return occurrenceCount(text, term) > 0;
}

function matchesKeyword(text: string, keyword: AtsKeyword): boolean {
  const definition = DEFINITIONS.find((item) => item.term === keyword.term);
  return [keyword.term, ...(definition?.aliases ?? [])].some((term) => matchesTerm(text, term));
}

function collectKeywords(description: string): AtsKeyword[] {
  const normalized = description.toLocaleLowerCase();
  const byCanonical = new Map<string, AtsKeyword>();
  for (const definition of DEFINITIONS) {
    const variants = [definition.term, ...(definition.aliases ?? [])];
    const occurrences = variants.reduce((max, value) => Math.max(max, occurrenceCount(normalized, value)), 0);
    if (!occurrences) continue;
    const existing = byCanonical.get(definition.term);
    const context = variants.filter((variant) => occurrenceCount(normalized, variant) > 0)
      .map((variant) => contextFor(description, variant))
      .join(" ");
    const priority = priorityFor(description, definition.term, occurrences, context);
    if (existing) {
      existing.occurrences = Math.max(existing.occurrences, occurrences);
      if (priority === "high" || (priority === "medium" && existing.priority === "additional")) existing.priority = priority;
    } else {
      byCanonical.set(definition.term, {
        term: definition.term,
        category: definition.category,
        priority,
        occurrences,
        recommendation: recommendedSection(definition.category),
      });
    }
  }

  const responsibilityPatterns = [
    /\b(?:manage|lead|develop|design|build|deliver|coordinate|support|analyze|prepare|oversee|implement|create|drive|maintain|monitor|own|execute|optimize|improve)\s+(?:the\s+)?[a-z][a-z0-9+#]*(?:\s+[a-z][a-z0-9+#]*){0,2}\b/gi,
    /(?:إدارة|تطوير|تنفيذ|تحليل|إعداد|متابعة|قيادة|تصميم|تنسيق|دعم)\s+[\u0600-\u06ff]{3,}(?:\s+[\u0600-\u06ff]{3,}){0,1}/g,
  ];
  for (const pattern of responsibilityPatterns) {
    for (const match of description.matchAll(pattern)) {
      const words = match[0].trim().replace(/\s+/g, " ").split(" ");
      while (words.length > 2 && STOP_WORDS.has(words.at(-1)?.toLocaleLowerCase() ?? "")) words.pop();
      const term = words.join(" ");
      if (!byCanonical.has(term)) {
        byCanonical.set(term, {
          term,
          category: "responsibilities",
          priority: priorityFor(description, term, occurrenceCount(normalized, term)) === "additional" ? "medium" : priorityFor(description, term, occurrenceCount(normalized, term)),
          occurrences: occurrenceCount(normalized, term),
          recommendation: recommendedSection("responsibilities"),
        });
      }
    }
  }

  for (const [index, match] of [...description.matchAll(EXPERIENCE_PATTERN)].entries()) {
    const term = match[0].trim().replace(/\s+/g, " ");
    const key = `experience-${term.toLocaleLowerCase()}`;
    if (!byCanonical.has(key)) {
      byCanonical.set(key, {
        term,
        category: "experience",
        priority: priorityFor(description, term, 1),
        occurrences: 1,
        recommendation: recommendedSection("experience"),
      });
    }
    if (index >= 7) break;
  }

  const candidates = description.split(SENTENCE_SPLIT).flatMap((sentence) => {
    const clean = sentence.toLocaleLowerCase().replace(/[^a-z0-9+#\s\u0600-\u06ff]/g, " ");
    return [...clean.matchAll(/(?:\b[a-z][a-z0-9+#]*(?:\s+[a-z][a-z0-9+#]*){1,2}\b|[\u0600-\u06ff]{3,}(?:\s+[\u0600-\u06ff]{3,}){0,2})/g)]
      .map((match) => match[0].trim())
      .filter((term) => {
        const words = term.split(/\s+/);
        return words.length > 1 && !words.some((word) => STOP_WORDS.has(word));
      });
  });
  const counts = new Map<string, number>();
  for (const term of candidates) counts.set(term, (counts.get(term) ?? 0) + 1);
  const rankedCandidates = [...counts.entries()].sort((left, right) =>
    right[0].split(/\s+/).length - left[0].split(/\s+/).length || right[1] - left[1],
  );
  for (const [term, count] of rankedCandidates) {
    const overlapsKnownTerm = DEFINITIONS.some((definition) =>
      [definition.term, ...(definition.aliases ?? [])].some((variant) => {
        const normalizedVariant = variant.toLocaleLowerCase();
        return normalizedVariant.includes(term) || term.includes(normalizedVariant);
      }),
    );
    if (byCanonical.has(term) || overlapsKnownTerm || [...byCanonical.keys()].some((canonical) => canonical.toLocaleLowerCase().includes(term))) continue;
    byCanonical.set(term, {
      term,
      category: "domain",
      priority: priorityFor(description, term, count),
      occurrences: count,
      recommendation: recommendedSection("domain"),
    });
    if (byCanonical.size >= 80) break;
  }

  return [...byCanonical.values()].sort((left, right) => {
    const priority = { high: 0, medium: 1, additional: 2 };
    return priority[left.priority] - priority[right.priority]
      || right.occurrences - left.occurrences
      || left.term.localeCompare(right.term);
  });
}

function requirementMatches(description: string, pattern: RegExp): string[] {
  return [...description.matchAll(pattern)].map((match) => match[0].trim().replace(/\s+/g, " ")).filter((value, index, values) => values.indexOf(value) === index).slice(0, 8);
}

function buildRequirements(description: string, keywords: AtsKeyword[]): JobRequirements {
  const experience = [...description.matchAll(EXPERIENCE_PATTERN)]
    .map((match) => match[0].trim())
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 5);
  const education = requirementMatches(description, /\b(?:bachelor'?s?(?:\s+degree)?|master'?s?(?:\s+degree)?|ph\.?d\.?|doctorate|associate'?s?(?:\s+degree)?|degree in [a-z][a-z\s&-]{2,35}|diploma in [a-z][a-z\s&-]{2,35})\b|(?:بكالوريوس|ماجستير|دكتوراه|دبلوم)(?:\s+[^،؛.\n]{2,45})?/gi);
  const languageTerms = ["English", "Arabic", "French", "Spanish", "German"];
  const languages = languageTerms.filter((language) =>
    DEFINITIONS.some((definition) => definition.term === language && [language, ...(definition.aliases ?? [])].some((variant) => matchesTerm(description, variant))),
  );
  const certifications = keywords.filter((keyword) => keyword.category === "certifications").map((keyword) => keyword.term);
  const tools = keywords.filter((keyword) => keyword.category === "tools").map((keyword) => keyword.term);
  const skills = keywords.filter((keyword) => ["technical", "soft"].includes(keyword.category)).slice(0, 12).map((keyword) => keyword.term);
  return { experience, education, certifications, languages, tools, skills };
}

function buildSummary(keywords: AtsKeyword[], title: string): string[] {
  const high = keywords.filter((keyword) => keyword.priority === "high").slice(0, 4);
  const top = (high.length ? high : keywords).slice(0, 4).map((keyword) => keyword.term);
  const mainSkills = top.length ? top.join("، ") : "المتطلبات المذكورة في الإعلان";
  const responsibility = keywords.find((keyword) => keyword.category === "responsibilities");
  return [
    `تبحث الجهة عن مرشح مناسب لوظيفة ${title || "الدور المعلن"} يمتلك أو يستطيع إثبات المهارات الأهم في الإعلان.`,
    `أبرز الكلمات والمهارات التي ظهرت في النص: ${mainSkills}.`,
    responsibility ? `يركز الإعلان أيضًا على مسؤوليات مثل ${responsibility.term}.` : "راجع المسؤوليات والمؤهلات المحددة في الإعلان، ثم اربطها بأمثلة حقيقية من خبرتك.",
  ];
}

function buildRecommendations(missing: AtsKeyword[], description: string): string[] {
  const suggestions = missing.slice(0, 5).map((keyword) =>
    `إذا كانت لديك خبرة حقيقية في ${keyword.term}، فأضفها بوضوح إلى ${keyword.recommendation}.`,
  );
  const repeated = missing.find((keyword) => keyword.occurrences >= 2);
  if (repeated) suggestions.unshift(`تكرر ذكر ${repeated.term} في الإعلان؛ أبرزها في موضع مناسب بسيرتك إذا كانت تعكس خبرتك فعلًا.`);
  if (!description.trim()) suggestions.push("أضف وصف الوظيفة لمقارنة سيرتك بالكلمات والمتطلبات التي يبحث عنها الإعلان.");
  if (!suggestions.length) suggestions.push("تظهر الكلمات الأهم في سيرتك المستخرجة. راجعها يدويًا للتأكد من أن السياق يوضح خبرتك الحقيقية.");
  return suggestions.slice(0, 6);
}

export function analyzeAtsKeywords(
  description: string,
  resumeText: string | null,
  jobTitle: string,
): AtsKeywordAnalysis {
  const keywords = collectKeywords(description);
  const groups = CATEGORY_IDS
    .map((id) => ({ id, title: CATEGORY_TITLES[id], keywords: keywords.filter((keyword) => keyword.category === id) }))
    .filter((group) => group.keywords.length > 0);
  const topKeywords = keywords.slice(0, 15);
  const resume = resumeText?.toLocaleLowerCase() ?? "";
  const matched = resumeText === null ? [] : keywords.filter((keyword) => matchesKeyword(resume, keyword));
  const missing = resumeText === null ? [] : keywords.filter((keyword) => !matchesKeyword(resume, keyword));
  const weightedTotal = keywords.reduce((sum, keyword) => sum + (keyword.priority === "high" ? 3 : keyword.priority === "medium" ? 2 : 1), 0);
  const weightedMatch = matched.reduce((sum, keyword) => sum + (keyword.priority === "high" ? 3 : keyword.priority === "medium" ? 2 : 1), 0);
  const score = keywords.length ? Math.round((weightedMatch / weightedTotal) * 100) : 0;

  return {
    keywords,
    groups,
    topKeywords,
    summary: buildSummary(keywords, jobTitle.trim()),
    requirements: buildRequirements(description, keywords),
    match: resumeText === null ? null : { score, matched, missing },
    recommendations: buildRecommendations(missing, description),
  };
}
