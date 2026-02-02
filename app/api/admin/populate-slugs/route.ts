import { NextResponse } from "next/server";
import { populateEventSlugs } from "@/lib/admin/populate-event-slugs";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * API route to populate slugs for existing events
 * Only accessible to admins
 */
export async function POST() {
  try {
    // Ensure only admins can run this
    await requireAdmin();

    const result = await populateEventSlugs();

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in populate-slugs API:", error);
    return NextResponse.json(
      { error: "Unauthorized or an error occurred" },
      { status: 403 }
    );
  }
}
