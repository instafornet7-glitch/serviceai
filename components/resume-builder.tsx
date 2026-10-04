"use client";

import { useState } from "react";

type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
};

type WorkExperience = {
  id: string;
  jobTitle: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  graduationDate: string;
  location: string;
};

type Language = {
  id: string;
  name: string;
  proficiency: string;
};

type ResumeData = {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: Language[];
};

const steps = [
  { title: "المعلومات الشخصية", description: "الاسم وطرق التواصل" },
  { title: "النبذة المهنية", description: "تعريف موجز بخبرتك" },
  { title: "الخبرات المهنية", description: "خبراتك وإنجازاتك" },
  { title: "التعليم", description: "المؤهلات الدراسية" },
  { title: "المهارات", description: "أبرز نقاط قوتك" },
  { title: "اللغات", description: "مستوى إتقانك" },
];

const emptyPersonal: PersonalInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
};

function newId(): string {
  return crypto.randomUUID();
}

function formatMonth(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "short" }).format(new Date(year, month - 1, 1));
}

function DateRange({ start, end, current }: { start: string; end: string; current?: boolean }) {
  const first = formatMonth(start);
  const last = current ? "حتى الآن" : formatMonth(end);
  if (!first && !last) return null;
  return <span className="resume-date-range">{first}{first && last ? " — " : ""}{last}</span>;
}

