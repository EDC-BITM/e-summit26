import { createClient } from '@/lib/supabase/server';

export async function getAdminStats() {
  const supabase = await createClient();

  // Total onboarded users
  const { count: onboardedCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('onboarding_completed', true);

  // Total registrations
  const { count: registrationsCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true });

  // Total teams
  const { count: teamsCount } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true });

  // Total events
  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  return {
    onboardedUsers: onboardedCount || 0,
    totalRegistrations: registrationsCount || 0,
    totalTeams: teamsCount || 0,
    totalEvents: eventsCount || 0,
  };
}

export async function getEventRegistrations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
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
    `)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }

  return data || [];
}

export async function getEventStats() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      name,
      category,
      max_score,
      event_registrations (
        count
      )
    `);

  if (error) {
    console.error('Error fetching event stats:', error);
    return [];
  }

  return data?.map((event) => ({
    ...event,
    registrationCount: event.event_registrations?.[0]?.count || 0,
  })) || [];
}

export async function getEventDetails(eventId: string) {
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    return null;
  }

  const { data: registrations, error: regError } = await supabase
    .from('event_registrations')
    .select(`
      id,
      registered_at,
      teams!inner (
        id,
        name,
        slug,
        team_leader_id
      ),
      event_results (
        rank,
        marks,
        declared_at
      )
    `)
    .eq('event_id', eventId)
    .order('registered_at', { ascending: false });

  if (regError) {
    console.error('Error fetching registrations:', regError);
    return { event, registrations: [] };
  }

  // Transform the data to match the expected type
  const transformedRegistrations = (registrations || []).map((reg: any) => ({
    id: reg.id,
    registered_at: reg.registered_at,
    teams: Array.isArray(reg.teams) ? reg.teams[0] : reg.teams,
    event_results: reg.event_results || [],
  }));

  return { 
    event, 
    registrations: transformedRegistrations
  };
}

export async function saveEventResult(
  eventId: string,
  teamId: string,
  rank: number,
  marks: number
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_results')
    .upsert({
      event_id: eventId,
      team_id: teamId,
      rank,
      marks,
      declared_at: new Date().toISOString(),
    }, {
      onConflict: 'event_id,team_id'
    })
    .select();

  if (error) {
    console.error('Error saving event result:', error);
    throw error;
  }

  return data;
}

export async function deleteEventResult(eventId: string, teamId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('event_results')
    .delete()
    .eq('event_id', eventId)
    .eq('team_id', teamId);

  if (error) {
    console.error('Error deleting event result:', error);
    throw error;
  }

  return true;
}

export async function getAllEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}
