"use client";

import { z } from "zod";
import { sanitizeArticleHtml } from "@/lib/content";
import { add, get, LOCAL_DB_KEYS, makeId, remove, set } from "@/lib/localDB";
import { getAllArticles, getCategories, type ArticleData, type Category } from "@/lib/data";
import { slugify } from "@/lib/slug";
import {
  AD_PLACEMENTS,
  createDefaultSitePreferences,
  type HomeSliderSlide,
  type SiteBranding,
  type SitePreferences,
  type SocialPreferences,
} from "@/lib/site-preferences";

export type ActionState = { error?: string; success?: string };

type StoredArticle = Omit<ArticleData, "category"> & { category_id: string };
type StoredPreferences = Record<string, unknown>;

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "اكتب عنوانًا يتكون من 3 أحرف على الأقل.").max(180),
  slug: z.string().trim().min(2, "أدخل رابط المقال.").max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "استخدم الأحرف الإنجليزية الصغيرة والأرقام والواصلات فقط."),
  excerpt: z.string().trim().min(20, "اكتب وصفًا مختصرًا (20 حرفًا على الأقل).").max(300),
  content_html: z.string().trim().min(1, "أضف محتوى المقال."),
  category_id: z.string().min(1, "اختر تصنيفًا صالحًا."),
  keywords: z.string().max(500),
  meta_title: z.string().trim().max(180),
  meta_description: z.string().trim().max(300),
  status: z.enum(["draft", "published"]),
  published_at: z.string(),
  featured_image: z.string(),
});

function readPreferences(): StoredPreferences {
  return get<StoredPreferences>(LOCAL_DB_KEYS.preferences, createDefaultSitePreferences() as unknown as StoredPreferences);
}

function writePreference(key: string, value: unknown) {
  const preferences = readPreferences();
  preferences[key] = value;
  set(LOCAL_DB_KEYS.preferences, preferences);
}

function getSubmitted(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

async function fileAsDataUrl(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return `data:${file.type};base64,${btoa(binary)}`;
}

export async function saveArticleAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const rawTitle = getSubmitted(formData, "title");
  const parsed = articleSchema.safeParse({
    id: getSubmitted(formData, "id"),
    title: rawTitle,
    slug: getSubmitted(formData, "slug") || slugify(rawTitle),
    excerpt: getSubmitted(formData, "excerpt"),
    content_html: getSubmitted(formData, "content_html"),
    category_id: getSubmitted(formData, "category_id"),
    keywords: getSubmitted(formData, "keywords"),
    meta_title: getSubmitted(formData, "meta_title"),
    meta_description: getSubmitted(formData, "meta_description"),
    status: getSubmitted(formData, "status") || "draft",
    published_at: getSubmitted(formData, "published_at"),
    featured_image: getSubmitted(formData, "featured_image"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من بيانات المقال." };

  const fields = parsed.data;
  const category = getCategories().find((item) => item.id === fields.category_id);
  if (!category) return { error: "التصنيف المحدد غير موجود." };
  const safeHtml = sanitizeArticleHtml(fields.content_html);
  if (!safeHtml.replace(/<[^>]*>/g, "").trim()) return { error: "محتوى المقال فارغ أو يحتوي على تنسيق غير مدعوم." };

  const articles = get<StoredArticle[]>(LOCAL_DB_KEYS.articles, []);
  if (articles.some((article) => article.slug === fields.slug && article.id !== fields.id)) {
    return { error: "هذا الرابط مستخدم لمقال آخر. اختر رابطًا مختلفًا." };
  }

  let publishedAt: string | null = null;
  if (fields.published_at) {
    const date = new Date(fields.published_at);
    if (Number.isNaN(date.getTime())) return { error: "تاريخ النشر غير صالح." };
    publishedAt = date.toISOString();
  }
  if (fields.status === "published" && !publishedAt) publishedAt = new Date().toISOString();

  const image = formData.get("featured_image_file");
  let featuredImage: string | null = fields.featured_image || null;
  if (image instanceof File && image.size > 0) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) return { error: "صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP." };
    if (image.size > 1024 * 1024) return { error: "حجم الصورة المحلية يجب ألا يتجاوز 1 ميغابايت لتناسب مساحة المتصفح." };
    featuredImage = await fileAsDataUrl(image);
  }

  const now = new Date().toISOString();
  const old = articles.find((article) => article.id === fields.id);
  const article: StoredArticle = {
    id: old?.id ?? makeId(),
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    content_html: safeHtml,
    category_id: fields.category_id,
    keywords: fields.keywords.split(",").map((word) => word.trim()).filter(Boolean),
    meta_title: fields.meta_title || null,
    meta_description: fields.meta_description || null,
    status: fields.status,
    published_at: publishedAt,
    featured_image: featuredImage,
    created_at: old?.created_at ?? now,
    updated_at: now,
  };
  try {
    add(LOCAL_DB_KEYS.articles, article);
    return { success: "تم حفظ المقال على هذا الجهاز." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ المقال محليًا." };
  }
}

export async function deleteArticleAction(formData: FormData) {
  remove<StoredArticle>(LOCAL_DB_KEYS.articles, getSubmitted(formData, "id"));
}

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "اكتب اسمًا للتصنيف.").max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "رابط التصنيف يقبل الأحرف الإنجليزية الصغيرة والأرقام والواصلات."),
});

