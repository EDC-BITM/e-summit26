import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function GET() {
  await headers();
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user)
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  // Fetch all team memberships (accepted and pending)
  const { data: memberships } = await supabase
    .from("team_members")
    .select(
      `
      team_id,
      role,
      status,
      joined_at,
      teams!inner (
        id,
        name,
        slug,
        team_leader_id,
        event_id,
        created_at
      )
    `
    )
    .eq("user_id", user.id)
    .in("status", ["pending", "accepted"])
    .order("joined_at", { ascending: false });

  const teams = (memberships || []).map((m) => {
    const team = Array.isArray(m.teams) ? m.teams[0] : m.teams;
    return {
      team_id: m.team_id,
      role: m.role,
      status: m.status,
      joined_at: m.joined_at,
      team: team,
    };
  });

  // Fetch event details for teams with event_id
  const eventIds = teams
    .map((t) => t.team?.event_id)
    .filter((id): id is string => !!id);

  const eventsMap = new Map();
  if (eventIds.length > 0) {
    const { data: events } = await supabase
      .from("events")
      .select("id, name, category, date, location, image_url")
      .in("id", eventIds);

    (events || []).forEach((e) => eventsMap.set(e.id, e));
  }

  // Fetch registrations for each team
  const teamIds = teams.map((t) => t.team_id);
  const registrationsMap = new Map();
  if (teamIds.length > 0) {
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("team_id, event_id, registered_at")
      .in("team_id", teamIds);

    (registrations || []).forEach((r) => {
      if (!registrationsMap.has(r.team_id)) {
        registrationsMap.set(r.team_id, []);
      }
      registrationsMap.get(r.team_id).push(r);
    });
  }

  // Fetch member counts for each team
  const memberCountsMap = new Map();
  if (teamIds.length > 0) {
    const { data: memberCounts } = await supabase
      .from("team_members")
      .select("team_id, status")
      .in("team_id", teamIds)
      .eq("status", "accepted");

    const counts: Record<string, number> = {};
    (memberCounts || []).forEach((mc) => {
      counts[mc.team_id] = (counts[mc.team_id] || 0) + 1;
    });

    Object.entries(counts).forEach(([teamId, count]) => {
      memberCountsMap.set(teamId, count);
    });
  }

  // Build response
  const teamsWithDetails = teams.map((t) => ({
    ...t,
    event: t.team?.event_id ? eventsMap.get(t.team.event_id) || null : null,
    registrations: registrationsMap.get(t.team_id) || [],
    memberCount: memberCountsMap.get(t.team_id) || 0,
  }));

  return NextResponse.json(
    {
      teams: teamsWithDetails,
      totalTeams: teams.length,
      acceptedTeams: teams.filter((t) => t.status === "accepted").length,
      pendingTeams: teams.filter((t) => t.status === "pending").length,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
