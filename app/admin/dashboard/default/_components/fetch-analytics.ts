import { createClient } from "@/lib/supabase/server";

export async function fetchAnalyticsData() {
  const supabase = await createClient();

  // Fetch all profiles with user data
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, branch, onboarding_completed, created_at")
    .order("created_at", { ascending: true });

  const profilesList = profiles || [];

  // Calculate user stats
  const onboardedCount = profilesList.filter((p) => p.onboarding_completed).length;
  const totalUsers = profilesList.length;
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const weekSignups = profilesList.filter(
    (p) => new Date(p.created_at) >= weekAgo
  ).length;
  
  const monthSignups = profilesList.filter(
    (p) => new Date(p.created_at) >= monthAgo
  ).length;

  // Calculate branch distribution
  const branchMap = new Map<string, number>();
  profilesList.forEach((profile) => {
    if (profile.branch) {
      branchMap.set(profile.branch, (branchMap.get(profile.branch) || 0) + 1);
    }
  });

  const branchDistribution = Array.from(branchMap.entries())
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate user growth data (last 30 days)
  const dateMap = new Map<string, number>();
  profilesList
    .filter((p) => new Date(p.created_at) >= monthAgo)
    .forEach((profile) => {
      const date = new Date(profile.created_at).toISOString().split("T")[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

  const userGrowthData = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate hourly activity (last 7 days)
  const hourMap = new Map<number, number>();
  profilesList
    .filter((p) => new Date(p.created_at) >= weekAgo)
    .forEach((profile) => {
      const hour = new Date(profile.created_at).getUTCHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

  const hourlyActivity = Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour - b.hour);

  // Fetch team stats
  const { data: teams } = await supabase
    .from("teams")
    .select("created_at")
    .order("created_at", { ascending: false });

  const teamsList = teams || [];
  const totalTeams = teamsList.length;
  const teamsThisWeek = teamsList.filter(
    (t) => new Date(t.created_at) >= weekAgo
  ).length;

  return {
    userGrowthData,
    branchDistribution,
    hourlyActivity,
    stats: {
      onboardedCount,
      totalUsers,
      weekSignups,
      monthSignups,
      totalTeams,
      teamsThisWeek,
    },
  };
}
