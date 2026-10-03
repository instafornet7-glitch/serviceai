"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getConfiguredAdminEmail } from "@/lib/admin-config";
import { getAdmin } from "@/lib/auth";
import { sanitizeArticleHtml } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { AD_PLACEMENTS, DEFAULT_SITE_BRANDING, type AdPlacementId, type AdSlotPreference, type HomeSliderSlide, type SiteBranding, type SocialPreferences } from "@/lib/site-preferences";

const articleSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(3, "اكتب عنوانًا يتكون من 3 أحرف على الأقل.").max(180),
  slug: z.string().trim().min(2, "أدخل رابط المقال.").max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "استخدم الأحرف الإنجليزية الصغيرة والأرقام والواصلات فقط."),
  excerpt: z.string().trim().min(20, "اكتب وصفًا مختصرًا (20 حرفًا على الأقل).").max(300),
  content_html: z.string().trim().min(1, "أضف محتوى المقال."),
  category_id: z.string().uuid("اختر تصنيفًا صالحًا."),
  keywords: z.string().max(500),
  meta_title: z.string().trim().max(180),
  meta_description: z.string().trim().max(300),
  status: z.enum(["draft", "published"]),
  published_at: z.string(),
  featured_image: z.string(),
});

export type ActionState = { error?: string; success?: string };

export async function loginAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const adminEmail = getConfiguredAdminEmail();

  if (!adminEmail) return { error: "لم يتم ضبط بريد المدير في إعدادات الخادم." };
  if (email !== adminEmail || !password) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };

  if (data.user.app_metadata.role !== "admin" || data.user.email?.toLowerCase() !== adminEmail) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw new Error(`Could not clear unauthorized session: ${signOutError.message}`);
    return { error: "هذا الحساب غير مخوّل لإدارة المحتوى." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Could not sign out: ${error.message}`);
  redirect("/admin/login");
}

export async function saveArticleAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  const parsed = articleSchema.safeParse({
    id: formData.get("id") ?? "",
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    content_html: formData.get("content_html") ?? "",
    category_id: formData.get("category_id") ?? "",
    keywords: formData.get("keywords") ?? "",
    meta_title: formData.get("meta_title") ?? "",
    meta_description: formData.get("meta_description") ?? "",
    status: formData.get("status") ?? "draft",
    published_at: formData.get("published_at") ?? "",
    featured_image: formData.get("featured_image") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من بيانات المقال." };

  const fields = parsed.data;
  const sanitizedHtml = sanitizeArticleHtml(fields.content_html);
  if (!sanitizedHtml.replace(/<[^>]*>/g, "").trim()) return { error: "محتوى المقال فارغ أو يحتوي على تنسيق غير مدعوم." };

  let publishedAt: string | null = null;
  if (fields.published_at || fields.status === "published") {
    const date = fields.published_at ? new Date(fields.published_at) : new Date();
    if (Number.isNaN(date.getTime())) return { error: "تاريخ النشر غير صالح." };
    publishedAt = date.toISOString();
  }

  const supabase = await createClient();
  const { data: category, error: categoryError } = await supabase
    .from("categories").select("id").eq("id", fields.category_id).maybeSingle();
  if (categoryError) return { error: `تعذر التحقق من التصنيف: ${categoryError.message}` };
  if (!category) return { error: "التصنيف المحدد غير موجود." };

  const image = formData.get("featured_image_file");
  let featuredImage = fields.featured_image || null;
  let uploadedImagePath: string | null = null;
  if (image instanceof File && image.size > 0) {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(image.type)) return { error: "صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP." };
    if (image.size > 5 * 1024 * 1024) return { error: "حجم الصورة يتجاوز الحد الأقصى (5 ميغابايت)." };

    const bytes = new Uint8Array(await image.slice(0, 12).arrayBuffer());
    const isJpeg = image.type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = image.type === "image/png" && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isWebp = image.type === "image/webp"
      && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    if (!isJpeg && !isPng && !isWebp) return { error: "محتوى الملف لا يطابق صيغة الصورة المحددة." };

    const extension = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1];
    uploadedImagePath = `${admin.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(uploadedImagePath, image, { contentType: image.type, cacheControl: "31536000", upsert: false });
    if (uploadError) return { error: `تعذر رفع الصورة: ${uploadError.message}` };
    featuredImage = supabase.storage.from("article-images").getPublicUrl(uploadedImagePath).data.publicUrl;
  }

  const article = {
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    content_html: sanitizedHtml,
    category_id: fields.category_id,
    keywords: fields.keywords.split(",").map((word) => word.trim()).filter(Boolean),
    meta_title: fields.meta_title || null,
    meta_description: fields.meta_description || null,
    status: fields.status,
    published_at: publishedAt,
    featured_image: featuredImage,
    updated_at: new Date().toISOString(),
  };

  const result = fields.id
    ? await supabase.from("articles").update(article).eq("id", fields.id).select("id").maybeSingle()
    : await supabase.from("articles").insert({ ...article, author_id: admin.id }).select("id").single();

  if (result.error) {
    if (uploadedImagePath) {
      const { error: cleanupError } = await supabase.storage.from("article-images").remove([uploadedImagePath]);
      if (cleanupError) return { error: `تعذر حفظ المقال: ${result.error.message}. كما تعذر تنظيف الصورة المرفوعة: ${cleanupError.message}` };
    }
    if (result.error.code === "23505") return { error: "هذا الرابط مستخدم لمقال آخر. اختر رابطًا مختلفًا." };
    return { error: `تعذر حفظ المقال: ${result.error.message}` };
  }
  if (!result.data) return { error: "لم يتم العثور على المقال المطلوب لتحديثه." };

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${fields.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/sitemap.xml");
  redirect("/admin/articles?message=saved");
}

export async function deleteArticleAction(formData: FormData) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/admin/articles?error=invalid-id");

  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id.data);
  if (error) redirect("/admin/articles?error=delete-failed");

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  redirect("/admin/articles?message=deleted");
}

const categorySchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2, "اكتب اسمًا للتصنيف.").max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "رابط التصنيف يقبل الأحرف الإنجليزية الصغيرة والأرقام والواصلات."),
});

export async function saveCategoryAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  const rawName = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const parsed = categorySchema.safeParse({
    id: formData.get("id") ?? "",
    name: rawName,
    slug: rawSlug || slugify(rawName),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تحقق من بيانات التصنيف." };

  const supabase = await createClient();
  const values = { name: parsed.data.name, slug: parsed.data.slug };
  const result = parsed.data.id
    ? await supabase.from("categories").update(values).eq("id", parsed.data.id).select("id").maybeSingle()
    : await supabase.from("categories").insert(values).select("id").single();

  if (result.error) {
    if (result.error.code === "23505") return { error: "اسم التصنيف أو رابطه مستخدم بالفعل." };
    if (result.error.code === "23503") return { error: "لا يمكن تعديل هذا التصنيف بسبب ارتباطه بمقالات." };
    return { error: `تعذر حفظ التصنيف: ${result.error.message}` };
  }
  if (!result.data) return { error: "لم يتم العثور على التصنيف المطلوب لتحديثه." };

  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles/new");
  revalidatePath("/admin");
  redirect("/admin/categories?message=saved");
}

export async function deleteCategoryAction(formData: FormData) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) redirect("/admin/categories?error=invalid-id");

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id.data);
  if (error) {
    if (error.code === "23503") redirect("/admin/categories?error=in-use");
    throw new Error(`Could not delete category: ${error.message}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles/new");
  revalidatePath("/admin");
  redirect("/admin/categories?message=deleted");
}

const publisherIdSchema = z.string().trim().regex(/^$|^ca-pub-[0-9]{16}$/, "أدخل معرّف ناشر صحيحًا يبدأ بـ ca-pub- ويتبعه 16 رقمًا.");
const adSlotIdSchema = z.string().trim().regex(/^[0-9]{0,32}$/, "رقم Ad Slot يجب أن يحتوي على أرقام فقط.");

function isSecureSocialUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export async function saveSiteSettingsAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  const publisherId = publisherIdSchema.safeParse(String(formData.get("adsense_client") ?? ""));
  if (!publisherId.success) return { error: publisherId.error.issues[0]?.message ?? "تحقق من معرّف ناشر AdSense." };

  const adSlots = {} as Record<AdPlacementId, AdSlotPreference>;
  for (const placement of AD_PLACEMENTS) {
    const slotId = adSlotIdSchema.safeParse(String(formData.get(`slot.${placement.id}.slot_id`) ?? ""));
    if (!slotId.success) return { error: `${placement.label}: ${slotId.error.issues[0]?.message ?? "رقم Ad Slot غير صالح."}` };
    const enabled = formData.get(`slot.${placement.id}.enabled`) === "on";
    if (enabled && !slotId.data) return { error: `أدخل رقم Ad Slot لموضع «${placement.label}» أو أوقف تفعيله.` };
    adSlots[placement.id] = { enabled, slotId: slotId.data };
  }

  if (Object.values(adSlots).some((slot) => slot.enabled) && !publisherId.data) {
    return { error: "أدخل معرّف ناشر AdSense قبل تفعيل أي موضع إعلاني." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_preferences")
    .upsert([
      { key: "adsense", value: { client: publisherId.data, slots: adSlots }, updated_at: new Date().toISOString() },
    ], { onConflict: "key" });

  if (error) return { error: `تعذر حفظ إعدادات الموقع: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/settings");
  revalidateTag("site-preferences", { expire: 0 });
  return { success: "تم حفظ إعدادات إعلانات Google AdSense." };
}

export async function saveSocialLinksAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  const socialLinks: SocialPreferences = {
    whatsapp: String(formData.get("social.whatsapp") ?? "").trim(),
    instagram: String(formData.get("social.instagram") ?? "").trim(),
    facebook: String(formData.get("social.facebook") ?? "").trim(),
    x: String(formData.get("social.x") ?? "").trim(),
    linkedin: String(formData.get("social.linkedin") ?? "").trim(),
    youtube: String(formData.get("social.youtube") ?? "").trim(),
  };

  const whatsappDigits = socialLinks.whatsapp.replace(/\D/g, "");
  if (socialLinks.whatsapp && (whatsappDigits.length < 8 || whatsappDigits.length > 15)) {
    return { error: "أدخل رقم WhatsApp دوليًا مع رمز الدولة، من 8 إلى 15 رقمًا." };
  }
  socialLinks.whatsapp = whatsappDigits;

  for (const key of ["instagram", "facebook", "x", "linkedin", "youtube"] as const) {
    const value = socialLinks[key];
    if (value.length > 500 || !isSecureSocialUrl(value)) {
      return { error: `أدخل رابط HTTPS صالحًا لحساب ${key}.` };
    }
  }

  const supabase = await createClient();
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("site_preferences")
    .upsert([
      { key: "contact", value: { whatsapp: socialLinks.whatsapp }, updated_at: updatedAt },
      {
        key: "social",
        value: {
          instagram: socialLinks.instagram,
          facebook: socialLinks.facebook,
          x: socialLinks.x,
          linkedin: socialLinks.linkedin,
          youtube: socialLinks.youtube,
        },
        updated_at: updatedAt,
      },
    ], { onConflict: "key" });

  if (error) return { error: `تعذر حفظ روابط التواصل: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin/social");
  return { success: "تم حفظ روابط التواصل الاجتماعي." };
}

const brandingSchema = z.object({
  siteName: z.string().trim().min(2, "اكتب اسمًا للموقع.").max(40),
  logoMark: z.string().trim().min(1, "أدخل رمز الشعار.").max(3),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "اختر لونًا أساسيًا صالحًا."),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "اختر لونًا مساعدًا صالحًا."),
  heroEyebrow: z.string().trim().min(2).max(100),
  heroTitle: z.string().trim().min(2).max(100),
  heroHighlight: z.string().trim().min(2).max(100),
  heroDescription: z.string().trim().min(10).max(400),
  heroPrimaryButton: z.string().trim().min(2).max(40),
  footerDescription: z.string().trim().min(10).max(250),
  footerContactLabel: z.string().trim().min(1).max(100),
  footerContactHref: z.string().trim().max(500),
  footerExploreHeading: z.string().trim().min(1).max(100),
  footerExploreToolsLabel: z.string().trim().min(1).max(100),
  footerExploreToolsHref: z.string().trim().max(500),
  footerExploreBlogLabel: z.string().trim().min(1).max(100),
  footerExploreBlogHref: z.string().trim().max(500),
  footerExploreAboutLabel: z.string().trim().min(1).max(100),
  footerExploreAboutHref: z.string().trim().max(500),
  footerInfoHeading: z.string().trim().min(1).max(100),
  footerInfoContactLabel: z.string().trim().min(1).max(100),
  footerInfoContactHref: z.string().trim().max(500),
  footerPrivacyLabel: z.string().trim().min(1).max(100),
  footerPrivacyHref: z.string().trim().max(500),
  footerTermsLabel: z.string().trim().min(1).max(100),
  footerTermsHref: z.string().trim().max(500),
  footerCallout: z.string().trim().min(2).max(100),
  footerCalloutLinkLabel: z.string().trim().min(1).max(100),
  footerCalloutLinkHref: z.string().trim().max(500),
  footerCopyright: z.string().trim().min(1).max(150),
  footerMadeWith: z.string().trim().min(1).max(150),
  footerBackToTopLabel: z.string().trim().min(1).max(100),
  footerBackToTopHref: z.string().trim().max(500),
});

const footerHrefKeys = [
  "footerContactHref",
  "footerExploreToolsHref",
  "footerExploreBlogHref",
  "footerExploreAboutHref",
  "footerInfoContactHref",
  "footerPrivacyHref",
  "footerTermsHref",
  "footerCalloutLinkHref",
  "footerBackToTopHref",
] as const;

function isSafeFooterHref(value: string): boolean {
  return !value
    || (value.startsWith("/") && !value.startsWith("//"))
    || /^#[A-Za-z0-9_-]+$/.test(value)
    || isSecureSocialUrl(value);
}

export async function saveSiteBrandingAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  const result = brandingSchema.safeParse(Object.fromEntries(
    Object.keys(DEFAULT_SITE_BRANDING).map((key) => [key, formData.get(key)]),
  ));
  if (!result.success) return { error: result.error.issues[0]?.message ?? "راجع بيانات هوية الموقع." };

  for (const key of footerHrefKeys) {
    if (!isSafeFooterHref(result.data[key])) {
      return { error: "روابط التذييل تقبل المسارات الداخلية أو روابط HTTPS آمنة فقط." };
    }
  }

  const branding: SiteBranding = {
    ...result.data,
    ...Object.fromEntries(footerHrefKeys.map((key) => [key, result.data[key].trim()])),
  };
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_preferences")
    .upsert({
      key: "branding",
      value: branding,
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });

  if (error) return { error: `تعذر حفظ هوية الموقع: ${error.message}` };

  revalidatePath("/", "layout");
  revalidatePath("/admin/appearance");
  revalidateTag("site-preferences", { expire: 0 });
  return { success: "تم حفظ هوية الموقع ومظهره." };
}

const sliderSlidesSchema = z.array(z.object({
  id: z.string().uuid(),
  imageUrl: z.string().max(2000),
  alt: z.string().trim().min(2, "أضف وصفًا للصورة لمستخدمي قارئات الشاشة.").max(180),
  caption: z.string().trim().max(180),
  href: z.string().trim().max(500),
})).max(10, "يمكن إضافة 10 شرائح كحد أقصى.");

function isSafeSliderHref(value: string): boolean {
  return !value
    || (value.startsWith("/") && !value.startsWith("//"))
    || /^#[A-Za-z0-9_-]+$/.test(value)
    || isSecureSocialUrl(value);
}

function getHomeSliderStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const prefix = "/storage/v1/object/public/article-images/home-slider/";
    if (!url.pathname.startsWith(prefix)) return null;
    return decodeURIComponent(url.pathname.slice(prefix.length));
  } catch {
    return null;
  }
}

export async function saveHomeSliderAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return { error: "انتهت الجلسة. سجّل الدخول مجددًا." };

  let submittedSlides: unknown;
  try {
    submittedSlides = JSON.parse(String(formData.get("slides") ?? "[]"));
  } catch {
    return { error: "تعذر قراءة بيانات الشرائح. حدّث الصفحة وحاول مجددًا." };
  }
  const parsedSlides = sliderSlidesSchema.safeParse(submittedSlides);
  if (!parsedSlides.success) return { error: parsedSlides.error.issues[0]?.message ?? "راجع بيانات شرائح الصور." };
  if (new Set(parsedSlides.data.map((slide) => slide.id)).size !== parsedSlides.data.length) {
    return { error: "تحتوي قائمة الشرائح على معرفات مكررة." };
  }
  for (const slide of parsedSlides.data) {
    if (!isSafeSliderHref(slide.href)) return { error: "روابط الشرائح تقبل المسارات الداخلية أو روابط HTTPS آمنة فقط." };
    const image = formData.get(`image-${slide.id}`);
    if (!slide.imageUrl && !(image instanceof File && image.size > 0)) {
      return { error: "ارفع صورة لكل شريحة قبل الحفظ." };
    }
    if (image instanceof File && image.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
        return { error: "صور السلايدر يجب أن تكون JPG أو PNG أو WebP." };
      }
      if (image.size > 5 * 1024 * 1024) return { error: "يجب ألا يتجاوز حجم صورة الشريحة 5 ميغابايت." };
    }
  }

  const supabase = await createClient();
  const previousData = await supabase
    .from("site_preferences")
    .select("value")
    .eq("key", "home_slider")
    .maybeSingle();
  if (previousData.error) return { error: `تعذر التحقق من صور السلايدر الحالية: ${previousData.error.message}` };
  const previousValue: unknown = previousData.data?.value;
  const previousSlides: unknown = typeof previousValue === "object" && previousValue !== null && "slides" in previousValue
    ? previousValue.slides
    : null;
  const uploadedPaths: string[] = [];
  const slides: HomeSliderSlide[] = [];

  for (const slide of parsedSlides.data) {
    const image = formData.get(`image-${slide.id}`);
    let imageUrl = slide.imageUrl;
    if (image instanceof File && image.size > 0) {
      const extension = image.type === "image/jpeg" ? "jpg" : image.type === "image/png" ? "png" : "webp";
      const path = `home-slider/${randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, image, { contentType: image.type, cacheControl: "31536000", upsert: false });

      if (uploadError) {
        if (uploadedPaths.length) {
          const { error: cleanupError } = await supabase.storage.from("article-images").remove(uploadedPaths);
          if (cleanupError) console.error("Could not clean up uploaded slider images:", cleanupError.message);
        }
        return { error: `تعذر رفع صورة الشريحة: ${uploadError.message}` };
      }
      uploadedPaths.push(path);
      imageUrl = supabase.storage.from("article-images").getPublicUrl(path).data.publicUrl;
    }
    slides.push({ ...slide, imageUrl });
  }

  const { error } = await supabase
    .from("site_preferences")
    .upsert({
      key: "home_slider",
      value: { slides },
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });

  if (error) {
    if (uploadedPaths.length) {
      const { error: cleanupError } = await supabase.storage.from("article-images").remove(uploadedPaths);
      if (cleanupError) console.error("Could not clean up uploaded slider images:", cleanupError.message);
    }
    return { error: `تعذر حفظ شرائح الصفحة الرئيسية: ${error.message}` };
  }

  const retainedUrls = new Set(slides.map((slide) => slide.imageUrl));
  const obsoletePaths = Array.isArray(previousSlides)
    ? previousSlides.flatMap((oldSlide) => {
      if (typeof oldSlide !== "object" || oldSlide === null || !("imageUrl" in oldSlide) || typeof oldSlide.imageUrl !== "string" || retainedUrls.has(oldSlide.imageUrl)) return [];
      const path = getHomeSliderStoragePath(oldSlide.imageUrl);
      return path ? [path] : [];
    })
    : [];
  if (obsoletePaths.length) {
    const { error: removeError } = await supabase.storage.from("article-images").remove(obsoletePaths);
    if (removeError) console.error("Could not remove obsolete home slider images:", removeError.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/slider");
  revalidateTag("site-preferences", { expire: 0 });
  return { success: "تم حفظ شرائح الصفحة الرئيسية." };
}
