import { createServiceClient } from "@/lib/supabase/server";

interface Profile {
  id: string;
  email?: string;
  roll_no?: string | null;
  phone?: string | null;
  branch?: string | null;
  whatsapp_no?: string | null;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  roll_no: string;
  phone: string;
  branch: string;
  whatsapp_no: string;
  onboarding_completed: boolean;
  created_at: string;
  role: string;
}

export async function getAllUsers(): Promise<User[]> {
  const supabase = await createServiceClient();

  try {
    // 1. Fetch all user roles
    const { data: userRoles, error: rolesError } = await supabase.from(
      "user_role"
    ).select(`
        user_id,
        roles (
          name
        )
      `);

    if (rolesError) {
      throw new Error(`Error fetching user roles: ${rolesError.message}`);
    }

    if (!userRoles || userRoles.length === 0) {
      console.log("No user roles found");
      return [];
    }

    console.log(`Fetched ${userRoles.length} user roles`);

    // 2. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      console.error(
        "Error fetching profiles (continuing with auth emails):",
        profilesError
      );
    }

    // 3. Create a map of user_id to profile
    const profilesMap = new Map<string, Profile>();
    (profiles || []).forEach((profile: Profile) => {
      profilesMap.set(profile.id, profile);
    });

    // 4. Process users
    const users: User[] = [];

    for (const userRole of userRoles) {
      const userId = userRole.user_id;
      const roleName = userRole.roles?.[0]?.name || "user";
      const profile = profilesMap.get(userId);

      let userData: Partial<User> = {
        id: userId,
        role: roleName,
        onboarding_completed: false,
        roll_no: "N/A",
        phone: "N/A",
        branch: "N/A",
        whatsapp_no: "N/A",
        created_at: new Date().toISOString(),
      };

      if (profile) {
        // User has completed onboarding
        userData = {
          ...userData,
          email: profile.email || "no-email",
          roll_no: profile.roll_no || "N/A",
          phone: profile.phone || "N/A",
          branch: profile.branch || "N/A",
          whatsapp_no: profile.whatsapp_no || "N/A",
          onboarding_completed: Boolean(profile.onboarding_completed),
          created_at: profile.created_at,
        };
      } else {
        // User has role but no profile (not onboarded) - get email from auth
        try {
          const { data: authUser, error: authError } =
            await supabase.auth.admin.getUserById(userId);
          if (!authError && authUser?.user?.email) {
            userData.email = authUser.user.email;
          } else {
            userData.email = "no-email";
          }
        } catch {
          userData.email = "no-email";
        }
      }

      users.push(userData as User);
    }

    console.log(`Successfully processed ${users.length} users`);
    return users;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}

export async function getAllRegistrations() {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      id,
      registered_at,
      events!inner (
        id,
        name,
        category
      ),
      teams!inner (
        id,
        name,
        slug
      )
    `
    )
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }

  // Transform the data to match the expected type
  interface RegistrationData {
    id: string;
    registered_at: string;
    events: unknown;
    teams: unknown;
  }

  return (data || []).map((reg: RegistrationData) => ({
    id: reg.id,
    registered_at: reg.registered_at,
    events: Array.isArray(reg.events) ? reg.events[0] : reg.events,
    teams: Array.isArray(reg.teams) ? reg.teams[0] : reg.teams,
  }));
}
