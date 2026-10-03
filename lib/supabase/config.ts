export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

const reportedMissingConfig = new Set<string>();

function normalizeEnvValue(value: string | undefined): string {
  return value?.replace(/\s/g, "").replace(/\/+$/, "") ?? "";
}

export function resolveSupabasePublicConfig(
  urlValue: string | undefined,
  anonKeyValue: string | undefined,
  publishableKeyValue: string | undefined,
): SupabasePublicConfig | null {
  const url = normalizeEnvValue(urlValue);
  const anonKey = normalizeEnvValue(anonKeyValue);
  const publishableKey = normalizeEnvValue(publishableKeyValue);
  const preferredPublishableKey = publishableKey.startsWith("sb_publishable_")
    ? publishableKey
    : "";
  const key = preferredPublishableKey || anonKey || publishableKey;

  if (!url || !key) return null;
  return { url, anonKey: key };
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const config = resolveSupabasePublicConfig(
    process.env["NEXT_PUBLIC_SUPABASE_URL"],
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
  );

  if (!config) {
    const missing = [
      ...(!normalizeEnvValue(process.env["NEXT_PUBLIC_SUPABASE_URL"]) ? ["NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!normalizeEnvValue(process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"])
        && !normalizeEnvValue(process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"])
        ? ["NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
        : []),
    ];
    const missingKey = missing.join(", ");
    if (!reportedMissingConfig.has(missingKey)) {
      reportedMissingConfig.add(missingKey);
      console.error(`Supabase configuration is incomplete. Missing: ${missingKey}.`);
    }
  }

  return config;
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicConfig() !== null;
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Check the server logs for missing environment variable names.");
  }
}
