"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Silk from "@/components/Silk";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { LogoutButton } from "@/components/logout-button";

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

type Team = { id: string; name: string; slug: string; team_leader_id: string; created_at: string };
type MemberRow = {
    user_id: string;
    role: "leader" | "member";
    status: "pending" | "accepted" | "rejected";
    joined_at: string;
    profile: null | { id: string; roll_no: string; branch: string; phone: string; whatsapp_no: string };
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
    children: React.ReactNode;
}) {
    return (
        <div
            className={cx(
                "rounded-[24px] bg-[#111114] ring-1 ring-white/10",
                "shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-xl",
                "p-6 md:p-7"
            )}
        >
            <div className="mb-5">
                <p className="text-sm font-medium text-white/85">{title}</p>
                {subtitle ? <p className="mt-1 text-sm text-white/55 leading-relaxed">{subtitle}</p> : null}
            </div>
            {children}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
            <p className="mt-1 text-sm font-medium text-white/90 break-words">{value}</p>
        </div>
    );
}

function Pill({ children, tone = "soft" }: { children: React.ReactNode; tone?: "soft" | "strong" }) {
    return (
        <span
            className={cx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                tone === "strong" ? "bg-white text-black" : "bg-white/10 text-white ring-1 ring-white/15"
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
    children: React.ReactNode;
}) {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[80] flex items-center justify-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/70" onClick={onClose} />
                    <motion.div
                        className={cx(
                            "relative w-full max-w-lg rounded-[24px] bg-[#111114] ring-1 ring-white/10",
                            "shadow-[0_28px_110px_rgba(0,0,0,0.75)] backdrop-blur-xl p-6 md:p-7"
                        )}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.99 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-white/90">{title}</p>
                                <p className="mt-1 text-sm text-white/55">E-Summit team management</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition"
                            >
                                Close
                            </button>
                        </div>
                        <div className="mt-6">{children}</div>
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

export default function DashboardClient({ user, profile }: { user: UserDTO; profile: ProfileDTO }) {
    const [teamState, setTeamState] = useState<TeamState>({ membershipStatus: "none" });
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    const [err, setErr] = useState<string | null>(null);

    async function refresh() {
        setErr(null);
        setLoading(true);
        try {
            const data = await api<any>("/api/team/me", { method: "GET" });
            setTeamState(data);
        } catch (e: any) {
            setErr(e?.message ?? "FAILED_TO_LOAD_TEAM");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (teamState.membershipStatus === "pending") {
            const t = setInterval(() => {
                refresh(); // your existing refresh()
            }, 4000);
            return () => clearInterval(t);
        }
    }, [teamState.membershipStatus]);


    const points = 0; // placeholder; wire later

    const isAccepted = teamState.membershipStatus === "accepted";
    const isPending = teamState.membershipStatus === "pending";
    const isLeader = isAccepted && teamState.membershipRole === "leader";

    const acceptedCount = isAccepted ? teamState.acceptedMembers.length : 0;
    const isEligible = isAccepted ? acceptedCount >= teamState.minEligibleSize : false;

    return (
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-black">
            <div className="absolute inset-0 opacity-70">
                <Silk speed={4} scale={1} color="#B05EC2" noiseIntensity={1.15} rotation={0} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/55" />
            <div
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                    background: "radial-gradient(70% 70% at 50% 15%, rgba(255,255,255,0.06), transparent 55%)",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 md:py-12">
                {/* Top bar */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <p className="text-sm text-white/55">E-Summit 2026</p>
                        <p className="text-base font-semibold text-white/90">Participant Dashboard</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Pill>{profile.branch}</Pill>
                        <Pill>{profile.roll_no}</Pill>

                        <div className="ml-0 md:ml-2 flex items-center gap-3 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2">
                            <span className="text-sm text-white/75">{user.email}</span>
                            <div className="h-4 w-px bg-white/15" />
                            <LogoutButton />
                        </div>
                    </div>
                </motion.div>

                {/* Heading */}
                <div className="mt-10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.22em] text-white/50">Dashboard</span>
                        <span className="h-px w-12 bg-white/15" />
                    </div>

                    <div className="mt-4">
                        <AnimatedBlurText lines={["Welcome back,"]} liteText={user.displayName} />
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                            Manage your E-Summit team, track points, and view your participation status. Team creation uses a short code
                            that others can request to join, and leaders approve requests.
                        </p>
                    </div>
                </div>

                {err ? (
                    <div className="mt-6 rounded-2xl bg-[#111114] ring-1 ring-white/10 p-4 text-sm text-white/75">
                        Error: {err}
                    </div>
                ) : null}

                {/* Main grid */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
                    className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* Team + Points */}
                    <div className="lg:col-span-2">
                        <Card
                            title="Points & Team"
                            subtitle="Create a team, join via code, and compete across challenges and checkpoints."
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-5">
                                    <p className="text-xs uppercase tracking-wide text-white/45">Your Points</p>
                                    <p className="mt-2 text-3xl font-semibold text-white/90">{points}</p>
                                    <p className="mt-2 text-sm text-white/55">This will become dynamic once you add a points ledger.</p>
                                </div>

                                <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-5">
                                    <p className="text-xs uppercase tracking-wide text-white/45">Team Status</p>

                                    {loading ? (
                                        <p className="mt-2 text-sm text-white/60">Loading team…</p>
                                    ) : teamState.membershipStatus === "none" ? (
                                        <>
                                            <p className="mt-2 text-lg font-semibold text-white/90">Not in a team</p>
                                            <p className="mt-2 text-sm text-white/55">
                                                Create a team to get a code, or request to join using an existing team code.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setCreateOpen(true)}
                                                    className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                                                >
                                                    Create Team
                                                </button>
                                                <button
                                                    onClick={() => setJoinOpen(true)}
                                                    className="rounded-full bg-white/10 text-white px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                                                >
                                                    Join via Code
                                                </button>
                                            </div>
                                        </>
                                    ) : teamState.membershipStatus === "pending" ? (
                                        <>
                                            <p className="mt-2 text-lg font-semibold text-white/90">Request Pending</p>
                                            <p className="mt-2 text-sm text-white/55">
                                                Your join request is awaiting approval by the team leader.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            setLoading(true);
                                                            await api("/api/team/cancel", { method: "POST" });
                                                            await refresh();
                                                        } catch (e: any) {
                                                            setErr(e?.message ?? "CANCEL_FAILED");
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    className="rounded-full bg-white/10 text-white px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                                                >
                                                    Cancel Request
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mt-2 text-lg font-semibold text-white/90">{teamState.team.name}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <Pill>Code: {teamState.team.slug}</Pill>
                                                <Pill>{acceptedCount}/5 members</Pill>
                                                {isEligible ? <Pill tone="strong">Eligible</Pill> : <Pill>Need 2+ members</Pill>}
                                            </div>
                                            <p className="mt-2 text-sm text-white/55">
                                                Share the code for join requests. Leader approves requests from the dashboard.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await navigator.clipboard.writeText(teamState.team.slug);
                                                        } catch { }
                                                    }}
                                                    className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                                                >
                                                    Copy Team Code
                                                </button>

                                                {!isLeader ? (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                setLoading(true);
                                                                await api("/api/team/leave", { method: "POST" });
                                                                await refresh();
                                                            } catch (e: any) {
                                                                setErr(e?.message ?? "LEAVE_FAILED");
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        className="rounded-full bg-white/10 text-white px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                                                    >
                                                        Leave Team
                                                    </button>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* If accepted: members + pending approvals */}
                            {isAccepted ? (
                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-5">
                                        <p className="text-sm font-semibold text-white/85">Team Members</p>
                                        <div className="mt-4 space-y-3">
                                            {teamState.acceptedMembers.map((m) => (
                                                <div key={m.user_id} className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/15 grid place-items-center text-xs font-semibold text-white/80">
                                                            {initialsFromProfile(m.profile)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-white/85">
                                                                {m.profile?.roll_no ?? m.user_id.slice(0, 8) + "…"}{" "}
                                                                {m.role === "leader" ? <span className="text-white/50">(Leader)</span> : null}
                                                            </p>
                                                            <p className="text-xs text-white/45">{m.profile?.branch ?? "—"}</p>
                                                        </div>
                                                    </div>
                                                    <Pill>{m.role}</Pill>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-5">
                                        <p className="text-sm font-semibold text-white/85">Join Requests</p>
                                        <p className="mt-1 text-sm text-white/55">
                                            {isLeader ? "Approve or reject pending requests." : "Only the leader can approve requests."}
                                        </p>

                                        <div className="mt-4 space-y-3">
                                            {teamState.pendingMembers.length === 0 ? (
                                                <p className="text-sm text-white/55">No pending requests.</p>
                                            ) : (
                                                teamState.pendingMembers.map((m) => (
                                                    <div key={m.user_id} className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-white/85">
                                                                    {m.profile?.roll_no ?? m.user_id.slice(0, 8) + "…"}
                                                                </p>
                                                                <p className="mt-1 text-xs text-white/50">
                                                                    {m.profile?.branch ?? "—"} • {m.profile?.phone ?? "—"} • {m.profile?.whatsapp_no ?? "—"}
                                                                </p>
                                                            </div>

                                                            {isLeader ? (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                setLoading(true);
                                                                                await api("/api/team/approve", {
                                                                                    method: "POST",
                                                                                    body: JSON.stringify({ team_id: teamState.team.id, user_id: m.user_id }),
                                                                                });
                                                                                await refresh();
                                                                            } catch (e: any) {
                                                                                setErr(e?.message ?? "APPROVE_FAILED");
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
                                                                            } catch (e: any) {
                                                                                setErr(e?.message ?? "REJECT_FAILED");
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
                            ) : null}

                            <div className="mt-6 flex flex-wrap gap-2">
                                <Link
                                    href="/"
                                    className="rounded-full bg-white/10 text-white px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15 transition"
                                >
                                    Back to Home
                                </Link>
                                <Link
                                    href="/contact"
                                    className="rounded-full bg-white text-black px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                                >
                                    Support
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* User details */}
                    <div className="lg:col-span-1">
                        <Card title="Your Details" subtitle="From Supabase public.profiles">
                            <div className="space-y-3">
                                <Field label="Roll Number" value={profile.roll_no} />
                                <Field label="Branch" value={profile.branch} />
                                <Field label="Phone" value={profile.phone} />
                                <Field label="WhatsApp" value={profile.whatsapp_no} />
                            </div>
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
                }}
            />

            {/* Join Team Modal */}
            <JoinTeamModal
                open={joinOpen}
                onClose={() => setJoinOpen(false)}
                onJoined={async () => {
                    setJoinOpen(false);
                    await refresh();
                }}
            />
        </section>
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
            {err ? <div className="mb-4 rounded-2xl bg-black/35 ring-1 ring-white/10 p-3 text-sm text-white/75">{err}</div> : null}

            <label className="block text-xs uppercase tracking-wide text-white/45">Team name</label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Night Owls"
                className={cx(
                    "mt-2 w-full rounded-2xl bg-black/40 px-4 py-3 text-sm text-white/90 outline-none",
                    "ring-1 ring-white/10 focus:ring-white/25"
                )}
            />

            <button
                disabled={busy}
                onClick={async () => {
                    setErr(null);
                    setBusy(true);
                    try {
                        await api("/api/team/create", { method: "POST", body: JSON.stringify({ name }) });
                        await onCreated();
                    } catch (e: any) {
                        setErr(e?.message ?? "CREATE_FAILED");
                    } finally {
                        setBusy(false);
                    }
                }}
                className={cx(
                    "mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition",
                    busy ? "bg-white/20 text-white/60" : "bg-white text-black hover:opacity-90"
                )}
            >
                {busy ? "Creating…" : "Create Team"}
            </button>

            <p className="mt-4 text-sm text-white/55">
                After creation, you’ll get a code (slug) to share. Members will request to join; you approve them from your dashboard.
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

    return (
        <ModalShell open={open} onClose={onClose} title="Join Team via Code">
            {err ? <div className="mb-4 rounded-2xl bg-black/35 ring-1 ring-white/10 p-3 text-sm text-white/75">{err}</div> : null}

            <label className="block text-xs uppercase tracking-wide text-white/45">Team code</label>
            <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., A7KQ2Z"
                className={cx(
                    "mt-2 w-full rounded-2xl bg-black/40 px-4 py-3 text-sm text-white/90 outline-none",
                    "ring-1 ring-white/10 focus:ring-white/25 tracking-[0.18em]"
                )}
            />

            <button
                disabled={busy}
                onClick={async () => {
                    setErr(null);
                    setBusy(true);
                    try {
                        await api("/api/team/join", { method: "POST", body: JSON.stringify({ code }) });
                        await onJoined();
                    } catch (e: any) {
                        setErr(e?.message ?? "JOIN_FAILED");
                    } finally {
                        setBusy(false);
                    }
                }}
                className={cx(
                    "mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition",
                    busy ? "bg-white/20 text-white/60" : "bg-white text-black hover:opacity-90"
                )}
            >
                {busy ? "Requesting…" : "Request to Join"}
            </button>

            <p className="mt-4 text-sm text-white/55">
                Your request will be pending until the team leader approves it. Teams have a maximum of 5 accepted members.
            </p>
        </ModalShell>
    );
}