export async function saveCategoryAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const name = getSubmitted(formData, "name").trim();
  const parsed = categorySchema.safeParse({
    id: getSubmitted(formData, "id"),
    name,
    slug: getSubmitted(formData, "slug").trim() || slugify(name),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من بيانات التصنيف." };
  const categories = get<Category[]>(LOCAL_DB_KEYS.categories, []);
  if (categories.some((category) => category.slug === parsed.data.slug && category.id !== parsed.data.id)) {
    return { error: "اسم التصنيف أو رابطه مستخدم بالفعل." };
  }
  try {
    add(LOCAL_DB_KEYS.categories, {
      id: parsed.data.id || makeId(),
      name: parsed.data.name,
      slug: parsed.data.slug,
    });
    return { success: "تم حفظ التصنيف محليًا." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ التصنيف." };
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const id = getSubmitted(formData, "id");
  if (getAllArticles().some((article) => article.category?.id === id)) {
    window.alert("لا يمكن حذف تصنيف مرتبط بمقالات. انقل المقالات أولًا.");
    return;
  }
  remove<Category>(LOCAL_DB_KEYS.categories, id);
}

export async function saveSiteSettingsAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const client = getSubmitted(formData, "adsense_client").trim();
  if (client && !/^ca-pub-[0-9]{16}$/.test(client)) return { error: "أدخل معرّف ناشر صحيحًا يبدأ بـ ca-pub- ويتبعه 16 رقمًا." };
  const slots = {} as SitePreferences["adSlots"];
  for (const { id, label } of AD_PLACEMENTS) {
    const slotId = getSubmitted(formData, `slot.${id}.slot_id`).trim();
    const enabled = formData.get(`slot.${id}.enabled`) === "on";
    if (!/^[0-9]{0,32}$/.test(slotId)) return { error: `${label}: رقم Ad Slot غير صالح.` };
    if (enabled && !slotId) return { error: `أدخل رقم Ad Slot لموضع «${label}» أو أوقف تفعيله.` };
    slots[id] = { enabled, slotId };
  }
  if (Object.values(slots).some((slot) => slot.enabled) && !client) return { error: "أدخل معرّف ناشر AdSense قبل تفعيل أي موضع إعلاني." };
  try {
    writePreference("adsense", { client, slots });
    return { success: "تم حفظ إعدادات Google AdSense على هذا الجهاز." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ الإعدادات المحلية." };
  }
}

function isSecureSocialUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function saveSocialLinksAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const social: SocialPreferences = {
    whatsapp: getSubmitted(formData, "social.whatsapp").trim().replace(/\D/g, ""),
    instagram: getSubmitted(formData, "social.instagram").trim(),
    facebook: getSubmitted(formData, "social.facebook").trim(),
    x: getSubmitted(formData, "social.x").trim(),
    linkedin: getSubmitted(formData, "social.linkedin").trim(),
    youtube: getSubmitted(formData, "social.youtube").trim(),
  };
  if (social.whatsapp && (social.whatsapp.length < 8 || social.whatsapp.length > 15)) return { error: "أدخل رقم WhatsApp دوليًا مع رمز الدولة، من 8 إلى 15 رقمًا." };
  for (const key of ["instagram", "facebook", "x", "linkedin", "youtube"] as const) {
    if (social[key].length > 500 || !isSecureSocialUrl(social[key])) return { error: `أدخل رابط HTTPS صالحًا لحساب ${key}.` };
  }
  try {
    const preferences = readPreferences();
    preferences.contact = { whatsapp: social.whatsapp };
    preferences.social = {
      instagram: social.instagram,
      facebook: social.facebook,
      x: social.x,
      linkedin: social.linkedin,
      youtube: social.youtube,
    };
    set(LOCAL_DB_KEYS.preferences, preferences);
    return { success: "تم حفظ روابط التواصل على هذا الجهاز." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ روابط التواصل." };
  }
}

export async function saveSiteBrandingAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const branding = Object.fromEntries(
    Object.keys(createDefaultSitePreferences().branding).map((key) => [key, getSubmitted(formData, key)]),
  ) as SiteBranding;
  if (!branding.siteName.trim() || !/^#[0-9a-f]{6}$/i.test(branding.primaryColor) || !/^#[0-9a-f]{6}$/i.test(branding.accentColor)) {
    return { error: "تحقق من اسم الموقع وألوان الهوية." };
  }
  const hrefKeys = Object.keys(branding).filter((key) => key.endsWith("Href")) as (keyof SiteBranding)[];
  for (const key of hrefKeys) {
    const value = branding[key];
    if (typeof value === "string" && value && !(value.startsWith("/") && !value.startsWith("//")) && !value.startsWith("#") && !isSecureSocialUrl(value)) {
      return { error: "روابط التذييل تقبل المسارات الداخلية أو روابط HTTPS آمنة فقط." };
    }
  }
  try {
    writePreference("branding", branding);
    return { success: "تم حفظ هوية الموقع ومظهره محليًا." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ الهوية محليًا." };
  }
}

export async function saveHomeSliderAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let submitted: unknown;
  try {
    submitted = JSON.parse(getSubmitted(formData, "slides") || "[]");
  } catch {
    return { error: "تعذر قراءة بيانات الشرائح." };
  }
  if (!Array.isArray(submitted) || submitted.length > 10) return { error: "يمكن إضافة 10 شرائح كحد أقصى." };
  const slides: HomeSliderSlide[] = [];
  for (const value of submitted) {
    if (typeof value !== "object" || value === null) return { error: "بيانات الشريحة غير صالحة." };
    const slide = value as HomeSliderSlide;
    if (!slide.id || !slide.alt?.trim()) return { error: "أضف وصفًا لكل صورة." };
    if (slide.href && !(slide.href.startsWith("/") && !slide.href.startsWith("//")) && !slide.href.startsWith("#") && !isSecureSocialUrl(slide.href)) {
      return { error: "روابط الشرائح تقبل المسارات الداخلية أو روابط HTTPS آمنة فقط." };
    }
    const image = formData.get(`image-${slide.id}`);
    let imageUrl = slide.imageUrl;
    if (image instanceof File && image.size) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 1024 * 1024) {
        return { error: "ارفع صورة JPG أو PNG أو WebP لا يتجاوز حجمها 1 ميغابايت." };
      }
      imageUrl = await fileAsDataUrl(image);
    }
    if (!imageUrl) return { error: "ارفع صورة لكل شريحة قبل الحفظ." };
    slides.push({ ...slide, imageUrl });
  }
  try {
    writePreference("home_slider", { slides });
    return { success: "تم حفظ شرائح الصفحة الرئيسية محليًا." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "تعذر حفظ الشرائح." };
  }
}
