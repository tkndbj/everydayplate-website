import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/lib/data";

/**
 * Sanity calls this webhook whenever content is published, so changes appear
 * on the site instantly instead of within a minute.
 * Setup: README → "Instant updates (optional)".
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    // One tag covers the whole site: pages re-render on their next visit.
    revalidateTag(CONTENT_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    console.error("Revalidation failed", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