function ContactValue({ value }: { value: string }) {
  const safeHref = value.trim().match(/^https?:\/\//i) ? value.trim() : `https://${value.trim()}`;
  return <span dir="auto">{value.startsWith("http") ? <a href={safeHref} target="_blank" rel="noreferrer">{value.replace(/^https?:\/\//i, "")}</a> : value}</span>;
}

function ResumePreview({ data, printId }: { data: ResumeData; printId: string }) {
  const { personal } = data;
  const contacts = [
    personal.email && <ContactValue value={personal.email} key="email" />,
    personal.phone && <ContactValue value={personal.phone} key="phone" />,
    personal.location && <ContactValue value={personal.location} key="location" />,
    personal.linkedin && <ContactValue value={personal.linkedin} key="linkedin" />,
    personal.website && <ContactValue value={personal.website} key="website" />,
  ].filter(Boolean);
  const hasExperience = data.experience.some((item) => item.jobTitle || item.company || item.description);
  const hasEducation = data.education.some((item) => item.institution || item.degree);

  return (
    <article className="resume-paper" id={printId} aria-label="معاينة السيرة الذاتية">
      <header className="resume-paper-header">
        <h2 dir="auto">{personal.fullName || "اسمك الكامل"}</h2>
        <p className="resume-job-title" dir="auto">{personal.jobTitle || "المسمى الوظيفي"}</p>
        {contacts.length > 0 && <div className="resume-contact-list">{contacts.map((contact, index) => <span className="resume-contact-item" key={index}>{contact}</span>)}</div>}
        {contacts.length === 0 && <p className="resume-contact-placeholder">البريد الإلكتروني · الهاتف · المدينة</p>}
      </header>
      {data.summary.trim() && <section className="resume-section"><h3>النبذة المهنية</h3><p className="resume-summary" dir="auto">{data.summary.trim()}</p></section>}
      {hasExperience && <section className="resume-section"><h3>الخبرات المهنية</h3><div className="resume-items">{data.experience.filter((item) => item.jobTitle || item.company || item.description).map((item) => <article className="resume-entry" key={item.id}><div className="resume-entry-heading"><div><h4 dir="auto">{item.jobTitle || "المسمى الوظيفي"}</h4><p dir="auto">{[item.company, item.city].filter(Boolean).join(" · ")}</p></div><DateRange start={item.startDate} end={item.endDate} current={item.current} /></div>{item.description.trim() && <div className="resume-entry-description" dir="auto">{item.description.trim()}</div>}</article>)}</div></section>}
      {hasEducation && <section className="resume-section"><h3>التعليم</h3><div className="resume-items">{data.education.filter((item) => item.institution || item.degree).map((item) => <article className="resume-entry" key={item.id}><div className="resume-entry-heading"><div><h4 dir="auto">{item.degree || "الشهادة أو التخصص"}</h4><p dir="auto">{[item.institution, item.location].filter(Boolean).join(" · ")}</p></div><DateRange start={item.startDate} end={item.graduationDate} /></div></article>)}</div></section>}
      {data.skills.length > 0 && <section className="resume-section"><h3>المهارات</h3><ul className="resume-skill-list">{data.skills.map((skill, index) => <li dir="auto" key={`${skill}-${index}`}>{skill}</li>)}</ul></section>}
      {data.languages.some((language) => language.name.trim()) && <section className="resume-section"><h3>اللغات</h3><ul className="resume-language-list">{data.languages.filter((language) => language.name.trim()).map((language) => <li key={language.id}><strong dir="auto">{language.name}</strong>{language.proficiency && <span dir="auto">{language.proficiency}</span>}</li>)}</ul></section>}
      {!personal.fullName && !personal.jobTitle && !data.summary && !hasExperience && !hasEducation && !data.skills.length && !data.languages.length && <p className="resume-empty-hint">ابدأ بإضافة بياناتك، وستظهر سيرتك الذاتية هنا مباشرة.</p>}
    </article>
  );
}

function Field({ label, name, value, onChange, type = "text", placeholder, required = false, autoComplete }: {
  label: string; name: keyof PersonalInfo; value: string; onChange: (name: keyof PersonalInfo, value: string) => void;
  type?: string; placeholder?: string; required?: boolean; autoComplete?: string;
}) {
  return <label className="resume-field">{label}{required && <span aria-hidden="true"> *</span>}<input id={name === "fullName" ? "resume-full-name" : `resume-${name}`} type={type} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} required={required} autoComplete={autoComplete} dir={name === "email" || name === "phone" || name === "linkedin" || name === "website" ? "ltr" : undefined} /></label>;
}

export function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>({
    personal: emptyPersonal,
    summary: "",
    experience: [],
    education: [],
    skills: [],
    languages: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [notice, setNotice] = useState("");

  const updatePersonal = (name: keyof PersonalInfo, value: string) => {
    setData((previous) => ({ ...previous, personal: { ...previous.personal, [name]: value } }));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    setData((previous) => ({
      ...previous,
      experience: previous.experience.map((item) => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData((previous) => ({
      ...previous,
      education: previous.education.map((item) => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const addSkills = () => {
    const additions = skillInput.split(/[,\n،]+/).map((skill) => skill.trim()).filter(Boolean);
    if (!additions.length) return;
    setData((previous) => ({ ...previous, skills: Array.from(new Set([...previous.skills, ...additions])) }));
    setSkillInput("");
  };

  const goNext = () => {
    if (step === 0) {
      const nameInput = document.getElementById("resume-full-name");
      const emailInput = document.getElementById("resume-email");
      if (nameInput instanceof HTMLInputElement && !nameInput.reportValidity()) return;
      if (emailInput instanceof HTMLInputElement && emailInput.value && !emailInput.reportValidity()) return;
    }
    setNotice("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const downloadPdf = () => {
    if (!data.personal.fullName.trim()) {
      setNotice("أدخل اسمك الكامل أولًا لتجهيز السيرة الذاتية.");
      setStep(0);
      document.getElementById("resume-full-name")?.focus();
      return;
    }
    setNotice("من نافذة الطباعة، اختر «حفظ بصيغة PDF» لتنزيل سيرتك الذاتية.");
    const previousTitle = document.title;
    document.title = `${data.personal.fullName.trim()} - السيرة الذاتية`;
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.setTimeout(() => window.print(), 100);
  };

  const clearAll = () => {
    if (!window.confirm("سيتم حذف جميع البيانات المدخلة من هذه الصفحة. هل تريد المتابعة؟")) return;
    setData({ personal: emptyPersonal, summary: "", experience: [], education: [], skills: [], languages: [] });
    setSkillInput("");
    setStep(0);
    setNotice("تم مسح البيانات. يمكنك البدء من جديد.");
  };

  return (
    <>
      <div className="resume-workspace">
        <section className="resume-form-column" aria-label="خطوات إنشاء السيرة الذاتية">
          <div className="resume-form-topline"><div><span className="eyebrow">قالب احترافي واحد</span><h2>بيانات سيرتك الذاتية</h2></div><button className="resume-reset-button" type="button" onClick={clearAll}>مسح البيانات والبدء من جديد</button></div>
          <nav className="resume-stepper" aria-label="خطوات إنشاء السيرة الذاتية">
            {steps.map((item, index) => <button className={`resume-step ${step === index ? "is-active" : ""} ${step > index ? "is-complete" : ""}`} type="button" key={item.title} onClick={() => { setStep(index); setNotice(""); }} aria-current={step === index ? "step" : undefined}><span className="resume-step-number">{step > index ? "✓" : index + 1}</span><span className="resume-step-copy"><strong>{item.title}</strong><small>{item.description}</small></span></button>)}
          </nav>
          <section className="resume-step-panel" aria-labelledby="resume-step-heading">
            <div className="resume-step-heading"><span className="resume-step-count">الخطوة {step + 1} من {steps.length}</span><h3 id="resume-step-heading">{steps[step].title}</h3><p>{steps[step].description}</p></div>

            {step === 0 && <div className="resume-input-grid">
              <Field label="الاسم الكامل" name="fullName" value={data.personal.fullName} onChange={updatePersonal} placeholder="مثال: سارة أحمد" required autoComplete="name" />
              <Field label="المسمى الوظيفي" name="jobTitle" value={data.personal.jobTitle} onChange={updatePersonal} placeholder="مثال: أخصائية تسويق رقمي" autoComplete="organization-title" />
              <Field label="البريد الإلكتروني" name="email" value={data.personal.email} onChange={updatePersonal} type="email" placeholder="name@example.com" autoComplete="email" />
              <Field label="رقم الهاتف" name="phone" value={data.personal.phone} onChange={updatePersonal} type="tel" placeholder="+966 5X XXX XXXX" autoComplete="tel" />
              <Field label="المدينة والدولة" name="location" value={data.personal.location} onChange={updatePersonal} placeholder="الرياض، المملكة العربية السعودية" autoComplete="address-level2" />
              <Field label="رابط LinkedIn (اختياري)" name="linkedin" value={data.personal.linkedin} onChange={updatePersonal} type="url" placeholder="https://linkedin.com/in/yourname" autoComplete="url" />
              <Field label="الموقع الشخصي (اختياري)" name="website" value={data.personal.website} onChange={updatePersonal} type="url" placeholder="https://yourwebsite.com" autoComplete="url" />
            </div>}

            {step === 1 && <div className="resume-single-field"><label className="resume-field" htmlFor="resume-summary">النبذة المهنية<textarea id="resume-summary" value={data.summary} onChange={(event) => setData((previous) => ({ ...previous, summary: event.target.value }))} rows={7} maxLength={1000} placeholder="اكتب نبذة قصيرة عن خبرتك وأبرز نقاط قوتك وما الذي تطمح إلى تحقيقه..." /></label><div className="resume-field-bottom"><span>{data.summary.length} / 1000</span><button className="resume-ai-button" type="button" onClick={() => setNotice("تحسين النبذة الآلي غير مفعّل في هذا الإصدار؛ استخدم إرشادات الصفحة لمراجعتها بنفسك.")}>✦ إرشادات تحسين النبذة</button></div><p className="resume-privacy-hint">تُعالج بياناتك في هذه الصفحة فقط؛ لا نحفظها في قاعدة بيانات أو نرسلها إلى خدمة ذكاء اصطناعي.</p></div>}

            {step === 2 && <div className="resume-repeat-section"><p className="resume-helper">أضف خبراتك من الأحدث إلى الأقدم. هذه الخطوة اختيارية ويمكنك إضافة أكثر من وظيفة.</p>{data.experience.map((item, index) => <article className="resume-repeat-card" key={item.id}><div className="resume-repeat-title"><strong>الخبرة {index + 1}</strong><button type="button" onClick={() => setData((previous) => ({ ...previous, experience: previous.experience.filter((entry) => entry.id !== item.id) }))}>حذف الخبرة</button></div><div className="resume-input-grid"><label className="resume-field">المسمى الوظيفي<input value={item.jobTitle} onChange={(event) => updateExperience(item.id, "jobTitle", event.target.value)} placeholder="مثال: محللة بيانات" /></label><label className="resume-field">اسم الشركة<input value={item.company} onChange={(event) => updateExperience(item.id, "company", event.target.value)} placeholder="اسم الشركة" /></label><label className="resume-field">المدينة<input value={item.city} onChange={(event) => updateExperience(item.id, "city", event.target.value)} placeholder="المدينة، الدولة" /></label><label className="resume-field">تاريخ البداية<input type="month" value={item.startDate} onChange={(event) => updateExperience(item.id, "startDate", event.target.value)} /></label><label className="resume-field">تاريخ النهاية<input type="month" value={item.endDate} disabled={item.current} onChange={(event) => updateExperience(item.id, "endDate", event.target.value)} /></label><label className="resume-current-job"><input type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, "current", event.target.checked)} /> أعمل هنا حاليًا</label><label className="resume-field resume-field-full">المهام والإنجازات<textarea rows={4} value={item.description} onChange={(event) => updateExperience(item.id, "description", event.target.value)} placeholder={"اكتب كل مهمة أو إنجاز في سطر مستقل.\nمثال: حسّنت كفاءة العملية بنسبة 20%."} /></label></div></article>)}<button className="resume-add-button" type="button" onClick={() => setData((previous) => ({ ...previous, experience: [...previous.experience, { id: newId(), jobTitle: "", company: "", city: "", startDate: "", endDate: "", current: false, description: "" }] }))}><span aria-hidden="true">+</span> إضافة خبرة عمل</button></div>}

            {step === 3 && <div className="resume-repeat-section"><p className="resume-helper">أضف مؤهلاتك الدراسية، بدءًا بالأحدث. لا حاجة لإضافة أي معلومات لا ترغب بمشاركتها.</p>{data.education.map((item, index) => <article className="resume-repeat-card" key={item.id}><div className="resume-repeat-title"><strong>المؤهل {index + 1}</strong><button type="button" onClick={() => setData((previous) => ({ ...previous, education: previous.education.filter((entry) => entry.id !== item.id) }))}>حذف المؤهل</button></div><div className="resume-input-grid"><label className="resume-field">المؤسسة التعليمية<input value={item.institution} onChange={(event) => updateEducation(item.id, "institution", event.target.value)} placeholder="اسم الجامعة أو المؤسسة" /></label><label className="resume-field">الشهادة أو التخصص<input value={item.degree} onChange={(event) => updateEducation(item.id, "degree", event.target.value)} placeholder="مثال: بكالوريوس علوم الحاسوب" /></label><label className="resume-field">تاريخ البداية<input type="month" value={item.startDate} onChange={(event) => updateEducation(item.id, "startDate", event.target.value)} /></label><label className="resume-field">تاريخ التخرج<input type="month" value={item.graduationDate} onChange={(event) => updateEducation(item.id, "graduationDate", event.target.value)} /></label><label className="resume-field resume-field-full">المدينة أو الدولة<input value={item.location} onChange={(event) => updateEducation(item.id, "location", event.target.value)} placeholder="المدينة، الدولة" /></label></div></article>)}<button className="resume-add-button" type="button" onClick={() => setData((previous) => ({ ...previous, education: [...previous.education, { id: newId(), institution: "", degree: "", startDate: "", graduationDate: "", location: "" }] }))}><span aria-hidden="true">+</span> إضافة مؤهل دراسي</button></div>}

            {step === 4 && <div className="resume-single-field"><p className="resume-helper">أضف المهارات الأكثر ارتباطًا بالدور الذي تستهدفه. أمثلة: SEO، Google Ads، Microsoft Excel، تصميم الجرافيك، البرمجة.</p><label className="resume-field" htmlFor="resume-skill-input">أضف مهاراتك<input id="resume-skill-input" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addSkills(); } }} placeholder="اكتب مهارة ثم اضغط Enter" /></label><button className="resume-add-button resume-add-skill" type="button" onClick={addSkills}>إضافة المهارة <span aria-hidden="true">+</span></button>{data.skills.length > 0 && <div className="resume-skill-chips" aria-label="المهارات المضافة">{data.skills.map((skill) => <span className="resume-skill-chip" key={skill}>{skill}<button type="button" aria-label={`حذف مهارة ${skill}`} onClick={() => setData((previous) => ({ ...previous, skills: previous.skills.filter((item) => item !== skill) }))}>×</button></span>)}</div>}<p className="resume-privacy-hint">اقتراح المهارات الآلي غير مفعّل في هذا الإصدار. اختر المهارات التي تمتلكها فعلًا، واجعلها محددة وذات صلة بالوظيفة.</p></div>}

            {step === 5 && <div className="resume-repeat-section"><p className="resume-helper">اذكر اللغات التي تتحدث بها ومستوى إتقانك لكل منها.</p>{data.languages.map((item, index) => <article className="resume-repeat-card resume-language-card" key={item.id}><div className="resume-repeat-title"><strong>اللغة {index + 1}</strong><button type="button" onClick={() => setData((previous) => ({ ...previous, languages: previous.languages.filter((entry) => entry.id !== item.id) }))}>حذف</button></div><div className="resume-input-grid"><label className="resume-field">اسم اللغة<input value={item.name} onChange={(event) => setData((previous) => ({ ...previous, languages: previous.languages.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry) }))} placeholder="مثال: العربية" /></label><label className="resume-field">مستوى الإتقان<select value={item.proficiency} onChange={(event) => setData((previous) => ({ ...previous, languages: previous.languages.map((entry) => entry.id === item.id ? { ...entry, proficiency: event.target.value } : entry) }))}><option value="">اختر المستوى</option><option>اللغة الأم</option><option>متقدم</option><option>جيد</option><option>متوسط</option><option>مبتدئ</option></select></label></div></article>)}<button className="resume-add-button" type="button" onClick={() => setData((previous) => ({ ...previous, languages: [...previous.languages, { id: newId(), name: "", proficiency: "" }] }))}><span aria-hidden="true">+</span> إضافة لغة</button><p className="resume-privacy-hint">مراجعة بياناتك قبل الطباعة مهمة؛ لا تُرسل المعلومات إلى خادم أو تخزّن بعد مغادرة الصفحة.</p></div>}

            {notice && <p className="resume-notice" role="status" aria-live="polite">{notice}</p>}
            <div className="resume-step-actions">{step > 0 ? <button className="resume-previous-button" type="button" onClick={() => { setStep((current) => current - 1); setNotice(""); }}>السابق</button> : <span />}<button className="button" type="button" onClick={step === steps.length - 1 ? downloadPdf : goNext}>{step === steps.length - 1 ? "تحميل السيرة الذاتية PDF" : "التالي"} <span aria-hidden="true">←</span></button></div>
          </section>
        </section>
        <aside className="resume-preview-column"><div className="resume-preview-toolbar"><div><span className="eyebrow">معاينة مباشرة</span><strong>قالب ATS احترافي</strong></div><button className="resume-preview-print" type="button" onClick={downloadPdf} aria-label="طباعة السيرة الذاتية أو حفظها PDF">↓ PDF</button></div><div className="resume-preview-scroll"><ResumePreview data={data} printId="resume-print-target" /></div><p className="resume-preview-footnote">معاينة خاصة بك — لا يتم حفظ البيانات.</p></aside>
      </div>

      <div className="resume-page-actions" aria-label="إجراءات السيرة الذاتية"><button className="button" type="button" onClick={downloadPdf}>تحميل السيرة الذاتية PDF <span aria-hidden="true">↓</span></button><button className="resume-reset-button" type="button" onClick={clearAll}>مسح البيانات والبدء من جديد</button></div>

    </>
  );
}
