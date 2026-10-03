import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard, SiteFooter, SiteHeader } from "@/components/site";
import { CmsSchemaNotReadyError, formatDate, getPublishedArticle, getPublishedArticles } from "@/lib/data";
import { sanitizeArticleHtml } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSiteUrl } from "@/lib/site-url";
import { AdSlot } from "@/components/ad-slot";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: "المقال غير موجود", robots: { index: false, follow: false } };
  let article;
  try {
    article = await getPublishedArticle(slug);
  } catch (error) {
    if (!(error instanceof CmsSchemaNotReadyError)) throw error;
    return { title: "المقال غير موجود", robots: { index: false, follow: false } };
  }
  if (!article) return { title: "المقال غير موجود", robots: { index: false, follow: false } };
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt;
  const canonical = `/blog/${article.slug}`;
  return {
    title: { absolute: title },
    description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: article.published_at ?? undefined,
      images: article.featured_image ? [{ url: article.featured_image }] : undefined,
    },
    twitter: { card: article.featured_image ? "summary_large_image" : "summary", title, description, images: article.featured_image ? [article.featured_image] : undefined },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();
  let article;
  try {
    article = await getPublishedArticle(slug);
  } catch (error) {
    if (!(error instanceof CmsSchemaNotReadyError)) throw error;
    notFound();
  }
  if (!article) notFound();

  const allArticles = await getPublishedArticles(20);
  const otherArticles = allArticles.filter((item) => item.slug !== article.slug);
  const sameCategory = otherArticles.filter((item) => article.category && item.category?.id === article.category.id);
  const related = (sameCategory.length ? sameCategory : otherArticles).slice(0, 3);
  const safeHtml = sanitizeArticleHtml(article.content_html);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    inLanguage: "ar",
    articleSection: article.category?.name,
    keywords: article.keywords,
    author: { "@type": "Organization", name: "ServiceAI" },
    publisher: { "@type": "Organization", name: "ServiceAI" },
    mainEntityOfPage: new URL(`/blog/${article.slug}`, getSiteUrl()).toString(),
    ...(article.featured_image ? { image: [article.featured_image] } : {}),
  };

  return <>
    <SiteHeader active="/blog" />
    <main id="main"><article className="article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="article-header container">
        <Link className="breadcrumbs" href="/blog">المدونة <span aria-hidden="true">/</span> {article.category?.name ?? "مقال مهني"}</Link>
        <span className="eyebrow">{article.category?.name ?? "مقال مهني"} · {formatDate(article.published_at)}</span>
        <h1>{article.title}</h1><p className="article-lead">{article.excerpt}</p>
        {article.featured_image && <Image className="article-cover-image" src={article.featured_image} alt={article.title} width={1440} height={900} sizes="(max-width: 820px) 100vw, 820px" priority />}
      </header>
      <div className="container article-content">
        <div className="article-info"><span>تاريخ النشر: {formatDate(article.published_at)}</span><span>التصنيف: {article.category?.name ?? "مقال مهني"}</span></div>
        <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        <AdSlot id="blog-article" className="article-ad-placeholder" description="مساحة مخصصة للإعلانات المستقبلية داخل المقال." />
        {related.length > 0 && <section className="related-articles"><div className="section-heading"><span className="eyebrow">تابع القراءة</span><h2>مقالات <span className="text-gradient">ذات صلة.</span></h2></div><div className="blog-grid">{related.map((item) => <ArticleCard article={item} key={item.id} />)}</div></section>}
        <Link className="text-link article-back" href="/blog">العودة إلى المدونة <span aria-hidden="true">←</span></Link>
      </div>
    </article></main><SiteFooter />
  </>;
}
