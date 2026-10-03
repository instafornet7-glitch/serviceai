"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import { analyzeAtsKeywords } from "@/lib/ats-keywords";
import type { AtsKeyword, AtsKeywordAnalysis } from "@/lib/ats-keywords";
import { extractResumeText } from "@/lib/resume-analyzer";

const MAX_FILE_SIZE = 12 * 1024 * 1024;

const PRIORITY_LABELS = {
  high: "عالية الأهمية",
  medium: "متوسطة الأهمية",
  additional: "إضافية",
} as const;

function KeywordTags({ keywords, className = "" }: { keywords: AtsKeyword[]; className?: string }) {
  return <ul className={`ats-keyword-tags ${className}`}>
    {keywords.map((keyword) => <li key={`${keyword.term}-${keyword.category}`} className={`ats-keyword-tag priority-${keyword.priority}`}>
      <span dir="auto">{keyword.term}</span>
      <small>{PRIORITY_LABELS[keyword.priority]}</small>
    </li>)}
  </ul>;
}

export function AtsKeywordGenerator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AtsKeywordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectFile = (nextFile?: File) => {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLocaleLowerCase();
    if (!["pdf", "docx"].includes(extension ?? "")) {
      setError("صيغة الملف غير مدعومة. اختر سيرة ذاتية بصيغة PDF أو DOCX.");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError("حجم الملف أكبر من الحد المسموح (12 ميغابايت). اختر ملفًا أصغر.");
      return;
    }
    setFile(nextFile);
    setAnalysis(null);
    setError("");
    setNotice("");
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setError("");
    setNotice("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (description.trim().length < 30) {
      setError("ألصق وصف الوظيفة كاملًا أو أدخل 30 حرفًا على الأقل للحصول على تحليل مفيد.");
      document.getElementById("ats-job-description")?.focus();
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    setAnalysis(null);
    try {
      const extractedText = file ? await extractResumeText(file) : null;
      setAnalysis(analyzeAtsKeywords(description, extractedText, jobTitle));
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر قراءة السيرة الذاتية. تحقق من الملف وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, success: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(success);
      setError("");
    } catch {
      setError("تعذر النسخ تلقائيًا. حدّد النص وانسخه يدويًا.");
    }
  };

  const reset = () => {
    setJobTitle("");
    setDescription("");
    removeFile();
    setAnalysis(null);
    setNotice("");
    setError("");
    document.getElementById("ats-keyword-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("ats-job-description")?.focus(), 250);
  };

  const totalKeywords = analysis?.keywords.length ?? 0;
  const score = analysis?.match?.score ?? 0;

  return <div className="ats-app">
    <form className="ats-form-card" id="ats-keyword-form" onSubmit={(event) => { event.preventDefault(); void analyze(); }}>
      <div className="ats-form-heading">
        <span className="eyebrow">من الإعلان إلى كلمات واضحة</span>
        <h2>أدخل تفاصيل الوظيفة</h2>
        <p>وصف الوظيفة هو المصدر الأساسي للتحليل. أضف سيرتك الذاتية اختياريًا لمقارنة الكلمات محليًا.</p>
      </div>

      <label className="ats-field">المسمى الوظيفي <span className="ats-optional">اختياري</span>
        <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} maxLength={120} placeholder="مثال: Digital Marketing Specialist" />
      </label>

      <label className="ats-field">ألصق وصف الوظيفة Job Description <span>*</span>
        <textarea id="ats-job-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={9} maxLength={20000} placeholder="الصق الإعلان كاملًا، بما فيه المسؤوليات والمؤهلات والمهارات المطلوبة..." required aria-describedby="ats-description-hint" />
        <small id="ats-description-hint" className="ats-field-hint">كلما كان الإعلان أكمل، تحسن استخراج المتطلبات ومؤشرات الأولوية. {description.length.toLocaleString("ar")} / 20,000</small>
      </label>

      <div className="ats-upload-field">
        <span className="ats-label">السيرة الذاتية <span className="ats-optional">اختياري</span></span>
        <p>يمكنك رفع سيرتك الذاتية لمقارنتها مباشرة مع إعلان الوظيفة. تُقرأ محليًا في متصفحك فقط.</p>
        <input ref={inputRef} className="ats-file-input" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-label="اختر ملف السيرة الذاتية PDF أو DOCX" onChange={(event) => selectFile(event.target.files?.[0])} />
        {file ? <div className="ats-file-card">
          <span className="ats-file-icon" aria-hidden="true">{file.name.toLocaleLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}</span>
          <span className="ats-file-name"><strong>{file.name}</strong><small>{(file.size / (1024 * 1024)).toFixed(2)} MB · جاهز للمقارنة</small></span>
          <button className="ats-remove-file" type="button" onClick={removeFile}>حذف الملف <span aria-hidden="true">×</span></button>
        </div> : <button className={`ats-dropzone${dragging ? " is-dragging" : ""}`} type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} aria-describedby="ats-file-hint">
          <span className="ats-upload-icon" aria-hidden="true">↑</span><strong>اسحب ملفك وأفلته هنا</strong><span>أو اضغط لاختيار ملف من جهازك</span><small id="ats-file-hint">PDF أو DOCX · الحد الأقصى 12 MB</small>
        </button>}
      </div>

      {error && <p className="ats-alert" role="alert">{error}</p>}
      {notice && <p className="ats-notice" role="status">{notice}</p>}
      <button className="button ats-submit" type="submit" disabled={loading}>
        {loading ? <><span className="ats-spinner" aria-hidden="true" /> جاري استخراج أهم الكلمات والمهارات من إعلان الوظيفة...</> : <>{file ? "تحليل ومقارنة CV" : "تحليل إعلان الوظيفة"} <span aria-hidden="true">←</span></>}
      </button>
      {loading && <p className="ats-loading-note" role="status">نحلل متطلبات الإعلان ونقارنها بنص سيرتك إن أرفقتها. تستغرق العملية لحظات.</p>}
      <p className="ats-privacy-note"><span aria-hidden="true">◇</span> لا نحفظ وصف الوظيفة أو سيرتك الذاتية. يتم التحليل واستخراج الملف محليًا في متصفحك، ولا تُرسل ملفاتك إلى خادم.</p>
      <p className="ats-method-note">التحليل إرشادي بقواعد محلية، ولا يتصل بمزوّد ذكاء اصطناعي أو يضمن نتيجة لدى أنظمة ATS.</p>
    </form>

    {analysis && <section className="ats-results" ref={resultsRef} aria-labelledby="ats-results-title">
      <div className="ats-results-heading"><div><span className="eyebrow">تقرير الإعلان الوظيفي</span><h2 id="ats-results-title">تحليل الكلمات والمتطلبات</h2><p>{jobTitle.trim() || "المسمى الوظيفي غير محدد"} · {totalKeywords} مصطلحًا مناسبًا</p></div>{file && <span className="ats-result-file" title={file.name}>{file.name}</span>}</div>

      {analysis.match && <section className="ats-match-card" aria-label="مقارنة السيرة الذاتية بالوظيفة">
        <div className="ats-match-score" role="img" aria-label={`تطابق الكلمات المرجحة ${score} بالمئة`} style={{ "--ats-score": `${score * 3.6}deg` } as CSSProperties}><div><strong>{score}</strong><span>%</span></div></div>
        <div className="ats-match-copy"><span>Resume Match Score</span><h3>تطابق الكلمات المرجحة</h3><p>يقارن هذا المؤشر الكلمات المستخرجة من نص السيرة بمتطلبات الإعلان. لا يقيس ملاءمتك الفعلية للوظيفة ولا يضمن اجتياز نظام توظيف.</p></div>
        <div className="ats-match-total"><strong>{analysis.match.matched.length} / {analysis.keywords.length}</strong><span>كلمة مطابقة</span></div>
      </section>}

      <section className="ats-top-card">
        <div className="ats-section-heading"><div><span className="eyebrow">الأولوية في الإعلان</span><h3>Top ATS Keywords</h3><p>مرتبة حسب أولوية السياق وتكرار المصطلح في الإعلان.</p></div><button type="button" onClick={() => void copyText(analysis.topKeywords.map((keyword) => keyword.term).join("\n"), "تم نسخ أهم الكلمات المفتاحية.")}>نسخ جميع الكلمات</button></div>
        {analysis.topKeywords.length ? <ul className="ats-top-list">{analysis.topKeywords.map((keyword) => <li key={`top-${keyword.term}`}><div><strong dir="auto">{keyword.term}</strong><span className={`ats-priority priority-${keyword.priority}`}>{PRIORITY_LABELS[keyword.priority]}</span><small>استخدمها في: {keyword.recommendation}</small></div><button type="button" aria-label={`نسخ ${keyword.term}`} onClick={() => void copyText(keyword.term, `تم نسخ ${keyword.term}.`)}>نسخ</button></li>)}</ul> : <p className="ats-empty-state">لم نعثر على مصطلحات مهنية محددة في النص. جرّب لصق إعلان أكثر تفصيلًا.</p>}
      </section>

      <section className="ats-summary-card">
        <div className="ats-section-heading"><div><span className="eyebrow">ملخص سريع</span><h3>ملخص الوظيفة</h3></div></div>
        <ul>{analysis.summary.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="ats-disclaimer">هذا ملخص آلي محلي مبني على مصطلحات وقواعد نصية، وليس توليدًا من نموذج ذكاء اصطناعي. راجع الإعلان الأصلي للتحقق من السياق.</p>
      </section>

      <section className="ats-groups-section">
        <div className="ats-section-heading"><div><span className="eyebrow">تصنيف المصطلحات</span><h3>أهم الكلمات المفتاحية</h3></div><span>{analysis.groups.length} فئات</span></div>
        <div className="ats-group-grid">{analysis.groups.map((group) => <article className="ats-group-card" key={group.id}>
          <div className="ats-group-heading"><h4>{group.title}</h4><span>{group.keywords.length}</span></div>
          <KeywordTags keywords={group.keywords} />
        </article>)}</div>
      </section>

      {analysis.match && <section className="ats-match-details">
        <article className="ats-match-list-card">
          <div className="ats-section-heading"><div><span className="eyebrow">تم العثور عليها في نص السيرة</span><h3>الكلمات الموجودة في سيرتك الذاتية</h3></div><span className="ats-count-pill">{analysis.match.matched.length}</span></div>
          {analysis.match.matched.length ? <KeywordTags keywords={analysis.match.matched} className="is-match" /> : <p className="ats-empty-state">لم نجد تطابقًا نصيًا واضحًا بين السيرة والإعلان.</p>}
        </article>
        <article className="ats-match-list-card is-missing-card">
          <div className="ats-section-heading"><div><span className="eyebrow">راجعها قبل الإضافة</span><h3>الكلمات المهمة المفقودة</h3></div><span className="ats-count-pill">{analysis.match.missing.length}</span></div>
          {analysis.match.missing.length ? <KeywordTags keywords={analysis.match.missing} className="is-missing" /> : <p className="ats-empty-state">لم تظهر كلمات مفقودة من المصطلحات التي استخرجها هذا الفحص.</p>}
        </article>
      </section>}

      <section className="ats-requirements-card">
        <div className="ats-section-heading"><div><span className="eyebrow">مما ورد نصًا في الإعلان</span><h3>متطلبات الوظيفة</h3></div></div>
        <div className="ats-requirement-grid">
          {([
            ["سنوات الخبرة المطلوبة", analysis.requirements.experience],
            ["المستوى التعليمي", analysis.requirements.education],
            ["الشهادات المطلوبة", analysis.requirements.certifications],
            ["اللغات المطلوبة", analysis.requirements.languages],
            ["الأدوات المطلوبة", analysis.requirements.tools],
            ["المهارات الرئيسية", analysis.requirements.skills],
          ] as Array<[string, string[]]>).map(([title, values]) => <article className="ats-requirement-item" key={title}>
            <h4>{title}</h4>{values.length ? <KeywordTags keywords={values.map((term) => ({ term, category: "domain", priority: "medium", occurrences: 1, recommendation: "" }))} /> : <p>لم يذكر بوضوح في النص المستخرج.</p>}
          </article>)}
        </div>
      </section>

      {analysis.match && <section className="ats-improvement-card">
        <div className="ats-section-heading"><div><span className="eyebrow">خطوات عملية</span><h3>كيف يمكنك تحسين سيرتك الذاتية؟</h3></div></div>
        <ul>{analysis.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul>
        <p>أضف الكلمات المفتاحية فقط عندما تعكس مهارة أو خبرة حقيقية، ووضّحها بسياق أو إنجاز صادق. لا تضف كلمات لا تستطيع دعمها.</p>
      </section>}

      <div className="ats-related-tools">
        <div><span className="eyebrow">خطوتك التالية</span><h3>واصل تحسين طلبك الوظيفي</h3></div>
        <div className="ats-tool-links">
          <Link href="/tools/resume-builder"><strong>إنشاء CV بهذه الكلمات</strong><span>Resume Builder <b aria-hidden="true">←</b></span></Link>
          <Link href="/tools/resume-analyzer"><strong>تحليل السيرة الذاتية بالكامل</strong><span>Resume Analyzer <b aria-hidden="true">←</b></span></Link>
          <Link href="/tools/cover-letter-generator"><strong>كتابة رسالة لهذه الوظيفة</strong><span>Cover Letter Generator <b aria-hidden="true">←</b></span></Link>
        </div>
      </div>

      <button className="button ats-retry" type="button" onClick={reset}>تحليل وظيفة أخرى <span aria-hidden="true">↻</span></button>
    </section>}
  </div>;
}
