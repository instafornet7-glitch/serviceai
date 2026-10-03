"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, saveArticleAction, saveCategoryAction, type ActionState } from "@/lib/admin-actions";
import type { ArticleData, Category } from "@/lib/data";
import { slugify } from "@/lib/slug";
import { RichTextEditor } from "@/components/rich-text-editor";

const initialState: ActionState = {};

export function LoginForm({ configError, sessionError }: { configError: boolean; sessionError: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form className="admin-login-form" action={action}>
      {configError && <p className="admin-alert" role="alert">إعدادات Supabase غير مكتملة. راجع ملف الإعداد قبل تسجيل الدخول.</p>}
      {sessionError && !configError && <p className="admin-alert" role="alert">تعذر التحقق من الجلسة الحالية. يمكنك تسجيل الدخول مجددًا.</p>}
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      <label htmlFor="admin-email">البريد الإلكتروني</label><input id="admin-email" type="email" name="email" autoComplete="username" required />
      <label htmlFor="admin-password">كلمة المرور</label><input id="admin-password" type="password" name="password" autoComplete="current-password" required />
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>{pending ? "جارٍ التحقق..." : "تسجيل الدخول"}<span aria-hidden="true">←</span></button>
    </form>
  );
}

export function ArticleForm({ article, categories }: { article: ArticleData | null; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveArticleAction, initialState);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [featuredPreview, setFeaturedPreview] = useState(article?.featured_image ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(article));
  const [keywords, setKeywords] = useState(article?.keywords.join(", ") ?? "");
  const currentDate = article?.published_at
    ? new Date(new Date(article.published_at).getTime() - new Date(article.published_at).getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
    : "";

  return (
    <form action={action} className="admin-form">
      {article && <input type="hidden" name="id" value={article.id} />}
      {article?.featured_image && <input type="hidden" name="featured_image" value={article.featured_image} />}
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      <div className="admin-form-main">
        <section className="admin-panel-card">
          <label htmlFor="article-title">عنوان المقال <span>*</span></label>
          <input id="article-title" name="title" required minLength={3} maxLength={180} value={title} onChange={(event) => { setTitle(event.target.value); if (!slugManuallyEdited) setSlug(slugify(event.target.value)); }} placeholder="اكتب عنوانًا واضحًا وجذابًا" />
          <div className="admin-field-grid">
            <div><label htmlFor="article-slug">رابط المقال (Slug) <span>*</span></label><input id="article-slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugManuallyEdited(true); }} placeholder="how-to-write-cv" /><small>سيظهر بهذا الشكل: /blog/{slug || "article-slug"}</small></div>
            <div><label htmlFor="article-category">التصنيف <span>*</span></label><select id="article-category" name="category_id" required defaultValue={article?.category?.id ?? ""}><option value="" disabled>اختر تصنيفًا</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></div>
          </div>
          <label htmlFor="article-excerpt">الوصف المختصر <span>*</span></label><textarea id="article-excerpt" name="excerpt" required minLength={20} maxLength={300} rows={3} defaultValue={article?.excerpt ?? ""} placeholder="ملخص يظهر في صفحة المدونة ونتائج البحث" />
          <div className="admin-editor-heading"><label>محتوى المقال <span>*</span></label><span>يُحفظ بتنسيق HTML آمن</span></div>
          <RichTextEditor initialContent={article?.content_html ?? "<p></p>"} />
        </section>
        <section className="admin-panel-card">
          <h2>تحسين محركات البحث</h2>
          <label htmlFor="article-meta-title">Meta Title</label><input id="article-meta-title" name="meta_title" maxLength={180} defaultValue={article?.meta_title ?? ""} placeholder={title || "عنوان مخصص لمحركات البحث"} />
          <label htmlFor="article-meta-description">Meta Description</label><textarea id="article-meta-description" name="meta_description" rows={3} maxLength={300} defaultValue={article?.meta_description ?? ""} placeholder="وصف قصير يظهر في نتائج البحث" />
          <label htmlFor="article-keywords">الكلمات المفتاحية</label><input id="article-keywords" name="keywords" value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="سيرة ذاتية، بحث عن عمل، مقابلة" /><small>افصل الكلمات بفاصلة.</small>
        </section>
      </div>
      <aside className="admin-form-sidebar">
        <section className="admin-panel-card">
          <h2>حالة المقال</h2>
          <label htmlFor="article-status">الحالة</label><select id="article-status" name="status" defaultValue={article?.status ?? "draft"}><option value="draft">مسودة</option><option value="published">منشور</option></select>
          <label htmlFor="article-published-at">تاريخ النشر</label><input id="article-published-at" name="published_at" type="datetime-local" defaultValue={currentDate} />
          <p className="admin-help">لن يظهر المقال للزوار قبل تاريخ النشر المحدد.</p>
          <button className="admin-button admin-button-primary admin-submit" type="submit" disabled={pending}>{pending ? "جارٍ الحفظ..." : article ? "حفظ التعديلات" : "حفظ المقال"}<span aria-hidden="true">←</span></button>
        </section>
        <section className="admin-panel-card">
          <h2>الصورة الرئيسية</h2>
          <label className="admin-upload" htmlFor="article-image"><span aria-hidden="true">↥</span><strong>اختر صورة</strong><small>JPG، PNG أو WebP · حتى 5 MB</small><input id="article-image" name="featured_image_file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setFeaturedPreview(URL.createObjectURL(file)); }} /></label>
          {featuredPreview && <div className="admin-image-preview" role="img" aria-label="معاينة الصورة الرئيسية" style={{ backgroundImage: `url("${featuredPreview}")` }} />}
        </section>
      </aside>
    </form>
  );
}

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategoryAction, initialState);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  return (
    <form action={action} className="admin-category-form">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div><label htmlFor={`category-name-${category?.id ?? "new"}`}>اسم التصنيف</label><input id={`category-name-${category?.id ?? "new"}`} name="name" required minLength={2} maxLength={80} value={name} onChange={(event) => { setName(event.target.value); if (!category) setSlug(slugify(event.target.value)); }} placeholder="مثال: السيرة الذاتية" /></div>
      <div><label htmlFor={`category-slug-${category?.id ?? "new"}`}>الرابط</label><input id={`category-slug-${category?.id ?? "new"}`} name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="cv-guide" /><small>أدخل رابطًا إنجليزيًا قصيرًا مثل cv-guide.</small></div>
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>{pending ? "جارٍ الحفظ..." : category ? "حفظ" : "إضافة تصنيف"}</button>
    </form>
  );
}

export function AdminNotice() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const messageText = message === "saved" ? "تم الحفظ بنجاح." : message === "deleted" ? "تم الحذف بنجاح." : null;
  const errorText = error === "in-use"
    ? "لا يمكن حذف تصنيف مرتبط بمقالات. غيّر تصنيفات المقالات أولًا."
    : error === "delete-failed"
      ? "تعذر حذف المقال."
      : error === "invalid-id"
        ? "تعذر تنفيذ العملية لأن المعرّف غير صالح."
        : null;
  if (!messageText && !errorText) return null;
  return <p className={errorText ? "admin-alert" : "admin-success"} role={errorText ? "alert" : "status"}>{errorText ?? messageText}</p>;
}
