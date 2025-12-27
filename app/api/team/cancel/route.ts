// app/api/team/cancel/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const { error } = await supabase
    .from("team_members")
    .update({ status: "rejected" })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (error) return NextResponse.json({ error: "CANCEL_FAILED", details: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
