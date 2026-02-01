"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import AnimatedBlurText from "./AnimatedBlurText";

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

interface TeamMember {
  user_id: string;
  status: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();
  const { width, height } = useWindowSize();

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

  const fetchTeamMembers = async (teamId: string) => {
    setLoadingTeamMembers(true);
    try {
      const { data, error } = await supabase.rpc(
        "get_team_members_with_email",
        { team_uuid: teamId },
      );

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setLoadingTeamMembers(false);
    }
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
      // Auto-select and show confirmation for single team
      setSelectedTeam(eligibleTeams[0]);
      fetchTeamMembers(eligibleTeams[0].id);
      setShowConfirmDialog(true);
    } else {
      // Show team selection dialog
      setShowTeamDialog(true);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
    setShowTeamDialog(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmRegistration = () => {
    if (currentEventId && selectedTeam) {
      handleRegister(currentEventId, selectedTeam.id);
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
        // Show success state in dialog
        setRegistrationSuccess(true);

        // Show confetti on successful registration
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

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
    }
  };

  const handleCloseConfirmDialog = (open: boolean) => {
    if (!open) {
      setShowConfirmDialog(false);
      setRegistrationSuccess(false);
      setSelectedTeam(null);
      setTeamMembers([]);
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

  const eligibleTeams = getEligibleTeams();

  // sort events to show Investor's Summit and B Plan first and cache the result
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const priorityEvents = ["Investor's Summit", "B Plan"];
      const aIsPriority = priorityEvents.some((name) =>
        a.name.toLowerCase().includes(name.toLowerCase()),
      );
      const bIsPriority = priorityEvents.some((name) =>
        b.name.toLowerCase().includes(name.toLowerCase()),
      );

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;

      // If both are priority or both are not, maintain original order
      return 0;
    });
  }, [events]);

  const EventCardSkeleton = () => (
    <Card className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full bg-white/5" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Skeleton className="h-6 w-3/4 bg-white/5" />
          <Skeleton className="h-5 w-20 bg-white/5" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3 bg-white/5" />
          <Skeleton className="h-4 w-1/2 bg-white/5" />
          <Skeleton className="h-4 w-3/5 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-full bg-white/5" />
      </CardContent>
    </Card>
  );

  return (
    <>
      <section className="relative py-20 px-5 bg-black">
        <div className="mx-auto ">
          <div className="text-center mb-8">
            <div className="flex items-center gap-3 text-white/85">
              <span className="h-px w-10 bg-white/80" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Events
              </span>
            </div>
          </div>

          <h2 className="mt-2 mb-8 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08]">
            <AnimatedBlurText
              lines={["Explore E-Summit’26 Events", ""]}
              liteText="Register Now"
            />
          </h2>

          {!user && (
            <div className="mb-8 mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
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
            {loading
              ? // Show 6 skeleton cards while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))
              : sortedEvents.map((event) => {
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
                            className={`uppercase text-[7.5px] md:text-[10px] ${getCategoryColor(event.category)}`}
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
                              <span>
                                Max {event.max_participants} participants
                              </span>
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
                              isRegistering ||
                              !user ||
                              eligibleTeams.length === 0
                            }
                            className="w-full bg-[#9000b1] hover:bg-[#800099] text-white"
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
        <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Select Team
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Choose which team to register for this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 sm:space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
            {eligibleTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className="w-full p-3 sm:p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {team.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {team.member_count} member
                      {team.member_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-[#733080]/10 text-[#733080] border-[#733080]/20 text-xs shrink-0"
                  >
                    {team.slug}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={handleCloseConfirmDialog}
      >
        <AlertDialogContent className="bg-black/98 backdrop-blur-xl border border-white/20 text-white max-w-[calc(100vw-2rem)] sm:max-w-lg w-full mx-auto top-[50%] translate-y-[-50%] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
          <div className="overflow-y-auto max-h-[85vh] p-5 sm:p-6">
            <AlertDialogHeader className="space-y-3 pb-4 border-b border-white/10">
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-center">
                {registrationSuccess ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <span className="text-green-400">
                      Registration Successful!
                    </span>
                  </div>
                ) : (
                  <span>Confirm Registration</span>
                )}
              </AlertDialogTitle>
              {!registrationSuccess && (
                <AlertDialogDescription className="text-gray-300 text-sm sm:text-base text-center">
                  Please review your team details before confirming
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>

            <div className="py-5">
              {registrationSuccess ? (
                <p className="text-green-400/90 text-center text-sm sm:text-base py-4">
                  🎉 You have successfully registered for this event with your
                  team!
                </p>
              ) : (
                <>
                  {selectedTeam && (
                    <div className="space-y-4">
                      {/* Team Info Card */}
                      <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white">
                            {selectedTeam.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-[#733080]/30 text-[#B05EC2] border-[#733080]/50 text-xs font-bold px-3 py-1"
                          >
                            {selectedTeam.slug}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          {selectedTeam.member_count}{" "}
                          {selectedTeam.member_count === 1
                            ? "member"
                            : "members"}
                        </p>
                      </div>

                      {/* Team Members Section */}
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#733080]" />
                          Team Members
                        </h4>
                        {loadingTeamMembers ? (
                          <div className="flex flex-col items-center justify-center gap-3 py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
                            <span className="text-sm text-gray-400">
                              Loading members...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {teamMembers.map((member, index) => {
                              const firstName = member.first_name || "";
                              const lastName = member.last_name || "";
                              const fullName =
                                `${firstName} ${lastName}`.trim() || "Unknown";
                              const email = member.email || "No email";

                              return (
                                <div
                                  key={member.user_id}
                                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#733080]/20 to-[#9000b1]/10 border border-[#733080]/30 hover:border-[#733080]/50 transition-all"
                                >
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#733080] to-[#9000b1] flex items-center justify-center text-white font-bold shrink-0 text-base sm:text-lg shadow-lg">
                                    {index + 1}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-white text-sm sm:text-base font-semibold leading-tight">
                                      {fullName}
                                    </p>
                                    <p className="text-gray-300 text-xs sm:text-sm mt-1 break-all">
                                      {email}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-white/10">
              {registrationSuccess ? (
                <AlertDialogAction
                  onClick={() => handleCloseConfirmDialog(false)}
                  className="bg-gradient-to-r from-[#733080] to-[#9000b1] hover:from-[#5a2666] hover:to-[#800099] text-white w-full text-base font-semibold h-12 rounded-xl shadow-lg"
                >
                  Close
                </AlertDialogAction>
              ) : (
                <>
                  <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto text-base font-semibold h-12 rounded-xl">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmRegistration}
                    disabled={registeringEventId !== null || loadingTeamMembers}
                    className="bg-gradient-to-r from-[#733080] to-[#9000b1] hover:from-[#5a2666] hover:to-[#800099] disabled:opacity-50 disabled:cursor-not-allowed text-white w-full sm:w-auto text-base font-semibold h-12 rounded-xl shadow-lg"
                  >
                    {registeringEventId ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      "Confirm Registration"
                    )}
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={width || window.innerWidth}
            height={height || window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            className="!fixed !inset-0"
          />
        </div>
      )}
    </>
  );
}
