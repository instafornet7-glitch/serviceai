import { AdminAuthGate } from "@/components/admin-auth-gate";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminAuthGate>{children}</AdminAuthGate>;
}
