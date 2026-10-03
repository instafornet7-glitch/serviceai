import type { Metadata } from "next";
import { AdminNotice, CategoryForm } from "@/components/admin-forms";
import { DeleteCategoryButton } from "@/components/delete-category-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "إدارة التصنيفات" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id,name,slug,articles:articles(count)")
    .order("name");
  if (error) throw new Error(`Could not load categories: ${error.message}`);

  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">تنظيم المحتوى</span><h1>التصنيفات</h1><p>نظّم المقالات في موضوعات واضحة تسهّل على القراء اكتشافها.</p></div></div>
      <div className="admin-category-layout">
        <section className="admin-panel-card"><div className="admin-card-heading"><div><h2>إضافة تصنيف</h2><p>أضف تصنيفًا جديدًا إلى المدونة.</p></div></div><CategoryForm /></section>
        <section className="admin-panel-card"><div className="admin-card-heading"><div><h2>كل التصنيفات</h2><p>{categories?.length ?? 0} تصنيف</p></div></div>
          {categories?.length ? <div className="admin-category-list">{categories.map((category) => {
            const articleCounts = category.articles as { count: number }[] | null;
            return <article className="admin-category-row" key={category.id}><div><strong>{category.name}</strong><small>/{category.slug} · {articleCounts?.[0]?.count ?? 0} مقال</small></div><div className="admin-row-actions"><details className="admin-category-edit"><summary>تعديل</summary><div className="admin-category-edit-popover"><CategoryForm category={category} /></div></details><DeleteCategoryButton id={category.id} name={category.name} /></div></article>;
          })}</div> : <div className="admin-empty-state"><strong>لا توجد تصنيفات بعد</strong><p>أضف تصنيفًا لبدء تنظيم مقالاتك.</p></div>}
        </section>
      </div>
    </div>
  );
}
