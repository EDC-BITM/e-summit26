"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

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
  team: string | null;
}

export async function getAllUsersWithDetails(): Promise<UserWithDetails[]> {
  // Check if current user is admin or moderator
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: currentUserRole } = await supabase
    .from("user_role")
    .select(`
      roles (
        name
      )
    `)
    .eq("user_id", user.id)
    .single();

  type Role = { name: string };
  const roleName = (currentUserRole?.roles as unknown as Role | null)?.name;

  if (!roleName || !["admin", "moderator"].includes(roleName)) {
    throw new Error("Unauthorized: Admin or Moderator access required");
  }

  // Use service client to get all users
  const supabaseAdmin = await createServiceClient();

  // Get all auth users with pagination (listUsers has a default limit of 50)
  let allUsers: any[] = [];
  let page = 1;
  const perPage = 1000; // Max allowed by Supabase
  
  while (true) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (authError) {
      console.error("Error fetching auth users:", authError);
      throw new Error("Failed to fetch users");
    }

    allUsers = allUsers.concat(authData.users);
    
    // If we got fewer users than perPage, we've reached the last page
    if (authData.users.length < perPage) {
      break;
    }
    
    page++;
  }

  // Extract all user IDs
  const userIds = allUsers.map(u => u.id);

  // Batch fetch all user roles
  const { data: userRoles } = await supabaseAdmin
    .from("user_role")
    .select(`
      user_id,
      role_id,
      roles (
        id,
        name
      )
    `)
    .in("user_id", userIds);

  // Batch fetch all profiles
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, roll_no, phone, branch, onboarding_completed")
    .in("id", userIds);

  // Batch fetch all team members
  const { data: teamMembers } = await supabaseAdmin
    .from("team_members")
    .select(`
      user_id,
      teams (
        name
      )
    `)
    .in("user_id", userIds);

  // Create lookup maps for O(1) access
  const roleMap = new Map(userRoles?.map(ur => [ur.user_id, ur]) || []);
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
  const teamMap = new Map(teamMembers?.map(tm => [tm.user_id, tm]) || []);

  type TeamType = { name: string };
  type RoleType = { id: string; name: string };

  // Map all users with their details
  const users: UserWithDetails[] = allUsers.map(authUser => {
    const userRole = roleMap.get(authUser.id);
    const profile = profileMap.get(authUser.id);
    const teamMember = teamMap.get(authUser.id);

    return {
      id: authUser.id,
      email: authUser.email || "",
      name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
      avatar_url: authUser.user_metadata?.avatar_url || null,
      role: (userRole?.roles as unknown as RoleType | null)?.name || "user",
      last_sign_in_at: authUser.last_sign_in_at || null,
      email_confirmed_at: authUser.email_confirmed_at || null,
      created_at: authUser.created_at,
      onboarding_completed: profile?.onboarding_completed || false,
      roll_no: profile?.roll_no || null,
      phone: profile?.phone || null,
      branch: profile?.branch || null,
      team: (teamMember?.teams as unknown as TeamType | null)?.name || null,
    };
  });

  return users;
}

export async function updateUserRole(
  userId: string,
  newRole: "admin" | "moderator" | "user"
): Promise<{ success: boolean; error?: string }> {
  // Check if current user is admin (only admins can change roles)
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: currentUserRole } = await supabase
    .from("user_role")
    .select(`
      roles (
        name
      )
    `)
    .eq("user_id", user.id)
    .single();

  type Role = { name: string };
  const roleName = (currentUserRole?.roles as unknown as Role | null)?.name;

  if (!roleName || roleName !== "admin") {
    return { success: false, error: "Unauthorized: Only admins can change user roles" };
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
