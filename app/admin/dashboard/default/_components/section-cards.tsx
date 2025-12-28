import {
  TrendingDown,
  TrendingUp,
  Users,
  Calendar,
  UsersRound,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  stats: {
    onboardedUsers: number;
    totalRegistrations: number;
    totalTeams: number;
    totalEvents: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Onboarded Users</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums flex items-center gap-2">
            <Users className="size-6 text-primary" />
            {stats.onboardedUsers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Users who completed onboarding
          </div>
          <div className="text-muted-foreground">
            Ready to participate in events
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Event Registrations</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums flex items-center gap-2">
            <Calendar className="size-6 text-primary" />
            {stats.totalRegistrations}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Team registrations across all events
          </div>
          <div className="text-muted-foreground">Total participation count</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Teams</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums flex items-center gap-2">
            <UsersRound className="size-6 text-primary" />
            {stats.totalTeams}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Teams created on the platform
          </div>
          <div className="text-muted-foreground">
            Collaborative participation
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Events</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums flex items-center gap-2">
            <Trophy className="size-6 text-primary" />
            {stats.totalEvents}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Events available for registration
          </div>
          <div className="text-muted-foreground">Across all categories</div>
        </CardFooter>
      </Card>
    </div>
  );
}
