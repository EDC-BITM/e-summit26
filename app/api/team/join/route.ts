import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const codeRaw = String(body?.code ?? "");
  const code = codeRaw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  if (code.length < 4) return NextResponse.json({ error: "CODE_INVALID" }, { status: 400 });

  // User already active somewhere?
  const { data: active } = await supabase
    .from("team_members")
    .select("team_id,status")
    .eq("user_id", user.id)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  if (active) return NextResponse.json({ error: "ALREADY_IN_TEAM_OR_PENDING" }, { status: 409 });

  const { data: team } = await supabase
    .from("teams")
    .select("id,name,slug,team_leader_id")
    .eq("slug", code)
    .maybeSingle();

  if (!team) return NextResponse.json({ error: "TEAM_NOT_FOUND" }, { status: 404 });
  if (team.team_leader_id === user.id) return NextResponse.json({ error: "CANNOT_JOIN_OWN_TEAM" }, { status: 400 });

  // Team full check (accepted only)
  const { count } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("team_id", team.id)
    .eq("status", "accepted");

  if ((count ?? 0) >= 5) return NextResponse.json({ error: "TEAM_FULL" }, { status: 409 });

  const { error: insErr } = await supabase
    .from("team_members")
    .insert({ team_id: team.id, user_id: user.id, role: "member", status: "pending" });

  if (insErr) return NextResponse.json({ error: "JOIN_REQUEST_FAILED", details: insErr.message }, { status: 400 });

  return NextResponse.json({ ok: true, team });
}
