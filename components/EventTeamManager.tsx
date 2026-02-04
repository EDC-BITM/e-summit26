"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Users,
  Crown,
  Copy,
  Check,
  UserPlus,
  Trophy,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/upload";

interface EventTeamManagerProps {
  eventId: string;
  eventName: string;
  eventSlug: string;
}

interface TeamMember {
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  email?: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  team_leader_id: string;
  event_id: string;
  created_at: string;
  members: TeamMember[];
}

export default function EventTeamManager({
  eventId,
  eventName,
  eventSlug,
}: EventTeamManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationConfirmDialog, setShowRegistrationConfirmDialog] =
    useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState<string | null>(
    null,
  );

  // New fields for B Plan and Investor Summit
  const [presentationUrl, setPresentationUrl] = useState("");
  const [productPhotosUrl, setProductPhotosUrl] = useState("");
  const [achievements, setAchievements] = useState("");

  // Upload states
  const [uploadingPresentation, setUploadingPresentation] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const isBPlan = eventName.toLowerCase().includes("b plan");
  const isInvestorSummit = eventName.toLowerCase().includes("investor summit");

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchTeamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchTeamData = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push(`/auth/login?redirect=/events/${eventSlug}`);
        return;
      }

      setUser(currentUser);

      // Check if user has a team for this specific event
      const { data: teamMemberData } = await supabase
        .from("team_members")
        .select(
          `
          team_id,
          teams!inner (
            id,
            name,
            slug,
            team_leader_id,
            event_id,
            created_at
          )
        `,
        )
        .eq("user_id", currentUser.id)
        .eq("teams.event_id", eventId)
        .in("status", ["pending", "accepted"])
        .maybeSingle();

      if (teamMemberData?.teams) {
        const teamData = Array.isArray(teamMemberData.teams)
          ? teamMemberData.teams[0]
          : teamMemberData.teams;

        console.log("Team data found:", teamData);

        // Fetch all team members with profiles
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select(
            `
            user_id,
            role,
            status,
            joined_at
          `,
          )
          .eq("team_id", teamData.id);

        console.log("Raw members data:", membersData);
        console.log("Members error:", membersError);

        if (membersError) {
          console.error("Error fetching team members:", membersError);
        }

        // Fetch profiles and emails separately for each member
        const membersWithProfiles = await Promise.all(
          (membersData || []).map(async (member) => {
            // Get profile data
            const { data: profileData } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", member.user_id)
              .single();

            // Get email from auth metadata if available
            const {
              data: { users },
            } = await supabase.auth.admin.listUsers();
            const authUser = users?.find((u) => u.id === member.user_id);
            const userEmail = authUser?.email || "Unknown User";

            console.log(
              `Profile for ${member.user_id}:`,
              profileData,
              "Email:",
              userEmail,
            );

            return {
              ...member,
              profiles: profileData || {
                first_name: null,
                last_name: null,
              },
              email: userEmail,
            };
          }),
        );

        console.log("Formatted members:", membersWithProfiles);

        setTeam({
          ...teamData,
          members: membersWithProfiles,
        });

        // Check if this team is already registered for this event
        const { data: registrationData } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", eventId)
          .eq("team_id", teamData.id)
          .maybeSingle();

        setIsRegistered(!!registrationData);

        // Fetch WhatsApp group link if registered
        if (registrationData) {
          const { data: eventData } = await supabase
            .from("events")
            .select("whatsapp_group_link")
            .eq("id", eventId)
            .single();

          setWhatsappGroupLink(eventData?.whatsapp_group_link || null);
        }
      } else {
        setTeam(null);
        setIsRegistered(false);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast({
        title: "Error",
        description: "Failed to load team data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!user || !newTeamName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          event_id: eventId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      toast({
        title: "Team Created!",
        description: `Team "${newTeamName}" has been created for ${eventName}.`,
      });

      setNewTeamName("");
      setShowCreateDialog(false);
      await fetchTeamData();
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create team.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const joinTeam = async () => {
    if (!user || !joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team code.",
        variant: "destructive",
      });
      return;
    }

    setJoining(true);
    try {
      const response = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Better error messages
        let errorMessage = "Failed to join team";
        if (data.error === "CODE_INVALID") {
          errorMessage =
            "Invalid team code. Code must be at least 4 characters.";
        } else if (data.error === "TEAM_NOT_FOUND") {
          errorMessage = "Team not found. Please check the code and try again.";
        } else if (data.error === "CANNOT_JOIN_OWN_TEAM") {
          errorMessage = "You cannot join your own team.";
        } else if (data.error === "ALREADY_IN_EVENT_TEAM") {
          errorMessage =
            data.message || "You already have a team for this event.";
        } else if (data.error === "ALREADY_IN_ANOTHER_TEAM") {
          errorMessage =
            data.message ||
            "You are already in another team. Please leave that team first.";
        } else if (data.error === "ALREADY_IN_TEAM_OR_PENDING") {
          errorMessage = "You already have a team or pending request.";
        } else if (data.error === "TEAM_FULL") {
          errorMessage = "This team is full (maximum 4 members).";
        } else if (data.error === "JOIN_REQUEST_FAILED") {
          errorMessage = data.details || "Failed to send join request.";
        } else if (data.error) {
          errorMessage = data.message || data.error;
        }

        // Show error toast immediately
        toast({
          title: "Cannot Join Team",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Request Sent!",
        description: "Your request to join the team has been sent.",
      });

      setJoinCode("");
      setShowJoinDialog(false);
      await fetchTeamData();
    } catch (error) {
      console.error("Error joining team:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join team.",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const copyTeamCode = () => {
    if (team?.slug) {
      navigator.clipboard.writeText(team.slug);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Team code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const approveMember = async (userId: string) => {
    if (!team) return;

    try {
      const response = await fetch("/api/team/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: team.id,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve member");
      }

      toast({
        title: "Member Approved",
        description: "Team member has been approved successfully.",
      });

      await fetchTeamData();
    } catch (error) {
      console.error("Error approving member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to approve member.",
        variant: "destructive",
      });
    }
  };

  const rejectMember = async (userId: string) => {
    if (!team) return;

    try {
      const response = await fetch("/api/team/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: team.id,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject member");
      }

      toast({
        title: "Member Rejected",
        description: "Request has been rejected.",
      });

      await fetchTeamData();
    } catch (error) {
      console.error("Error rejecting member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reject member.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "presentation" | "photos",
  ) => {
    if (!team) return;

    const setUploading =
      type === "presentation" ? setUploadingPresentation : setUploadingPhotos;
    const setUrl =
      type === "presentation" ? setPresentationUrl : setProductPhotosUrl;

    setUploading(true);
    try {
      const url = await uploadFile(file, `teams/${team.id}/${type}`);

      if (type === "photos") {
        // Append for photos if they want multiple, or just comma separate
        setUrl((prev) => (prev ? `${prev}, ${url}` : url));
      } else {
        setUrl(url);
      }

      toast({
        title: "Upload Successful",
        description: `${type === "presentation" ? "Presentation" : "Product photo"} uploaded successfully.`,
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

  const registerForEvent = async () => {
    if (!team || !user) return;

    setRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          team_id: team.id,
          presentation_url: presentationUrl,
          product_photos_url: productPhotosUrl,
          achievements: achievements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Fetch the event details to get WhatsApp link
      const { data: eventData } = await supabase
        .from("events")
        .select("whatsapp_group_link")
        .eq("id", eventId)
        .single();

      const whatsappLink = eventData?.whatsapp_group_link;

      toast({
        title: "Registered!",
        description: whatsappLink
          ? `Team "${team.name}" has been registered for ${eventName}. Check for the WhatsApp group link!`
          : `Team "${team.name}" has been registered for ${eventName}.`,
      });

      // If there's a WhatsApp link, show it in a dialog or redirect with the link
      if (whatsappLink) {
        // Store the link temporarily to show after redirect
        sessionStorage.setItem("event_whatsapp_link", whatsappLink);
        sessionStorage.setItem("event_name", eventName);
      }

      router.push("/protected");
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to register.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border-purple-500/20">
        <CardContent className="py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white/70 font-medium">Loading team data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const acceptedMembers =
    team?.members.filter((m) => m.status === "accepted") || [];
  const pendingMembers =
    team?.members.filter((m) => m.status === "pending") || [];
  const isLeader = team?.team_leader_id === user?.id;
  const isEligible = acceptedMembers.length >= 2 && acceptedMembers.length <= 4;
  const userMembership = team?.members.find((m) => m.user_id === user?.id);
  const isPending = userMembership?.status === "pending";

  return (
    <div className="space-y-6">
      {/* Already Registered Message */}
      {isRegistered && team && (
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Already Registered!
                </h3>
                <p className="text-green-300 text-sm">
                  Your team &quot;{team.name}&quot; is already registered for{" "}
                  {eventName}
                </p>
              </div>
            </div>

            {/* WhatsApp Group Link */}
            {whatsappGroupLink && (
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <h4 className="font-semibold text-sm">
                    Join Event WhatsApp Group
                  </h4>
                </div>
                <p className="text-xs text-white/70">
                  Stay updated with important announcements and event
                  information
                </p>
                <a
                  href={whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Open WhatsApp Group
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!team ? (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="space-y-4">
            <CardTitle className="text-white text-xl">
              Join the Competition
            </CardTitle>
            <p className="text-gray-400 text-sm">
              You need to create or join a team to register for {eventName}.
              Teams must have 2-4 members to be eligible.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="w-full bg-[#8F00AF] hover:bg-[#8F00AF]/90 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
            <Button
              onClick={() => setShowJoinDialog(true)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              Join with Team Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <CardTitle className="text-white text-xl mb-3">
                  {team.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs font-mono bg-white/5 border-white/20"
                  >
                    {team.slug}
                  </Badge>
                  {isLeader && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyTeamCode}
                      className="h-7 px-2 hover:bg-white/10"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-[#8F00AF]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <Badge
                className={
                  isPending
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    : "bg-white/10 text-white border-white/20"
                }
              >
                {isPending ? "Pending Approval" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Team Members</h3>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/5 border-white/20"
                >
                  {acceptedMembers.length}/4
                </Badge>
              </div>
              <div className="space-y-2">
                {acceptedMembers.map((member) => {
                  const profile = member.profiles;
                  const displayName =
                    profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : member.email;

                  return (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-sm border border-white/20">
                          {(displayName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm">{displayName}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {member.role === "leader" && (
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Leader
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Members (only visible to leader) */}
            {isLeader && pendingMembers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">
                    Pending Requests
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs bg-white/5 border-white/20"
                  >
                    {pendingMembers.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {pendingMembers.map((member) => {
                    const profile = member.profiles;
                    const displayName =
                      profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : member.email;

                    return (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-sm border border-white/20">
                            {(displayName || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm">{displayName}</p>
                            <p className="text-xs text-gray-500">
                              Requested to join
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveMember(member.user_id)}
                            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white h-8 text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectMember(member.user_id)}
                            className="border-white/20 cursor-pointer text-white hover:bg-white/5 h-8 text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Eligibility Status */}
            {!isPending && !isRegistered && (
              <>
                {!isEligible && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-sm text-gray-400">
                      {acceptedMembers.length < 2
                        ? `Need at least ${2 - acceptedMembers.length} more member(s) to register`
                        : `Team has too many members (max 4)`}
                    </p>
                  </div>
                )}

                {isEligible && (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-300">
                        Team is eligible with {acceptedMembers.length} members
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        if (isBPlan || isInvestorSummit) {
                          setShowRegistrationConfirmDialog(true);
                        } else {
                          registerForEvent();
                        }
                      }}
                      disabled={registering}
                      className="w-full bg-[#8F00AF] hover:bg-[#8F00AF]/90 text-white"
                      size="lg"
                    >
                      {registering ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Register Team for Event
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {isPending && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <p className="text-sm text-gray-400">
                    Your request is pending approval from the team leader
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Registration Details Dialog */}
      <Dialog
        open={showRegistrationConfirmDialog}
        onOpenChange={setShowRegistrationConfirmDialog}
      >
        <DialogContent className="bg-black border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Finalize Registration</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Please provide the required details for {eventName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Presentation/Pitch Deck (PDF or Link){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <Input
                  value={presentationUrl}
                  onChange={(e) => setPresentationUrl(e.target.value)}
                  placeholder="Paste link or upload PDF"
                  className="bg-white/5 border-white/10 text-white"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="hidden"
                    id="presentation-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "presentation");
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("presentation-upload")?.click()
                    }
                    className="border-white/10 w-full"
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
                  <Label className="text-sm font-medium text-white">
                    Product Photos <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    <Input
                      value={productPhotosUrl}
                      onChange={(e) => setProductPhotosUrl(e.target.value)}
                      placeholder="Photos link or upload"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="photos-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0]; // Handling single for now, can be updated for multiple if needed
                          if (file) handleFileUpload(file, "photos");
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("photos-upload")?.click()
                        }
                        className="border-white/10 w-full"
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
                  <Label className="text-sm font-medium text-white">
                    Achievements (Brief)
                  </Label>
                  <Input
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="Key milestones/achievements"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </>
            )}

            <Button
              onClick={() => {
                setShowRegistrationConfirmDialog(false);
                registerForEvent();
              }}
              disabled={
                registering ||
                uploadingPresentation ||
                uploadingPhotos ||
                !presentationUrl ||
                (isInvestorSummit && !productPhotosUrl)
              }
              className="w-full bg-[#8F00AF] hover:bg-[#8F00AF]/90"
            >
              {registering ? "Registering..." : "Confirm Registration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Create Team for {eventName}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              You&apos;ll need 2-4 members to register.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="team-name" className="text-sm text-white">
                Team Name
              </Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                disabled={creating}
              />
            </div>
            <Button
              onClick={createTeam}
              disabled={creating || !newTeamName.trim()}
              className="w-full bg-[#8F00AF] hover:bg-[#8F00AF]/90 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Team Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg">Join Team with Code</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Enter the 6-character team code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="join-code" className="text-sm text-white">
                Team Code
              </Label>
              <Input
                id="join-code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-mono text-lg tracking-wider text-center"
                disabled={joining}
                maxLength={6}
              />
            </div>
            <Button
              onClick={joinTeam}
              disabled={joining || !joinCode.trim()}
              className="w-full bg-[#8F00AF] hover:bg-[#8F00AF]/90 disabled:opacity-50"
            >
              {joining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Request to Join
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
