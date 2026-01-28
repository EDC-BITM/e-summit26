import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DbEvent = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  max_score: number;
  created_at: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean | null;
};

type DbTeam = {
  id: string;
  slug: string;
  name: string;
  team_leader_id: string;
  created_at: string;
};

type DbEventResult = {
  event_id: string;
  team_id: string;
  rank: 1 | 2 | 3;
  marks: number;
  declared_at: string | null;
  team: DbTeam | null;
};

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  if (!UUID_RE.test(eventId)) {
    return json({ error: "Invalid eventId (expected UUID)" }, { status: 400 });
  }

  const sb = supabaseAdmin(); // ✅ FIX

  const { data: eventData, error: eventErr } = await sb
    .from("events")
    .select(
      "id,name,category,description,max_score,created_at,date,location,image_url,max_participants,is_active"
    )
    .eq("id", eventId)
    .maybeSingle();

  if (eventErr) {
    return json(
      { error: "Failed to fetch event", details: eventErr.message },
      { status: 500 }
    );
  }

  const event = eventData as DbEvent | null;
  if (!event) return json({ error: "Event not found" }, { status: 404 });

  const { data: rowsData, error: rowsErr } = await sb
    .from("event_results")
    .select(
      `
      event_id,
      team_id,
      rank,
      marks,
      declared_at,
      team:teams!event_results_team_id_fkey (
        id,
        slug,
        name,
        team_leader_id,
        created_at
      )
    `
    )
    .eq("event_id", eventId)
    .order("rank", { ascending: true });

  if (rowsErr) {
    return json(
      { error: "Failed to fetch leaderboard", details: rowsErr.message },
      { status: 500 }
    );
  }

  const rows = (rowsData as unknown as DbEventResult[]) ?? [];

  const results = rows
    .filter((r) => r.team)
    .map((r) => ({
      rank: r.rank,
      marks: r.marks,
      declared_at: r.declared_at,
      team: {
        id: r.team!.id,
        slug: r.team!.slug,
        name: r.team!.name,
        team_leader_id: r.team!.team_leader_id,
        created_at: r.team!.created_at,
      },
    }));

  return json({ event, declared: results.length > 0, results });
}