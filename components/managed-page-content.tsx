"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site";
import { sanitizeArticleHtml } from "@/lib/content";
import { get, LOCAL_DB_KEYS, subscribe } from "@/lib/localDB";
import { MANAGEABLE_SITE_PAGES, type ManagedPage } from "@/lib/site-pages";

type ManagedPageOverrides = Record<string, Pick<ManagedPage, "title" | "contentHtml">>;

export function ManagedPageContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [override, setOverride] = useState<Pick<ManagedPage, "title" | "contentHtml"> | null>(null);
  const page = MANAGEABLE_SITE_PAGES.find((item) => item.path === pathname);

  useEffect(() => {
    if (!page) return;
    const refresh = () => {
      try {
        const saved = get<ManagedPageOverrides>(LOCAL_DB_KEYS.pages, {});
        setOverride(saved[page.path] ?? null);
        setLoadedPath(page.path);
      } catch (error) {
        console.error("تعذر تحميل محتوى الصفحة المحلي.", error);
      }
    };
    queueMicrotask(refresh);
    return subscribe((key) => {
      if (key === LOCAL_DB_KEYS.pages) refresh();
    });
  }, [page]);

  useEffect(() => {
    if (!page || !override) return;
    const title = `${override.title} — ServiceAI`;
    const syncTitle = () => {
      if (document.title !== title) document.title = title;
    };
    syncTitle();
    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [override, page]);

  if (!page || loadedPath !== page.path || !override) return children;

  return (
    <>
      <SiteHeader active={page.path} />
      <main id="main">
        <section className="page-hero compact-page-hero">
          <div className="container">
            <span className="eyebrow"><span className="eyebrow-dot" />{page.label}</span>
            <h1>{override.title}</h1>
          </div>
        </section>
        <section className="section legal-section">
          <article className="container legal-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(override.contentHtml) }} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
