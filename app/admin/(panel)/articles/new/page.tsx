import Link from "next/link";
import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin-forms";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "إضافة مقال" };

export default async function NewArticlePage() {
  const categories = await getCategories();
  return <div className="admin-page"><div className="admin-page-heading"><div><Link className="admin-breadcrumb" href="/admin/articles">المقالات <span aria-hidden="true">/</span> مقال جديد</Link><h1>إضافة مقال جديد</h1><p>أضف محتوى مفيدًا لجمهور ServiceAI.</p></div></div>{categories.length ? <ArticleForm article={null} categories={categories} /> : <div className="admin-alert">أضف تصنيفًا واحدًا على الأقل قبل إنشاء مقال. <Link href="/admin/categories">إدارة التصنيفات</Link></div>}</div>;
}
