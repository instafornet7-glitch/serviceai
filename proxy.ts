import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  if (!url || !anonKey) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login?error=configuration", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
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
  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
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