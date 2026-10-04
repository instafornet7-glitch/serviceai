"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, FolderOpen, PenSquare, Send } from "lucide-react";
import { AdminNotice } from "@/components/admin-forms";
import { formatDate, getAllArticles, getCategories, type ArticleData, type Category } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const refresh = () => { setArticles(getAllArticles()); setCategories(getCategories()); };
    refresh();
    return subscribe((key) => {
      if (key === LOCAL_DB_KEYS.articles || key === LOCAL_DB_KEYS.categories) refresh();
    });
  }, []);
  const published = articles.filter((article) => article.status === "published").length;
  const drafts = articles.filter((article) => article.status === "draft").length;
  const stats = [
    { label: "إجمالي المقالات", value: articles.length, icon: FileText, tone: "blue" },
    { label: "مقالات منشورة", value: published, icon: Send, tone: "green" },
    { label: "مسودات", value: drafts, icon: PenSquare, tone: "gold" },
    { label: "التصنيفات", value: categories.length, icon: FolderOpen, tone: "lilac" },
  ];
  const latest = articles.slice(0, 5);
  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">مساحة العمل المحلية</span><h1>مرحبًا بك في لوحة التحكم</h1><p>تُحفظ بيانات هذه اللوحة على هذا المتصفح فقط.</p></div><Link className="admin-button admin-button-primary" href="/admin/articles/new"><span aria-hidden="true">+</span> إضافة مقال</Link></div>
      <section className="admin-stats-grid" aria-label="إحصائيات المحتوى">
        {stats.map(({ label, value, icon: Icon, tone }) => <article className="admin-stat-card" key={label}><span className={`admin-stat-icon tone-${tone}`}><Icon size={19} aria-hidden="true" /></span><span className="admin-stat-value">{value}</span><span className="admin-stat-label">{label}</span></article>)}
      </section>
      <section className="admin-panel-card admin-recent-card"><div className="admin-card-heading"><div><h2>آخر التعديلات</h2><p>أحدث المقالات التي أُنشئت أو عُدّلت.</p></div><Link href="/admin/articles">عرض المقالات <span aria-hidden="true">←</span></Link></div>
        {latest.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>عنوان المقال</th><th>الحالة</th><th>آخر تحديث</th><th>إجراء</th></tr></thead><tbody>{latest.map((article) => <tr key={article.id}><td><strong>{article.title}</strong></td><td><span className={`admin-status ${article.status === "published" ? "status-published" : "status-draft"}`}>{article.status === "published" ? "منشور" : "مسودة"}</span></td><td>{formatDate(article.updated_at)}</td><td><Link className="admin-row-action" href={`/admin/articles/${article.id}/edit`}>تعديل</Link></td></tr>)}</tbody></table></div> : <div className="admin-empty-state"><span aria-hidden="true">✦</span><strong>لا توجد مقالات بعد</strong><p>أضف أول مقال ليظهر هنا.</p><Link href="/admin/articles/new">إضافة مقال جديد <span aria-hidden="true">←</span></Link></div>}
      </section>
    </div>
  );
}
