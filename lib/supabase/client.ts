"use client";

import { createBrowserClient } from "@supabase/ssr";
import { resolveSupabasePublicConfig } from "@/lib/supabase/config";

export function createClient() {
  const config = resolveSupabasePublicConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!config) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and a public anon/publishable key.");
  }

  return createBrowserClient(config.url, config.anonKey);
}
