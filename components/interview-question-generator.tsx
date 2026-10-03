"use client";

import { useMemo, useState } from "react";
import type { InterviewInput, InterviewLanguage, InterviewQuestion, InterviewType } from "@/lib/interview-questions";
import { createInterviewQuestions, getInterviewSupportingContent } from "@/lib/interview-questions";

const initialInput: InterviewInput = {
  jobTitle: "",
  company: "",
  industry: "",
  yearsExperience: "",
  level: "intermediate",
  jobDescription: "",
  types: ["general", "behavioral", "hr"],
  count: 10,
  language: "ar",
  harder: false,
};

const interviewTypes: Array<[InterviewType, string]> = [
  ["general", "مقابلة عامة"],
  ["technical", "مقابلة تقنية"],
  ["hr", "مقابلة الموارد البشرية HR"],
  ["behavioral", "مقابلة سلوكية"],
  ["management", "مقابلة إدارية"],
];

const interviewLanguages: Array<[InterviewLanguage, string]> = [
  ["ar", "العربية"],
  ["en", "الإنجليزية"],
  ["fr", "الفرنسية"],
  ["es", "الإسبانية"],
  ["de", "الألمانية"],
];

function sampleName(name: string): string {
  const safe = name.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").replace(/\s+/g, "-").slice(0, 50);
  return safe || "interview-preparation";
}

