"use client";

import { useEffect, useState, type FormEvent } from "react";
import { get, LOCAL_DB_KEYS, set } from "@/lib/localDB";
import { MANAGEABLE_SITE_PAGES, type ManagedPage } from "@/lib/site-pages";

type ManagedPageOverrides = Record<string, Pick<ManagedPage, "title" | "contentHtml">>;

export function AdminSitePagesForm() {
  const [selectedPath, setSelectedPath] = useState(MANAGEABLE_SITE_PAGES[0].path);
  const [overrides, setOverrides] = useState<ManagedPageOverrides>({});
  const [title, setTitle] = useState(MANAGEABLE_SITE_PAGES[0].title);
  const [contentHtml, setContentHtml] = useState(MANAGEABLE_SITE_PAGES[0].contentHtml);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedPage = MANAGEABLE_SITE_PAGES.find((page) => page.path === selectedPath) ?? MANAGEABLE_SITE_PAGES[0];

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = get<ManagedPageOverrides>(LOCAL_DB_KEYS.pages, {});
        setOverrides(saved);
        const current = saved[selectedPath];
        if (current) {
          setTitle(current.title);
          setContentHtml(current.contentHtml);
        }
      } catch (cause) {
        console.error("تعذر تحميل الصفحات من التخزين المحلي.", cause);
        setError("تعذر قراءة الصفحات من التخزين المحلي.");
      }
    });
  }, [selectedPath]);

  function selectPage(path: string) {
    const page = MANAGEABLE_SITE_PAGES.find((item) => item.path === path);
    if (!page) return;
    const saved = overrides[path];
    setSelectedPath(path);
    setTitle(saved?.title ?? page.title);
    setContentHtml(saved?.contentHtml ?? page.contentHtml);
    setMessage("");
    setError("");
  }

  function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!title.trim()) {
      setError("عنوان الصفحة مطلوب.");
      return;
    }
    if (!contentHtml.trim()) {
      setError("محتوى الصفحة مطلوب.");
      return;
    }
    const updated = { ...overrides, [selectedPath]: { title: title.trim(), contentHtml } };
    try {
      set(LOCAL_DB_KEYS.pages, updated);
      setOverrides(updated);
      setMessage("تم حفظ الصفحة محليًا بنجاح.");
    } catch (cause) {
      console.error("تعذر حفظ محتوى الصفحة محليًا.", cause);
      setError(cause instanceof Error ? cause.message : "تعذر حفظ محتوى الصفحة.");
    }
  }

  return (
    <div className="admin-site-pages">
      <nav className="admin-panel-card admin-site-pages-list" aria-label="قائمة صفحات الموقع">
        <h2>صفحات الموقع</h2>
        {MANAGEABLE_SITE_PAGES.map((page) => (
          <button
            className={page.path === selectedPath ? "is-active" : ""}
            key={page.path}
            type="button"
            onClick={() => selectPage(page.path)}
          >
            <span>{page.label}</span><small dir="ltr">{page.path}</small>
          </button>
        ))}
      </nav>
      <form className="admin-form admin-site-page-editor" onSubmit={savePage}>
        <section className="admin-panel-card">
          {error && <p className="admin-alert" role="alert">{error}</p>}
          {message && <p className="admin-success" role="status">{message}</p>}
          <div className="admin-card-heading">
            <div><h2>تعديل: {selectedPage.label}</h2><p dir="ltr">{selectedPage.path}</p></div>
          </div>
          <label htmlFor="managed-page-title">عنوان الصفحة</label>
          <input id="managed-page-title" value={title} maxLength={180} onChange={(event) => setTitle(event.currentTarget.value)} required />
          <label htmlFor="managed-page-content">المحتوى (HTML)</label>
          <textarea id="managed-page-content" className="admin-site-page-content" value={contentHtml} onChange={(event) => setContentHtml(event.currentTarget.value)} rows={16} required dir="ltr" />
          <p className="admin-help">يُعرض المحتوى بتنسيق آمن. بعض وسوم HTML والسكربتات غير مسموح بها.</p>
          <button className="admin-button admin-button-primary" type="submit">حفظ الصفحة</button>
        </section>
      </form>
    </div>
  );
}
