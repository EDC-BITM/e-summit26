"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Silk from "@/components/Silk";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { RegistrationCards } from "@/components/ui/registration-cards";
import { ArrowLeft, AlertCircle } from "lucide-react";

type Event = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  max_participants: number | null;
  is_active: boolean | null;
  whatsapp_group_link: string | null;
};

type TeamState = {
  membershipStatus: "none" | "pending" | "accepted";
  team?: {
    id: string;
    name: string;
    slug: string;
  };
  acceptedMembers?: Array<{ user_id: string }>;
  minEligibleSize?: number;
};

function cx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<
    Array<{ event_id: string; team_id: string }>
  >([]);
  const [teamState, setTeamState] = useState<TeamState>({
    membershipStatus: "none",
  });
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(
    null,
  );

  const isAccepted = teamState.membershipStatus === "accepted";
  const acceptedCount = isAccepted
    ? (teamState.acceptedMembers?.length ?? 0)
    : 0;
  const isEligible = isAccepted
    ? acceptedCount >= (teamState.minEligibleSize ?? 2)
    : false;
  const myTeamId = isAccepted ? teamState.team?.id : null;

  async function refreshTeam() {
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

  async function refreshEvents() {
    setEventsLoading(true);
    try {
      // Fetch active events
      const eventsData = await api<{ events: Event[] }>(
        "/api/leaderboard?activeOnly=true&includeOverall=false",
        { method: "GET" },
      );
      setEvents(eventsData.events || []);

      // Fetch user's registrations if they have a team
      if (myTeamId) {
        const regsData = await api<{
          data: Array<{ event_id: string; team_id: string }>;
        }>(`/api/events/registrations?teamId=${myTeamId}`, {
          method: "GET",
        }).catch(() => ({ data: [] }));
        setRegistrations(regsData.data || []);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "FAILED_TO_LOAD_EVENTS";
      setErr(msg);
    } finally {
      setEventsLoading(false);
    }
  }

  async function handleEventRegister(eventId: string) {
    if (!isAccepted || !isEligible || !teamState.team) {
      setErr("You need a team with at least 2 members to register for events.");
      return;
    }

    setRegisteringEventId(eventId);
    try {
      await api("/api/events/register", {
        method: "POST",
        body: JSON.stringify({
          event_id: eventId,
          team_id: teamState.team.id,
        }),
      });
      await refreshEvents();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "REGISTRATION_FAILED";
      setErr(msg);
    } finally {
      setRegisteringEventId(null);
    }
  }

  useEffect(() => {
    refreshTeam();
  }, []);

  useEffect(() => {
    if (!loading) {
      refreshEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, myTeamId]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-x-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 opacity-70">
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Link
            href="/protected"
            className={cx(
              "inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15",
              "px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition mb-6",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.22em] text-white/50">
              Events
            </span>
            <span className="h-px w-12 bg-white/15" />
          </div>

          <AnimatedBlurText lines={["Event Registration"]} />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
            Browse and register your team for exciting events at E-Summit 2026.
            Team registration requires at least 2 accepted members.
          </p>
        </motion.div>

        {/* Error Display */}
        {err && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 p-4"
          >
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{err}</p>
            </div>
          </motion.div>
        )}

        {/* Team Status Warnings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="mt-10"
        >
          {loading ? (
            <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-8 text-center">
              <p className="text-sm text-white/60">
                Loading team information...
              </p>
            </div>
          ) : !isAccepted ? (
            <div className="rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-300 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-300 mb-1">
                    No Team Found
                  </p>
                  <p className="text-sm text-orange-300/80">
                    You need to join a team before registering for events. Visit
                    the{" "}
                    <Link
                      href="/protected"
                      className="underline hover:text-orange-200"
                    >
                      dashboard
                    </Link>{" "}
                    to create or join a team.
                  </p>
                </div>
              </div>
            </div>
          ) : !isEligible ? (
            <div className="rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-300 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-300 mb-1">
                    Team Not Eligible
                  </p>
                  <p className="text-sm text-orange-300/80">
                    Your team needs at least {teamState.minEligibleSize ?? 2}{" "}
                    accepted members to register for events. Current members:{" "}
                    {acceptedCount}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Events Section */}
          <div className="mt-6">
            {eventsLoading ? (
              <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-8 text-center">
                <p className="text-sm text-white/60">Loading events...</p>
              </div>
            ) : (
              <RegistrationCards
                events={events}
                registeredEventIds={registrations.map((r) => r.event_id)}
                onRegister={handleEventRegister}
                registeringEventId={registeringEventId}
                isEligible={isEligible}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
