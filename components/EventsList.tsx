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
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import AnimatedBlurText from "./AnimatedBlurText";

interface Event {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean;
  whatsapp_group_link: string | null;
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

  // New fields for B Plan and Investor Summit
  const [presentationUrl, setPresentationUrl] = useState("");
  const [productPhotosUrl, setProductPhotosUrl] = useState("");
  const [achievements, setAchievements] = useState("");

  // Upload states
  const [uploadingPresentation, setUploadingPresentation] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

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
        // Fetch user's teams with accepted member count first
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

        // Get member counts for each team and collect team IDs
        const teamsWithCounts: Team[] = [];
        const teamIds: string[] = [];

        for (const teamData of teamsData || []) {
          const team = Array.isArray(teamData.teams)
            ? teamData.teams[0]
            : teamData.teams;
          
          teamIds.push(team.id);

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

        // Fetch user's registrations based on their teams
        // This ensures if ANY member of a team registered the team, all members see it
        let regsData: Registration[] = [];
        if (teamIds.length > 0) {
          const { data, error: regsError } = await supabase
            .from("event_registrations")
            .select("event_id, team_id, status")
            .in("team_id", teamIds);

          if (regsError) throw regsError;
          regsData = data || [];
        }
        
        // Also check if user registered as an individual if that's possible (legacy or fallback)
        const { data: individualRegs, error: indError } = await supabase
          .from("event_registrations")
          .select("event_id, team_id, status")
          .eq("user_id", user.id);
        
        if (!indError && individualRegs) {
          // Merge and de-duplicate by event_id
          const mergedRegs = [...regsData];
          individualRegs.forEach(ind => {
            if (!mergedRegs.some(r => r.event_id === ind.event_id)) {
              mergedRegs.push(ind);
            }
          });
          regsData = mergedRegs;
        }

        setRegistrations(regsData);
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

  const handleFileUpload = async (
    file: File,
    type: "presentation" | "photos",
    teamId: string,
  ) => {
    const setUploading =
      type === "presentation" ? setUploadingPresentation : setUploadingPhotos;
    const setUrl =
      type === "presentation" ? setPresentationUrl : setProductPhotosUrl;

    setUploading(true);
    try {
      const url = await uploadFile(file, `teams/${teamId}/${type}`);
      setUrl(url);
      toast({
        title: "Upload Successful",
        description: `${type === "presentation" ? "Presentation" : "Product photos"} uploaded successfully.`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
        presentation_url: presentationUrl,
        product_photos_url: productPhotosUrl,
        achievements: achievements,
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
      setPresentationUrl("");
      setProductPhotosUrl("");
      setAchievements("");
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

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === currentEventId);
  }, [events, currentEventId]);

  const isBPlan = currentEvent?.name.toLowerCase().includes("b plan");
  const isInvestorSummit =
    currentEvent?.name.toLowerCase().includes("investor's") &&
    currentEvent?.name.toLowerCase().includes("summit");

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
                  You need a team with 1-4 accepted members to register for
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
                      className="bg-black/60 backdrop-blur-xl border-white/20 overflow-hidden group hover:border-[#733080]/70 hover:shadow-2xl hover:shadow-[#733080]/20 transition-all duration-300 flex flex-col h-full"
                    >
                      <Link
                        href={`/events/${event.slug}`}
                        className="block flex-grow"
                      >
                        {event.image_url && (
                          <div className="relative h-56 overflow-hidden">
                            <Image
                              src={event.image_url}
                              alt={event.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            {registered && (
                              <div className="absolute inset-0 bg-[#9000b1]/10 flex items-center justify-center backdrop-blur-[2px]">
                                <Badge className="bg-green-500 text-white border-none px-4 py-1.5 text-sm font-bold shadow-2xl">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  REGISTERED
                                </Badge>
                              </div>
                            )}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                              <Badge
                                variant="outline"
                                className={`uppercase text-[9px] md:text-[10px] font-semibold backdrop-blur-md bg-black/50 border-white/30 ${getCategoryColor(event.category)}`}
                              >
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl md:text-2xl text-white font-bold group-hover:text-[#9000b1] transition-colors line-clamp-2">
                            {event.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-sm line-clamp-2 mt-2">
                            {event.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-4">
                          <div className="space-y-2.5 text-sm">
                            {event.date && (
                              <div className="flex items-center gap-2.5 text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                                <Calendar className="h-4 w-4 text-[#9000b1] flex-shrink-0" />
                                <span className="text-sm">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2.5 text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                                <MapPin className="h-4 w-4 text-[#9000b1] flex-shrink-0" />
                                <span className="text-sm truncate">
                                  {event.location}
                                </span>
                              </div>
                            )}
                            {event.max_participants && (
                              <div className="flex items-center gap-2.5 text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                                <Users className="h-4 w-4 text-[#9000b1] flex-shrink-0" />
                                <span className="text-sm">
                                  Max {event.max_participants} participants
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Link>
                      <CardContent className="pt-0 pb-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/events/${event.slug}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full cursor-pointer border-[#733080]/40 text-white hover:bg-[#733080]/20 hover:border-[#733080]/60 hover:text-white transition-all"
                            >
                              View Details
                              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                          </Link>
                          {registered ? (
                            <Button
                              size="sm"
                              className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                              disabled
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              Registered
                            </Button>
                          ) : (
                            <Link
                              href={`/events/${event.slug}`}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-[#9000b1] to-[#733080] hover:from-[#800099] hover:to-[#5a2666] text-white shadow-lg shadow-purple-600/20 transition-all"
                              >
                                Register Now
                              </Button>
                            </Link>
                          )}
                        </div>
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
                <div className="space-y-4">
                  <p className="text-green-400/90 text-center text-sm sm:text-base">
                    🎉 You have successfully registered for this event with your
                    team!
                  </p>
                  {(() => {
                    const currentEvent = events.find(
                      (e) => e.id === currentEventId,
                    );
                    return currentEvent?.whatsapp_group_link ? (
                      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          <h4 className="font-semibold text-base">
                            Join Event WhatsApp Group
                          </h4>
                        </div>
                        <p className="text-sm text-white/70">
                          Click the link below to join the WhatsApp group for
                          important updates and announcements:
                        </p>
                        <a
                          href={currentEvent.whatsapp_group_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Open WhatsApp Group
                        </a>
                      </div>
                    ) : null;
                  })()}
                </div>
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

                      {/* Additional Registration Fields */}
                      {(isBPlan || isInvestorSummit) && (
                        <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
                          <h4 className="text-base sm:text-lg font-bold text-white mb-3">
                            Additional Information
                          </h4>

                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">
                              Presentation/Pitch Deck (PDF or Link){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="space-y-3">
                              <Input
                                value={presentationUrl}
                                onChange={(e) =>
                                  setPresentationUrl(e.target.value)
                                }
                                placeholder="Paste link or upload PDF"
                                className="bg-white/5 border-white/10 text-white text-sm"
                              />
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.ppt,.pptx"
                                  className="hidden"
                                  id={`presentation-upload-${selectedTeam?.id}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && selectedTeam)
                                      handleFileUpload(
                                        file,
                                        "presentation",
                                        selectedTeam.id,
                                      );
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `presentation-upload-${selectedTeam?.id}`,
                                      )
                                      ?.click()
                                  }
                                  className="border-white/10 w-full text-xs"
                                  disabled={uploadingPresentation}
                                >
                                  {uploadingPresentation
                                    ? "Uploading..."
                                    : "Upload from Device"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {isInvestorSummit && (
                            <>
                              <div className="space-y-2">
                                <Label className="text-xs text-gray-400">
                                  Product Photos{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="space-y-3">
                                  <Input
                                    value={productPhotosUrl}
                                    onChange={(e) =>
                                      setProductPhotosUrl(e.target.value)
                                    }
                                    placeholder="Photos link or upload"
                                    className="bg-white/5 border-white/10 text-white text-sm"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      id={`photos-upload-${selectedTeam?.id}`}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && selectedTeam)
                                          handleFileUpload(
                                            file,
                                            "photos",
                                            selectedTeam.id,
                                          );
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `photos-upload-${selectedTeam?.id}`,
                                          )
                                          ?.click()
                                      }
                                      className="border-white/10 w-full text-xs"
                                      disabled={uploadingPhotos}
                                    >
                                      {uploadingPhotos
                                        ? "Uploading..."
                                        : "Upload from Device"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-gray-400">
                                  Achievements (Brief)
                                </Label>
                                <Input
                                  value={achievements}
                                  onChange={(e) =>
                                    setAchievements(e.target.value)
                                  }
                                  placeholder="Key milestones/achievements"
                                  className="bg-white/5 border-white/10 text-white text-sm"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
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
                    disabled={
                      registeringEventId !== null ||
                      loadingTeamMembers ||
                      uploadingPresentation ||
                      uploadingPhotos ||
                      !presentationUrl ||
                      (isInvestorSummit && !productPhotosUrl)
                    }
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
