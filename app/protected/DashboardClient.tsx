"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Silk from "@/components/Silk";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { LogoutButton } from "@/components/logout-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";

type UserDTO = { id: string; email: string; displayName: string };
type ProfileDTO = {
  id: string;
  roll_no: string;
  phone: string;
  branch: string;
  whatsapp_no: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

type Team = {
  id: string;
  name: string;
  slug: string;
  team_leader_id: string;
  created_at: string;
};

type MemberRow = {
  user_id: string;
  role: "leader" | "member";
  status: "pending" | "accepted" | "rejected";
  joined_at: string;
  profile: null | {
    id: string;
    roll_no: string;
    branch: string;
    phone: string;
    whatsapp_no: string;
    first_name: string;
    last_name: string;
  };
};

type TeamState =
  | { membershipStatus: "none" }
  | {
      membershipStatus: "pending" | "accepted";
      membershipRole: "leader" | "member";
      team: Team;
      acceptedMembers: MemberRow[];
      pendingMembers: MemberRow[];
      maxSize: number;
      minEligibleSize: number;
    };

// ---------- Leaderboard DTOs (from /api/leaderboard) ----------
type LbTeamMini = { id: string; slug: string; name: string };

type LbEventResult = {
  rank: 1 | 2 | 3;
  marks: number;
  declared_at: string | null;
  team: LbTeamMini;
};

type LbEvent = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  max_score: number;
  created_at: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean | null;

  declared: boolean;
  results: LbEventResult[];
};

type LbOverallRow = {
  team: LbTeamMini;
  total_marks: number;
  podiums: number;
  golds: number;
  silvers: number;
  bronzes: number;
};

type LeaderboardDTO = {
  events: LbEvent[];
  overall: LbOverallRow[];
};

function cx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-[20px] md:rounded-[24px] bg-[#111114] ring-1 ring-white/10",
        "shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-xl",
        "p-4 sm:p-5 md:p-7",
      )}
    >
      <div className="mb-4 md:mb-5">
        <p className="text-sm font-medium text-white/85">{title}</p>
        {subtitle ? (
          <p className="mt-1 text-xs sm:text-sm text-white/55 leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl md:rounded-2xl bg-black/35 ring-1 ring-white/10 px-3 sm:px-4 py-2.5 sm:py-3">
      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-1 text-xs sm:text-sm font-medium text-white/90 break-words">
        {value}
      </p>
    </div>
  );
}

function Pill({
  children,
  tone = "soft",
}: {
  children: ReactNode;
  tone?: "soft" | "strong";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold whitespace-nowrap",
        tone === "strong"
          ? "bg-white text-black"
          : "bg-white/10 text-white ring-1 ring-white/15",
      )}
    >
      {children}
    </span>
  );
}

function ModalShell({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <motion.div
            className={cx(
              "relative w-full max-w-lg rounded-[20px] md:rounded-[24px] bg-[#111114] ring-1 ring-white/10",
              "shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-xl p-4 sm:p-6 md:p-7 max-h-[90vh] overflow-y-auto",
            )}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90">{title}</p>
                <p className="mt-1 text-xs sm:text-sm text-white/55">
                  E-Summit team management
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full bg-white/10 ring-1 ring-white/15 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition"
              >
                Close
              </button>
            </div>
            <div className="mt-4 sm:mt-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "REQUEST_FAILED");
  return json as T;
}

function initialsFromProfile(p: MemberRow["profile"]) {
  if (!p?.roll_no) return "U";
  return p.roll_no.slice(0, 2).toUpperCase();
}

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "•";
}

