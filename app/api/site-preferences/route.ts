import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_preferences").select("*");

    if (error) throw error;
    const preferences = Object.fromEntries(
      (data ?? [])
        .filter((row) => typeof row.key === "string")
        .map((row) => [row.key, row.value]),
    );

    return NextResponse.json(preferences, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Public site preferences are unavailable:", error);
    return NextResponse.json({}, { headers: { "Cache-Control": "private, no-store" } });
  }
}
