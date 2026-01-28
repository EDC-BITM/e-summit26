import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get("activeOnly");
  const includeOverall = url.searchParams.get("includeOverall");

  const onlyActive =
    activeOnly === null ? true : activeOnly === "1" || activeOnly === "true";
  const wantOverall =
    includeOverall === null
      ? true
      : includeOverall === "1" || includeOverall === "true";

  const sb = supabaseAdmin(); // ✅ FIX

  const eventsQuery = sb
    .from("events")
    .select(
      "id,name,category,description,max_score,created_at,date,location,image_url,max_participants,is_active"
    )
    .order("created_at", { ascending: false });

  const { data: eventsData, error: eventsErr } = onlyActive
    ? await eventsQuery.eq("is_active", true)
    : await eventsQuery;

  if (eventsErr) {
    return json(
      { error: "Failed to fetch events", details: eventsErr.message },
      { status: 500 }
    );
  }

  const events = ((eventsData as DbEvent[]) ?? []).map((e) => ({
    ...e,
    results: [] as Array<{
      rank: 1 | 2 | 3;
      marks: number;
      declared_at: string | null;
      team: { id: string; slug: string; name: string };
    }>,
    declared: false,
  }));

  const eventIds = events.map((e) => e.id);
  if (eventIds.length === 0) return json({ events: [], overall: [] });

  const { data: rowsData, error: rowsErr } = await sb
    .from("event_results")
    .select(
      `
      event_id,
      team_id,
      rank,
      marks,
      declared_at,
      team:teams!event_results_team_id_fkey ( id, slug, name, team_leader_id, created_at )
    `
    )
    .in("event_id", eventIds)
    .order("event_id", { ascending: true })
    .order("rank", { ascending: true });

  if (rowsErr) {
    return json(
      { error: "Failed to fetch event results", details: rowsErr.message },
      { status: 500 }
    );
  }

  const rows = (rowsData as unknown as DbEventResult[]) ?? [];

  const byEventId = new Map<string, DbEventResult[]>();
  for (const r of rows) {
    if (!byEventId.has(r.event_id)) byEventId.set(r.event_id, []);
    byEventId.get(r.event_id)!.push(r);
  }

  for (const e of events) {
    const list = byEventId.get(e.id) ?? [];
    const normalized = list
      .filter((r) => r.team)
      .map((r) => ({
        rank: r.rank,
        marks: r.marks,
        declared_at: r.declared_at,
        team: { id: r.team!.id, slug: r.team!.slug, name: r.team!.name },
      }));

    e.results = normalized;
    e.declared = normalized.length > 0;
  }

  let overall: Array<{
    team: { id: string; slug: string; name: string };
    total_marks: number;
    podiums: number;
    golds: number;
    silvers: number;
    bronzes: number;
  }> = [];

  if (wantOverall) {
    const agg = new Map<
      string,
      {
        team: { id: string; slug: string; name: string };
        total_marks: number;
        golds: number;
        silvers: number;
        bronzes: number;
      }
    >();

    for (const r of rows) {
      if (!r.team) continue;

      const key = r.team.id;
      if (!agg.has(key)) {
        agg.set(key, {
          team: { id: r.team.id, slug: r.team.slug, name: r.team.name },
          total_marks: 0,
          golds: 0,
          silvers: 0,
          bronzes: 0,
        });
      }

      const v = agg.get(key)!;
      v.total_marks += r.marks;
      if (r.rank === 1) v.golds++;
      if (r.rank === 2) v.silvers++;
      if (r.rank === 3) v.bronzes++;
    }

    overall = Array.from(agg.values())
      .map((v) => ({
        team: v.team,
        total_marks: v.total_marks,
        podiums: v.golds + v.silvers + v.bronzes,
        golds: v.golds,
        silvers: v.silvers,
        bronzes: v.bronzes,
      }))
      .sort((a, b) => {
        if (b.total_marks !== a.total_marks) return b.total_marks - a.total_marks;
        if (b.golds !== a.golds) return b.golds - a.golds;
        if (b.silvers !== a.silvers) return b.silvers - a.silvers;
        if (b.bronzes !== a.bronzes) return b.bronzes - a.bronzes;
        return a.team.name.localeCompare(b.team.name);
      });
  }

  return json({ events, overall });
}