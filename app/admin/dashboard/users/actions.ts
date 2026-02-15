"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

export interface UserTeam {
  team_id: string;
  team_name: string;
  team_slug: string;
  event_id: string | null;
  event_name: string | null;
}

interface TeamRow {
  id: string;
  name: string;
  slug: string;
  event_id: string | null;
}

export interface UserWithDetails {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  created_at: string;
  onboarding_completed: boolean;
  roll_no: string | null;
  phone: string | null;
  branch: string | null;
  teams: UserTeam[];
  gender: string | null;
  college: string | null;
  whatsapp_no: string | null;
  first_name: string | null;
  last_name: string | null;
}

export async function getAllUsersWithDetails(): Promise<UserWithDetails[]> {
  // Check if current user is admin or moderator
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: currentUserRole } = await supabase
    .from("user_role")
    .select(
      `
      roles (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .single();

  type Role = { name: string };
  const roleName = (currentUserRole?.roles as unknown as Role | null)?.name;

  if (!roleName || !["admin", "moderator"].includes(roleName)) {
    throw new Error("Unauthorized: Admin or Moderator access required");
  }

  const supabaseAdmin = await createServiceClient();

  type AuthUser = {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      [key: string]: unknown;
    };
    last_sign_in_at?: string | null;
    email_confirmed_at?: string | null;
    created_at: string;
    [key: string]: unknown;
  };

  let allUsers: AuthUser[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

    if (authError) {
      console.error("Error fetching auth users:", authError);
      throw new Error("Failed to fetch users");
    }

    allUsers = allUsers.concat(authData.users as unknown as AuthUser[]);

    if (authData.users.length < perPage) {
      break;
    }

    page++;
  }

  // Extract all user IDs
  const userIds = allUsers.map((u) => u.id);

  // Batch fetch all user roles
  const { data: userRoles } = await supabaseAdmin
    .from("user_role")
    .select(
      `
      user_id,
      role_id,
      roles (
        id,
        name
      )
    `,
    )
    .in("user_id", userIds);

  // Batch fetch all profiles
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, roll_no, phone, branch, onboarding_completed, gender, college, whatsapp_no, first_name, last_name",
    )
    .in("id", userIds);

  // Batch fetch all team members with event info
  const { data: teamMembers } = await supabaseAdmin
    .from("team_members")
    .select(
      `
      user_id,
      teams (
        id,
        name,
        slug,
        event_id
      )
    `,
    )
    .in("user_id", userIds);

  // Get all unique event IDs (teams can be object or array depending on relationship)
  const eventIds = new Set(
    (teamMembers || [])
      .flatMap((tm) => {
        const teams = Array.isArray(tm.teams)
          ? (tm.teams as TeamRow[])
          : tm.teams
            ? ([tm.teams] as TeamRow[])
            : [];
        return teams.map((t) => t.event_id);
      })
      .filter((id): id is string => id !== null && id !== undefined),
  );

  // Batch fetch event names
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, name")
    .in("id", Array.from(eventIds));

  const eventMap = new Map((events || []).map((e) => [e.id, e.name]));

  // Create lookup maps for O(1) access
  const roleMap = new Map(userRoles?.map((ur) => [ur.user_id, ur]) || []);
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  // Group team members by user_id
  const userTeamsMap = new Map<string, UserTeam[]>();
  (teamMembers || []).forEach((tm) => {
    const teams = Array.isArray(tm.teams)
      ? (tm.teams as TeamRow[])
      : tm.teams
        ? ([tm.teams] as TeamRow[])
        : [];

    teams.forEach((team: TeamRow) => {
      const userTeam: UserTeam = {
        team_id: team.id,
        team_name: team.name,
        team_slug: team.slug,
        event_id: team.event_id || null,
        event_name: team.event_id ? eventMap.get(team.event_id) || null : null,
      };

      if (!userTeamsMap.has(tm.user_id)) {
        userTeamsMap.set(tm.user_id, []);
      }
      userTeamsMap.get(tm.user_id)!.push(userTeam);
    });
  });

  type RoleType = { id: string; name: string };

  // Map all users with their details
  const users: UserWithDetails[] = allUsers.map((authUser) => {
    const userRole = roleMap.get(authUser.id);
    const profile = profileMap.get(authUser.id);
    const userTeams = userTeamsMap.get(authUser.id) || [];

    return {
      id: authUser.id,
      email: authUser.email || "",
      name:
        authUser.user_metadata?.full_name ||
        authUser.email?.split("@")[0] ||
        "User",
      avatar_url: authUser.user_metadata?.avatar_url || null,
      role: (userRole?.roles as unknown as RoleType | null)?.name || "user",
      last_sign_in_at: authUser.last_sign_in_at || null,
      email_confirmed_at: authUser.email_confirmed_at || null,
      created_at: authUser.created_at,
      onboarding_completed: profile?.onboarding_completed || false,
      roll_no: profile?.roll_no || null,
      phone: profile?.phone || null,
      branch: profile?.branch || null,
      teams: userTeams,
      gender: profile?.gender || null,
      college: profile?.college || null,
      whatsapp_no: profile?.whatsapp_no || null,
      first_name: profile?.first_name || null,
      last_name: profile?.last_name || null,
    };
  });

  return users;
}

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "moderator" | "user",
): Promise<{ success: boolean; error?: string }> {
  // Check if current user is admin (only admins can change roles)
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: currentUserRole } = await supabase
    .from("user_role")
    .select(
      `
      roles (
        name
      )
    `,
    )
    .eq("user_id", user.id)
    .single();

  type Role = { name: string };
  const roleName = (currentUserRole?.roles as unknown as Role | null)?.name;

  if (!roleName || roleName !== "admin") {
    return {
      success: false,
      error: "Unauthorized: Only admins can change user roles",
    };
  }

  // Don't allow changing own role
  if (userId === user.id) {
    return { success: false, error: "Cannot change your own role" };
  }

  // Get role ID for the new role
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", newRole)
    .single();

  if (roleError || !roleData) {
    return { success: false, error: "Invalid role" };
  }

  // Update user role
  const supabaseAdmin = await createServiceClient();
  const { error: updateError } = await supabaseAdmin
    .from("user_role")
    .update({ role_id: roleData.id })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating user role:", updateError);
    return { success: false, error: "Failed to update user role" };
  }

  return { success: true };
}
