export type CoverLetterLanguage = "en" | "fr" | "ar" | "es" | "de";
export type CoverLetterTone = "professional" | "concise" | "friendly" | "formal";
export type CoverLetterLength = "short" | "medium" | "detailed";

export type CoverLetterInput = {
  fullName: string;
  currentRole: string;
  yearsExperience: string;
  skills: string;
  achievements: string;
  jobTitle: string;
  company: string;
  hiringManager: string;
  location: string;
  jobDescription: string;
  tone: CoverLetterTone;
  length: CoverLetterLength;
  language: CoverLetterLanguage;
};

const COMMON_TERMS = [
  "project management", "data analysis", "digital marketing", "google analytics",
  "google ads", "search engine optimization", "customer service", "communication",
  "leadership", "teamwork", "problem solving", "strategic planning", "content creation",
  "social media", "javascript", "python", "sql", "excel", "seo", "ppc", "crm",
  "marketing", "sales", "design", "analytics", "management", "research", "budget",
  "forecasting", "reporting", "التسويق الرقمي", "تحليل البيانات", "إدارة المشاريع",
  "التواصل", "القيادة", "التسويق", "المبيعات", "التصميم", "البرمجة", "إكسل",
];

const STOP_WORDS = new Set([
  "about", "also", "and", "are", "for", "from", "have", "into", "our", "that",
  "the", "their", "this", "with", "will", "your", "you", "who", "what", "where",
  "work", "working", "role", "position", "company", "candidate", "required",
  "requirements", "responsibilities", "experience", "skills", "ability", "must",
  "strong", "excellent", "looking", "seeking", "join", "team", "years",
  "pour", "dans", "avec", "les", "des", "une", "qui", "vous", "nous", "sur",
  "para", "con", "por", "una", "las", "los", "del", "que", "und", "mit", "der",
  "die", "das", "ein", "eine", "sie", "wir", "von", "ist", "und",
  "من", "في", "على", "إلى", "عن", "مع", "هذا", "هذه", "التي", "الذي", "كما",
  "لدى", "ضمن", "أو", "وهو", "وهي", "مطلوب", "المطلوب", "الوظيفة", "العمل",
  "المتقدم", "المتقدمين", "سنوات", "خبرة", "مهارات", "فريق", "للعمل",
]);

type LanguageCopy = {
  subject: string;
  hello: (manager: string, tone: CoverLetterTone) => string;
  opening: (name: string, job: string, company: string) => string;
  roleOnly: (job: string) => string;
  companyOnly: (company: string) => string;
  matchInterest: (job: string, company: string, terms: string) => string;
  profile: (role: string, years: string) => string;
  contribution: (skills: string) => string;
  achievements: (achievements: string) => string;
  motivation: (job: string, company: string) => string;
  closing: string;
  signoff: string;
};

