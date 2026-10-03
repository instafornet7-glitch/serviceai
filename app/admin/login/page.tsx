import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin-forms";
import { getConfiguredAdminEmail } from "@/lib/admin-config";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "دخول المدير", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configError = error === "configuration"
    || !isSupabaseConfigured()
    || !getConfiguredAdminEmail();
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/"><span className="brand-mark" aria-hidden="true">S</span><span>service<span className="brand-accent">AI</span></span></Link>
        <span className="admin-login-kicker">مساحة محمية للمدير</span>
        <h1>مرحبًا بعودتك</h1>
        <p>سجّل الدخول لإدارة مقالات وتصنيفات ServiceAI.</p>
        <LoginForm configError={configError} sessionError={error === "session"} />
        <Link className="admin-login-back" href="/">العودة إلى الموقع <span aria-hidden="true">←</span></Link>
      </section>
    </main>
  );
}
