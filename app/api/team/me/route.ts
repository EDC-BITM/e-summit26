import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProfileLite = { id: string; roll_no: string; branch: string; phone: string; whatsapp_no: string };

export async function GET() {
    const supabase = await createClient();

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

    // Active membership (pending or accepted)
    const { data: membership } = await supabase
        .from("team_members")
        .select("team_id, role, status, joined_at")
        .eq("user_id", user.id)
        .in("status", ["pending", "accepted"])
        .order("joined_at", { ascending: false })
        .maybeSingle();

    if (!membership) {
        return NextResponse.json({ membershipStatus: "none" });
    }

    const { data: team } = await supabase
        .from("teams")
        .select("id, name, slug, team_leader_id, created_at")
        .eq("id", membership.team_id)
        .single();

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
    const { data: pendingMembers } = isLeader
        ? await supabase
            .from("team_members")
            .select("user_id, role, status, joined_at")
            .eq("team_id", team.id)
            .eq("status", "pending")
            .order("joined_at", { ascending: true })
        : { data: [] as any[] };

    const allUserIds = Array.from(
        new Set([...(acceptedMembers ?? []).map(m => m.user_id), ...(pendingMembers ?? []).map(m => m.user_id)])
    );

    const profilesMap = new Map<string, ProfileLite>();
    if (allUserIds.length) {
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, roll_no, branch, phone, whatsapp_no")
            .in("id", allUserIds);

        (profiles ?? []).forEach((p) => profilesMap.set(p.id, p as ProfileLite));
    }

    const decorate = (rows: any[]) =>
        (rows ?? []).map((r) => ({ ...r, profile: profilesMap.get(r.user_id) ?? null }));

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
