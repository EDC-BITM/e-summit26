"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Silk from "@/components/Silk";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { LogoutButton } from "@/components/logout-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { DashboardCards } from "./DashboardCards";

// Memoize Silk to prevent rerenders
const MemoizedSilk = memo(Silk);

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
  event_id: string | null;
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
      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/45">
        {label}
      </p>
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

// User Teams Types
type UserTeamData = {
  team_id: string;
  role: "leader" | "member";
  status: "pending" | "accepted";
  joined_at: string;
  team: Team;
  event: {
    id: string;
    name: string;
    category: string;
    date: string | null;
    location: string | null;
    image_url: string | null;
  } | null;
  registrations: Array<{
    team_id: string;
    event_id: string;
    registered_at: string;
  }>;
  memberCount: number;
};

type UserTeamsResponse = {
  teams: UserTeamData[];
  totalTeams: number;
  acceptedTeams: number;
  pendingTeams: number;
};

export default function DashboardClient({
  user,
  profile,
}: {
  user: UserDTO;
  profile: ProfileDTO;
}) {
  const [userTeams, setUserTeams] = useState<UserTeamsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [err, setErr] = useState<string | null>(null);

  // ---------- Leaderboard state ----------
  const [lb, setLb] = useState<LeaderboardDTO | null>(null);
  const [lbLoading, setLbLoading] = useState(true);
  const [lbErr, setLbErr] = useState<string | null>(null);
  const [lbView, setLbView] = useState<"overall" | "events">("overall");
  const [overallExpanded, setOverallExpanded] = useState(false);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const [copied, setCopied] = useState<Record<string, boolean>>({});

  async function refreshUserTeams() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api<UserTeamsResponse>("/api/user/teams", {
        method: "GET",
      });
      setUserTeams(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "FAILED_TO_LOAD_TEAMS";
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

  // Get all user's team IDs for leaderboard comparison
  const userTeamIds = useMemo(() => {
    return (
      userTeams?.teams
        .filter((t) => t.status === "accepted")
        .map((t) => t.team_id) || []
    );
  }, [userTeams]);

  useEffect(() => {
    refreshUserTeams();
    refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate total points from all user teams
  const totalPoints = useMemo(() => {
    if (!lb || !userTeamIds.length) return 0;
    return userTeamIds.reduce((sum, teamId) => {
      const teamRow = lb.overall.find((r) => r.team.id === teamId);
      return sum + (teamRow?.total_marks || 0);
    }, 0);
  }, [lb, userTeamIds]);

  // Calculate stats
  const stats = useMemo(() => {
    const accepted = userTeams?.acceptedTeams || 0;
    const pending = userTeams?.pendingTeams || 0;
    const registered =
      userTeams?.teams.filter((t) => t.registrations.length > 0).length || 0;

    return { accepted, pending, registered };
  }, [userTeams]);

  return (
    <>
      <Navbar />

      <section className="relative pt-20 md:pt-24 min-h-svh w-full overflow-x-hidden bg-black">
        <div className="fixed inset-0 opacity-70">
          <MemoizedSilk
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
                Manage your E-Summit participation, track points, and view
                leaderboards. Teams are now event-specific - create or join
                teams from individual event pages.
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
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-white/70 text-sm">
                  Loading your data...
                </p>
              </div>
            ) : (
              <DashboardCards
                teams={userTeams?.teams || []}
                totalPoints={totalPoints}
                stats={stats}
              />
            )}
          </motion.div>

          {/* Leaderboard Section */}
          {lb && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
              className="mt-6"
            >
              <Card
                title="Leaderboard"
                subtitle="View rankings and results across all events"
              >
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLbView("overall")}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                        lbView === "overall"
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      Overall Rankings
                    </button>
                    <button
                      onClick={() => setLbView("events")}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                        lbView === "events"
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      Event Results
                    </button>
                  </div>

                  {lbView === "overall" && (
                    <div className="space-y-2">
                      {(overallExpanded
                        ? lb.overall
                        : lb.overall.slice(0, 5)
                      ).map((row, idx) => {
                        const isUserTeam = userTeamIds.includes(row.team.id);
                        return (
                          <div
                            key={row.team.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isUserTeam
                                ? "bg-white/10 ring-1 ring-white/20"
                                : "bg-black/35"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-white/60 font-semibold w-8">
                                #{idx + 1}
                              </span>
                              <span className="text-white font-medium">
                                {row.team.name}
                              </span>
                              {isUserTeam && (
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/60">
                                  Your Team
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                {row.total_marks}
                              </div>
                              <div className="text-[10px] text-white/40">
                                points
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {lb.overall.length > 5 && (
                        <button
                          onClick={() => setOverallExpanded(!overallExpanded)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-white/60 hover:text-white/80 transition"
                        >
                          {overallExpanded ? (
                            <>
                              Show Less <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show All ({lb.overall.length}){" "}
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {lbView === "events" && (
                    <div className="space-y-3">
                      {lb.events.map((ev) => (
                        <div key={ev.id} className="rounded-lg bg-black/35 p-3">
                          <button
                            onClick={() =>
                              setOpenEventId(
                                openEventId === ev.id ? null : ev.id,
                              )
                            }
                            className="w-full flex items-center justify-between text-left"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {ev.name}
                              </p>
                              <p className="text-[10px] text-white/40 uppercase">
                                {ev.category}
                              </p>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 text-white/60 transition ${
                                openEventId === ev.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {openEventId === ev.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 space-y-2">
                                  {ev.results.map((r) => {
                                    const isUserTeam = userTeamIds.includes(
                                      r.team.id,
                                    );
                                    return (
                                      <div
                                        key={r.team.id}
                                        className={`flex items-center justify-between p-2 rounded ${
                                          isUserTeam
                                            ? "bg-white/10"
                                            : "bg-white/5"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 text-sm">
                                          <span>{medal(r.rank)}</span>
                                          <span className="text-white/85">
                                            {r.team.name}
                                          </span>
                                          {isUserTeam && (
                                            <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">
                                              YOU
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-sm font-bold text-white/90">
                                          {r.marks}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
{
  /* Team Points Column */
}
