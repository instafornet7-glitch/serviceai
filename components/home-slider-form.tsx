"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Search, Trash2 } from "lucide-react";
import { saveHomeSliderAction, type ActionState } from "@/lib/admin-actions";
import type { HomeSliderSlide } from "@/lib/site-preferences";

type EditableSlide = HomeSliderSlide & { previewUrl?: string };

const initialState: ActionState = {};

function createSlide(): EditableSlide {
  return { id: crypto.randomUUID(), imageUrl: "", alt: "", caption: "", href: "" };
}

export function HomeSliderForm({ initialSlides }: { initialSlides: HomeSliderSlide[] }) {
  const [slides, setSlides] = useState<EditableSlide[]>(initialSlides);
  const [keywords, setKeywords] = useState("career,job-search");
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [searchError, setSearchError] = useState("");
  const [state, action, pending] = useActionState(saveHomeSliderAction, initialState);
  const previewUrls = useRef(new Map<string, string>());

  useEffect(() => {
    if (state.success) window.dispatchEvent(new Event("site-preferences-updated"));
  }, [state.success]);

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function updateSlide(id: string, patch: Partial<EditableSlide>) {
    setSlides((current) => current.map((slide) => slide.id === id ? { ...slide, ...patch } : slide));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    setSlides((current) => {
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  function removeSlide(id: string) {
    if (slides.length <= 3) return;
    const previewUrl = previewUrls.current.get(id);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrls.current.delete(id);
    setSlides((current) => current.filter((item) => item.id !== id));
  }

  function searchSuggestedImages() {
    const terms = keywords.split(",").map((term) => term.trim()).filter(Boolean);
    if (!terms.length) {
      setSearchError("اكتب كلمة مفتاحية واحدة على الأقل للبحث عن الصور.");
      setSuggestedImages([]);
      return;
    }
    const keyword = terms.map(encodeURIComponent).join(",");
    setSearchError("");
    setSuggestedImages(Array.from({ length: 8 }, (_, index) =>
      `https://loremflickr.com/800/400/${keyword}?random=${index + 1}`,
    ));
  }

  function addSuggestedImage(imageUrl: string, index: number) {
    if (slides.length >= 10) {
      setSearchError("يمكن إضافة 10 شرائح كحد أقصى.");
      return;
    }
    const description = keywords.trim().replace(/\s*,\s*/g, ", ");
    setSlides((current) => [...current, {
      ...createSlide(),
      imageUrl,
      alt: `${description} - صورة مقترحة ${index + 1}`,
    }]);
    setSearchError("");
  }

  function fallbackToRandomImage(imageUrl: string) {
    const random = imageUrl.match(/[?&]random=(\d+)/)?.[1] ?? "1";
    const fallbackUrl = `https://picsum.photos/seed/serviceai-slider-${random}/800/400`;
    setSuggestedImages((current) => current.map((url) => url === imageUrl ? fallbackUrl : url));
  }

  return (
    <form action={action} className="site-settings-form">
      <input type="hidden" name="slides" value={JSON.stringify(slides.map(({ id, imageUrl, alt, caption, href }) => ({ id, imageUrl, alt, caption, href })))} />
      {state.error && <p className="admin-alert" role="alert">{state.error}</p>}
      {state.success && <p className="admin-success" role="status">{state.success}</p>}

      <section className="admin-panel-card site-settings-card">
        <div className="slider-image-suggestions">
          <div className="slider-image-suggestions__heading">
            <div><h2>اقتراح صور مناسبة</h2><p>ابحث عن صور حسب موضوع موقعك وأضف ما يناسبك إلى السلايدر.</p></div>
          </div>
          <div className="slider-image-suggestions__search">
            <label className="site-settings-field" htmlFor="slider-image-keywords">
              <span>اكتب نوع الصور اللي بغيتي</span>
              <input
                id="slider-image-keywords"
                value={keywords}
                maxLength={120}
                placeholder="مثال: career, job-search"
                onChange={(event) => setKeywords(event.currentTarget.value)}
              />
            </label>
            <button className="admin-button admin-button-secondary" type="button" onClick={searchSuggestedImages}>
              <Search size={16} aria-hidden="true" /> بحث
            </button>
          </div>
          {searchError && <p className="admin-alert" role="alert">{searchError}</p>}
          {suggestedImages.length > 0 && (
            <div className="slider-image-suggestions__grid">
              {suggestedImages.map((imageUrl, index) => (
                <article className="slider-image-suggestion" key={imageUrl}>
                  <div className="slider-image-suggestion__preview">
                    <Image
                      src={imageUrl}
                      alt={`اقتراح صورة ${index + 1}`}
                      fill
                      sizes="(max-width: 600px) 100vw, 260px"
                      unoptimized
                      onError={() => {
                        if (imageUrl.startsWith("https://loremflickr.com/")) fallbackToRandomImage(imageUrl);
                      }}
                    />
                  </div>
                  <button
                    className="admin-button admin-button-secondary"
                    type="button"
                    disabled={slides.length >= 10}
                    onClick={() => addSuggestedImage(imageUrl, index)}
                  >إضافة للسلايدر</button>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card-heading home-slider-admin-heading">
          <div><h2>شرائح الصفحة الرئيسية</h2><p>تبدأ الصفحة بثلاث شرائح جاهزة. يمكنك تعديلها وإضافة ما يصل إلى 10 صور إجمالًا. الصيغ المدعومة JPG وPNG وWebP، بحد أقصى 1 ميغابايت للصورة.</p></div>
          <button className="admin-button admin-button-secondary" type="button" disabled={slides.length >= 10} onClick={() => setSlides((current) => [...current, createSlide()])}>
            <ImagePlus size={16} aria-hidden="true" /> إضافة شريحة
          </button>
        </div>
        {slides.length === 0
          ? <p className="home-slider-empty">لا توجد شرائح بعد. أضف صورة لعرضها بدل الرسم التوضيحي في الصفحة الرئيسية.</p>
          : <div className="home-slider-admin-list">
            {slides.map((slide, index) => (
              <article className="home-slider-admin-slide" key={slide.id}>
                <div className="home-slider-admin-toolbar">
                  <strong>الشريحة {index + 1}</strong>
                  <div>
                    <button className="admin-icon-button" type="button" aria-label={`نقل الشريحة ${index + 1} للأعلى`} disabled={index === 0} onClick={() => moveSlide(index, -1)}><ArrowUp size={16} /></button>
                    <button className="admin-icon-button" type="button" aria-label={`نقل الشريحة ${index + 1} للأسفل`} disabled={index === slides.length - 1} onClick={() => moveSlide(index, 1)}><ArrowDown size={16} /></button>
                    <button className="admin-icon-button admin-icon-button-danger" type="button" aria-label={`حذف الشريحة ${index + 1}`} title={slides.length <= 3 ? "يلزم وجود ثلاث شرائح على الأقل" : "حذف الشريحة"} disabled={slides.length <= 3} onClick={() => removeSlide(slide.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <label className="home-slider-upload">
                  {slide.previewUrl
                    ? <Image src={slide.previewUrl} alt="" fill sizes="280px" unoptimized />
                    : slide.imageUrl
                      ? <Image src={slide.imageUrl} alt="" fill unoptimized sizes="280px" />
                      : <span><ImagePlus size={25} aria-hidden="true" />اختر صورة للشريحة</span>}
                  <input
                    type="file"
                    name={`image-${slide.id}`}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      const previousUrl = previewUrls.current.get(slide.id);
                      if (previousUrl) URL.revokeObjectURL(previousUrl);
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        previewUrls.current.set(slide.id, previewUrl);
                        updateSlide(slide.id, { previewUrl });
                      } else {
                        previewUrls.current.delete(slide.id);
                        updateSlide(slide.id, { previewUrl: undefined });
                      }
                    }}
                  />
                </label>
                <div className="branding-field-grid">
                  <label className="site-settings-field branding-field-wide" htmlFor={`slider-alt-${slide.id}`}>
                    <span>وصف الصورة (Alt)</span>
                    <input id={`slider-alt-${slide.id}`} value={slide.alt} maxLength={180} required onChange={(event) => updateSlide(slide.id, { alt: event.currentTarget.value })} />
                  </label>
                  <label className="site-settings-field branding-field-wide" htmlFor={`slider-caption-${slide.id}`}>
                    <span>النص الظاهر على الصورة (اختياري)</span>
                    <input id={`slider-caption-${slide.id}`} value={slide.caption} maxLength={180} onChange={(event) => updateSlide(slide.id, { caption: event.currentTarget.value })} />
                  </label>
                  <label className="site-settings-field branding-field-wide" htmlFor={`slider-href-${slide.id}`}>
                    <span>الرابط عند الضغط (اختياري)</span>
                    <input id={`slider-href-${slide.id}`} type="text" dir="ltr" value={slide.href} maxLength={500} placeholder="/tools أو https://example.com" onChange={(event) => updateSlide(slide.id, { href: event.currentTarget.value })} />
                  </label>
                </div>
              </article>
            ))}
          </div>}
      </section>

      <div className="site-settings-submit">
        <p>تُعرض الشرائح في الصفحة الرئيسية حسب الترتيب أعلاه.</p>
        <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
          {pending ? "جارٍ حفظ الشرائح..." : "حفظ شرائح الصفحة"}
        </button>
      </div>
    </form>
  );
}
