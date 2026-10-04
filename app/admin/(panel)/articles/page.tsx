"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNotice } from "@/components/admin-forms";
import { DeleteArticleButton } from "@/components/delete-article-button";
import { formatDate, getAllArticles, type ArticleData } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  useEffect(() => {
    const refresh = () => setArticles(getAllArticles());
    refresh();
    return subscribe((key) => { if (key === LOCAL_DB_KEYS.articles) refresh(); });
  }, []);
  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">إدارة المحتوى المحلي</span><h1>المقالات</h1><p>أنشئ مقالاتك وحررها وتابع حالة النشر.</p></div><Link className="admin-button admin-button-primary" href="/admin/articles/new"><span aria-hidden="true">+</span> إضافة مقال</Link></div>
      <section className="admin-panel-card admin-list-card">
        {articles.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>المقال</th><th>التصنيف</th><th>الحالة</th><th>تاريخ النشر</th><th>الإجراءات</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td><strong>{article.title}</strong><small className="admin-slug">/blog/{article.slug}</small></td><td>{article.category?.name ?? "—"}</td><td><span className={`admin-status ${article.status === "published" ? "status-published" : "status-draft"}`}>{article.status === "published" ? "منشور" : "مسودة"}</span></td><td>{formatDate(article.published_at)}</td><td><div className="admin-row-actions"><Link className="admin-row-action" href={`/admin/articles/${article.id}/edit`}>تعديل</Link><DeleteArticleButton id={article.id} title={article.title} /></div></td></tr>)}</tbody></table></div> : <div className="admin-empty-state"><span aria-hidden="true">✦</span><strong>ابدأ بنشر مقالك الأول</strong><p>ستظهر مقالاتك هنا بعد إضافتها على هذا الجهاز.</p><Link href="/admin/articles/new">إضافة مقال <span aria-hidden="true">←</span></Link></div>}
      </section>
    </div>
  );
}
