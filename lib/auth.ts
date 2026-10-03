import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw new Error(`Could not verify the current session: ${error.message}`);
  if (!user) return null;

  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = user.app_metadata.role === "admin"
    && Boolean(adminEmail)
    && user.email?.toLowerCase() === adminEmail;

  return isAdmin ? user : null;
}

export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
