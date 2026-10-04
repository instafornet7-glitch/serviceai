"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleForm } from "@/components/admin-forms";
import { getArticleById, getCategories, type ArticleData, type Category } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleData | null | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const refresh = () => { setArticle(getArticleById(id)); setCategories(getCategories()); };
    refresh();
    return subscribe((key) => {
      if (key === LOCAL_DB_KEYS.articles || key === LOCAL_DB_KEYS.categories) refresh();
    });
  }, [id]);
  if (article === undefined) return <div className="admin-page">جارٍ تحميل المقال من التخزين المحلي...</div>;
  if (!article) notFound();
  return <div className="admin-page"><div className="admin-page-heading"><div><Link className="admin-breadcrumb" href="/admin/articles">المقالات <span aria-hidden="true">/</span> تعديل مقال</Link><h1>تعديل المقال</h1><p>{article.title}</p></div></div><ArticleForm article={article} categories={categories} /></div>;
}
