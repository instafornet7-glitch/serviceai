"use client";

import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("ServiceAI page error:", error);
  }, [error]);

  return <main className="article-not-found" role="alert"><span className="eyebrow">حدث خطأ</span><h1>تعذر تحميل هذه الصفحة.</h1><p>تحقق من إعداد قاعدة البيانات واتصال الخدمة، ثم حاول مجددًا.</p>{process.env.NODE_ENV === "development" && <p>{error.message}</p>}<button className="button" onClick={() => reset()}>إعادة المحاولة</button></main>;
}
