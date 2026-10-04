"use client";

import { AdminSitePagesForm } from "@/components/admin-site-pages-form";

export default function AdminSitePagesPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">إدارة محتوى الموقع</span>
          <h1>إدارة الصفحات</h1>
          <p>عدّل عناوين ومحتوى الصفحات العامة. تُحفظ التغييرات في هذا المتصفح.</p>
        </div>
      </div>
      <AdminSitePagesForm />
    </div>
  );
}
