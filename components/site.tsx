import Link from "next/link";
import Image from "next/image";
import type { ArticleCardData } from "@/lib/data";
import { articleCardCategory, formatDate } from "@/lib/data";
import { SiteBrand, SiteFooterBottom, SiteFooterContent } from "@/components/site-branding-display";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/tools", label: "الأدوات" },
  { href: "/blog", label: "المدونة" },
  { href: "/about", label: "من نحن" },
];

export function SiteHeader({ active = "" }: { active?: string }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <SiteBrand />
        <details className="mobile-navigation">
          <summary className="menu-toggle" aria-label="القائمة الرئيسية"><span></span><span></span><span></span></summary>
          <nav className="primary-nav" aria-label="القائمة الرئيسية">
            {navLinks.map((item) => <Link className={active === item.href ? "active" : ""} aria-current={active === item.href ? "page" : undefined} href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </details>
        <nav className="desktop-navigation" aria-label="القائمة الرئيسية">
          {navLinks.map((item) => <Link className={active === item.href ? "active" : ""} aria-current={active === item.href ? "page" : undefined} href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <Link className="button button-small header-cta" href="/tools">اكتشف الأدوات <span aria-hidden="true">←</span></Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <SiteFooterContent />
      </div>
      <SiteFooterBottom />
    </footer>
  );
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const category = articleCardCategory(article);
  const visual = /مقابل/.test(category) ? "visual-interview" : /لينكد|حضور/.test(category) ? "visual-linkedin" : "visual-cv";

  return (
    <Link className="article-card" href={`/blog/${article.slug}`}>
      <div className={`article-visual ${visual}`}>
        {article.featured_image ? <Image className="article-card-image" src={article.featured_image} alt="" fill sizes="(max-width: 680px) 40vw, (max-width: 940px) 30vw, 370px" /> : <span className="article-placeholder-icon" aria-hidden="true">✦</span>}
        <span className="visual-tag">{category}</span>
      </div>
      <div className="article-body"><div className="article-meta"><span>{category}</span><span>{formatDate(article.published_at)}</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><span className="card-link">اقرأ المقال <b aria-hidden="true">←</b></span></div>
    </Link>
  );
}

export function PageHero({ eyebrow, title, highlight, description }: { eyebrow: string; title: string; highlight: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner"><div><span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span><h1>{title}<br /><span className="text-gradient">{highlight}</span></h1><p>{description}</p></div><div className="page-hero-art blog-hero-art" aria-hidden="true"><div className="blog-art-book"><span>ملاحظات<br />لمستقبلك<br /><b>المهني</b></span><i>✦</i></div><span className="blog-art-spark">✳</span></div></div>
    </section>
  );
}
