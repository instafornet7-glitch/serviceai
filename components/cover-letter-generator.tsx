"use client";

import { useMemo, useState } from "react";
import type { CoverLetterInput, CoverLetterLanguage, CoverLetterLength, CoverLetterScores, CoverLetterTone } from "@/lib/cover-letter";
import { extractJobKeywords, generateCoverLetter, scoreCoverLetter } from "@/lib/cover-letter";

const initialInput: CoverLetterInput = {
  fullName: "",
  currentRole: "",
  yearsExperience: "",
  skills: "",
  achievements: "",
  jobTitle: "",
  company: "",
  hiringManager: "",
  location: "",
  jobDescription: "",
  tone: "professional",
  length: "medium",
  language: "en",
};

const languages: Array<[CoverLetterLanguage, string]> = [
  ["en", "الإنجليزية"],
  ["fr", "الفرنسية"],
  ["ar", "العربية"],
  ["es", "الإسبانية"],
  ["de", "الألمانية"],
];

const tones: Array<[CoverLetterTone, string]> = [
  ["professional", "احترافي"],
  ["concise", "مختصر ومباشر"],
  ["friendly", "ودود"],
  ["formal", "رسمي"],
];

const lengths: Array<[CoverLetterLength, string]> = [
  ["short", "قصيرة"],
  ["medium", "متوسطة"],
  ["detailed", "مفصلة"],
];

function safeFileName(value: string): string {
  const cleaned = value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").replace(/\s+/g, "-").slice(0, 60);
  return cleaned || "cover-letter";
}

function scoreLabel(score: number): string {
  if (score >= 85) return "جيدة جدًا";
  if (score >= 70) return "جيدة";
  if (score >= 50) return "تحتاج إلى بعض التحسين";
  return "يمكن تعزيزها";
}

