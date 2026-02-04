"use client";

import { Users, Trophy, Clock, Copy, Check, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type UserTeamData = {
  team_id: string;
  role: "leader" | "member";
  status: "pending" | "accepted";
  joined_at: string;
  team: {
    id: string;
    name: string;
    slug: string;
    team_leader_id: string;
    created_at: string;
    event_id: string | null;
  };
  event: {
    id: string;
    name: string;
    slug: string;
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

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] md:rounded-[24px] bg-[#111114] ring-1 ring-white/10 shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-xl p-4 sm:p-5 md:p-7">
      <div className="mb-4 md:mb-5">
        <p className="text-sm font-medium text-white/85">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-white/55 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "strong";
}) {
  return (
    <span
      className={
        tone === "strong"
          ? "inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-white/95 ring-1 ring-white/20"
          : "inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs text-white/70"
      }
    >
      {children}
    </span>
  );
}

export function DashboardCards({
  teams,
  totalPoints,
  stats,
}: {
  teams: UserTeamData[];
  totalPoints: number;
  stats: { accepted: number; pending: number; registered: number };
}) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyCode = async (slug: string, teamId: string) => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied({ ...copied, [teamId]: true });
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [teamId]: false }));
      }, 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card
        title="Your E-Summit Stats"
        subtitle="Overview of your participation across all events"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-black/35 ring-1 ring-white/10 p-4">
            <p className="text-[10px] uppercase tracking-wide text-white/45">
              Total Points
            </p>
            <p className="mt-2 text-2xl font-semibold text-white/90">
              {totalPoints}
            </p>
          </div>
          <div className="rounded-xl bg-black/35 ring-1 ring-white/10 p-4">
            <p className="text-[10px] uppercase tracking-wide text-white/45">
              Active Teams
            </p>
            <p className="mt-2 text-2xl font-semibold text-white/90">
              {stats.accepted}
            </p>
          </div>
          <div className="rounded-xl bg-black/35 ring-1 ring-white/10 p-4">
            <p className="text-[10px] uppercase tracking-wide text-white/45">
              Pending
            </p>
            <p className="mt-2 text-2xl font-semibold text-white/90">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-xl bg-black/35 ring-1 ring-white/10 p-4">
            <p className="text-[10px] uppercase tracking-wide text-white/45">
              Events Joined
            </p>
            <p className="mt-2 text-2xl font-semibold text-white/90">
              {stats.registered}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/events"
            className="rounded-full bg-white text-black px-5 py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition"
          >
            Browse Events
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/10 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
          >
            Home
          </Link>
        </div>
      </Card>

      {/* My Teams */}
      {teams.length > 0 ? (
        <Card
          title="My Teams"
          subtitle={`You are part of ${teams.length} team${teams.length !== 1 ? "s" : ""} across different events`}
        >
          <div className="space-y-3">
            {teams.map((teamData) => {
              const isLeader = teamData.role === "leader";
              const isPending = teamData.status === "pending";
              const isRegistered = teamData.registrations.length > 0;

              return (
                <div
                  key={teamData.team_id}
                  className="rounded-xl bg-black/35 ring-1 ring-white/10 p-4 hover:bg-black/40 hover:ring-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold">
                          {teamData.team.name}
                        </h3>
                        {isLeader && (
                          <Pill tone="strong">
                            <Crown className="h-3 w-3" />
                            Leader
                          </Pill>
                        )}
                        {isPending && (
                          <Pill>
                            <Clock className="h-3 w-3" />
                            Pending Approval
                          </Pill>
                        )}
                      </div>

                      {teamData.event && (
                        <p className="mt-1 text-xs text-white/60">
                          {teamData.event.name} •{" "}
                          <span className="text-white/40">
                            {teamData.event.category}
                          </span>
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Pill>
                          <Users className="h-3 w-3" />
                          {teamData.memberCount}/4 members
                        </Pill>
                        <Pill>Code: {teamData.team.slug}</Pill>
                        {isRegistered && (
                          <Pill tone="strong">
                            <Trophy className="h-3 w-3" />
                            Registered
                          </Pill>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!isPending && (
                        <button
                          onClick={() =>
                            copyCode(teamData.team.slug, teamData.team_id)
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            copied[teamData.team_id]
                              ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
                              : "bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15"
                          }`}
                        >
                          {copied[teamData.team_id] ? (
                            <>
                              <Check className="h-3 w-3 inline mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 inline mr-1" />
                              Copy Code
                            </>
                          )}
                        </button>
                      )}
                      {teamData.event && (
                        <Link
                          href={`/events/${teamData.event.slug}`}
                          className="rounded-full bg-white text-black px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition"
                        >
                          View Event
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card
          title="No Teams Yet"
          subtitle="Start your E-Summit journey by creating or joining a team"
        >
          <div className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <p className="text-sm text-white/60 mb-6">
              Browse events and create or join teams for the competitions you&apos;re
              interested in. Teams are specific to each event.
            </p>
            <Link
              href="/events"
              className="inline-block rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Explore Events
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