const COPY: Record<CoverLetterLanguage, LanguageCopy> = {
  en: {
    subject: "Application",
    hello: (manager, tone) => tone === "friendly" ? `Hello${manager ? ` ${manager}` : ""},` : tone === "formal" ? "Dear Sir or Madam," : manager ? `Dear ${manager},` : "Dear Hiring Manager,",
    opening: (name, job, company) => `I am ${name}, and I am writing to apply for the ${job} position${company ? ` at ${company}` : ""}.`,
    roleOnly: (job) => `I am writing to apply for the ${job} position.`,
    companyOnly: (company) => `I am writing to express my interest in an opportunity at ${company}.`,
    matchInterest: (job, company, terms) => `The opportunity to contribute as ${job}${company ? ` at ${company}` : ""} interests me. The priorities described in the role${terms ? `, including ${terms}` : ""} align with the work I would like to contribute to.`,
    profile: (role, years) => `My background is in ${role}${years ? `, with ${years} of experience` : ""}.`,
    contribution: (skills) => `I can bring experience in ${skills} to the role.`,
    achievements: (achievements) => `In my previous work, ${achievements}.`,
    motivation: (job, company) => `I would welcome the opportunity to discuss how my background could support the ${job} team${company ? ` at ${company}` : ""}.`,
    closing: "Thank you for your time and consideration. I look forward to the possibility of speaking with you.",
    signoff: "Kind regards,",
  },
  fr: {
    subject: "Candidature",
    hello: (manager, tone) => tone === "friendly" || tone === "concise" ? `Bonjour${manager ? ` ${manager}` : ""},` : manager ? `Madame, Monsieur ${manager},` : "Madame, Monsieur,",
    opening: (name, job, company) => `Je m’appelle ${name} et je vous adresse ma candidature au poste de ${job}${company ? ` au sein de ${company}` : ""}.`,
    roleOnly: (job) => `Je vous adresse ma candidature au poste de ${job}.`,
    companyOnly: (company) => `Je souhaite vous faire part de mon intérêt pour une opportunité au sein de ${company}.`,
    matchInterest: (job, company, terms) => `L’opportunité de contribuer en tant que ${job}${company ? ` chez ${company}` : ""} m’intéresse. Les priorités décrites dans l’offre${terms ? `, notamment ${terms}` : ""}, correspondent aux missions auxquelles je souhaite contribuer.`,
    profile: (role, years) => `Mon parcours est orienté vers ${role}${years ? `, avec ${years} d’expérience` : ""}.`,
    contribution: (skills) => `Je peux mettre mes compétences en ${skills} au service de ce poste.`,
    achievements: (achievements) => `Au cours de mes expériences précédentes, ${achievements}.`,
    motivation: (job, company) => `Je serais heureux de discuter de la manière dont mon parcours pourrait contribuer à l’équipe ${job}${company ? ` de ${company}` : ""}.`,
    closing: "Je vous remercie de l’attention portée à ma candidature et reste à votre disposition pour un échange.",
    signoff: "Cordialement,",
  },
  ar: {
    subject: "طلب التقديم",
    hello: (manager, tone) => tone === "friendly" || tone === "concise" ? `مرحبًا${manager ? ` ${manager}` : ""}،` : manager ? `السيد/ة ${manager} المحترم/ة،` : "السادة فريق التوظيف المحترمون،",
    opening: (name, job, company) => `اسمي ${name}، وأتقدم لشغل وظيفة ${job}${company ? ` لدى ${company}` : ""}.`,
    roleOnly: (job) => `أتقدم لشغل وظيفة ${job}.`,
    companyOnly: (company) => `أود التعبير عن اهتمامي بفرصة العمل لدى ${company}.`,
    matchInterest: (job, company, terms) => `تستهويني فرصة الإسهام في وظيفة ${job}${company ? ` لدى ${company}` : ""}. وتتوافق أولويات الدور${terms ? `، ومنها ${terms}` : ""} مع نوع العمل الذي أطمح إلى الإسهام فيه.`,
    profile: (role, years) => `يتركز تخصصي في ${role}${years ? `، ولدي ${years} من الخبرة` : ""}.`,
    contribution: (skills) => `يمكنني توظيف مهاراتي في ${skills} لخدمة متطلبات هذا الدور.`,
    achievements: (achievements) => `ومن أبرز ما أنجزته في خبراتي السابقة: ${achievements}.`,
    motivation: (job, company) => `يسعدني مناقشة كيفية إسهام خلفيتي المهنية في فريق ${job}${company ? ` لدى ${company}` : ""}.`,
    closing: "شكرًا لوقتكم واهتمامكم، وأتطلع إلى فرصة مناقشة مدى ملاءمتي لهذا الدور.",
    signoff: "مع خالص التحية،",
  },
  es: {
    subject: "Solicitud",
    hello: (manager, tone) => tone === "friendly" || tone === "concise" ? `Hola${manager ? ` ${manager}` : ""},` : manager ? `Estimado/a ${manager}:` : "Estimado equipo de selección:",
    opening: (name, job, company) => `Soy ${name} y me gustaría presentar mi candidatura al puesto de ${job}${company ? ` en ${company}` : ""}.`,
    roleOnly: (job) => `Me gustaría presentar mi candidatura al puesto de ${job}.`,
    companyOnly: (company) => `Quisiera expresar mi interés en una oportunidad en ${company}.`,
    matchInterest: (job, company, terms) => `Me interesa la oportunidad de contribuir como ${job}${company ? ` en ${company}` : ""}. Las prioridades descritas para el puesto${terms ? `, como ${terms}` : ""}, coinciden con el tipo de trabajo al que deseo contribuir.`,
    profile: (role, years) => `Mi trayectoria se centra en ${role}${years ? `, con ${years} de experiencia` : ""}.`,
    contribution: (skills) => `Puedo aportar al puesto experiencia en ${skills}.`,
    achievements: (achievements) => `En mis experiencias anteriores, ${achievements}.`,
    motivation: (job, company) => `Me gustaría conversar sobre cómo mi trayectoria podría contribuir al equipo de ${job}${company ? ` en ${company}` : ""}.`,
    closing: "Gracias por su tiempo y consideración. Quedo a su disposición para conversar sobre mi candidatura.",
    signoff: "Atentamente,",
  },
  de: {
    subject: "Bewerbung",
    hello: (manager, tone) => tone === "friendly" || tone === "concise" ? `Guten Tag${manager ? ` ${manager}` : ""},` : manager ? `Sehr geehrte/r ${manager},` : "Sehr geehrtes Recruiting-Team,",
    opening: (name, job, company) => `Mein Name ist ${name}, und ich bewerbe mich um die Position als ${job}${company ? ` bei ${company}` : ""}.`,
    roleOnly: (job) => `Hiermit bewerbe ich mich um die Position als ${job}.`,
    companyOnly: (company) => `Ich möchte mein Interesse an einer Position bei ${company} zum Ausdruck bringen.`,
    matchInterest: (job, company, terms) => `Die Möglichkeit, als ${job}${company ? ` bei ${company}` : ""} mitzuwirken, interessiert mich. Die in der Ausschreibung genannten Schwerpunkte${terms ? `, darunter ${terms}` : ""}, passen zu den Aufgaben, zu denen ich beitragen möchte.`,
    profile: (role, years) => `Mein beruflicher Hintergrund liegt im Bereich ${role}${years ? ` mit ${years} Jahren Erfahrung` : ""}.`,
    contribution: (skills) => `Meine Kenntnisse in ${skills} kann ich in diese Position einbringen.`,
    achievements: (achievements) => `In meinen bisherigen Tätigkeiten ${achievements}.`,
    motivation: (job, company) => `Gerne bespreche ich, wie mein Hintergrund das Team für ${job}${company ? ` bei ${company}` : ""} unterstützen kann.`,
    closing: "Vielen Dank für Ihre Zeit und die Berücksichtigung meiner Bewerbung. Ich freue mich auf die Möglichkeit eines Gesprächs.",
    signoff: "Mit freundlichen Grüßen,",
  },
};

