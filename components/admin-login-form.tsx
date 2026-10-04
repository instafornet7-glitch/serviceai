"use client";

import { useState, type FormEvent } from "react";
import { loginLocalAdmin } from "@/lib/local-admin-auth";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const formData = new FormData(event.currentTarget);
      if (!loginLocalAdmin(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""))) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        return;
      }
      window.location.replace("/admin");
    } catch (cause) {
      console.error("تعذر تسجيل دخول المدير المحلي.", cause);
      setError("تعذر استخدام التخزين المحلي. تحقق من إعدادات المتصفح.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <label htmlFor="admin-email">البريد الإلكتروني</label>
      <input id="admin-email" type="email" name="email" autoComplete="username" required />
      <label htmlFor="admin-password">كلمة المرور</label>
      <input id="admin-password" type="password" name="password" autoComplete="current-password" required />
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
        {pending ? "جارٍ التحقق..." : "دخول"}<span aria-hidden="true">←</span>
      </button>
    </form>
  );
}
