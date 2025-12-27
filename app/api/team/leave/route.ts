// app/api/team/leave/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id, role, status")
    .eq("user_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (!mem) return NextResponse.json({ error: "NOT_IN_TEAM" }, { status: 400 });
  if (mem.role === "leader") return NextResponse.json({ error: "LEADER_CANNOT_LEAVE" }, { status: 400 });

  const { error } = await supabase
    .from("team_members")
    .update({ status: "rejected" })
    .eq("user_id", user.id)
    .eq("team_id", mem.team_id)
    .eq("status", "accepted");

  if (error) return NextResponse.json({ error: "LEAVE_FAILED", details: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
