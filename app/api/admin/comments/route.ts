import { NextResponse } from "next/server";
import { getAdminPasswordFromRequest, listAdminComments } from "@/lib/comment-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const comments = await listAdminComments(getAdminPasswordFromRequest(request));
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized." }, { status: 401 });
  }
}
