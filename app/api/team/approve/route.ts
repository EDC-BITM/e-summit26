// app/api/team/approve/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const team_id = String(body?.team_id ?? "");
  const user_id = String(body?.user_id ?? "");

  const { data: team } = await supabase
    .from("teams")
    .select("id, team_leader_id")
    .eq("id", team_id)
    .single();

  if (!team || team.team_leader_id !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // full check (accepted)
  const { count } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("team_id", team_id)
    .eq("status", "accepted");

  if ((count ?? 0) >= 5) return NextResponse.json({ error: "TEAM_FULL" }, { status: 409 });

  const { error } = await supabase
    .from("team_members")
    .update({ status: "accepted" })
    .eq("team_id", team_id)
    .eq("user_id", user_id)
    .eq("status", "pending");

  if (error) return NextResponse.json({ error: "APPROVE_FAILED", details: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
