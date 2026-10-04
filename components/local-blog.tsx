"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/site";
import { getPublishedArticle, getPublishedArticles, type ArticleCardData, type ArticleData } from "@/lib/data";
import { LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";
import { sanitizeArticleHtml } from "@/lib/content";

export function LocalArticleCards({ limit, className = "blog-grid" }: { limit?: number; className?: string }) {
  const [articles, setArticles] = useState<ArticleCardData[]>([]);
  useEffect(() => {
    const refresh = () => setArticles(getPublishedArticles(limit));
    refresh();
    return subscribe((key) => { if (key === LOCAL_DB_KEYS.articles || key === LOCAL_DB_KEYS.categories) refresh(); });
  }, [limit]);
  return <div className={className}>{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div>;
}

export function LocalBlogIndex() {
  const [articles, setArticles] = useState<ArticleCardData[]>([]);
  useEffect(() => {
    const refresh = () => setArticles(getPublishedArticles());
    refresh();
    return subscribe((key) => { if (key === LOCAL_DB_KEYS.articles || key === LOCAL_DB_KEYS.categories) refresh(); });
  }, []);
  return <>
    <div className="section-heading split-heading"><div><span className="eyebrow">دليلك المهني</span><h2>مقالاتنا <span className="text-gradient">الأخيرة.</span></h2></div><span className="results-label">{articles.length} مقال منشور على هذا الجهاز</span></div>
    {articles.length
      ? <div className="blog-grid blog-grid-page">{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div>
      : <div className="blog-empty"><span aria-hidden="true">✦</span><h2>لا توجد مقالات منشورة محليًا بعد.</h2><p>أضف مقالات من لوحة الإدارة على هذا المتصفح.</p></div>}
  </>;
}

export function LocalArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [allArticles, setAllArticles] = useState<ArticleCardData[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setArticle(getPublishedArticle(slug));
      setAllArticles(getPublishedArticles(20));
      setLoaded(true);
    };
    refresh();
    return subscribe((key) => { if (key === LOCAL_DB_KEYS.articles || key === LOCAL_DB_KEYS.categories) refresh(); });
  }, [slug]);
  if (!article) return <div className="container blog-empty"><h1>{loaded ? "المقال غير موجود" : "جارٍ تحميل المقال..."}</h1>{loaded && <p>قد يكون المقال غير منشور أو غير موجود في التخزين المحلي لهذا المتصفح.</p>}</div>;
  return <div className="container">
    <header className="article-header">
      <Link className="breadcrumbs" href="/blog">المدونة <span aria-hidden="true">/</span> {article.category?.name ?? "مقال مهني"}</Link>
      <span className="eyebrow">{article.category?.name ?? "مقال مهني"}</span>
      <h1>{article.title}</h1><p className="article-lead">{article.excerpt}</p>
      {article.featured_image && <Image className="article-cover-image" src={article.featured_image} alt={article.title} width={1440} height={900} unoptimized />}
    </header>
    <div className="article-content">
      <div className="article-info"><span>تاريخ النشر: {article.published_at ? new Intl.DateTimeFormat("ar", { dateStyle: "long" }).format(new Date(article.published_at)) : "—"}</span><span>التصنيف: {article.category?.name ?? "مقال مهني"}</span></div>
      <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content_html) }} />
      {allArticles.filter((item) => item.slug !== article.slug).slice(0, 3).length > 0 && <section className="related-articles"><div className="section-heading"><span className="eyebrow">تابع القراءة</span><h2>مقالات <span className="text-gradient">ذات صلة.</span></h2></div><div className="blog-grid">{allArticles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => <ArticleCard article={item} key={item.id} />)}</div></section>}
      <Link className="text-link article-back" href="/blog">العودة إلى المدونة <span aria-hidden="true">←</span></Link>
    </div>
  </div>;
}