export function extractJobKeywords(jobDescription: string): string[] {
  const normalized = jobDescription.toLocaleLowerCase();
  const phrases = COMMON_TERMS.filter((term) => {
    if (/^[a-z]/i.test(term)) {
      return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}\\b`, "i").test(normalized);
    }
    return normalized.includes(term);
  }).filter((term, index, terms) => !terms.some((other, otherIndex) => otherIndex !== index && other.length > term.length && other.includes(term)));

  const tokens = normalized.match(/[a-z][a-z0-9+#]*(?:[.-][a-z0-9+#]+)*|[\u0600-\u06ff]{3,}/g) ?? [];
  const coveredTokens = new Set(phrases.flatMap((phrase) => phrase.match(/[a-z][a-z0-9+#]*(?:[.-][a-z0-9+#]+)*|[\u0600-\u06ff]{3,}/g) ?? []));
  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (token.length > 2 && !STOP_WORDS.has(token) && !coveredTokens.has(token) && !/^\d+$/.test(token)) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  const sourceCase = (term: string) => {
    const match = jobDescription.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"), "i"));
    return match?.[0] ?? term;
  };
  return [...phrases, ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([term]) => term)]
    .map(sourceCase)
    .slice(0, 12);
}

function cleanValue(value: string): string {
  return value.trim().replace(/[.!?؟،,;:\s]+$/u, "");
}

export function generateCoverLetter(input: CoverLetterInput, variation = 0): string {
  const copy = COPY[input.language];
  const name = cleanValue(input.fullName);
  const job = cleanValue(input.jobTitle);
  const company = [cleanValue(input.company), cleanValue(input.location)].filter(Boolean).join(" — ");
  const role = cleanValue(input.currentRole);
  const years = cleanValue(input.yearsExperience);
  const skills = cleanValue(input.skills);
  const achievements = cleanValue(input.achievements);
  const manager = cleanValue(input.hiringManager);
  const keywords = extractJobKeywords(input.jobDescription);
  const relevantTerms = keywords.filter((term) => input.skills.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  const terms = relevantTerms.slice(0, 3).join(input.language === "ar" ? "، " : ", ");
  const opening = variation % 2 === 0
    ? (name ? copy.opening(name, job || copy.subject, company) : job ? copy.roleOnly(job) : company ? copy.companyOnly(company) : "")
    : (job ? copy.roleOnly(job) : name ? copy.opening(name, copy.subject, company) : company ? copy.companyOnly(company) : "");
  const paragraphs = [copy.hello(manager, input.tone)];
  if (opening) paragraphs.push(opening);
  if (role) paragraphs.push(copy.profile(role, years));
  else if (skills) paragraphs.push(copy.contribution(skills));
  if (input.length !== "short" && skills && (role || years)) paragraphs.push(copy.contribution(skills));
  if (input.jobDescription.trim() && (input.length !== "short" || (!skills && !achievements && !role && !years))) {
    paragraphs.push(copy.matchInterest(job || copy.subject, company, terms));
  }
  if (achievements) paragraphs.push(copy.achievements(achievements));
  if (input.length === "detailed" && input.jobDescription.trim() && (role || years || skills || achievements)) {
    paragraphs.push(copy.motivation(job || copy.subject, company));
  } else if (input.length === "short" || !input.jobDescription.trim()) {
    paragraphs.push(copy.motivation(job || copy.subject, company));
  }
  paragraphs.push(copy.closing);
  paragraphs.push(copy.signoff);
  if (name) paragraphs.push([name, cleanValue(input.location)].filter(Boolean).join("\n"));
  return paragraphs.filter(Boolean).join("\n\n");
}

export type CoverLetterScores = {
  total: number;
  personalization: number;
  clarity: number;
  length: number;
  professionalism: number;
  keywords: number;
};

export function scoreCoverLetter(input: CoverLetterInput, letter: string): CoverLetterScores {
  const keywords = extractJobKeywords(input.jobDescription);
  const lowerLetter = letter.toLocaleLowerCase();
  const used = keywords.filter((keyword) => lowerLetter.includes(keyword.toLocaleLowerCase()));
  const words = letter.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = letter.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length;
  const hasJob = Boolean(input.jobTitle.trim() && lowerLetter.includes(input.jobTitle.trim().toLocaleLowerCase()));
  const hasCompany = Boolean(input.company.trim() && lowerLetter.includes(input.company.trim().toLocaleLowerCase()));
  const personalization = Math.min(100, 35 + (hasJob ? 30 : 0) + (hasCompany ? 25 : 0) + (input.jobDescription.trim() ? 10 : 0));
  const clarity = Math.min(100, 45 + Math.min(paragraphs, 5) * 9 + (words > 70 ? 10 : 0));
  const length = input.length === "short" ? (words <= 190 ? 100 : Math.max(40, 100 - Math.floor((words - 190) / 5))) :
    input.length === "medium" ? (words >= 130 && words <= 360 ? 100 : Math.max(45, 100 - Math.abs(words - 240) / 3)) :
      (words >= 230 && words <= 520 ? 100 : Math.max(45, 100 - Math.abs(words - 360) / 4));
  const professionalism = Math.min(100, 55 + (input.fullName.trim() ? 15 : 0) + (input.jobTitle.trim() ? 15 : 0) + (paragraphs >= 4 ? 15 : 0));
  const keywordScore = keywords.length ? Math.round((used.length / keywords.length) * 100) : (input.jobDescription.trim() ? 0 : 65);
  const total = Math.round(personalization * 0.25 + clarity * 0.2 + length * 0.15 + professionalism * 0.2 + keywordScore * 0.2);
  return {
    total,
    personalization: Math.round(personalization),
    clarity: Math.round(clarity),
    length: Math.round(length),
    professionalism: Math.round(professionalism),
    keywords: keywordScore,
  };
}
