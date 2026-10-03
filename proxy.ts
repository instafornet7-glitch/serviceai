import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getConfiguredAdminEmail } from "@/lib/admin-config";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const supabaseConfig = getSupabasePublicConfig();
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  if (!supabaseConfig) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login?error=configuration", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const adminEmail = getConfiguredAdminEmail();
  const isAdmin = Boolean(
    !error
    && user
    && user.app_metadata.role === "admin"
    && adminEmail
    && user.email?.toLowerCase() === adminEmail,
  );

  if (!isAdmin && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    if (error) loginUrl.searchParams.set("error", "session");
    return NextResponse.redirect(loginUrl);
  }
  if (isAdmin && isLoginPage) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};