import { createClient } from "@/lib/supabase/server";

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
  category: Category | null;
};

export type ArticleData = ArticleCardData & {
  content_html: string;
  meta_title: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

const articleFields = "id,title,slug,excerpt,featured_image,published_at,keywords,content_html,meta_title,meta_description,status,created_at,updated_at,category:categories(id,name,slug)";

export class CmsSchemaNotReadyError extends Error {
  constructor(cause: string) {
    super("The articles table is unavailable. Apply the Supabase CMS migration.", { cause });
    this.name = "CmsSchemaNotReadyError";
  }
}

function throwArticleQueryError(error: { code: string; message: string }, action: string): never {
  if (error.code === "PGRST205") throw new CmsSchemaNotReadyError(error.message);
  throw new Error(`Could not ${action}: ${error.message}`);
}

function normalizeArticle(row: Record<string, unknown>): ArticleData {
  const category = row.category as Category | Category[] | null;
  return {
    ...row,
    category: Array.isArray(category) ? category[0] ?? null : category,
  } as ArticleData;
}

export async function getPublishedArticles(limit?: number): Promise<ArticleCardData[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("id,title,slug,excerpt,featured_image,published_at,keywords,category:categories(id,name,slug)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throwArticleQueryError(error, "load published articles");

  return (data ?? []).map((row) => {
    const category = row.category as Category | Category[] | null;
    return { ...row, category: Array.isArray(category) ? category[0] ?? null : category } as ArticleCardData;
  });
}

export async function getPublishedArticle(slug: string): Promise<ArticleData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleFields)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) throwArticleQueryError(error, "load article");
  return data ? normalizeArticle(data as Record<string, unknown>) : null;
}

export async function getArticleById(id: string): Promise<ArticleData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select(articleFields).eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load article: ${error.message}`);
  return data ? normalizeArticle(data as Record<string, unknown>) : null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id,name,slug").order("name");
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return data ?? [];
}

export function articleCardCategory(article: ArticleCardData): string {
  return article.category?.name ?? "مقال مهني";
}

export function formatDate(date: string | null): string {
  if (!date) return "قريبًا";
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));
}
