import { createServiceClient } from "@/lib/supabase/server";

export async function fetchAnalyticsData() {
  const supabase = await createServiceClient();

  // Get all auth users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError || !users) {
    console.error("Error fetching users:", usersError);
  }

  // Fetch all profiles with user data
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, branch, gender, college, onboarding_completed, created_at")
    .order("created_at", { ascending: true });

  const profilesList = profiles || [];

  // Get admin/moderator user IDs to exclude them
  const { data: adminModUsers } = await supabase
    .from("user_role")
    .select("user_id")
    .or("role_id.eq.2,role_id.eq.1");

  const adminModUserIds = new Set(adminModUsers?.map(u => u.user_id) || []);

  // Create a map of user_id to profile data
  const profilesMap = new Map(
    profilesList.map((profile) => [profile.id, profile])
  );

  // Calculate user stats (excluding admin/moderator)
  let onboardedCount = 0;
  let totalUsers = 0;

  if (users) {
    users.forEach((user) => {
      // Skip admin/moderator users
      if (adminModUserIds.has(user.id)) {
        return;
      }

      totalUsers++;

      const profile = profilesMap.get(user.id);
      const hasProfile = !!profile;
      const completedOnboarding = hasProfile ? (profile.onboarding_completed || false) : false;

      if (hasProfile && completedOnboarding) {
        onboardedCount++;
      }
    });
  }
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Filter out admin/moderator users from signup counts
  const weekSignups = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && new Date(p.created_at) >= weekAgo
  ).length;
  
  const previousWeekSignups = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && new Date(p.created_at) >= twoWeeksAgo && new Date(p.created_at) < weekAgo
  ).length;
  
  const monthSignups = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && new Date(p.created_at) >= monthAgo
  ).length;

  // Calculate onboarding completion trend (excluding admin/moderator)
  const onboardedThisWeek = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && p.onboarding_completed && new Date(p.created_at) >= weekAgo
  ).length;
  
  const onboardedPreviousWeek = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && p.onboarding_completed && new Date(p.created_at) >= twoWeeksAgo && new Date(p.created_at) < weekAgo
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

  // Calculate gender distribution
  const genderMap = new Map<string, number>();
  profilesList.forEach((profile) => {
    if (profile.gender) {
      const gender = profile.gender.toLowerCase();
      genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
    }
  });

  const genderDistribution = Array.from(genderMap.entries())
    .map(([gender, count]) => ({ 
      gender: gender.charAt(0).toUpperCase() + gender.slice(1), 
      count 
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate college distribution
  const collegeMap = new Map<string, number>();
  profilesList.forEach((profile) => {
    if (profile.college) {
      collegeMap.set(profile.college, (collegeMap.get(profile.college) || 0) + 1);
    }
  });

  const collegeDistribution = Array.from(collegeMap.entries())
    .map(([college, count]) => ({ college, count }))
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
  
  const teamsPreviousWeek = teamsList.filter(
    (t) => new Date(t.created_at) >= twoWeeksAgo && new Date(t.created_at) < weekAgo
  ).length;

  // Fetch team members count for average team size calculation
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("user_id, status")
    .eq("status", "accepted");

  const totalTeamMembers = teamMembers?.length || 0;

  // Calculate trends (week over week percentage change)
  const weekSignupsTrend = previousWeekSignups > 0 
    ? Math.round(((weekSignups - previousWeekSignups) / previousWeekSignups) * 100)
    : weekSignups > 0 ? 100 : 0;

  const onboardingTrend = onboardedPreviousWeek > 0
    ? Math.round(((onboardedThisWeek - onboardedPreviousWeek) / onboardedPreviousWeek) * 100)
    : onboardedThisWeek > 0 ? 100 : 0;

  // Calculate engagement/active rate trend (excluding admin/moderator)
  const usersAsOfWeekAgo = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && new Date(p.created_at) < weekAgo
  ).length;
  const onboardedAsOfWeekAgo = profilesList.filter(
    (p) => !adminModUserIds.has(p.id) && p.onboarding_completed && new Date(p.created_at) < weekAgo
  ).length;
  
  const currentActiveRate = totalUsers > 0 ? (onboardedCount / totalUsers) * 100 : 0;
  const previousActiveRate = usersAsOfWeekAgo > 0 ? (onboardedAsOfWeekAgo / usersAsOfWeekAgo) * 100 : 0;
  
  const engagementTrend = previousActiveRate > 0
    ? Math.round(currentActiveRate - previousActiveRate)
    : currentActiveRate > 0 ? Math.round(currentActiveRate) : 0;

  return {
    userGrowthData,
    branchDistribution,
    genderDistribution,
    collegeDistribution,
    hourlyActivity,
    stats: {
      onboardedCount,
      totalUsers,
      weekSignups,
      monthSignups,
      totalTeams,
      totalTeamMembers,
      teamsThisWeek,
      weekSignupsTrend,
      onboardingTrend,
      engagementTrend,
    },
  };
}
