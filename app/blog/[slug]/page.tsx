import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard, SiteFooter, SiteHeader } from "@/components/site";
import { LocalArticlePage } from "@/components/local-blog";
import blogs from "@/data/blogs.json";
import { sanitizeArticleHtml } from "@/lib/content";
import type { ArticleCardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find((article) => article.slug === slug);
  return {
    title: post?.seo_title ?? "مقال مهني | ServiceAI",
    description: post?.seo_description ?? "مقال ونصائح مهنية من مدونة ServiceAI.",
    alternates: { canonical: `/blog/${encodeURIComponent(slug)}` },
    robots: { index: Boolean(post), follow: true },
    ...(post && {
      openGraph: {
        type: "article",
        title: post.seo_title,
        description: post.seo_description,
        publishedTime: `${post.date}T12:00:00.000Z`,
        images: [post.image],
      },
    }),
  };
}

function toArticleCard(post: (typeof blogs)[number]): ArticleCardData {
  const categorySlug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featured_image: post.image,
    published_at: `${post.date}T12:00:00.000Z`,
    keywords: post.tags,
    author: post.author,
    tags: post.tags,
    language: post.language === "en" ? "en" : "ar",
    category: { id: `blog-category-${categorySlug}`, name: post.category, slug: categorySlug },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogs.find((article) => article.slug === slug);
  return <><SiteHeader active="/blog" /><main id="main"><article className="article-page">
    {post ? <div className="container">
      <header className="article-header">
        <Link className="breadcrumbs" href="/blog">المدونة <span aria-hidden="true">/</span> {post.category}</Link>
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="article-lead">{post.excerpt}</p>
        <Image className="article-cover-image" src={post.image} alt={post.title} width={1440} height={900} unoptimized />
      </header>
      <div className="article-content">
        <div className="article-info">
          <span>تاريخ النشر: {new Intl.DateTimeFormat(post.language, { dateStyle: "long" }).format(new Date(`${post.date}T12:00:00.000Z`))}</span>
          <span>التصنيف: {post.category}</span>
          <span>بقلم: {post.author}</span>
        </div>
        <p className="article-tags" aria-label="الكلمات المفتاحية">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
        <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }} />
        <section className="related-articles">
          <div className="section-heading"><span className="eyebrow">تابع القراءة</span><h2>مقالات <span className="text-gradient">ذات صلة.</span></h2></div>
          <div className="blog-grid">{blogs.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3).map((item) => <ArticleCard article={toArticleCard(item)} key={item.id} />)}</div>
        </section>
        <Link className="text-link article-back" href="/blog">العودة إلى المدونة <span aria-hidden="true">←</span></Link>
      </div>
    </div> : <LocalArticlePage slug={slug} />}
  </article></main><SiteFooter /></>;
}
