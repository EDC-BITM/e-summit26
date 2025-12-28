import { createClient } from '@/lib/supabase/server';

export async function getAllUsers() {
  const supabase = await createClient();

  // First get all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  if (!profiles) return [];

  // Get user roles separately
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_role')
    .select(`
      user_id,
      roles (
        name
      )
    `);

  if (rolesError) {
    console.error('Error fetching user roles:', rolesError);
  }

  // Map roles to a lookup object
  const rolesMap = new Map(
    (userRoles || []).map((ur: any) => [
      ur.user_id,
      ur.roles?.name || 'user'
    ])
  );

  // Combine profiles with roles
  return profiles.map((profile: any) => ({
    id: profile.id,
    roll_no: profile.roll_no,
    phone: profile.phone,
    branch: profile.branch,
    whatsapp_no: profile.whatsapp_no,
    onboarding_completed: profile.onboarding_completed,
    created_at: profile.created_at,
    user_role: {
      roles: {
        name: rolesMap.get(profile.id) || 'user'
      }
    },
  }));
}

export async function getAllRegistrations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
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
    `)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }

  // Transform the data to match the expected type
  return (data || []).map((reg: any) => ({
    id: reg.id,
    registered_at: reg.registered_at,
    events: Array.isArray(reg.events) ? reg.events[0] : reg.events,
    teams: Array.isArray(reg.teams) ? reg.teams[0] : reg.teams,
  }));
}
