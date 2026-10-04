import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "دخول المدير", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>service<span className="brand-accent">AI</span></span></Link>
        <span className="admin-login-kicker">مساحة المدير</span>
        <h1>تسجيل الدخول</h1>
        <p>أدخل بيانات دخول المدير للمتابعة.</p>
        <AdminLoginForm />
        <Link className="admin-login-back" href="/">العودة إلى الموقع <span aria-hidden="true">←</span></Link>
      </section>
    </main>
  );
}
