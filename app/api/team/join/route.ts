import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const codeRaw = String(body?.code ?? "");
  const code = codeRaw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  console.log("[JOIN] User:", user.id, "Code:", code, "Raw:", codeRaw);

  if (code.length < 4) {
    console.log("[JOIN] Code too short:", code.length);
    return NextResponse.json({ error: "CODE_INVALID" }, { status: 400 });
  }

  // First, get the team details including event_id
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id,name,slug,team_leader_id,event_id")
    .eq("slug", code)
    .maybeSingle();

  if (teamError || !team) return NextResponse.json({ error: "TEAM_NOT_FOUND" }, { status: 404 });
  if (team.team_leader_id === user.id) return NextResponse.json({ error: "CANNOT_JOIN_OWN_TEAM" }, { status: 400 });

  console.log("[JOIN] Team found:", team.id, "Event:", team.event_id);

  // Check if user already has a team for THIS SPECIFIC event
  const { data: existingMemberships } = await supabase
    .from("team_members")
    .select("team_id, status, teams!inner(id, name, event_id)")
    .eq("user_id", user.id)
    .in("status", ["pending", "accepted"]);

  console.log("[JOIN] Existing memberships:", existingMemberships);

  if (existingMemberships && existingMemberships.length > 0) {
    // Check if user already has a team for this specific event
    for (const membership of existingMemberships) {
      const existingTeam = Array.isArray(membership.teams) 
        ? membership.teams[0] 
        : membership.teams;
      
      if (existingTeam && existingTeam.event_id === team.event_id) {
        return NextResponse.json({ 
          error: "ALREADY_IN_EVENT_TEAM",
          message: `You already have a team for this event: ${existingTeam.name}`
        }, { status: 409 });
      }
    }
  }

  // Team full check (accepted only)
  const { count } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("team_id", team.id)
    .eq("status", "accepted");

  if ((count ?? 0) >= 5) return NextResponse.json({ error: "TEAM_FULL" }, { status: 409 });

  console.log("[JOIN] Team size:", count, "- proceeding with join");

  // Upsert the joining record (allows re-applying after cancellation/rejection)
  const { error: insErr } = await supabase
    .from("team_members")
    .upsert(
      { team_id: team.id, user_id: user.id, role: "member", status: "pending" },
      { onConflict: "team_id,user_id" }
    );

  if (insErr) {
    console.error("[JOIN] Insert error:", insErr);
    return NextResponse.json({ error: "JOIN_REQUEST_FAILED", details: insErr.message }, { status: 400 });
  }

  console.log("[JOIN] Success - User", user.id, "joined team", team.id);

  return NextResponse.json({ ok: true, team });
}
