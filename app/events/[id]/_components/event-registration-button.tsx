"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Event {
  id: string;
  name: string;
  is_active: boolean;
}

interface Team {
  id: string;
  name: string;
  slug: string;
}

interface Registration {
  event_id: string;
  team_id: string;
  status: string;
}

export function EventRegistrationButton({ event }: { event: Event }) {
  const [user, setUser] = useState<User | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user's teams
      const { data: teamsData } = await supabase
        .from("team_members")
        .select(
          `
          team_id,
          teams (
            id,
            name,
            slug
          )
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "accepted");

      const teams =
        (teamsData
              ?.map((tm) => tm.teams)
              .filter((t): t is Team => t !== null) as unknown as Team[]) || [];
      setUserTeams(teams);

      // Fetch registrations for this event
      const { data: regsData } = await supabase
        .from("event_registrations")
        .select("event_id, team_id, status")
        .eq("event_id", event.id);

      setRegistrations(regsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const handleRegister = async (teamId: string) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setRegistering(true);

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          teamId: teamId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      toast({
        title: "Success!",
        description: `Successfully registered for ${event.name}`,
      });

      setShowTeamDialog(false);
      await fetchData();
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while registering",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = registrations.some((reg) =>
    userTeams.some((team) => team.id === reg.team_id),
  );

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!event.is_active) {
    return (
      <Button disabled className="w-full">
        Registration Closed
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={() => router.push("/auth/login")} className="w-full">
        Login to Register
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button disabled className="w-full">
        Already Registered
      </Button>
    );
  }

  if (userTeams.length === 0) {
    return (
      <Button onClick={() => router.push("/teams")} className="w-full">
        Create a Team to Register
      </Button>
    );
  }

  return (
    <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
      <DialogTrigger asChild>
        <Button className="w-full">Register for Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your Team</DialogTitle>
          <DialogDescription>
            Choose which team you want to register for this event
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {userTeams.map((team) => {
            const teamRegistered = registrations.some(
              (reg) => reg.team_id === team.id,
            );
            return (
              <Button
                key={team.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleRegister(team.id)}
                disabled={registering || teamRegistered}
              >
                {registering && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {team.name}
                {teamRegistered && " (Already Registered)"}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
