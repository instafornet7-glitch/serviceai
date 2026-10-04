import { get, LOCAL_DB_KEYS } from "@/lib/localDB";
import seedBlogs from "@/data/blogs.json";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ArticleCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string | null;
  keywords: string[];
  author: string;
  tags: string[];
  language: "ar" | "en";
  category: Category | null;
};

export type ArticleData = ArticleCardData & {
  content_html: string;
  meta_title: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type StoredArticle = Partial<Omit<ArticleData, "category">> & {
  id: string;
  title: string;
  slug: string;
  category_id?: string;
  content?: string;
  date?: string;
  image?: string;
  category?: Category | null;
  author?: string;
  tags?: string[];
};

function categories(): Category[] {
  return get<Category[]>(LOCAL_DB_KEYS.categories, []);
}

function normalizeArticle(article: StoredArticle): ArticleData {
  const category = article.category && typeof article.category === "object"
    ? article.category
    : categories().find((item) => item.id === article.category_id) ?? null;
  const publishedAt = article.published_at ?? article.date ?? null;
  const content = article.content_html ?? article.content ?? "";
  const excerpt = article.excerpt ?? content.replace(/<[^>]*>/g, "").trim().slice(0, 280);
  const timestamp = publishedAt ?? new Date().toISOString();
  return {
    ...article,
    excerpt,
    featured_image: article.featured_image ?? article.image ?? null,
    published_at: publishedAt,
    keywords: Array.isArray(article.keywords) ? article.keywords : [],
    category: category ?? null,
    content_html: content,
    meta_title: article.meta_title ?? null,
    meta_description: article.meta_description ?? null,
    status: article.status ?? "published",
    author: article.author ?? "ServiceAI Team",
    tags: Array.isArray(article.tags) ? article.tags : Array.isArray(article.keywords) ? article.keywords : [],
    language: article.language === "en" ? "en" : "ar",
    created_at: article.created_at ?? timestamp,
    updated_at: article.updated_at ?? timestamp,
  };
}

function articles(): ArticleData[] {
  const merged = new Map<string, StoredArticle>();
  for (const post of seedBlogs) {
    const categorySlug = post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const language: "ar" | "en" = post.language === "en" ? "en" : "ar";
    merged.set(post.id, {
      ...post,
      language,
      category: { id: `blog-category-${categorySlug}`, name: post.category, slug: categorySlug },
      featured_image: post.image,
      published_at: new Date(`${post.date}T12:00:00.000Z`).toISOString(),
      keywords: post.tags,
      meta_title: post.seo_title,
      meta_description: post.seo_description,
      status: "published",
      created_at: new Date(`${post.date}T12:00:00.000Z`).toISOString(),
      updated_at: new Date(`${post.date}T12:00:00.000Z`).toISOString(),
    });
  }
  for (const article of get<StoredArticle[]>(LOCAL_DB_KEYS.articles, [])) {
    merged.set(article.id, article);
  }
  return [...merged.values()].map(normalizeArticle);
}

export function getPublishedArticles(limit?: number): ArticleCardData[] {
  const now = Date.now();
  const published = articles()
    .filter((article) => article.status === "published" && (!article.published_at || Date.parse(article.published_at) <= now))
    .sort((a, b) => Date.parse(b.published_at ?? b.updated_at) - Date.parse(a.published_at ?? a.updated_at))
  return (limit ? published.slice(0, limit) : published).map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    featured_image: article.featured_image,
    published_at: article.published_at,
    keywords: article.keywords,
    author: article.author,
    tags: article.tags,
    language: article.language,
    category: article.category,
  }));
}

export function getPublishedArticle(slug: string): ArticleData | null {
  const article = articles()
    .find((item) => item.slug === slug && item.status === "published"
      && (!item.published_at || Date.parse(item.published_at) <= Date.now()));
  return article ?? null;
}

export function getArticleById(id: string): ArticleData | null {
  return articles().find((item) => item.id === id) ?? null;
}

export function getCategories(): Category[] {
  return categories().sort((a, b) => a.name.localeCompare(b.name, "ar"));
}

export function getAllArticles(): ArticleData[] {
  return articles()
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}

export function articleCardCategory(article: ArticleCardData): string {
  return article.category?.name ?? "مقال مهني";
}

export function formatDate(date: string | null): string {
  if (!date) return "قريبًا";
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}
