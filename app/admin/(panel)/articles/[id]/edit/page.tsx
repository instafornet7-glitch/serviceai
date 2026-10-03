import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin-forms";
import { getArticleById, getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "تعديل مقال" };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([getArticleById(id), getCategories()]);
  if (!article) notFound();
  return <div className="admin-page"><div className="admin-page-heading"><div><Link className="admin-breadcrumb" href="/admin/articles">المقالات <span aria-hidden="true">/</span> تعديل مقال</Link><h1>تعديل المقال</h1><p>{article.title}</p></div></div><ArticleForm article={article} categories={categories} /></div>;
}
