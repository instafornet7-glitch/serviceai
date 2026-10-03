import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const parsedSupabaseUrl = supabaseUrl ? new URL(supabaseUrl) : null;
const supabaseImageHost = parsedSupabaseUrl?.hostname ?? null;

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: supabaseImageHost
      ? [{ protocol: parsedSupabaseUrl?.protocol === "http:" ? "http" : "https", hostname: supabaseImageHost, pathname: "/storage/v1/object/public/article-images/**" }]
      : [],
  },
};

export default nextConfig;
