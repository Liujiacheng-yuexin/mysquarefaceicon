import { NextResponse } from "next/server";
import { getCommentImage } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    key: string[];
  };
};

export async function GET(_request: Request, context: RouteContext) {
  const key = context.params.key.join("/");
  const image = await getCommentImage(key);
  if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

  return new Response(image.body, {
    headers: {
      "content-type": image.contentType,
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
}
