import { NextResponse, type NextRequest } from "next/server";
import { getPage, getPages, updatePage } from "@/lib/pages";

export const dynamic = "force-dynamic";

function isDevelopmentRequest(request: NextRequest): boolean {
  return process.env.NODE_ENV !== "production"
    && ["localhost", "127.0.0.1", "::1"].includes(request.nextUrl.hostname);
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  try {
    if (slug) {
      const page = await getPage(slug);
      return page ? NextResponse.json(page) : NextResponse.json({ error: "Page not found." }, { status: 404 });
    }
    return NextResponse.json(await getPages());
  } catch (error) {
    if (error instanceof Error && error.message === "Unknown page slug.") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to read managed pages.", error);
    return NextResponse.json({ error: "Could not read pages." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDevelopmentRequest(request)) {
    return NextResponse.json({ error: "Page-file editing is available only in local development." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object"
    || body === null
    || !("slug" in body)
    || !("title" in body)
    || !("content" in body)
    || typeof body.slug !== "string"
    || typeof body.title !== "string"
    || typeof body.content !== "string"
    || !body.title.trim()
    || body.title.length > 180
    || body.content.length > 100_000
  ) {
    return NextResponse.json({ error: "A valid slug, title, and page content are required." }, { status: 400 });
  }

  try {
    const page = await updatePage(body.slug, { title: body.title.trim(), content: body.content });
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof Error && error.message === "Unknown page slug.") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to update managed page.", error);
    return NextResponse.json({ error: "Could not save page." }, { status: 500 });
  }
}
