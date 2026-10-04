"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

type PageData = { title: string; content: string };

export default function EditManagedPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [page, setPage] = useState<PageData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/pages?slug=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as PageData & { error?: string };
        if (!response.ok) throw new Error(data.error ?? "تعذر تحميل الصفحة.");
        setPage(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        console.error("Failed to load managed page.", cause);
        setError(cause instanceof Error ? cause.message : "تعذر تحميل الصفحة.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [slug]);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, content }),
      });
      const result = await response.json() as PageData & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "تعذر حفظ الصفحة.");
      setPage(result);
      setTitle(result.title);
      setContent(result.content);
      setMessage("تم الحفظ");
    } catch (cause) {
      console.error("Failed to save managed page.", cause);
      setError(cause instanceof Error ? cause.message : "تعذر حفظ الصفحة.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">إدارة محتوى الموقع</span>
          <h1>تعديل الصفحة</h1>
          <p dir="ltr">/{slug}</p>
        </div>
        <Link className="admin-button admin-button-secondary" href="/admin/pages">العودة للصفحات</Link>
      </div>
      {loading && <p role="status">جارٍ تحميل الصفحة...</p>}
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {page && <form className="admin-panel-card admin-managed-page-form" onSubmit={savePage}>
        {message && <p className="admin-success" role="status">{message}</p>}
        <label htmlFor="managed-page-title">عنوان الصفحة</label>
        <input id="managed-page-title" value={title} maxLength={180} required onChange={(event) => setTitle(event.currentTarget.value)} />
        <label htmlFor="managed-page-content">محتوى HTML</label>
        <textarea id="managed-page-content" value={content} rows={18} dir="ltr" onChange={(event) => setContent(event.currentTarget.value)} />
        <button className="admin-button admin-button-primary" type="submit" disabled={saving}>{saving ? "جارٍ الحفظ..." : "حفظ"}</button>
      </form>}
    </div>
  );
}
