import { NextResponse } from "next/server";
import { deleteComment, getAdminPasswordFromRequest, updateCommentStatus, type CommentStatus } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

const statuses = new Set<CommentStatus>(["pending", "approved", "rejected"]);

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const body = (await request.json()) as { status?: CommentStatus };
    if (!body.status || !statuses.has(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const comment = await updateCommentStatus(context.params.id, body.status, getAdminPasswordFromRequest(request));
    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update comment." }, { status: 401 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await deleteComment(context.params.id, getAdminPasswordFromRequest(request));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete comment." }, { status: 401 });
  }
}
