import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().origin;
  const routes = ["", "/blog", "/tools", "/tools/resume-builder", "/tools/resume-analyzer", "/tools/cover-letter-generator", "/tools/interview-questions", "/tools/ats-keywords", "/about", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : ["/blog", "/tools/resume-builder", "/tools/resume-analyzer", "/tools/cover-letter-generator", "/tools/interview-questions", "/tools/ats-keywords"].includes(route) ? 0.8 : 0.5,
  }));
}
