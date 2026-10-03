let adminEmailWarningLogged = false;

export function getConfiguredAdminEmail(): string | null {
  const email = (process.env.SUPABASE_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL)?.trim().toLowerCase();
  if (email) return email;

  if (!adminEmailWarningLogged) {
    adminEmailWarningLogged = true;
    console.error("Admin configuration is incomplete. Set SUPABASE_ADMIN_EMAIL or ADMIN_EMAIL.");
  }
  return null;
}
