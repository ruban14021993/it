import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const tag: string = body.tag;

  if (!tag) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: true, tag });
}
