import Link from "next/link";
import { AdminNotice } from "@/components/admin-forms";
import { DeleteArticleButton } from "@/components/delete-article-button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";

export const metadata = { title: "إدارة المقالات" };

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles, error } = await supabase.from("articles").select("id,title,slug,status,published_at,updated_at,category:categories(name)").order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load articles: ${error.message}`);

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">إدارة المحتوى</span><h1>المقالات</h1><p>أنشئ مقالاتك وحررها وتابع حالة النشر.</p></div><Link className="admin-button admin-button-primary" href="/admin/articles/new"><span aria-hidden="true">+</span> إضافة مقال</Link></div>
      <section className="admin-panel-card admin-list-card">
        {articles?.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>المقال</th><th>التصنيف</th><th>الحالة</th><th>تاريخ النشر</th><th>الإجراءات</th></tr></thead><tbody>{articles.map((article) => {
          const category = article.category as { name: string } | { name: string }[] | null;
          const categoryName = Array.isArray(category) ? category[0]?.name : category?.name;
          return <tr key={article.id}><td><strong>{article.title}</strong><small className="admin-slug">/blog/{article.slug}</small></td><td>{categoryName ?? "—"}</td><td><span className={`admin-status ${article.status === "published" ? "status-published" : "status-draft"}`}>{article.status === "published" ? "منشور" : "مسودة"}</span></td><td>{formatDate(article.published_at)}</td><td><div className="admin-row-actions"><Link className="admin-row-action" href={`/admin/articles/${article.id}/edit`}>تعديل</Link><DeleteArticleButton id={article.id} title={article.title} /></div></td></tr>;
        })}</tbody></table></div> : <div className="admin-empty-state"><span aria-hidden="true">✦</span><strong>ابدأ بنشر مقالك الأول</strong><p>ستظهر مقالاتك هنا بعد إضافتها.</p><Link href="/admin/articles/new">إضافة مقال <span aria-hidden="true">←</span></Link></div>}
      </section>
    </div>
  );
}
