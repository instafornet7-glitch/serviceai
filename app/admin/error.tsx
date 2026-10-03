"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return <main className="admin-error"><h1>تعذر تحميل صفحة الإدارة</h1><p>{error.message}</p><button className="admin-button admin-button-primary" onClick={() => reset()}>إعادة المحاولة</button></main>;
}
