import Link from "next/link";
import { FileText, FolderOpen, PenSquare, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminNotice } from "@/components/admin-forms";

export const metadata = { title: "نظرة عامة" };

async function getDashboardStats() {
  const supabase = await createClient();
  const [all, published, drafts, categories, latest] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id,title,slug,status,updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);

  for (const result of [all, published, drafts, categories, latest]) {
    if (result.error) throw new Error(`Could not load dashboard data: ${result.error.message}`);
  }

  return {
    stats: [
      { label: "إجمالي المقالات", value: all.count ?? 0, icon: FileText, tone: "blue" },
      { label: "مقالات منشورة", value: published.count ?? 0, icon: Send, tone: "green" },
      { label: "مسودات", value: drafts.count ?? 0, icon: PenSquare, tone: "gold" },
      { label: "التصنيفات", value: categories.count ?? 0, icon: FolderOpen, tone: "lilac" },
    ],
    latest: latest.data ?? [],
  };
}

export default async function AdminDashboardPage() {
  const { stats, latest } = await getDashboardStats();
  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">مساحة العمل</span><h1>مرحبًا بك في لوحة التحكم</h1><p>إليك نظرة سريعة على محتوى ServiceAI.</p></div><Link className="admin-button admin-button-primary" href="/admin/articles/new"><span aria-hidden="true">+</span> إضافة مقال</Link></div>
      <section className="admin-stats-grid" aria-label="إحصائيات المحتوى">
        {stats.map(({ label, value, icon: Icon, tone }) => <article className="admin-stat-card" key={label}><span className={`admin-stat-icon tone-${tone}`}><Icon size={19} aria-hidden="true" /></span><span className="admin-stat-value">{value}</span><span className="admin-stat-label">{label}</span></article>)}
      </section>
      <section className="admin-panel-card admin-recent-card"><div className="admin-card-heading"><div><h2>آخر التعديلات</h2><p>أحدث المقالات التي أُنشئت أو عُدّلت.</p></div><Link href="/admin/articles">عرض المقالات <span aria-hidden="true">←</span></Link></div>
        {latest.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>عنوان المقال</th><th>الحالة</th><th>آخر تحديث</th><th>إجراء</th></tr></thead><tbody>{latest.map((article) => <tr key={article.id}><td><strong>{article.title}</strong></td><td><span className={`admin-status ${article.status === "published" ? "status-published" : "status-draft"}`}>{article.status === "published" ? "منشور" : "مسودة"}</span></td><td>{new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(new Date(article.updated_at))}</td><td><Link className="admin-row-action" href={`/admin/articles/${article.id}/edit`}>تعديل</Link></td></tr>)}</tbody></table></div> : <div className="admin-empty-state"><span aria-hidden="true">✦</span><strong>لا توجد مقالات بعد</strong><p>أضف أول مقال ليظهر هنا.</p><Link href="/admin/articles/new">إضافة مقال جديد <span aria-hidden="true">←</span></Link></div>}
      </section>
    </div>
  );
}
