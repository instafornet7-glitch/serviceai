"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FileText, Files, Images, KeyRound, LayoutDashboard, LogOut, Megaphone, Palette, Settings2, Share2, Sparkles, Wrench } from "lucide-react";
import { logoutLocalAdmin } from "@/lib/local-admin-auth";

const navigation = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/articles", label: "المقالات", icon: FileText },
  { href: "/admin/categories", label: "التصنيفات", icon: Settings2 },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Megaphone },
  { href: "/admin/appearance", label: "هوية ومظهر الموقع", icon: Palette },
  { href: "/admin/slider", label: "سلايدر الصفحة", icon: Images },
  { href: "/admin/social", label: "روابط التواصل", icon: Share2 },
  { href: "/admin/credentials", label: "تغيير معلومات الدخول", icon: KeyRound },
  { href: "/admin/pages", label: "إدارة الصفحات", icon: Files },
  { href: "/admin/tools", label: "إدارة الأدوات", icon: Wrench },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    try {
      logoutLocalAdmin();
      router.replace("/admin/login");
    } catch (error) {
      console.error("تعذر تسجيل خروج المدير المحلي.", error);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin"><span className="admin-brand__icon"><Sparkles size={18} aria-hidden="true" /></span><span><strong>ServiceAI</strong><small>إدارة المحتوى</small></span></Link>
        <p className="admin-sidebar__label">مساحة العمل</p>
        <nav className="admin-navigation" aria-label="قائمة الإدارة">
          {navigation.map(({ href, label, icon: Icon }) => <Link className={pathname === href || href !== "/admin" && pathname.startsWith(href) ? "is-active" : ""} href={href} key={href}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link>)}
        </nav>
        <Link className="admin-new-article" href="/admin/articles/new"><span aria-hidden="true">+</span> مقال جديد</Link>
        <div className="admin-sidebar__bottom"><span className="admin-avatar" aria-hidden="true">{email.slice(0, 1).toUpperCase()}</span><span className="admin-sidebar__email" title={email}>{email}</span><button className="admin-logout" type="button" aria-label="تسجيل الخروج" title="تسجيل الخروج" onClick={logout}><LogOut size={17} aria-hidden="true" /></button></div>
      </aside>
      <div className="admin-main"><header className="admin-topbar"><span>لوحة تحكم ServiceAI</span><div><Link href="/" target="_blank">عرض الموقع <span aria-hidden="true">↗</span></Link><span className="admin-topbar__secure">مساحة المدير</span></div></header><main className="admin-content">{children}</main></div>
    </div>
  );
}
