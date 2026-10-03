import { DEFAULT_SITE_BRANDING, parseSitePreferences } from "@/lib/site-preferences";

export async function getSiteBranding() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return DEFAULT_SITE_BRANDING;

  const settingsUrl = new URL("/rest/v1/site_preferences?key=eq.branding&select=value", supabaseUrl);
  const response = await fetch(settingsUrl, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    next: { revalidate: 300, tags: ["site-preferences"] },
  });

  if (!response.ok) return DEFAULT_SITE_BRANDING;
  const data: unknown = await response.json();
  const row = Array.isArray(data) ? data[0] : null;
  const value = typeof row === "object" && row !== null && "value" in row ? row.value : null;
  return parseSitePreferences({ branding: value }).branding;
}
