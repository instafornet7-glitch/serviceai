"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PageData = { title: string; content: string };
type PagesData = Record<string, PageData>;

const labels: Record<string, string> = {
  "/contact": "تواصل معنا",
  "/about": "من نحن",
  "/tools": "الأدوات",
  "/blog": "المدونة",
  "/privacy": "سياسة الخصوصية",
  "/terms": "شروط الاستخدام",
};

export default function AdminSitePagesPage() {
  const [pages, setPages] = useState<PagesData>({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/pages")
      .then(async (response) => {
        if (!response.ok) throw new Error("تعذر تحميل الصفحات.");
        setPages(await response.json() as PagesData);
      })
      .catch((cause: unknown) => {
        console.error("Failed to load page list.", cause);
        setError(cause instanceof Error ? cause.message : "تعذر تحميل الصفحات.");
      });
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">إدارة محتوى الموقع</span>
          <h1>إدارة الصفحات</h1>
          <p>عدّل عناوين ومحتوى الصفحات العامة.</p>
        </div>
      </div>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <section className="admin-panel-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>اسم الصفحة</th><th>المسار</th><th>الإجراء</th></tr></thead>
          <tbody>
            {Object.keys(pages).map((slug) => (
              <tr key={slug}>
                <td><strong>{labels[slug] ?? pages[slug].title}</strong></td>
                <td dir="ltr">{slug}</td>
                <td><Link className="admin-row-action" href={`/admin/pages/${slug.slice(1)}`}>تعديل</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!error && Object.keys(pages).length === 0 && <p className="admin-empty-state">جارٍ تحميل الصفحات...</p>}
      </section>
    </div>
  );
}
