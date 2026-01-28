"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Loader2,
  UserPlus,
  Trash2,
  Crown,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamMember {
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

interface Team {
  id: string;
  name: string;
  slug: string;
  team_leader_id: string;
  created_at: string;
  members: TeamMember[];
}

export default function TeamsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitingToTeam, setInvitingToTeam] = useState<string | null>(null);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/teams");
        return;
      }

      setUser(user);

      // Fetch teams where user is a member
      const { data: teamMembersData, error: teamMembersError } = await supabase
        .from("team_members")
        .select(
          `
          team_id,
          teams (
            id,
            name,
            slug,
            team_leader_id,
            created_at
          )
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "accepted");

      if (teamMembersError) throw teamMembersError;

      // Fetch members for each team
      const teamsWithMembers: Team[] = [];

      for (const tm of teamMembersData || []) {
        const team = Array.isArray(tm.teams) ? tm.teams[0] : tm.teams;

        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select(
            `
            user_id,
            role,
            status,
            joined_at,
            profiles:user_id (
              first_name,
              last_name
            )
          `,
          )
          .eq("team_id", team.id);

        if (membersError) throw membersError;

        // Get user emails
        const membersWithEmails = await Promise.all(
          (membersData || []).map(async (member) => {
            const {
              data: { user: memberUser },
            } = await supabase.auth.admin.getUserById(member.user_id);
            const profile = Array.isArray(member.profiles)
              ? member.profiles[0]
              : member.profiles;

            return {
              ...member,
              profiles: {
                first_name: profile?.first_name || null,
                last_name: profile?.last_name || null,
                email: memberUser?.email || "Unknown",
              },
            };
          }),
        );

        teamsWithMembers.push({
          ...team,
          members: membersWithEmails,
        });
      }

      setTeams(teamsWithMembers);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams.",
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
      // Generate unique slug
      const slug = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: newTeamName,
          slug,
          team_leader_id: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamData.id,
          user_id: user.id,
          role: "leader",
          status: "accepted",
        });

      if (memberError) throw memberError;

      toast({
        title: "Team Created!",
        description: `Team "${newTeamName}" has been created successfully.`,
      });

      setNewTeamName("");
      setShowCreateDialog(false);
      fetchData();
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const inviteMember = async (teamId: string) => {
    if (!inviteEmail.trim()) return;

    setInvitingToTeam(teamId);
    try {
      // Find user by email
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", inviteEmail)
        .single();

      toast({
        title: "Feature Coming Soon",
        description:
          "Email-based invites will be available soon. For now, share your team slug with teammates.",
      });
    } catch (error) {
      console.error("Error inviting member:", error);
    } finally {
      setInvitingToTeam(null);
      setInviteEmail("");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-black via-[#0a0015] to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#733080]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B05EC2]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 pt-24 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  My Teams
                </h1>
                <p className="text-gray-400 text-lg">Manage your event teams</p>
              </div>
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Create a team to participate in events (2-4 members
                      required)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Enter team name"
                        className="bg-white/5 border-white/10 text-white"
                        disabled={creating}
                      />
                    </div>
                    <Button
                      onClick={createTeam}
                      disabled={creating || !newTeamName.trim()}
                      className="w-full bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Team"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {teams.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardContent className="py-12 text-center">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Teams Yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create a team to register for events
                  </p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-linear-to-r from-[#733080] to-[#B05EC2]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Team
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team) => {
                  const isLeader = team.team_leader_id === user?.id;
                  const acceptedMembers = team.members.filter(
                    (m) => m.status === "accepted",
                  );
                  const pendingMembers = team.members.filter(
                    (m) => m.status === "pending",
                  );
                  const isEligible =
                    acceptedMembers.length >= 2 && acceptedMembers.length <= 4;

                  return (
                    <Card
                      key={team.id}
                      className="bg-black/40 backdrop-blur-xl border-white/10"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                              {team.name}
                              {isLeader && (
                                <Crown className="h-5 w-5 text-yellow-500" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Team Code:{" "}
                              <span className="font-mono font-semibold text-[#733080]">
                                {team.slug}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              isEligible
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            }
                          >
                            {acceptedMembers.length} / 4 Members
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">
                            Team Members
                          </h4>
                          <div className="space-y-2">
                            {acceptedMembers.map((member) => (
                              <div
                                key={member.user_id}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#733080] to-[#B05EC2] flex items-center justify-center text-white font-semibold">
                                    {member.profiles.first_name?.[0] ||
                                      member.profiles.email[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {member.profiles.first_name &&
                                      member.profiles.last_name
                                        ? `${member.profiles.first_name} ${member.profiles.last_name}`
                                        : member.profiles.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {member.role}
                                    </p>
                                  </div>
                                </div>
                                {member.role === "leader" && (
                                  <Crown className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {!isEligible && (
                          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <p className="text-sm text-orange-400">
                              {acceptedMembers.length < 2
                                ? `Need at least ${2 - acceptedMembers.length} more member(s) to register for events`
                                : `Team has too many members (max 4)`}
                            </p>
                          </div>
                        )}

                        {isEligible && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-400" />
                            <p className="text-sm text-green-400">
                              Team is eligible for event registration
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
