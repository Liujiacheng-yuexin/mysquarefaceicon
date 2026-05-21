import { NextResponse } from "next/server";
import { likeComment } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = (await request.json()) as { visitorId?: string };
    const result = await likeComment(context.params.id, body.visitorId ?? "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to like comment." },
      { status: 400 }
    );
  }
}
