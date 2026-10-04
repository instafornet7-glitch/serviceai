"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/app/admin/admin-shell";

const DEFAULT_EMAIL = "tahar@gmail.com";
const DEFAULT_PASS = "admin123";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const savedEmail = window.localStorage.getItem("admin_email") || DEFAULT_EMAIL;
        if (!window.localStorage.getItem("admin_email")) {
          window.localStorage.setItem("admin_email", DEFAULT_EMAIL);
        }
        if (!window.localStorage.getItem("admin_password")) {
          window.localStorage.setItem("admin_password", DEFAULT_PASS);
        }
        if (window.localStorage.getItem("admin_logged") === "true") {
          setEmail(savedEmail);
          setLogged(true);
          setLoading(false);
        } else {
          setLoading(false);
          window.location.replace("/admin/login");
        }
      } catch (error) {
        console.error("تعذر التحقق من دخول المدير المحلي.", error);
        setStorageError(true);
        setLoading(false);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (loading) return <div className="admin-login-page"><p role="status">جارٍ التحقق من الدخول...</p></div>;
  if (logged) return <AdminShell email={email}>{children}</AdminShell>;
  return <div className="admin-login-page"><p className={storageError ? "admin-alert" : ""} role={storageError ? "alert" : "status"}>{storageError ? "تعذر الوصول إلى التخزين المحلي. فعّل التخزين في المتصفح ثم أعد المحاولة." : "يلزم تسجيل الدخول لفتح لوحة التحكم."}</p><Link className="admin-login-back" href="/admin/login">الانتقال إلى تسجيل الدخول</Link></div>;
}
