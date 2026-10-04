"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSitePreferences } from "@/components/site-preferences-provider";

export function HomeSlider({ fallback }: { fallback: React.ReactNode }) {
  const { preferences } = useSitePreferences();
  const slides = preferences.homeSlider;
  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndex = Math.min(activeIndex, Math.max(0, slides.length - 1));

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return <>{fallback}</>;

  const slide = slides[currentIndex];
  const image = (
    <>
      <Image className="home-slider-image" src={slide.imageUrl} alt={slide.alt} fill unoptimized priority sizes="(max-width: 940px) 100vw, 48vw" />
      {slide.caption && <span className="home-slider-caption">{slide.caption}</span>}
    </>
  );

  return (
    <div className="home-slider" role="region" aria-roledescription="carousel" aria-label="صور ServiceAI">
      {slide.href
        ? <Link className="home-slider-slide" href={slide.href} aria-label={slide.caption || slide.alt}>{image}</Link>
        : <div className="home-slider-slide">{image}</div>}
      {slides.length > 1 && <>
        <button
          className="home-slider-arrow home-slider-previous"
          type="button"
          aria-label="الشريحة السابقة"
          onClick={() => setActiveIndex((currentIndex - 1 + slides.length) % slides.length)}
        >‹</button>
        <button
          className="home-slider-arrow home-slider-next"
          type="button"
          aria-label="الشريحة التالية"
          onClick={() => setActiveIndex((currentIndex + 1) % slides.length)}
        >›</button>
        <div className="home-slider-dots" aria-label="اختيار الشريحة">
          {slides.map((item, index) => (
            <button
              key={item.id}
              className={index === currentIndex ? "is-active" : ""}
              type="button"
              aria-label={`عرض الشريحة ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </>}
    </div>
  );
}
