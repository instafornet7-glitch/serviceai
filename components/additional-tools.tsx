"use client";

import { useState, type FormEvent } from "react";
import { makeId, LOCAL_DB_KEYS, remove, set } from "@/lib/localDB";
import { useLocalDBValue } from "@/lib/use-local-db";

type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: string;
  followUpDate: string;
};

export function CareerGuidanceTool() {
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState(false);

  return <section className="section mini-tool-section"><div className="container">
    <form className="mini-tool-panel" onSubmit={(event) => { event.preventDefault(); setPlan(true); }}>
      <h2>كوّن خطة مهنية أولية</h2>
      <p>أجب عن سؤالين لتحصل على خطوات إرشادية عملية. لا تُرسل إجاباتك إلى خادم.</p>
      <label>المجال أو المسمى الذي تستهدفه<input value={role} onChange={(event) => setRole(event.currentTarget.value)} placeholder="مثال: التسويق الرقمي" required /></label>
      <label>هدفك المهني في الأشهر القادمة<textarea value={goal} onChange={(event) => setGoal(event.currentTarget.value)} rows={3} placeholder="مثال: إيجاد فرصة مبتدئة أو تطوير مهارة محددة" required /></label>
      <button className="button" type="submit">اعرض خطتي <span aria-hidden="true">←</span></button>
      {plan && <div className="mini-tool-result" role="status"><h3>خطواتك المقترحة نحو {role}</h3><ol>
        <li>راجع 3 إعلانات وظائف في {role} وسجّل المهارات المتكررة بينها.</li>
        <li>حدّث سيرتك الذاتية لتوضح خبراتك المرتبطة بهدفك: {goal}.</li>
        <li>حدّد موعدًا أسبوعيًا للتقديم والمتابعة، ثم راجع النتائج وعدّل خطتك.</li>
      </ol><p>هذه إرشادات عامة لمساعدتك على التخطيط، وليست توصية مهنية مخصصة.</p></div>}
    </form>
  </div></section>;
}

export function JobSearchOrganizer() {
  const applications = useLocalDBValue<JobApplication[]>(LOCAL_DB_KEYS.jobApplications, []);
  const [error, setError] = useState("");

  function addApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const application: JobApplication = {
      id: makeId(),
      company: String(form.get("company") ?? "").trim(),
      role: String(form.get("role") ?? "").trim(),
      status: String(form.get("status") ?? "تم التقديم"),
      followUpDate: String(form.get("followUpDate") ?? ""),
    };
    try {
      const updated = [application, ...applications];
      set(LOCAL_DB_KEYS.jobApplications, updated);
      setError("");
      event.currentTarget.reset();
    } catch (cause) {
      console.error("Failed to save job application locally.", cause);
      setError(cause instanceof Error ? cause.message : "تعذر حفظ الطلب على هذا الجهاز.");
    }
  }

  function deleteApplication(id: string) {
    try {
      remove<JobApplication>(LOCAL_DB_KEYS.jobApplications, id);
      setError("");
    } catch (cause) {
      console.error("Failed to delete job application locally.", cause);
      setError(cause instanceof Error ? cause.message : "تعذر حذف الطلب.");
    }
  }

  return <section className="section mini-tool-section"><div className="container">
    <form className="mini-tool-panel" onSubmit={addApplication}>
      <h2>أضف فرصة جديدة</h2>
      <p>تُحفظ تفاصيل طلباتك في LocalStorage على هذا المتصفح فقط.</p>
      <div className="mini-tool-grid">
        <label>الشركة<input name="company" maxLength={100} required /></label>
        <label>المسمى الوظيفي<input name="role" maxLength={100} required /></label>
        <label>الحالة<select name="status"><option>تم التقديم</option><option>مقابلة</option><option>متابعة</option><option>عرض عمل</option><option>مغلق</option></select></label>
        <label>موعد المتابعة<input name="followUpDate" type="date" /></label>
      </div>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <button className="button" type="submit">حفظ الفرصة <span aria-hidden="true">+</span></button>
    </form>
    <div className="mini-tool-list"><h2>فرصك ({applications.length})</h2>
      {applications.length === 0 ? <p>لم تضف فرصًا بعد.</p> : applications.map((application) => (
        <article className="mini-tool-application" key={application.id}>
          <div><h3>{application.role} — {application.company}</h3><p>{application.status}{application.followUpDate ? ` · متابعة ${application.followUpDate}` : ""}</p></div>
          <button type="button" onClick={() => deleteApplication(application.id)} aria-label={`حذف طلب ${application.role} لدى ${application.company}`}>حذف</button>
        </article>
      ))}
    </div>
  </div></section>;
}

export function ProfileReviewTool() {
  const [profile, setProfile] = useState("");
  const [review, setReview] = useState<string[] | null>(null);

  function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = profile.toLowerCase();
    const checks: [RegExp, string][] = [
      [/\b(مدير|مهندس|مصمم|محلل|developer|designer|engineer|manager|specialist|consultant)\b/i, "أضف مسمى مهنيًا واضحًا في بداية النبذة."],
      [/\b(سنوات|خبرة|years|experience)\b/i, "وضح مدة خبرتك أو نطاق عملك إذا كان ذلك مناسبًا."],
      [/\b(زيادة|خفض|تحسين|نمو|%|رفع|تقليل|improved|increased|reduced)\b/i, "ادعم إنجازاتك بنتائج أو أرقام قابلة للقياس."],
      [/\b(مهارة|أداة|تقنية|skill|tool|technology|excel|python|sql)\b/i, "اذكر مهارات أو أدوات محددة مرتبطة بالدور المستهدف."],
    ];
    const suggestions = checks.filter(([pattern]) => !pattern.test(normalized)).map(([, suggestion]) => suggestion);
    if (profile.trim().length < 100) suggestions.unshift("وسّع نبذتك لتتضمن خبرتك ونتيجة ملموسة وهدفك المهني.");
    if (!suggestions.length) suggestions.push("نبذتك تتضمن عناصر جيدة. راجع وضوحها وتأكد أن كل ادعاء دقيق ومثبت.");
    setReview(suggestions);
  }

  return <section className="section mini-tool-section"><div className="container">
    <form className="mini-tool-panel" onSubmit={analyze}>
      <h2>راجع نبذتك المهنية</h2>
      <p>الصق النبذة لتحصل على قائمة تحقق محلية حول الوضوح والإنجازات والمهارات.</p>
      <label>النبذة المهنية<textarea value={profile} onChange={(event) => setProfile(event.currentTarget.value)} rows={8} maxLength={3000} required placeholder="اكتب نبذتك هنا..." /></label>
      <button className="button" type="submit">راجع النبذة <span aria-hidden="true">←</span></button>
      {review && <div className="mini-tool-result" role="status"><h3>ملاحظات لتحسين الملف</h3><ul>{review.map((item) => <li key={item}>{item}</li>)}</ul><p>تعمل المراجعة محليًا بمؤشرات نصية عامة، ولا تمثل تقييمًا من جهة توظيف.</p></div>}
    </form>
  </div></section>;
}