export function InterviewQuestionGenerator() {
  const [input, setInput] = useState<InterviewInput>(initialInput);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [generation, setGeneration] = useState(0);
  const supporting = useMemo(() => getInterviewSupportingContent(input.language), [input.language]);
  const hasResults = questions.length > 0;

  const update = <K extends keyof InterviewInput>(key: K, value: InterviewInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const generate = async (override?: Partial<InterviewInput>, nextGeneration = generation + 1) => {
    const nextInput = { ...input, ...override };
    if (!nextInput.jobTitle.trim()) {
      setError(input.language === "ar" ? "أدخل المسمى الوظيفي المستهدف أولًا." : "Enter the target job title first.");
      document.getElementById("interview-job-title")?.focus();
      return;
    }
    if (!nextInput.types.length) {
      setError(input.language === "ar" ? "اختر نوعًا واحدًا على الأقل من المقابلات." : "Select at least one interview type.");
      return;
    }
    setInput(nextInput);
    setLoading(true);
    setError("");
    setNotice("");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setQuestions(createInterviewQuestions(nextInput, nextGeneration));
    setGeneration(nextGeneration);
    setLoading(false);
    window.setTimeout(() => document.getElementById("interview-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const changeType = (type: InterviewType, checked: boolean) => {
    setInput((current) => ({
      ...current,
      types: checked ? [...new Set([...current.types, type])] : current.types.filter((item) => item !== type),
    }));
  };

  const copyQuestions = async () => {
    const text = questions.map((question, index) => [
      `${index + 1}. ${question.question}`,
      `${input.language === "ar" ? "لماذا يُطرح هذا السؤال؟" : "Why this question?"} ${question.why}`,
      `${input.language === "ar" ? "إجابة مقترحة:" : "Suggested answer:"} ${question.answer}`,
      `${input.language === "ar" ? "نصيحة:" : "Tip:"} ${question.tip}`,
    ].join("\n")).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setNotice(input.language === "ar" ? "تم نسخ الأسئلة والإجابات والنصائح." : "Questions, answers, and tips copied.");
      setError("");
    } catch {
      setError(input.language === "ar" ? "تعذر النسخ تلقائيًا. حدّد النص وانسخه يدويًا." : "Could not copy automatically. Select and copy the text manually.");
    }
  };

  const downloadPdf = () => {
    const previousTitle = document.title;
    document.title = `${sampleName(input.jobTitle)}-interview-questions`;
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.print();
    setNotice(input.language === "ar" ? "من نافذة الطباعة اختر «حفظ بصيغة PDF»." : "Choose “Save as PDF” in the print dialog.");
  };

  const increaseDifficulty = () => {
    const next = { ...input, harder: true };
    void generate(next, generation + 1);
  };

  const generateOnly = (type: InterviewType) => {
    const next = { ...input, types: [type] };
    void generate(next, generation + 1);
  };

  const reset = () => {
    setInput(initialInput);
    setQuestions([]);
    setError("");
    setNotice("");
    setGeneration(0);
    document.getElementById("interview-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("interview-job-title")?.focus(), 250);
  };

  return (
    <div className="interview-app">
      <form id="interview-form" className="interview-form-card" onSubmit={(event) => { event.preventDefault(); void generate(); }}>
        <div className="interview-form-heading"><span className="eyebrow">تدرب على مقابلة تناسبك</span><h2>أخبرنا عن الوظيفة المستهدفة</h2><p>المسمى الوظيفي مطلوب. أضف التفاصيل التي تساعد على تخصيص الأسئلة، وتُستخدم بياناتك في هذه الصفحة فقط.</p></div>

        <section className="interview-form-section"><h3><span>01</span> معلومات الوظيفة والخبرة</h3>
          <div className="interview-fields-grid">
            <label className="interview-field">المسمى الوظيفي المستهدف <span>*</span><input id="interview-job-title" value={input.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} maxLength={120} placeholder="مثال: Frontend Developer أو أخصائي تسويق رقمي" required /></label>
            <label className="interview-field">اسم الشركة <small>اختياري</small><input value={input.company} onChange={(event) => update("company", event.target.value)} maxLength={120} placeholder="اسم الشركة" /></label>
            <label className="interview-field">مجال العمل أو الصناعة <small>اختياري</small><input value={input.industry} onChange={(event) => update("industry", event.target.value)} maxLength={120} placeholder="مثال: التجارة الإلكترونية، التقنية المالية" /></label>
            <label className="interview-field">سنوات الخبرة <small>اختياري</small><input value={input.yearsExperience} onChange={(event) => update("yearsExperience", event.target.value)} maxLength={40} placeholder="مثال: سنتان، 5 سنوات" /></label>
            <label className="interview-field">مستوى الخبرة<select value={input.level} onChange={(event) => update("level", event.target.value as InterviewInput["level"])}><option value="beginner">مبتدئ</option><option value="intermediate">متوسط</option><option value="senior">محترف / Senior</option></select></label>
          </div>
        </section>

        <section className="interview-form-section"><h3><span>02</span> وصف الوظيفة</h3>
          <label className="interview-field">وصف الوظيفة Job Description <small>اختياري</small><textarea value={input.jobDescription} onChange={(event) => update("jobDescription", event.target.value)} rows={5} maxLength={12000} placeholder="الصق إعلان الوظيفة أو أهم مسؤولياتها ومهاراتها هنا..." /><span className="interview-field-hint">إضافة الوصف تساعد على استخراج مصطلحات الإعلان وربط الأسئلة بها. لا ترسل الأداة بياناتك إلى خادم. {input.jobDescription.length.toLocaleString("ar")} / 12,000</span></label>
        </section>

        <section className="interview-form-section"><h3><span>03</span> إعداد المقابلة</h3>
          <fieldset className="interview-type-field"><legend>نوع المقابلة <small>يمكن اختيار أكثر من نوع</small></legend><div className="interview-type-options">{interviewTypes.map(([type, label]) => <label className="interview-type-choice" key={type}><input type="checkbox" checked={input.types.includes(type)} onChange={(event) => changeType(type, event.target.checked)} /><span>{label}</span></label>)}</div></fieldset>
          <div className="interview-fields-grid interview-options-grid">
            <label className="interview-field">عدد الأسئلة<select value={input.count} onChange={(event) => update("count", Number(event.target.value))}><option value={5}>5 أسئلة</option><option value={10}>10 أسئلة</option><option value={15}>15 سؤالًا</option><option value={20}>20 سؤالًا</option></select></label>
            <label className="interview-field">لغة المقابلة<select value={input.language} onChange={(event) => update("language", event.target.value as InterviewLanguage)}>{interviewLanguages.map(([language, label]) => <option value={language} key={language}>{label}</option>)}</select></label>
          </div>
        </section>

        {error && <p className="interview-alert" role="alert">{error}</p>}
        <button className="button interview-generate-button" type="submit" disabled={loading}>{loading ? <><span className="interview-spinner" aria-hidden="true" /> جاري إعداد مقابلة مخصصة لك...</> : <>إنشاء أسئلة المقابلة <span aria-hidden="true">←</span></>}</button>
        {loading && <p className="interview-loading-note" role="status">نرتب الأسئلة بحسب المسمى والوصف ونجهز إجابات إرشادية قابلة للتخصيص.</p>}
        <p className="interview-privacy-note"><span aria-hidden="true">◇</span> لا نحفظ بياناتك أو نتائجك بشكل دائم. هذه النسخة تنشئ الأسئلة محليًا في متصفحك.</p>
        <p className="interview-method-note">تنبيه: لا يتصل الإصدار الحالي بمزوّد ذكاء اصطناعي؛ الأسئلة والإجابات تُبنى محليًا بقواعد وقوالب متعددة اللغات.</p>
      </form>

      {hasResults && <section className="interview-results" id="interview-results" aria-labelledby="interview-results-title">
        <div className="interview-results-heading"><div><span className="eyebrow">جلسة تدريب مخصصة</span><h2 id="interview-results-title">{input.language === "ar" ? "أسئلة مقابلتك" : "Interview questions"}</h2><p>{input.jobTitle}{input.company ? ` · ${input.company}` : ""} · {supporting.level[input.level]} · {questions.length} {input.language === "ar" ? "أسئلة" : "questions"}</p></div><span className="interview-results-language">{interviewLanguages.find(([value]) => value === input.language)?.[1]}</span></div>

        <div className="interview-result-controls">
          <div className="interview-control-group"><button type="button" onClick={() => void generate(undefined, generation + 1)}>إنشاء أسئلة جديدة <span aria-hidden="true">↻</span></button><button type="button" onClick={increaseDifficulty}>زيادة صعوبة الأسئلة <span aria-hidden="true">↗</span></button></div>
          <div className="interview-control-group"><button type="button" onClick={() => generateOnly("technical")}>أسئلة تقنية فقط</button><button type="button" onClick={() => generateOnly("hr")}>أسئلة HR فقط</button><button type="button" onClick={() => void copyQuestions()}>نسخ جميع الأسئلة</button><button type="button" onClick={downloadPdf}>تحميل PDF</button></div>
        </div>
        {error && <p className="interview-alert" role="alert">{error}</p>}
        {notice && <p className="interview-notice" role="status">{notice}</p>}

        {questions.map((question, index) => <article className="interview-question-card" key={`${generation}-${question.id}`}>
          <div className="interview-question-top"><span className="interview-question-number">{String(index + 1).padStart(2, "0")}</span><span className={`interview-question-type type-${question.type}`}>{supporting.category[question.type]}</span><span className={`interview-difficulty difficulty-${question.difficulty === supporting.easy ? "easy" : question.difficulty === supporting.hard ? "hard" : "medium"}`}>{question.difficulty}</span></div>
          <h3 dir={input.language === "ar" ? "rtl" : "auto"}>{question.question}</h3>
          <div className="interview-question-detail"><h4>لماذا يُطرح هذا السؤال؟</h4><p>{question.why}</p></div>
          <div className="interview-answer"><h4>إجابة مقترحة</h4><p dir={input.language === "ar" ? "rtl" : "auto"}>{question.answer}</p><small>استبدل النص بين الأقواس بمعلومات صحيحة من تجربتك؛ لا تعرض المثال كأنه إنجازك قبل تخصيصه.</small></div>
          <div className="interview-tip"><h4>نصيحة</h4><p>{question.tip}</p></div>
          {question.isStar && <div className="interview-star-guide"><strong>طريقة STAR</strong><p>{supporting.star}</p><div><span><b>S</b> Situation</span><span><b>T</b> Task</span><span><b>A</b> Action</span><span><b>R</b> Result</span></div></div>}
        </article>)}

        <section className="interview-ask-company"><div><span className="eyebrow">في نهاية المقابلة</span><h3>أسئلة يمكنك طرحها على مسؤول التوظيف</h3></div><ol>{supporting.questionsToAsk.map((question) => <li key={question}>{question}</li>)}</ol></section>
        <section className="interview-prep-checklist"><div><span className="eyebrow">قبل موعدك</span><h3>نصائح سريعة قبل المقابلة</h3></div><ul>{supporting.before.map((tip) => <li key={tip}>{tip}</li>)}</ul></section>
        <div className="interview-new-session"><button className="button" type="button" onClick={reset}>إنشاء أسئلة جديدة <span aria-hidden="true">↻</span></button><p>أعدّل الأمثلة المقترحة لتتوافق مع خبرتك الفعلية، ولا تشارك معلومات لا ترغب في ذكرها.</p></div>
        <article className={`interview-print-document${input.language === "ar" ? " is-rtl" : ""}`} dir={input.language === "ar" ? "rtl" : "ltr"}><h1>{input.jobTitle}{input.company ? ` — ${input.company}` : ""}</h1><p>{questions.map((question, index) => `${index + 1}. ${question.question}\n\n${question.why}\n\n${question.answer}\n\n${question.tip}${question.isStar ? `\n\n${supporting.star}` : ""}`).join("\n\n")}</p><h2>{input.language === "ar" ? "أسئلة لمسؤول التوظيف" : "Questions for the interviewer"}</h2><p>{supporting.questionsToAsk.map((question, index) => `${index + 1}. ${question}`).join("\n")}</p></article>
      </section>}
    </div>
  );
}
