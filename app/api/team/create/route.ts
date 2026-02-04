import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function makeCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing O/0/I/1
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const event_id = body?.event_id;

  if (name.length < 3 || name.length > 40) {
    return NextResponse.json({ error: "NAME_INVALID" }, { status: 400 });
  }

  // event_id is required - teams must be associated with an event
  if (!event_id) {
    return NextResponse.json({ error: "EVENT_ID_REQUIRED" }, { status: 400 });
  }

  // Verify the event exists and is active
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id, is_active")
    .eq("id", event_id)
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: "EVENT_NOT_FOUND" }, { status: 404 });
  }

  if (!event.is_active) {
    return NextResponse.json({ error: "EVENT_NOT_ACTIVE" }, { status: 400 });
  }

  // Check if user already has a team for this specific event
  const { data: existingMemberships } = await supabase
    .from("team_members")
    .select("team_id, status, teams!inner(id, event_id)")
    .eq("user_id", user.id)
    .in("status", ["pending", "accepted"]);

  if (existingMemberships && existingMemberships.length > 0) {
    for (const membership of existingMemberships) {
      const team = membership.teams as unknown as { id: string; event_id: string | null };
      
      if (team.event_id === event_id) {
        return NextResponse.json({ 
          error: "ALREADY_IN_EVENT_TEAM",
          message: "You already have a team for this event"
        }, { status: 409 });
      }
    }
  }

  // Try slug/code insert with retry on collision
  let lastErr: { message?: string; code?: string } | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const slug = makeCode(6);

    const { data: team, error: teamErr } = await supabase
      .from("teams")
      .insert({ name, slug, team_leader_id: user.id, event_id })
      .select("id,name,slug,team_leader_id,created_at,event_id")
      .single();

    if (teamErr) {
      lastErr = teamErr;
      // unique violation on slug -> retry
      if (String(teamErr?.code) === "23505") continue;
      return NextResponse.json({ error: "TEAM_CREATE_FAILED", details: teamErr.message }, { status: 400 });
    }

    // Insert leader membership as accepted leader
    const { error: memErr } = await supabase
      .from("team_members")
      .insert({ team_id: team.id, user_id: user.id, role: "leader", status: "accepted" });

    if (memErr) {
      return NextResponse.json({ error: "LEADER_MEMBERSHIP_FAILED", details: memErr.message }, { status: 400 });
    }

    return NextResponse.json({ team });
  }

  return NextResponse.json({ error: "SLUG_COLLISION_RETRY_EXHAUSTED", details: lastErr?.message }, { status: 500 });
}
