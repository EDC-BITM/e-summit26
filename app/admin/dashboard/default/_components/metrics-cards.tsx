"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
}: MetricCardProps) {
  const trendDirection = trend
    ? trend.value > 0
      ? "up"
      : trend.value < 0
        ? "down"
        : "neutral"
    : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trendDirection === "up" && (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            )}
            {trendDirection === "down" && (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            {trendDirection === "neutral" && (
              <Minus className="h-4 w-4 text-gray-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trendDirection === "up" && "text-green-500",
                trendDirection === "down" && "text-red-500",
                trendDirection === "neutral" && "text-gray-500",
              )}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AdditionalMetricsProps {
  stats: {
    onboardedCount: number;
    totalUsers: number;
    weekSignups: number;
    totalTeams: number;
    totalTeamMembers: number;
    weekSignupsTrend: number;
    onboardingTrend: number;
    engagementTrend: number;
  };
  eventRegistrationsByEvent: Array<{ event: string; count: number }>;
}

export function AdditionalMetrics({
  stats,
  eventRegistrationsByEvent,
}: AdditionalMetricsProps) {
  const onboardingRate =
    stats.totalUsers > 0
      ? Math.round((stats.onboardedCount / stats.totalUsers) * 100)
      : 0;

  const avgTeamSize =
    stats.totalTeams > 0
      ? (stats.totalTeamMembers / stats.totalTeams).toFixed(1)
      : "0";

  // Find worst performing event (lowest registrations)
  const worstEvent =
    eventRegistrationsByEvent.length > 0
      ? eventRegistrationsByEvent[eventRegistrationsByEvent.length - 1]
      : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Onboarding Rate"
        value={`${onboardingRate}%`}
        description="Users who completed onboarding"
        trend={{
          value: stats.onboardingTrend,
          label: "vs last week",
        }}
      />
      <MetricCard
        title="Weekly Growth"
        value={stats.weekSignups}
        description="New registrations this week"
        trend={{
          value: stats.weekSignupsTrend,
          label: "from last week",
        }}
      />
      <MetricCard
        title="Avg Team Size"
        value={avgTeamSize}
        description="Members per team"
      />
      <MetricCard
        title="Active Rate"
        value={`${Math.round(
          (stats.onboardedCount / Math.max(stats.totalUsers, 1)) * 100,
        )}%`}
        description="User engagement metric"
        trend={{
          value: stats.engagementTrend,
          label: "engagement",
        }}
      />
      {worstEvent && (
        <Card className="md:col-span-2 lg:col-span-4 border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
              Lowest Registered Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {worstEvent.event}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Only {worstEvent.count} team
                  {worstEvent.count !== 1 ? "s" : ""} registered
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-red-600/80 dark:text-red-400/80">
                  Needs attention
                </div>
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {worstEvent.count} registration
                  {worstEvent.count !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
