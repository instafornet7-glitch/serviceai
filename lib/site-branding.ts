import { DEFAULT_SITE_BRANDING, parseSitePreferences } from "@/lib/site-preferences";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function getSiteBranding() {
  const supabaseConfig = getSupabasePublicConfig();
  if (!supabaseConfig) return DEFAULT_SITE_BRANDING;

  const settingsUrl = new URL("/rest/v1/site_preferences?key=eq.branding&select=value", supabaseConfig.url);
  const response = await fetch(settingsUrl, {
    headers: { apikey: supabaseConfig.anonKey, Authorization: `Bearer ${supabaseConfig.anonKey}` },
    next: { revalidate: 300, tags: ["site-preferences"] },
  });

  if (!response.ok) return DEFAULT_SITE_BRANDING;
  const data: unknown = await response.json();
  const row = Array.isArray(data) ? data[0] : null;
  const value = typeof row === "object" && row !== null && "value" in row ? row.value : null;
  return parseSitePreferences({ branding: value }).branding;
}