export function CoverLetterGenerator() {
  const [input, setInput] = useState<CoverLetterInput>(initialInput);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [variation, setVariation] = useState(0);

  const keywords = useMemo(() => extractJobKeywords(input.jobDescription), [input.jobDescription]);
  const usedKeywords = useMemo(() => keywords.filter((keyword) => letter.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())), [keywords, letter]);
  const scores: CoverLetterScores | null = letter ? scoreCoverLetter(input, letter) : null;
  const rtl = input.language === "ar";

  const update = <K extends keyof CoverLetterInput>(key: K, value: CoverLetterInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const createLetter = async (nextVariation = 0) => {
    if (!input.fullName.trim()) {
      setError("اكتب اسمك الكامل أولًا.");
      document.getElementById("cover-full-name")?.focus();
      return;
    }
    if (!input.jobTitle.trim()) {
      setError("أدخل اسم الوظيفة التي تريد التقديم عليها.");
      document.getElementById("cover-job-title")?.focus();
      return;
    }
    if (!input.company.trim()) {
      setError("أدخل اسم الشركة أو الجهة التي تريد التقديم إليها.");
      document.getElementById("cover-company")?.focus();
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setLetter(generateCoverLetter(input, nextVariation));
    setVariation(nextVariation);
    setLoading(false);
    window.setTimeout(() => document.getElementById("cover-letter-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const transformLetter = (action: "shorter" | "professional" | "persuasive") => {
    if (!letter) return;
    const paragraphs = letter.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
    if (action === "shorter") {
      if (paragraphs.length > 4) {
        paragraphs.splice(Math.max(2, Math.floor(paragraphs.length / 2)), 1);
      } else {
        const bodyIndex = paragraphs.findIndex((paragraph, index) => index > 0 && index < paragraphs.length - 2 && paragraph.split(/[.!?؟]+/).filter(Boolean).length > 1);
        if (bodyIndex >= 0) paragraphs[bodyIndex] = paragraphs[bodyIndex].split(/(?<=[.!?؟])\s+/).slice(0, 1).join(" ");
        else if (paragraphs.length > 3) paragraphs.splice(2, 1);
      }
      setLetter(paragraphs.join("\n\n"));
      setNotice("اختُصرت الرسالة مع الحفاظ على النص الذي يمكنك مراجعته وتعديله.");
    } else if (action === "professional") {
      const replacements: Array<[RegExp, string]> = input.language === "en"
        ? [[/^Hello\b/i, "Dear Hiring Manager,"], [/\bI want to\b/gi, "I would welcome the opportunity to"], [/\bI'm\b/g, "I am"], [/\bcan't\b/gi, "cannot"]]
        : input.language === "ar"
          ? [[/^مرحبًا/u, "السادة فريق التوظيف المحترمون،"], [/أحب أن أعمل/u, "أرغب في الإسهام"]]
          : input.language === "fr"
            ? [[/^Bonjour/u, "Madame, Monsieur,"]]
            : input.language === "es"
              ? [[/^Hola/u, "Estimado equipo de selección:"]]
              : [[/^Guten Tag/u, "Sehr geehrtes Recruiting-Team,"]];
      setLetter(paragraphs.map((paragraph) => replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), paragraph)).join("\n\n"));
      setNotice("حُدّثت الصياغة لتكون أكثر رسمية، ويمكنك متابعة تحرير النص يدويًا.");
    } else {
      const evidence = input.achievements.trim()
        ? input.language === "ar" ? `ومن إنجازاتي ذات الصلة: ${input.achievements.trim().replace(/[.!?؟]+$/u, "")}.` : `A relevant achievement I can discuss is ${input.achievements.trim().replace(/[.!?]+$/u, "")}.`
        : input.skills.trim()
          ? ({
              en: `I would welcome the opportunity to apply my skills in ${input.skills.trim()} as a ${input.jobTitle.trim()}.`,
              fr: `Je souhaite mettre mes compétences en ${input.skills.trim()} à profit dans le poste de ${input.jobTitle.trim()}.`,
              ar: `وأتطلع إلى توظيف مهاراتي في ${input.skills.trim()} في وظيفة ${input.jobTitle.trim()}.`,
              es: `Me gustaría aportar mis habilidades en ${input.skills.trim()} al puesto de ${input.jobTitle.trim()}.`,
              de: `Gerne möchte ich meine Kenntnisse in ${input.skills.trim()} in der Position als ${input.jobTitle.trim()} einbringen.`,
            }[input.language])
          : "";
      if (!evidence) {
        setNotice("لجعل الرسالة أكثر إقناعًا بمعلومات دقيقة، أضف مهارة أو إنجازًا حقيقيًا في النموذج أولًا.");
        return;
      }
      const alreadyIncluded = paragraphs.some((paragraph) => paragraph === evidence);
      if (!alreadyIncluded) {
        const closingIndex = paragraphs.length > 2 ? paragraphs.length - 2 : paragraphs.length;
        paragraphs.splice(closingIndex, 0, evidence);
      }
      setLetter(paragraphs.join("\n\n"));
      setNotice("أُبرزت معلومات المهارات أو الإنجازات التي أدخلتها فقط، دون إضافة خبرات جديدة.");
    }
    setError("");
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setNotice("تم نسخ رسالة التقديم.");
      setError("");
    } catch {
      setError("تعذر النسخ تلقائيًا. حدّد النص وانسخه يدويًا.");
    }
  };

  const downloadDocx = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");
      const doc = new Document({
        creator: "ServiceAI",
        title: `Cover Letter - ${input.fullName}`,
        sections: [{
          properties: { page: { margin: { top: 1100, right: 1100, bottom: 1100, left: 1100 } } },
          children: letter.split(/\n\s*\n/).map((paragraph) => new Paragraph({
            bidirectional: rtl,
            alignment: rtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { after: 220, line: 300 },
            children: [new TextRun({ text: paragraph, font: "Arial", size: 22 })],
          })),
        }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${safeFileName(input.fullName)}-cover-letter.docx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("تم تجهيز ملف DOCX وتنزيله.");
      setError("");
    } catch {
      setError("تعذر إنشاء ملف DOCX. انسخ الرسالة أو جرّب مرة أخرى.");
    }
  };

  const downloadPdf = () => {
    const previousTitle = document.title;
    document.title = `${safeFileName(input.fullName)}-cover-letter`;
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.print();
    setNotice("من نافذة الطباعة اختر «حفظ بصيغة PDF» لتنزيل الرسالة.");
  };

  const startOver = () => {
    setInput(initialInput);
    setLetter("");
    setError("");
    setNotice("");
    setVariation(0);
    document.getElementById("cover-generator-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("cover-full-name")?.focus(), 250);
  };

  return (
    <div className="cover-app">
      <form className="cover-form-card" id="cover-generator-form" onSubmit={(event) => { event.preventDefault(); void createLetter(); }}>
        <div className="cover-form-heading"><span className="eyebrow">مخصص للوظيفة التي تستهدفها</span><h2>أخبرنا عنك وعن الفرصة</h2><p>الاسم والوظيفة المستهدفة مطلوبان؛ بقية المعلومات اختيارية ويمكنك تخطي ما لا ينطبق عليك.</p></div>

        <section className="cover-form-section"><h3><span>01</span> معلوماتك المهنية</h3>
          <div className="cover-fields-grid">
            <label className="cover-field">الاسم الكامل <span>*</span><input id="cover-full-name" value={input.fullName} onChange={(event) => update("fullName", event.target.value)} maxLength={100} placeholder="مثال: سارة أحمد" autoComplete="name" required /></label>
            <label className="cover-field">المسمى الوظيفي الحالي أو التخصص <small>اختياري</small><input value={input.currentRole} onChange={(event) => update("currentRole", event.target.value)} maxLength={120} placeholder="مثال: أخصائية تسويق رقمي" /></label>
            <label className="cover-field">سنوات الخبرة <small>اختياري</small><input value={input.yearsExperience} onChange={(event) => update("yearsExperience", event.target.value)} maxLength={40} placeholder="مثال: 5 سنوات" /></label>
            <label className="cover-field cover-field-span">أهم المهارات <small>اختياري</small><input value={input.skills} onChange={(event) => update("skills", event.target.value)} maxLength={400} placeholder="مثال: SEO، Google Analytics، إدارة الحملات" /></label>
            <label className="cover-field cover-field-span">أهم الخبرات أو الإنجازات <small>اختياري</small><textarea value={input.achievements} onChange={(event) => update("achievements", event.target.value)} rows={3} maxLength={800} placeholder="اكتب إنجازًا أو خبرة حقيقية تريد إبرازها. مثال: رفعت الزيارات العضوية بنسبة 25%." /></label>
          </div>
        </section>

        <section className="cover-form-section"><h3><span>02</span> معلومات الوظيفة</h3>
          <div className="cover-fields-grid">
            <label className="cover-field">اسم الوظيفة <span>*</span><input id="cover-job-title" value={input.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} maxLength={120} placeholder="مثال: Digital Marketing Specialist" required /></label>
            <label className="cover-field">اسم الشركة <span>*</span><input id="cover-company" value={input.company} onChange={(event) => update("company", event.target.value)} maxLength={120} placeholder="اسم الجهة" required /></label>
            <label className="cover-field">اسم مسؤول التوظيف <small>اختياري</small><input value={input.hiringManager} onChange={(event) => update("hiringManager", event.target.value)} maxLength={100} placeholder="إن كنت تعرفه" /></label>
            <label className="cover-field">موقع الشركة أو الدولة <small>اختياري</small><input value={input.location} onChange={(event) => update("location", event.target.value)} maxLength={100} placeholder="الرياض، المملكة العربية السعودية" /></label>
            <label className="cover-field cover-field-span">وصف الوظيفة Job Description <small>اختياري</small><textarea value={input.jobDescription} onChange={(event) => update("jobDescription", event.target.value)} rows={5} maxLength={10000} placeholder="الصق إعلان الوظيفة أو أهم مسؤولياتها ومهاراتها هنا..." /><span className="cover-field-hint">إضافة وصف الوظيفة تساعد على اقتراح كلمات مرتبطة بالإعلان وتخصيص الرسالة أكثر. {input.jobDescription.length.toLocaleString("ar")} / 10,000</span></label>
          </div>
        </section>

        <section className="cover-form-section"><h3><span>03</span> خصّص الرسالة</h3>
          <div className="cover-fields-grid cover-options-grid">
            <fieldset className="cover-choice-field"><legend>أسلوب الرسالة</legend><div className="cover-choice-options">{tones.map(([value, label]) => <label className="cover-choice" key={value}><input type="radio" name="tone" value={value} checked={input.tone === value} onChange={() => update("tone", value)} /><span>{label}</span></label>)}</div></fieldset>
            <fieldset className="cover-choice-field"><legend>طول الرسالة</legend><div className="cover-choice-options">{lengths.map(([value, label]) => <label className="cover-choice" key={value}><input type="radio" name="length" value={value} checked={input.length === value} onChange={() => update("length", value)} /><span>{label}</span></label>)}</div></fieldset>
            <label className="cover-field cover-language-field">لغة الرسالة<select value={input.language} onChange={(event) => update("language", event.target.value as CoverLetterLanguage)}>{languages.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <p className="cover-language-hint">للحفاظ على لغة واحدة، أدخل مهاراتك وإنجازاتك باللغة المختارة. لا تتم ترجمة المعلومات التي تكتبها تلقائيًا في هذا الإصدار.</p>
          </div>
        </section>

        {error && <p className="cover-alert" role="alert">{error}</p>}
        {notice && !letter && <p className="cover-notice" role="status">{notice}</p>}
        <button className="button cover-generate-button" type="submit" disabled={loading}>{loading ? <><span className="cover-spinner" aria-hidden="true" /> جاري إنشاء رسالة تقديم مخصصة لهذه الوظيفة...</> : <>إنشاء رسالة التقديم <span aria-hidden="true">←</span></>}</button>
        {loading && <p className="cover-loading-note" role="status">نرتب تفاصيلك والكلمات ذات الصلة في صياغة قابلة للتحرير. لا نرسل بياناتك إلى خدمة خارجية.</p>}
        <p className="cover-privacy-note"><span aria-hidden="true">◇</span> تُستخدم المعلومات المدخلة لإنشاء النتيجة داخل هذه الصفحة فقط، ولا يتم حفظها في قاعدة بيانات.</p>
        <p className="cover-method-note">هذه النسخة تستخدم صياغة محلية مبنية على المعلومات التي تقدمها، ولا تتصل حاليًا بمزوّد ذكاء اصطناعي خارجي.</p>
      </form>

      {letter && scores && (
        <section className="cover-result-section" id="cover-letter-result" aria-labelledby="cover-result-title">
          <div className="cover-result-heading"><div><span className="eyebrow">مسودة قابلة للتعديل</span><h2 id="cover-result-title">رسالة التقديم الخاصة بك</h2><p>راجع كل جملة وعدّلها لتعبّر عنك بدقة قبل إرسالها.</p></div><span className="cover-result-language">{languages.find(([value]) => value === input.language)?.[1]}</span></div>
          <section className="cover-quality-card" aria-labelledby="cover-score-title">
            <div className="cover-quality-score"><strong>{scores.total}</strong><span>/ 100</span></div>
            <div className="cover-quality-copy"><span>Cover Letter Score</span><h3 id="cover-score-title">{scoreLabel(scores.total)}</h3><p>مؤشر إرشادي لمراجعة المسودة، ولا يضمن قبولك في الوظيفة.</p></div>
            <div className="cover-quality-bars">{([
              ["التخصيص للوظيفة", scores.personalization],
              ["الوضوح", scores.clarity],
              ["الطول", scores.length],
              ["الأسلوب المهني", scores.professionalism],
              ["الكلمات المتعلقة بالوظيفة", scores.keywords],
            ] as Array<[string, number]>).map(([label, score]) => <div className="cover-quality-row" key={label}><span>{label}</span><div><i style={{ width: `${score}%` }} /></div><strong>{score}</strong></div>)}</div>
          </section>

          <div className="cover-result-toolbar">
            <div className="cover-transform-buttons">
              <button type="button" onClick={() => transformLetter("shorter")}>اجعلها أقصر</button>
              <button type="button" onClick={() => transformLetter("professional")}>اجعلها أكثر احترافية</button>
              <button type="button" onClick={() => transformLetter("persuasive")}>اجعلها أكثر إقناعًا</button>
              <button type="button" onClick={() => void createLetter(variation + 1)}>إعادة الإنشاء</button>
            </div>
            <div className="cover-export-buttons"><button type="button" onClick={() => void copyLetter()}>نسخ الرسالة</button><button type="button" onClick={downloadPdf}>تحميل PDF</button><button type="button" onClick={() => void downloadDocx()}>تحميل DOCX</button></div>
          </div>

          {error && <p className="cover-alert" role="alert">{error}</p>}
          {notice && <p className="cover-notice" role="status">{notice}</p>}
          <label className="cover-letter-editor-label" htmlFor="cover-letter-editor">حرّر رسالتك هنا</label>
          <textarea className={`cover-letter-editor${rtl ? " is-rtl" : ""}`} id="cover-letter-editor" value={letter} onChange={(event) => setLetter(event.target.value)} dir={rtl ? "rtl" : "auto"} spellCheck rows={Math.max(15, letter.split("\n").length + 3)} />

          {input.jobDescription.trim() && <section className="cover-keywords-section"><div><span className="eyebrow">من وصف الوظيفة</span><h3>الكلمات المهمة في إعلان الوظيفة</h3><p>الكلمات الخضراء ظهرت في الرسالة؛ أضف ما ينطبق على خبرتك فقط.</p></div><div className="cover-keywords-list">{keywords.map((keyword) => <span className={usedKeywords.includes(keyword) ? "is-used" : "is-unused"} key={keyword}><b aria-hidden="true">{usedKeywords.includes(keyword) ? "✓" : "·"}</b>{keyword}</span>)}</div></section>}

          <div className="cover-result-bottom-actions"><button className="button" type="button" onClick={startOver}>إنشاء Cover Letter جديدة <span aria-hidden="true">↻</span></button><p>احفظ نسخة وراجعها يدويًا قبل إرسالها. لا تتضمن الرسالة أي إنجازات لم تدخلها بنفسك.</p></div>
          <article className={`cover-print-document${rtl ? " is-rtl" : ""}`} dir={rtl ? "rtl" : "ltr"}><h1>{input.fullName}</h1><p>{input.location}</p><h2>{input.language === "ar" ? "طلب التقديم" : input.language === "fr" ? "Candidature" : input.language === "es" ? "Solicitud" : input.language === "de" ? "Bewerbung" : "Cover Letter"}</h2><div>{letter}</div></article>
        </section>
      )}
    </div>
  );
}
