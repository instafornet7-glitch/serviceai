import type { MetadataRoute } from "next";
import { CmsSchemaNotReadyError, getPublishedArticles, type ArticleCardData } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().origin;
  const staticRoutes = ["", "/blog", "/tools", "/tools/resume-builder", "/tools/resume-analyzer", "/tools/cover-letter-generator", "/tools/interview-questions", "/tools/ats-keywords", "/about", "/contact", "/privacy", "/terms"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : ["/blog", "/tools/resume-builder", "/tools/resume-analyzer", "/tools/cover-letter-generator", "/tools/interview-questions", "/tools/ats-keywords"].includes(route) ? 0.8 : 0.5,
  }));
  let articles: ArticleCardData[] = [];
  if (isSupabaseConfigured()) {
    try {
      articles = await getPublishedArticles();
    } catch (error) {
      if (!(error instanceof CmsSchemaNotReadyError)) throw error;
      console.error(error.message, error.cause);
    }
  }
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: article.published_at ? new Date(article.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticEntries, ...articleEntries];
}
