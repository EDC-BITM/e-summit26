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
  const event_id = body?.event_id ?? null; // Optional event_id for event-specific teams

  if (name.length < 3 || name.length > 40) {
    return NextResponse.json({ error: "NAME_INVALID" }, { status: 400 });
  }

  // If event_id is provided, verify the event exists and is active
  if (event_id) {
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
  }

  // Ensure user has no active team for this event (or general team if no event_id)
  // For event-specific teams, check if user already has a team for this event
  let activeQuery = supabase
    .from("team_members")
    .select("team_id, status, teams!inner(event_id)")
    .eq("user_id", user.id)
    .in("status", ["pending", "accepted"]);

  if (event_id) {
    // Check if user already has a team for this specific event
    activeQuery = activeQuery.eq("teams.event_id", event_id);
  } else {
    // For general teams, check if user has any general team (event_id is null)
    activeQuery = activeQuery.is("teams.event_id", null);
  }

  const { data: active } = await activeQuery.maybeSingle();

  if (active) {
    return NextResponse.json({ 
      error: event_id ? "ALREADY_IN_EVENT_TEAM" : "ALREADY_IN_TEAM_OR_PENDING" 
    }, { status: 409 });
  }

  // Try slug/code insert with retry on collision
  let lastErr: { message?: string; code?: string } | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const slug = makeCode(6);

    const teamData = event_id 
      ? { name, slug, team_leader_id: user.id, event_id }
      : { name, slug, team_leader_id: user.id };

    const { data: team, error: teamErr } = await supabase
      .from("teams")
      .insert(teamData)
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
