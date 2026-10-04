"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getLocalAdminEmail, updateLocalAdminCredentials } from "@/lib/local-admin-auth";

export function AdminCredentialsForm() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCurrentEmail(getLocalAdminEmail());
      } catch (cause) {
        console.error("تعذر تحميل بريد المدير المحلي.", cause);
        setError("تعذر قراءة بيانات الدخول المحلية.");
      }
    });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");
    if (!email) {
      setError("أدخل البريد الإلكتروني الجديد.");
      return;
    }
    if (!password) {
      setError("أدخل كلمة المرور الجديدة.");
      return;
    }
    if (password !== confirmation) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين.");
      return;
    }
    try {
      updateLocalAdminCredentials(email, password);
      setCurrentEmail(email);
      event.currentTarget.reset();
      setMessage("تم التحديث بنجاح");
    } catch (cause) {
      console.error("تعذر حفظ بيانات دخول المدير المحلي.", cause);
      setError("تعذر حفظ التغييرات في التخزين المحلي.");
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <section className="admin-panel-card admin-credentials-card">
        {error && <p className="admin-alert" role="alert">{error}</p>}
        {message && <p className="admin-success" role="status">{message}</p>}
        <label htmlFor="current-admin-email">الإيميل الحالي</label>
        <input id="current-admin-email" type="email" value={currentEmail} readOnly />
        <label htmlFor="new-admin-email">إيميل جديد</label>
        <input id="new-admin-email" type="email" name="email" required />
        <label htmlFor="new-admin-password">باسورد جديد</label>
        <input id="new-admin-password" type="password" name="password" autoComplete="new-password" required />
        <label htmlFor="confirm-admin-password">تأكيد الباسورد الجديد</label>
        <input id="confirm-admin-password" type="password" name="confirmation" autoComplete="new-password" required />
        <button className="admin-button admin-button-primary" type="submit">حفظ التغييرات</button>
      </section>
    </form>
  );
}
