"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Users, Clock } from "lucide-react";

interface AnalyticsChartsProps {
  userGrowthData: Array<{ date: string; count: number }>;
  branchDistribution: Array<{ branch: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  collegeDistribution: Array<{ college: string; count: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  stats: {
    onboardedCount: number;
    totalUsers: number;
    weekSignups: number;
    monthSignups: number;
    totalTeams: number;
    teamsThisWeek: number;
  };
}

export function AnalyticsCharts({
  userGrowthData,
  branchDistribution,
  genderDistribution,
  collegeDistribution,
  hourlyActivity,
  stats,
}: AnalyticsChartsProps) {
  // User Growth Chart Config
  const userGrowthConfig = {
    count: {
      label: "New Users",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Branch Distribution Chart Config
  const branchConfig = {
    count: {
      label: "Students",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Hourly Activity Chart Config
  const hourlyConfig = {
    count: {
      label: "Signups",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  // Onboarding Progress Config
  const onboardingData = [
    {
      status: "Completed",
      count: stats.onboardedCount,
      fill: "hsl(var(--chart-1))",
    },
    {
      status: "Pending",
      count: stats.totalUsers - stats.onboardedCount,
      fill: "hsl(var(--chart-5))",
    },
  ];

  const onboardingConfig = {
    count: {
      label: "Users",
    },
    Completed: {
      label: "Completed",
      color: "hsl(var(--chart-1))",
    },
    Pending: {
      label: "Pending",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  // Team Growth Radial
  const teamGrowthPercentage =
    stats.totalTeams > 0
      ? Math.round((stats.teamsThisWeek / stats.totalTeams) * 100)
      : 0;

  const teamRadialData = [
    {
      name: "Teams This Week",
      value: teamGrowthPercentage,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const teamRadialConfig = {
    value: {
      label: "Growth %",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Colors for branch pie chart
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const totalBranchCount = branchDistribution.reduce(
    (acc, item) => acc + item.count,
    0,
  );

  // Gender Distribution Config
  const genderConfig = {
    count: {
      label: "Users",
      color: "hsl(var(--chart-5))",
    },
    Male: {
      label: "Male",
      color: "hsl(var(--chart-1))",
    },
    Female: {
      label: "Female",
      color: "hsl(var(--chart-3))",
    },
    Other: {
      label: "Other",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const totalGenderCount = genderDistribution.reduce(
    (acc, item) => acc + item.count,
    0,
  );

  // College Distribution Config
  const collegeConfig = {
    count: {
      label: "Students",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const totalCollegeCount = collegeDistribution.reduce(
    (acc, item) => acc + item.count,
    0,
  );

  return (
    <div className="grid @5xl/main:grid-cols-2 grid-cols-1 gap-4 md:gap-6">
      {/* User Growth Over Time */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            Last 30 days signup activity{" "}
            <span className="text-xs text-muted-foreground">
              ({userGrowthData.length} day{userGrowthData.length !== 1 && "s"})
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={userGrowthConfig}>
            <AreaChart
              accessibilityLayer
              data={userGrowthData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                type="natural"
                fill="var(--color-count)"
                fillOpacity={0.4}
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {stats.weekSignups > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {stats.weekSignups} new user{stats.weekSignups !== 1 && "s"}{" "}
                    this week
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                    No new registrations this week
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {stats.monthSignups} total in the last 30 days
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Branch Distribution */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>Branch Distribution</CardTitle>
          <CardDescription>Student enrollment by department</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={branchConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={branchDistribution.map((item, index) => ({
                  ...item,
                  fill: chartColors[index % chartColors.length],
                }))}
                dataKey="count"
                nameKey="branch"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalBranchCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Students
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {branchDistribution.map((item, index) => (
              <div key={item.branch} className="flex items-center gap-1">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="text-muted-foreground">
                  {item.branch}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Gender Distribution */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>User demographics by gender</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={genderConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={genderDistribution.map((item) => ({
                  ...item,
                  fill:
                    genderConfig[item.gender as keyof typeof genderConfig]
                      ?.color || "hsl(var(--chart-5))",
                }))}
                dataKey="count"
                nameKey="gender"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalGenderCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {genderDistribution.map((item) => (
              <div key={item.gender} className="flex items-center gap-1">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor:
                      genderConfig[item.gender as keyof typeof genderConfig]
                        ?.color || "hsl(var(--chart-5))",
                  }}
                />
                <span className="text-muted-foreground">
                  {item.gender}: {item.count} (
                  {totalGenderCount > 0
                    ? Math.round((item.count / totalGenderCount) * 100)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* College Distribution */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>College Distribution</CardTitle>
          <CardDescription>Student enrollment by institution</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={collegeConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={collegeDistribution.map((item, index) => ({
                  ...item,
                  fill: chartColors[index % chartColors.length],
                }))}
                dataKey="count"
                nameKey="college"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCollegeCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Students
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {collegeDistribution.map((item, index) => (
              <div key={item.college} className="flex items-center gap-1">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="text-muted-foreground">
                  {item.college}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Onboarding Progress */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>Onboarding Status</CardTitle>
          <CardDescription>User onboarding completion rate</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={onboardingConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={onboardingData}
                dataKey="count"
                nameKey="status"
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const completionRate =
                        stats.totalUsers > 0
                          ? Math.round(
                              (stats.onboardedCount / stats.totalUsers) * 100,
                            )
                          : 0;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {completionRate}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Complete
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            <Users className="h-4 w-4" />
            {stats.onboardedCount} of {stats.totalUsers} users completed
            onboarding
          </div>
          <div className="leading-none text-muted-foreground">
            {stats.totalUsers - stats.onboardedCount} pending onboarding
          </div>
        </CardFooter>
      </Card>

      {/* Hourly Activity */}
      <Card className="@container/chart">
        <CardHeader>
          <CardTitle>Peak Activity Hours</CardTitle>
          <CardDescription>Signups by hour (Last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={hourlyConfig}>
            <BarChart
              accessibilityLayer
              data={hourlyActivity}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <Clock className="h-4 w-4" />
            Most active time:{" "}
            {hourlyActivity.length > 0
              ? `${
                  hourlyActivity.reduce((max, item) =>
                    item.count > max.count ? item : max,
                  ).hour
                }:00`
              : "No data"}
          </div>
          <div className="leading-none text-muted-foreground">
            Track user engagement patterns
          </div>
        </CardFooter>
      </Card>

      {/* Team Growth Radial */}
      <Card className="@container/chart col-span-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Team Formation Trend</CardTitle>
          <CardDescription>
            Percentage of teams created this week
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={teamRadialConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={teamRadialData}
              startAngle={0}
              endAngle={teamGrowthPercentage * 3.6}
              innerRadius={80}
              outerRadius={140}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
              <RadialBar dataKey="value" background>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {teamGrowthPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            This Week
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {stats.teamsThisWeek > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500" />
                {stats.teamsThisWeek} new team{stats.teamsThisWeek !== 1 && "s"}{" "}
                formed this week
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-orange-500" />
                No new teams this week
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Total teams: {stats.totalTeams}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
