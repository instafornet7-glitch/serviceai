"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { analyzeResume, extractResumeText } from "@/lib/resume-analyzer";
import type { ResumeAnalysis } from "@/lib/resume-analyzer";

const MAX_FILE_SIZE = 12 * 1024 * 1024;

export function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);

  const chooseFile = (nextFile?: File) => {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLocaleLowerCase();
    if (!["pdf", "docx"].includes(extension ?? "")) {
      setError("صيغة الملف غير مدعومة. يمكنك رفع ملف PDF أو DOCX فقط.");
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
    chooseFile(event.dataTransfer.files[0]);
  };

  const runAnalysis = async () => {
    if (!file) {
      setError("ارفع سيرتك الذاتية أولًا لبدء التحليل.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    setAnalysis(null);
    try {
      const text = await extractResumeText(file);
      const result = analyzeResume(text, jobDescription);
      setAnalysis(result);
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر تحليل الملف. تحقق منه وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const copyMissingKeywords = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis.missingKeywords.join(", "));
      setNotice("تم نسخ الكلمات المفتاحية المفقودة.");
    } catch {
      setError("تعذر النسخ تلقائيًا. حدّد الكلمات وانسخها يدويًا.");
    }
  };

  const startOver = () => {
    removeFile();
    setJobTitle("");
    setJobDescription("");
    document.getElementById("resume-analyzer-tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => dropzoneRef.current?.focus(), 250);
  };

  return (
    <div className="analyzer-app" id="resume-analyzer-tool">
      <section className="analyzer-card" aria-label="إعداد تحليل السيرة الذاتية">
        <div className="analyzer-card-heading">
          <span className="eyebrow">فحص أولي مجاني</span>
          <h2>ابدأ بتحليل سيرتك الذاتية</h2>
          <p>استخراج النص وتحليله يتم محليًا في متصفحك. لا تُرفع سيرتك إلى خادمنا.</p>
        </div>

        <div className="analyzer-upload-field">
          <span className="analyzer-label">ارفع سيرتك الذاتية <span>*</span></span>
          <input
            ref={inputRef}
            className="analyzer-file-input"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-label="اختر ملف السيرة الذاتية PDF أو DOCX"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          {file ? (
            <div className="analyzer-file-card">
              <span className="analyzer-file-icon" aria-hidden="true">{file.name.toLocaleLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}</span>
              <span className="analyzer-file-name"><strong>{file.name}</strong><small>{(file.size / (1024 * 1024)).toFixed(2)} MB · جاهز للتحليل</small></span>
              <button className="analyzer-file-remove" type="button" onClick={removeFile} aria-label="حذف الملف ورفع ملف آخر">حذف الملف <span aria-hidden="true">×</span></button>
            </div>
          ) : (
            <button
              ref={dropzoneRef}
              className={`analyzer-dropzone${dragging ? " is-dragging" : ""}`}
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              aria-describedby="analyzer-file-hint"
            >
              <span className="analyzer-upload-icon" aria-hidden="true">↑</span>
              <strong>اسحب ملفك وأفلته هنا</strong>
              <span>أو اضغط لاختيار ملف من جهازك</span>
              <small id="analyzer-file-hint">PDF أو DOCX · الحد الأقصى 12 MB</small>
            </button>
          )}
        </div>

        <div className="analyzer-job-fields">
          <label className="analyzer-field">ما الوظيفة التي تريد التقديم عليها؟ <span className="analyzer-optional">اختياري</span>
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="مثال: Digital Marketing Specialist" />
          </label>
          <label className="analyzer-field">وصف الوظيفة <span className="analyzer-optional">اختياري</span>
            <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={5} maxLength={12000} placeholder="الصق هنا وصف الوظيفة أو أهم متطلباتها..." />
          </label>
          <p className="analyzer-field-hint">إضافة وصف الوظيفة تساعد على مقارنة الكلمات المفتاحية في سيرتك مع متطلبات الإعلان بدقة أكبر. {jobDescription.length.toLocaleString("ar")} / 12,000</p>
        </div>

        {error && <p className="analyzer-alert" role="alert">{error}</p>}
        {notice && <p className="analyzer-notice" role="status">{notice}</p>}
        <button className="button analyzer-submit" type="button" onClick={runAnalysis} disabled={loading}>
          {loading ? <><span className="analyzer-spinner" aria-hidden="true" /> جارٍ تحليل سيرتك الذاتية...</> : <>تحليل السيرة الذاتية <span aria-hidden="true">←</span></>}
        </button>
        {loading && <p className="analyzer-loading-note" role="status">نقرأ النص ونفحص الأقسام والمؤشرات الأساسية محليًا على جهازك. قد يستغرق ذلك لحظات.</p>}
        <p className="analyzer-privacy"><span aria-hidden="true">◇</span> نحن نحترم خصوصيتك. لا يتم الاحتفاظ بسيرتك الذاتية بشكل دائم بعد انتهاء عملية التحليل.</p>
      </section>

      {analysis && (
        <section className="analyzer-results" ref={resultsRef} aria-labelledby="analyzer-results-title">
          <div className="analyzer-results-heading">
            <div><span className="eyebrow">تقرير الفحص</span><h2 id="analyzer-results-title">نتيجة تحليل سيرتك الذاتية</h2><p>هذه مؤشرات آلية أولية للنص القابل للاستخراج، وليست تقييمًا مضمونًا لقرار أنظمة التوظيف.{jobTitle.trim() && <> الوظيفة المستهدفة: <strong>{jobTitle.trim()}</strong>.</>}</p></div>
            <span className="analyzer-result-filename">{file?.name}</span>
          </div>

          <div className="analyzer-score-card">
            <div className="analyzer-score-ring" style={{ "--score-angle": `${analysis.score * 3.6}deg` } as React.CSSProperties} role="img" aria-label={`مؤشر ATS: ${analysis.score} من 100`}>
              <div><strong>{analysis.score}</strong><span>/ 100</span></div>
            </div>
            <div className="analyzer-score-copy"><span>مؤشر التوافق مع ATS</span><h3>{analysis.rating}</h3><p>يعتمد المؤشر على وضوح الأقسام، ومعلومات التواصل، والمهارات، وطول النص المستخرج. أضف وصف الوظيفة لمقارنة الكلمات المفتاحية.</p></div>
            <div className="analyzer-score-meta"><strong>{analysis.wordCount.toLocaleString("ar")}</strong><span>كلمة مستخرجة</span></div>
          </div>

          {analysis.keywordScore !== null && (
            <section className="analyzer-keyword-card" aria-labelledby="analyzer-keywords-title">
              <div className="analyzer-section-heading"><div><span className="eyebrow">مطابقة وصف الوظيفة</span><h3 id="analyzer-keywords-title">تحليل الكلمات المفتاحية ATS</h3></div><strong className="analyzer-keyword-score">{analysis.keywordScore}%</strong></div>
              <div className="analyzer-keyword-track" role="progressbar" aria-label="نسبة تطابق الكلمات المفتاحية" aria-valuenow={analysis.keywordScore} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${analysis.keywordScore}%` }} /></div>
              <div className="analyzer-keyword-columns">
                <div><h4>كلمات موجودة في السيرة</h4>{analysis.matchedKeywords.length ? <ul className="analyzer-keyword-list is-matched">{analysis.matchedKeywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul> : <p className="analyzer-empty-copy">لم تُكتشف كلمات مشتركة في المقارنة الأولية.</p>}</div>
                <div><div className="analyzer-missing-heading"><h4>كلمات مهمة غير مكتشفة</h4>{analysis.missingKeywords.length > 0 && <button type="button" onClick={copyMissingKeywords}>نسخ الكلمات</button>}</div>{analysis.missingKeywords.length ? <ul className="analyzer-keyword-list is-missing">{analysis.missingKeywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul> : <p className="analyzer-empty-copy">لم تظهر كلمات مفقودة من قائمة المصطلحات التي فُحصت.</p>}</div>
              </div>
              <p className="analyzer-disclaimer">المقارنة تعتمد على كلمات نصية متطابقة فقط؛ راجع كل مصطلح وأضفه إلى سيرتك إذا كان يصف خبرتك فعلًا.</p>
            </section>
          )}

          <section className="analyzer-checks-section">
            <div className="analyzer-section-heading"><div><span className="eyebrow">نظرة تفصيلية</span><h3>تحليل أقسام السيرة الذاتية</h3></div><span className="analyzer-check-count">{analysis.checks.filter((check) => check.good).length} من {analysis.checks.length} مؤشرات جيدة</span></div>
            <div className="analyzer-check-grid">{analysis.checks.map((check) => <article className={`analyzer-check-card${check.good ? " is-good" : " is-warning"}`} key={check.title}><span className="analyzer-check-icon" aria-hidden="true">{check.good ? "✓" : "!"}</span><div><h4>{check.title}<span>{check.good ? "جيد" : "يحتاج إلى تحسين"}</span></h4><p>{check.detail}</p></div></article>)}</div>
          </section>

          <div className="analyzer-insight-grid">
            <section className="analyzer-insight-card analyzer-strengths"><span className="eyebrow">ما يعمل جيدًا</span><h3>نقاط القوة في سيرتك الذاتية</h3><ul>{analysis.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul></section>
            <section className="analyzer-insight-card analyzer-improvements"><span className="eyebrow">خطوات عملية</span><h3>ما الذي يجب تحسينه؟</h3><ol>{analysis.improvements.map((improvement, index) => <li key={`${index}-${improvement}`}>{improvement}</li>)}</ol></section>
          </div>

          <section className="analyzer-suggestions"><span className="eyebrow">خطوتك التالية</span><h3>اقتراحات لتحسين سيرتك الذاتية</h3><ul>
            <li>أضف أرقامًا ونتائج قابلة للقياس إلى خبراتك المهنية، وتأكد أنها دقيقة ويمكنك شرحها.</li>
            <li>اجعل النبذة المهنية موجزة ومخصصة للدور، واذكر التخصص والخبرة والمهارات ذات الصلة.</li>
            <li>استخدم عناوين أقسام مألوفة ونصًا واضحًا ونقاط تعداد بسيطة ليسهل استخراجه.</li>
            {analysis.missingKeywords.length > 0 && <li>راجع الكلمات المفتاحية المفقودة وأضف فقط ما لديك خبرة حقيقية به.</li>}
          </ul></section>
          <button className="button analyzer-retry" type="button" onClick={startOver}>تحليل سيرة ذاتية أخرى <span aria-hidden="true">↻</span></button>
        </section>
      )}
    </div>
  );
}
