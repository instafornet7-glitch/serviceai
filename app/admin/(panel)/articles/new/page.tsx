"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleForm } from "@/components/admin-forms";
import { getCategories, type Category } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";

export default function NewArticlePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const refresh = () => setCategories(getCategories());
    refresh();
    return subscribe((key) => { if (key === LOCAL_DB_KEYS.categories) refresh(); });
  }, []);
  return <div className="admin-page"><div className="admin-page-heading"><div><Link className="admin-breadcrumb" href="/admin/articles">المقالات <span aria-hidden="true">/</span> مقال جديد</Link><h1>إضافة مقال جديد</h1><p>أضف محتوى مفيدًا لجمهور ServiceAI.</p></div></div>{categories.length ? <ArticleForm article={null} categories={categories} /> : <div className="admin-alert">أضف تصنيفًا واحدًا على الأقل قبل إنشاء مقال. <Link href="/admin/categories">إدارة التصنيفات</Link></div>}</div>;
}
