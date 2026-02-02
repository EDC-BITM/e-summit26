import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProfileLite = {
  id: string;
  roll_no: string;
  branch: string;
  phone: string;
  whatsapp_no: string;
  first_name: string;
  last_name: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const supabase = await createClient();
  const { eventId } = await params;

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user)
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  // Get user's team for this specific event
  const { data: membership } = await supabase
    .from("team_members")
    .select(
      `
      team_id,
      role,
      status,
      joined_at,
      teams!inner(id, name, slug, team_leader_id, created_at, event_id)
    `
    )
    .eq("user_id", user.id)
    .eq("teams.event_id", eventId)
    .in("status", ["pending", "accepted"])
    .order("joined_at", { ascending: false })
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ membershipStatus: "none" });
  }

  const team = Array.isArray(membership.teams)
    ? membership.teams[0]
    : membership.teams;

  if (!team) return NextResponse.json({ membershipStatus: "none" });

  const isLeader = team.team_leader_id === user.id;

  // Accepted members
  const { data: acceptedMembers } = await supabase
    .from("team_members")
    .select("user_id, role, status, joined_at")
    .eq("team_id", team.id)
    .eq("status", "accepted")
    .order("role", { ascending: true });

  // Pending requests (leader only)
  const { data: pendingMembers } =
    isLeader && team
      ? await supabase
          .from("team_members")
          .select("user_id, role, status, joined_at")
          .eq("team_id", team.id)
          .eq("status", "pending")
          .order("joined_at", { ascending: true })
      : {
          data: [] as {
            user_id: string;
            role: string;
            status: string;
            joined_at: string;
          }[],
        };

  const allUserIds = Array.from(
    new Set([
      ...(acceptedMembers ?? []).map((m) => m.user_id),
      ...(pendingMembers ?? []).map((m) => m.user_id),
    ])
  );

  const profilesMap = new Map<string, ProfileLite>();
  if (allUserIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, roll_no, branch, phone, whatsapp_no, first_name, last_name")
      .in("id", allUserIds);

    (profiles ?? []).forEach((p) => profilesMap.set(p.id, p as ProfileLite));
  }

  const decorate = (
    rows: {
      user_id: string;
      role: string;
      status: string;
      joined_at?: string;
    }[] | null
  ) =>
    (rows ?? []).map((r) => ({
      ...r,
      profile: profilesMap.get(r.user_id) ?? null,
    }));

  return NextResponse.json(
    {
      membershipStatus: membership.status,
      membershipRole: membership.role,
      team,
      acceptedMembers: decorate(acceptedMembers ?? []),
      pendingMembers: decorate(pendingMembers ?? []),
      maxSize: 5,
      minEligibleSize: 2,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
