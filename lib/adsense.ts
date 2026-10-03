import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function getAdsensePublisherId(): Promise<string | null> {
  const supabaseConfig = getSupabasePublicConfig();
  if (!supabaseConfig) return null;

  const settingsUrl = new URL("/rest/v1/site_preferences?key=eq.adsense&select=value", supabaseConfig.url);
  const response = await fetch(settingsUrl, {
    headers: { apikey: supabaseConfig.anonKey, Authorization: `Bearer ${supabaseConfig.anonKey}` },
    next: { revalidate: 300, tags: ["site-preferences"] },
  });

  if (!response.ok) {
    if (response.status !== 404) {
      console.warn(`AdSense publisher ID is unavailable during metadata generation (HTTP ${response.status}); verify the Supabase public key and site_preferences table.`);
    }
    return null;
  }

  const data: unknown = await response.json();
  const row = Array.isArray(data) ? data[0] : null;
  const value = typeof row === "object" && row !== null && "value" in row ? row.value : null;
  const publisherId = typeof value === "object" && value !== null
    ? "client" in value ? value.client : "adsense_client" in value ? value.adsense_client : null
    : null;
  return typeof publisherId === "string" && /^ca-pub-[0-9]{16}$/.test(publisherId)
    ? publisherId
    : null;
}