function fmtDate(s?: string | null) {
  if (!s) return "";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export default function DashboardClient({
  user,
  profile,
}: {
  user: UserDTO;
  profile: ProfileDTO;
}) {
  const [teamState, setTeamState] = useState<TeamState>({
    membershipStatus: "none",
  });
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const [err, setErr] = useState<string | null>(null);

  // ---------- Leaderboard state ----------
  const [lb, setLb] = useState<LeaderboardDTO | null>(null);
  const [lbLoading, setLbLoading] = useState(true);
  const [lbErr, setLbErr] = useState<string | null>(null);
  const [lbView, setLbView] = useState<"overall" | "events">("overall");
  const [overallExpanded, setOverallExpanded] = useState(false);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api<TeamState>("/api/team/me", { method: "GET" });
      setTeamState(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "FAILED_TO_LOAD_TEAM";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function refreshLeaderboard() {
    setLbErr(null);
    setLbLoading(true);
    try {
      const data = await api<LeaderboardDTO>(
        "/api/leaderboard?activeOnly=true&includeOverall=true",
        { method: "GET" },
      );
      setLb(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "FAILED_TO_LOAD_LEADERBOARD";
      setLbErr(msg);
    } finally {
      setLbLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAccepted = teamState.membershipStatus === "accepted";
  const isLeader = isAccepted && teamState.membershipRole === "leader";

  const acceptedCount = isAccepted ? teamState.acceptedMembers.length : 0;
  const isEligible = isAccepted
    ? acceptedCount >= teamState.minEligibleSize
    : false;

  const myTeamId = isAccepted ? teamState.team.id : null;

  // Polling:
  // 1. If pending, poll every 4s to see if approved
  // 2. If leader, poll every 10s to see new join requests
  useEffect(() => {
    if (teamState.membershipStatus === "pending") {
      const t = setInterval(() => refresh(), 4000);
      return () => clearInterval(t);
    }
    if (isLeader) {
      const t = setInterval(() => refresh(), 10000);
      return () => clearInterval(t);
    }
  }, [teamState.membershipStatus, isLeader]);

  // Optional lightweight leaderboard polling when user is active on dashboard
  useEffect(() => {
    const t = setInterval(() => refreshLeaderboard(), 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myOverallIndex = useMemo(() => {
    if (!lb || !myTeamId) return -1;
    return lb.overall.findIndex((r) => r.team.id === myTeamId);
  }, [lb, myTeamId]);

  const myOverallRow = useMemo(() => {
    if (!lb || myOverallIndex < 0) return null;
    return lb.overall[myOverallIndex] ?? null;
  }, [lb, myOverallIndex]);

  const points = myOverallRow?.total_marks ?? 0;

  return (
    <>
      <Navbar />

      <section className="relative pt-20 md:pt-24 min-h-svh w-full overflow-x-hidden bg-black">
        <div className="fixed inset-0 opacity-70">
          <Silk
            speed={4}
            scale={1}
            color="#B05EC2"
            noiseIntensity={1.15}
            rotation={0}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/55" />
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(70% 70% at 50% 15%, rgba(255,255,255,0.06), transparent 55%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 md:py-10 lg:py-12">
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-base font-semibold text-white/90">
                Participant Dashboard
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Pill>{profile.branch}</Pill>
              <Pill>{profile.roll_no}</Pill>
              <LogoutButton />
            </div>
          </motion.div>

          {/* Heading */}
          <div className="mt-6 md:mt-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/50">
                Dashboard
              </span>
              <span className="h-px w-8 sm:w-12 bg-white/15" />
            </div>

            <div className="mt-3 sm:mt-4">
              <AnimatedBlurText
                lines={["Welcome back, "]}
                liteText={user.displayName}
              />
              <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/55">
                Manage your E-Summit team, track points, and view leaderboards.
                Team creation uses a short code that others can request to join,
                and leaders approve requests.
              </p>
            </div>
          </div>

          {err ? (
            <div className="mt-4 md:mt-6 rounded-xl md:rounded-2xl bg-[#111114] ring-1 ring-white/10 p-3 sm:p-4 text-xs sm:text-sm text-white/75">
              Error: {err}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="mt-6 md:mt-10"
          >
            <div className="space-y-6">
              {/* Card 1: Points & Team Status */}
              <Card
                title="Points & Team"
                subtitle="Create a team, join via code, and compete across challenges."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Team Points Column */}
                  <div className="rounded-xl md:rounded-2xl bg-black/35 ring-1 ring-white/10 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/45">
                      Team Points
                    </p>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-white/90">
                      {points}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-white/55">
                      Points are computed from overall event results.
                    </p>

                    {isAccepted && myOverallRow ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Pill tone="strong">
                          Rank: {myOverallIndex >= 0 ? `#${myOverallIndex + 1}` : "—"}
                        </Pill>
                        <Pill>
                          Podiums: {myOverallRow.podiums} • 🥇{myOverallRow.golds} 🥈
                          {myOverallRow.silvers} 🥉{myOverallRow.bronzes}
                        </Pill>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Pill>Join a team to appear on leaderboard</Pill>
                      </div>
                    )}
                  </div>

                  {/* Team Status Column */}
                  <div className="rounded-xl md:rounded-2xl bg-black/35 ring-1 ring-white/10 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/45">
                      Team Status
                    </p>

                    {loading ? (
                      <p className="mt-2 text-xs sm:text-sm text-white/60">
                        Loading team…
                      </p>
                    ) : teamState.membershipStatus === "none" ? (
                      <>
                        <p className="mt-2 text-base sm:text-lg font-semibold text-white/90">
                          Not in a team
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-white/55">
                          Create a team or join using code.
                        </p>
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setCreateOpen(true)}
                            className="rounded-full bg-white text-black px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition w-full sm:w-auto"
                          >
                            Create Team
                          </button>
                          <button
                            onClick={() => setJoinOpen(true)}
                            className="rounded-full bg-white/10 text-white px-4 py-2 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition w-full sm:w-auto"
                          >
                            Join via Code
                          </button>
                        </div>
                      </>
                    ) : teamState.membershipStatus === "pending" ? (
                      <>
                        <p className="mt-2 text-base sm:text-lg font-semibold text-white/90">
                          Join Request Sent
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-white/55">
                          Awaiting approval from &quot;{teamState.team?.name}&quot; leader.
                        </p>
                        <div className="mt-3 sm:mt-4">
                          <button
                            onClick={async () => {
                              try {
                                setLoading(true);
                                await api("/api/team/cancel", { method: "POST" });
                                await refresh();
                              } catch (e: unknown) {
                                setErr(e instanceof Error ? e.message : "CANCEL_FAILED");
                              } finally {
                                setLoading(false);
                              }
                            }}
                            className="rounded-full bg-white/10 text-white px-4 py-2 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition w-full sm:w-auto"
                          >
                            Cancel Request
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-base sm:text-lg font-semibold text-white/90">
                          {teamState.team.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <Pill>Code: {teamState.team.slug}</Pill>
                          <Pill>{acceptedCount}/5 members</Pill>
                          {isEligible ? (
                            <Pill tone="strong">Eligible</Pill>
                          ) : (
                            <Pill>Need 2+ members</Pill>
                          )}
                        </div>
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(teamState.team.slug);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              } catch {}
                            }}
                            className={cx(
                              "rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition w-full sm:w-auto",
                              copied ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30" : "bg-white text-black hover:opacity-90"
                            )}
                          >
                            {copied ? "Copied!" : "Copy Code"}
                          </button>
                          {!isLeader && (
                            <button
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  await api("/api/team/leave", { method: "POST" });
                                  await refresh();
                                } catch (e: unknown) {
                                  setErr(e instanceof Error ? e.message : "LEAVE_FAILED");
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="rounded-full bg-white/10 text-white px-4 py-2 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition w-full sm:w-auto"
                            >
                              Leave Team
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="/"
                    className="rounded-full bg-white/10 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition text-center w-full sm:w-auto"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/protected/events"
                    className="rounded-full bg-white text-black px-5 py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition text-center w-full sm:w-auto"
                  >
                    Register for Events
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full bg-white/10 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition text-center w-full sm:w-auto"
                  >
                    Support
                  </Link>
                </div>
              </Card>

              {/* Card 2: Team Members & Requests (if accepted) */}
              {isAccepted && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-[20px] md:rounded-[24px] bg-[#111114] ring-1 ring-white/10 p-5 md:p-7">
                    <p className="text-sm font-medium text-white/85">Team Members</p>
                    <div className="mt-4 space-y-3">
                      {teamState.acceptedMembers.map((m) => (
                        <div key={m.user_id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 ring-1 ring-white/15 grid place-items-center text-xs font-semibold text-white/80">
                              {initialsFromProfile(m.profile)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-white/85 truncate">
                                {m.profile?.first_name ? `${m.profile.first_name} ${m.profile.last_name || ""}` : (m.profile?.roll_no || m.user_id.slice(0, 8))}
                                {m.role === "leader" && <span className="ml-1 text-white/50">(Leader)</span>}
                              </p>
                              <p className="text-xs text-white/45 truncate">
                                {m.profile?.roll_no || "—"} • {m.profile?.branch || "—"}
                              </p>
                            </div>
                          </div>
                          <Pill>{m.role}</Pill>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] md:rounded-[24px] bg-[#111114] ring-1 ring-white/10 p-5 md:p-7">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white/85">Join Requests</p>
                      <Pill>{teamState.pendingMembers.length}</Pill>
                    </div>
                    <p className="mt-1 text-xs text-white/55">
                      {isLeader ? "Approve or reject pending requests." : "Only leader can approve."}
                    </p>
                    <div className="mt-4 space-y-3">
                      {teamState.pendingMembers.length === 0 ? (
                        <p className="text-xs text-white/45">No pending requests.</p>
                      ) : (
                        teamState.pendingMembers.map((m) => (
                          <div key={m.user_id} className="rounded-xl bg-black/35 ring-1 ring-white/10 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white/85 truncate">
                                  {m.profile?.first_name || m.profile?.roll_no || "User"}
                                </p>
                                <p className="text-xs text-white/50">{m.profile?.roll_no} • {m.profile?.branch}</p>
                              </div>
                              {isLeader ? (
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={async () => {
                                      try {
                                        setLoading(true);
                                        await api("/api/team/approve", {
                                          method: "POST",
                                          body: JSON.stringify({ team_id: teamState.team.id, user_id: m.user_id }),
                                        });
                                        await refresh();
                                      } catch (e: unknown) {
                                        setErr(e instanceof Error ? e.message : "APPROVE_FAILED");
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                    className="rounded-full bg-white text-black px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        setLoading(true);
                                        await api("/api/team/reject", {
                                          method: "POST",
                                          body: JSON.stringify({ team_id: teamState.team.id, user_id: m.user_id }),
                                        });
                                        await refresh();
                                      } catch (e: unknown) {
                                        setErr(e instanceof Error ? e.message : "REJECT_FAILED");
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                    className="rounded-full bg-white/10 text-white px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <Pill>Pending</Pill>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Leaderboard */}
              <Card
                title="Leaderboard"
                subtitle="Overall standings and event-wise results (updates automatically)."
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-black/30 ring-1 ring-white/10 p-1">
                    <button
                      onClick={() => setLbView("overall")}
                      className={cx(
                        "rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition",
                        lbView === "overall" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                      )}
                    >
                      Overall
                    </button>
                    <button
                      onClick={() => setLbView("events")}
                      className={cx(
                        "rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition",
                        lbView === "events" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                      )}
                    >
                      Events
                    </button>
                  </div>
                  <button
                    onClick={refreshLeaderboard}
                    className="rounded-full bg-white/10 text-white px-4 py-2 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                  >
                    Refresh
                  </button>
                </div>

                {lbLoading ? (
                  <div className="mt-5 text-sm text-white/60">Loading leaderboard…</div>
                ) : lbErr ? (
                  <div className="mt-5 rounded-2xl bg-black/35 ring-1 ring-white/10 p-4 text-sm text-white/75">
                    Error: {lbErr}
                  </div>
                ) : !lb ? (
                  <div className="mt-5 text-sm text-white/60">No data.</div>
                ) : lbView === "overall" ? (
                  <div className="mt-5 space-y-4">
                    {lb.overall.length === 0 ? (
                      <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-4 text-sm text-white/70 text-center">
                        No results declared yet.
                      </div>
                    ) : (
                      <>
                        {isAccepted && (
                          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 border-l-4 border-white">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold uppercase text-white/40">Your Team</span>
                              <span className="text-sm font-semibold text-white/90">{teamState.team.name}</span>
                              <Pill tone="strong">Rank: {myOverallIndex >= 0 ? `#${myOverallIndex + 1}` : "—"}</Pill>
                              <Pill>Points: {points}</Pill>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          {(overallExpanded ? lb.overall : lb.overall.slice(0, 10)).map((row, idx) => (
                            <div
                              key={row.team.id}
                              className={cx(
                                "flex items-center justify-between rounded-2xl px-4 py-3 ring-1 transition",
                                myTeamId === row.team.id ? "bg-white/10 ring-white/20" : "bg-black/35 ring-white/10 hover:bg-black/40"
                              )}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white/90">#{idx + 1}</span>
                                  <span className="truncate text-sm font-semibold text-white/85">{row.team.name}</span>
                                  {myTeamId === row.team.id && <span className="text-[10px] text-white/50">(You)</span>}
                                </div>
                                <div className="mt-1 text-[10px] text-white/50">
                                  🥇{row.golds} 🥈{row.silvers} 🥉{row.bronzes} • Podiums: {row.podiums}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-white/90">{row.total_marks}</div>
                                <div className="text-[10px] text-white/50">pts</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {lb.overall.length > 10 && (
                          <button
                            onClick={() => setOverallExpanded(!overallExpanded)}
                            className="w-full py-3 text-xs font-semibold text-white/60 hover:text-white transition"
                          >
                            {overallExpanded ? "Show Less" : `Show ${lb.overall.length - 10} More`}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {lb.events.length === 0 ? (
                      <div className="text-sm text-white/60 text-center">No events found.</div>
                    ) : (
                      lb.events.map((ev) => {
                        const isOpen = openEventId === ev.id;
                        const myPodium = myTeamId && ev.results.find(r => r.team.id === myTeamId);
                        return (
                          <div key={ev.id} className="rounded-2xl bg-black/35 ring-1 ring-white/10 overflow-hidden">
                            <button
                              onClick={() => setOpenEventId(isOpen ? null : ev.id)}
                              className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-white/90">{ev.name}</span>
                                  <Pill>{ev.category}</Pill>
                                  {ev.declared ? <Pill tone="strong">Results In</Pill> : <Pill>Pending</Pill>}
                                  {myPodium && <Pill tone="strong">{medal(myPodium.rank)} Rank #{myPodium.rank}</Pill>}
                                </div>
                                <p className="mt-1 text-[10px] text-white/50">
                                  {ev.date ? `${fmtDate(ev.date)} • ` : ""}Max: {ev.max_score}
                                </p>
                              </div>
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                  className="border-t border-white/5 bg-white/5 px-4 pb-4 pt-3"
                                >
                                  {ev.description && <p className="mb-4 text-xs text-white/50 leading-relaxed">{ev.description}</p>}
                                  {ev.results.length === 0 ? (
                                    <p className="text-center py-2 text-xs text-white/40 italic">Results not yet declared.</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {ev.results.map(r => (
                                        <div key={r.team.id} className={cx("flex items-center justify-between rounded-xl p-3", myTeamId === r.team.id ? "bg-white/10" : "bg-black/20")}>
                                          <div className="flex items-center gap-2 text-sm">
                                            <span>{medal(r.rank)}</span>
                                            <span className="font-semibold text-white/85">{r.team.name}</span>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-sm font-bold text-white/90">{r.marks}</div>
                                            <div className="text-[10px] text-white/40">marks</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Create Team Modal */}
        <CreateTeamModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={async () => {
            setCreateOpen(false);
            await refresh();
            await refreshLeaderboard();
          }}
        />

        {/* Join Team Modal */}
        <JoinTeamModal
          open={joinOpen}
          onClose={() => setJoinOpen(false)}
          onJoined={async () => {
            setJoinOpen(false);
            await refresh();
            await refreshLeaderboard();
          }}
        />
      </section>
    </>
  );
}

function CreateTeamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <ModalShell open={open} onClose={onClose} title="Create Team">
      {err ? (
        <div className="mb-4 rounded-2xl bg-black/35 ring-1 ring-white/10 p-3 text-sm text-white/75">
          {err}
        </div>
      ) : null}

      <label className="block text-xs uppercase tracking-wide text-white/45">
        Team name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Night Owls"
        className={cx(
          "mt-2 w-full rounded-2xl bg-black/40 px-4 py-3 text-sm text-white/90 outline-none",
          "ring-1 ring-white/10 focus:ring-white/25",
        )}
      />

      <button
        disabled={busy}
        onClick={async () => {
          setErr(null);
          setBusy(true);
          try {
            await api("/api/team/create", {
              method: "POST",
              body: JSON.stringify({ name }),
            });
            await onCreated();
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "CREATE_FAILED";
            setErr(msg);
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition",
          busy
            ? "bg-white/20 text-white/60"
            : "bg-white text-black hover:opacity-90",
        )}
      >
        {busy ? "Creating…" : "Create Team"}
      </button>

      <p className="mt-4 text-sm text-white/55">
        After creation, you’ll get a code (slug) to share. Members will request
        to join; you approve them from your dashboard.
      </p>
    </ModalShell>
  );
}

function JoinTeamModal({
  open,
  onClose,
  onJoined,
}: {
  open: boolean;
  onClose: () => void;
  onJoined: () => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <ModalShell open={open} onClose={onClose} title="Request Sent!">
        <div className="py-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 grid place-items-center mb-4">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-white/90 font-medium">Your request has been sent successfully.</p>
          <p className="mt-2 text-xs text-white/55">The team leader will approve your request soon.</p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-white text-black px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Join Team via Code">
      {err ? (
        <div className="mb-3 sm:mb-4 rounded-xl md:rounded-2xl bg-black/35 ring-1 ring-white/10 p-2.5 sm:p-3 text-xs sm:text-sm text-white/75">
          {err}
        </div>
      ) : null}

      <label className="block text-[10px] sm:text-xs uppercase tracking-wide text-white/45">
        Team code
      </label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="e.g., A7KQ2Z"
        className={cx(
          "mt-2 w-full rounded-xl md:rounded-2xl bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white/90 outline-none",
          "ring-1 ring-white/10 focus:ring-white/25 tracking-[0.18em]",
        )}
      />

      <button
        disabled={busy}
        onClick={async () => {
          const trimmed = code.trim();
          if (!trimmed) {
            setErr("Please enter a code");
            return;
          }
          setErr(null);
          setBusy(true);
          try {
            await api("/api/team/join", {
              method: "POST",
              body: JSON.stringify({ code: trimmed }),
            });
            setSuccess(true);
            setTimeout(async () => {
              await onJoined();
            }, 1500);
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "JOIN_FAILED";
            setErr(msg);
          } finally {
            setBusy(false);
          }
        }}
        className={cx(
          "mt-4 sm:mt-5 w-full rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition",
          busy
            ? "bg-white/20 text-white/60"
            : "bg-white text-black hover:opacity-90",
        )}
      >
        {busy ? "Requesting…" : "Request to Join"}
      </button>

      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/55 leading-relaxed">
        Your request will be pending until the team leader approves it. Teams
        have a maximum of 5 accepted members.
      </p>
    </ModalShell>
  );
}
