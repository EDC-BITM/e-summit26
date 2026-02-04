import { createServiceClient } from "@/lib/supabase/server";

type TeamRegistration = {
  id: string;
  registered_at: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    team_leader_id: string;
  };
  event_results?: Array<{
    rank: number;
    marks: number;
    declared_at: string;
  }>;
};

type Registration = {
  id: string;
  registered_at: string;
  team_id: string;
  teams:
    | {
        id: string;
        name: string;
        slug: string;
        team_leader_id: string;
      }
    | {
        id: string;
        name: string;
        slug: string;
        team_leader_id: string;
      }[];
};

export async function getAdminStats() {
  const supabase = await createServiceClient();

  // Get admin and moderator count
  const { count: AdminOrModeratorCount } = await supabase
    .from("user_role")
    .select("user_id", { count: "exact", head: true })
    .or("role_id.eq.2,role_id.eq.1");

  // Get all users from auth
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError || !users) {
    console.error("Error fetching users:", usersError);
  }

  // Get all profiles with onboarding status
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, onboarding_completed");

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  // Create a map of user_id to onboarding status
  const profilesMap = new Map(
    (profiles || []).map((profile) => [
      profile.id,
      profile.onboarding_completed || false,
    ])
  );

  // Get admin/moderator user IDs
  const { data: adminModUsers } = await supabase
    .from("user_role")
    .select("user_id")
    .or("role_id.eq.2,role_id.eq.1");

  const adminModUserIds = new Set(adminModUsers?.map(u => u.user_id) || []);

  // Count users who have a profile AND completed onboarding (excluding admin/moderator)
  // Also count ALL users to show total, including those without profile entries
  let onboardedCount = 0;
  let totalNonAdminUsers = 0;
  
  if (users) {
    users.forEach((user) => {
      // Skip admin/moderator users
      if (adminModUserIds.has(user.id)) {
        return;
      }

      totalNonAdminUsers++;

      const hasProfile = profilesMap.has(user.id);
      const completedOnboarding = hasProfile ? profilesMap.get(user.id)! : false;
      
      // Count as onboarded only if they have a profile AND completed onboarding
      if (hasProfile && completedOnboarding) {
        onboardedCount++;
      }
    });
  }

  // Total registrations
  const { count: registrationsCount } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true });

  // Total teams
  const { count: teamsCount } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true });

  // Total events
  const { count: eventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  return {
    onboardedUsers: onboardedCount || 0,
    totalRegistrations: registrationsCount || 0,
    totalTeams: teamsCount || 0,
    totalEvents: eventsCount || 0,
  };
}

export async function getEventRegistrations() {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      id,
      registered_at,
      events (
        id,
        name,
        category,
        description
      ),
      teams (
        id,
        name,
        slug,
        team_leader_id
      )
    `
    )
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }

  return data || [];
}

export async function getEventStats() {
  const supabase = await createServiceClient();

  const { data, error } = await supabase.from("events").select(`
      id,
      name,
      category,
      max_score,
      event_registrations (
        count
      )
    `);

  if (error) {
    console.error("Error fetching event stats:", error);
    return [];
  }

  return (
    data?.map((event) => ({
      ...event,
      registrationCount: event.event_registrations?.[0]?.count || 0,
    })) || []
  );
}

export async function getEventDetails(eventId: string) {
  const supabase = await createServiceClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return null;
  }

  const { data: registrations, error: regError } = await supabase
    .from("event_registrations")
    .select(
      `
      id,
      registered_at,
      team_id,
      teams!inner (
        id,
        name,
        slug,
        team_leader_id
      )
    `
    )
    .eq("event_id", eventId)
    .order("registered_at", { ascending: false });

  // Fetch event results separately for each registration
  let registrationsWithResults: TeamRegistration[] = [];

  if (registrations && registrations.length > 0) {
    const teamIds = registrations.map((reg: Registration) => reg.team_id);

    const { data: results } = await supabase
      .from("event_results")
      .select("team_id, rank, marks, declared_at")
      .eq("event_id", eventId)
      .in("team_id", teamIds);

    const resultsMap = new Map(results?.map((r) => [r.team_id, r]) || []);

    registrationsWithResults = registrations.map((reg: Registration) => {
      const result = resultsMap.get(reg.team_id);
      return {
        id: reg.id,
        registered_at: reg.registered_at,
        teams: Array.isArray(reg.teams) ? reg.teams[0] : reg.teams,
        event_results: result ? [result] : [],
      };
    });
  }

  if (regError) {
    console.error("Error fetching registrations:", regError);
    return { event, registrations: [] };
  }

  return {
    event,
    registrations: registrationsWithResults,
  };
}

export async function saveEventResult(
  eventId: string,
  teamId: string,
  rank: number,
  marks: number
) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("event_results")
    .upsert(
      {
        event_id: eventId,
        team_id: teamId,
        rank,
        marks,
        declared_at: new Date().toISOString(),
      },
      {
        onConflict: "event_id,team_id",
      }
    )
    .select();

  if (error) {
    console.error("Error saving event result:", error);
    throw error;
  }

  return data;
}

export async function deleteEventResult(eventId: string, teamId: string) {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("event_results")
    .delete()
    .eq("event_id", eventId)
    .eq("team_id", teamId);

  if (error) {
    console.error("Error deleting event result:", error);
    throw error;
  }

  return true;
}

export async function getAllEvents() {
  const supabase = await createServiceClient();

  const { data } = await supabase.from("events").select("*").order("name");

  return data || [];
}
