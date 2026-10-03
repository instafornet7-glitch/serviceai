import { AdminShell } from "@/app/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  return <AdminShell email={user.email ?? "المدير"}>{children}</AdminShell>;
}
