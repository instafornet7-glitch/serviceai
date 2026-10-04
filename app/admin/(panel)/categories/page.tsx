"use client";

import { useEffect, useState } from "react";
import { AdminNotice, CategoryForm } from "@/components/admin-forms";
import { DeleteCategoryButton } from "@/components/delete-category-button";
import { getAllArticles, getCategories, type Category } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const refresh = () => {
      setCategories(getCategories());
      setArticleCounts(getAllArticles().reduce<Record<string, number>>((counts, article) => {
        const id = article.category?.id;
        if (id) counts[id] = (counts[id] ?? 0) + 1;
        return counts;
      }, {}));
    };
    refresh();
    return subscribe((key) => {
      if (key === LOCAL_DB_KEYS.categories || key === LOCAL_DB_KEYS.articles) refresh();
    });
  }, []);
  return (
    <div className="admin-page">
      <AdminNotice />
      <div className="admin-page-heading"><div><span className="admin-kicker">تنظيم المحتوى</span><h1>التصنيفات</h1><p>التصنيفات محفوظة محليًا على هذا المتصفح.</p></div></div>
      <div className="admin-category-layout">
        <section className="admin-panel-card"><div className="admin-card-heading"><div><h2>إضافة تصنيف</h2><p>أضف تصنيفًا جديدًا إلى المدونة.</p></div></div><CategoryForm /></section>
        <section className="admin-panel-card"><div className="admin-card-heading"><div><h2>كل التصنيفات</h2><p>{categories.length} تصنيف</p></div></div>
          {categories.length ? <div className="admin-category-list">{categories.map((category) => <article className="admin-category-row" key={category.id}><div><strong>{category.name}</strong><small>/{category.slug} · {articleCounts[category.id] ?? 0} مقال</small></div><div className="admin-row-actions"><details className="admin-category-edit"><summary>تعديل</summary><div className="admin-category-edit-popover"><CategoryForm category={category} /></div></details><DeleteCategoryButton id={category.id} name={category.name} /></div></article>)}</div> : <div className="admin-empty-state"><strong>لا توجد تصنيفات بعد</strong><p>أضف تصنيفًا لبدء تنظيم مقالاتك.</p></div>}
        </section>
      </div>
    </div>
  );
}
