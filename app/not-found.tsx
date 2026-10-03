import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <main className="article-not-found"><span className="eyebrow">٤٠٤ · الصفحة غير موجودة</span><h1>لم نعثر على هذه الصفحة.</h1><p>قد يكون الرابط غير صحيح أو أن الصفحة لم تعد متاحة.</p><Link className="button" href="/">العودة إلى الرئيسية <span aria-hidden="true">←</span></Link></main>;
}
