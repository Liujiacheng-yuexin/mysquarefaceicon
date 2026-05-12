import { NextResponse } from "next/server";
import { createComment, listPublicComments } from "@/lib/comment-store";
import { isLocaleCode, type LocaleCode } from "@/lib/locales";

export const dynamic = "force-dynamic";

function normalizeLocale(value: string | null): LocaleCode {
  if (!value || value === "en") return "en";
  return isLocaleCode(value) ? value : "en";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = normalizeLocale(url.searchParams.get("locale"));
  const comments = await listPublicComments(locale);
  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const rating = Number(formData.get("rating") ?? 5);
    const locale = normalizeLocale(String(formData.get("locale") ?? "en"));
    const imageValue = formData.get("image");
    const image = imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

    if (!name || !email || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }

    const comment = await createComment({ locale, name, email, content, rating, image });
    return NextResponse.json({ id: comment.id, status: comment.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to submit comment." }, { status: 400 });
  }
}
