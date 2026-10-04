import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type PageData = {
  title: string;
  content: string;
};

export type PagesData = Record<string, PageData>;

const pagesFile = path.join(process.cwd(), "data", "pages.json");
const pagePaths = new Set(["/contact", "/about", "/tools", "/blog", "/privacy", "/terms"]);

function normalizePageSlug(slug: string): string {
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  if (!pagePaths.has(normalized)) throw new Error("Unknown page slug.");
  return normalized;
}

export async function getPages(): Promise<PagesData> {
  const contents = await readFile(pagesFile, "utf8");
  return JSON.parse(contents) as PagesData;
}

export async function getPage(slug: string): Promise<PageData | null> {
  const pages = await getPages();
  return pages[normalizePageSlug(slug)] ?? null;
}

export async function updatePage(slug: string, data: PageData): Promise<PageData> {
  const pagePath = normalizePageSlug(slug);
  const pages = await getPages();
  const updated = { ...pages, [pagePath]: { title: data.title, content: data.content } };
  const temporaryFile = `${pagesFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
  await rename(temporaryFile, pagesFile);
  return updated[pagePath];
}
