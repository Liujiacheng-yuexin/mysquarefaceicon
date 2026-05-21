import { NextResponse } from "next/server";
import { getAdminCommentImage, getAdminPasswordFromRequest } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    key: string[];
  };
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const key = context.params.key.join("/");
    const image = await getAdminCommentImage(key, getAdminPasswordFromRequest(request));
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    return new Response(image.body, {
      headers: {
        "content-type": image.contentType,
        "cache-control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    );
  }
}
