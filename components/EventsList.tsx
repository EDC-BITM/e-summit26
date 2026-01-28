"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean;
}

interface Registration {
  event_id: string;
  team_id: string;
  status: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  member_count: number;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(
    null,
  );
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const fetchData = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch all active events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true, nullsFirst: false });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      if (user) {
        // Fetch user's registrations
        const { data: regsData, error: regsError } = await supabase
          .from("event_registrations")
          .select("event_id, team_id, status")
          .eq("user_id", user.id);

        if (regsError) throw regsError;
        setRegistrations(regsData || []);

        // Fetch user's teams with accepted member count
        const { data: teamsData, error: teamsError } = await supabase
          .from("team_members")
          .select(
            `
            team_id,
            teams!inner (
              id,
              name,
              slug
            )
          `,
          )
          .eq("user_id", user.id)
          .eq("status", "accepted");

        if (teamsError) throw teamsError;

        // Get member counts for each team
        const teamsWithCounts: Team[] = [];

        for (const teamData of teamsData || []) {
          const team = Array.isArray(teamData.teams)
            ? teamData.teams[0]
            : teamData.teams;

          const { count } = await supabase
            .from("team_members")
            .select("*", { count: "exact", head: true })
            .eq("team_id", team.id)
            .eq("status", "accepted");

          teamsWithCounts.push({
            id: team.id,
            name: team.name,
            slug: team.slug,
            member_count: count || 0,
          });
        }

        setUserTeams(teamsWithCounts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRegistered = (eventId: string) => {
    return registrations.some((reg) => reg.event_id === eventId);
  };

  const getEligibleTeams = () => {
    return userTeams.filter(
      (team) => team.member_count >= 2 && team.member_count <= 4,
    );
  };

  const handleRegisterClick = (eventId: string) => {
    if (!user) {
      router.push(`/auth/login?redirect=/events`);
      return;
    }

    const eligibleTeams = getEligibleTeams();

    if (eligibleTeams.length === 0) {
      toast({
        title: "No Eligible Team",
        description:
          "You need a team with 2-4 accepted members to register. Create or join a team first.",
        variant: "destructive",
      });
      return;
    }

    setCurrentEventId(eventId);
    if (eligibleTeams.length === 1) {
      // Auto-select if only one eligible team
      handleRegister(eventId, eligibleTeams[0].id);
    } else {
      // Show team selection dialog
      setShowTeamDialog(true);
    }
  };

  const handleRegister = async (eventId: string, teamId: string) => {
    if (!user) return;

    setRegisteringEventId(eventId);
    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        team_id: teamId,
        user_id: user.id,
        status: "confirmed",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: "You are already registered for this event.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered for this event.",
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register for the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegisteringEventId(null);
      setShowTeamDialog(false);
      setCurrentEventId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      formal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      informal: "bg-green-500/10 text-green-400 border-green-500/20",
      technical: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      workshop: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      speaker_session: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      "networking & strategic":
        "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    };
    return (
      colors[category.toLowerCase()] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/20"
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
      </div>
    );
  }

  const eligibleTeams = getEligibleTeams();

  return (
    <>
      <section className="relative py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All Events
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore and register for exciting events at E-Summit 2026
            </p>
          </div>

          {!user && (
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                <AlertCircle className="h-5 w-5" />
                <p>Please log in to register for events</p>
              </div>
            </div>
          )}

          {user && eligibleTeams.length === 0 && (
            <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400">
                <AlertCircle className="h-5 w-5" />
                <p>
                  You need a team with 2-4 accepted members to register for
                  events. Create or join a team first.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const registered = isRegistered(event.id);
              const isRegistering = registeringEventId === event.id;

              return (
                <Card
                  key={event.id}
                  className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-[#733080]/50 transition-all duration-300"
                >
                  {event.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image_url}
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl text-white">
                        {event.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={getCategoryColor(event.category)}
                      >
                        {event.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      {event.date && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-4 w-4 text-[#733080]" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-[#733080]" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="h-4 w-4 text-[#733080]" />
                          <span>Max {event.max_participants} participants</span>
                        </div>
                      )}
                    </div>

                    {registered ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRegisterClick(event.id)}
                        disabled={
                          isRegistering || !user || eligibleTeams.length === 0
                        }
                        className="w-full bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white"
                      >
                        {isRegistering ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register Now"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Selection Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Select Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose which team to register for this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {eligibleTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  if (currentEventId) {
                    handleRegister(currentEventId, team.id);
                  }
                }}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all"
                disabled={registeringEventId !== null}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-sm text-gray-400">
                      {team.member_count} member
                      {team.member_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-[#733080]/10 text-[#733080] border-[#733080]/20"
                  >
                    {team.slug}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
