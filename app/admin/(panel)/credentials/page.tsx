"use client";

import { AdminCredentialsForm } from "@/components/admin-credentials-form";

export default function AdminCredentialsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">أمان الحساب المحلي</span>
          <h1>تغيير معلومات الدخول</h1>
          <p>تُحفظ بيانات الدخول على هذا المتصفح فقط.</p>
        </div>
      </div>
      <AdminCredentialsForm />
    </div>
  );
}
