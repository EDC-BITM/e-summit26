"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

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
};

type RegistrationCardsProps = {
  events: Event[];
  registeredEventIds: string[];
  onRegister: (eventId: string) => void;
  registeringEventId: string | null;
  isEligible: boolean;
};

function cx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    formal: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
    informal: "bg-green-500/15 text-green-300 ring-green-500/30",
    technical: "bg-purple-500/15 text-purple-300 ring-purple-500/30",
    workshop: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
    speaker_session: "bg-pink-500/15 text-pink-300 ring-pink-500/30",
    "networking & strategic": "bg-cyan-500/15 text-cyan-300 ring-cyan-500/30",
  };
  return (
    colors[category.toLowerCase()] ||
    "bg-white/10 text-white/70 ring-white/20"
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Date TBA";
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "Date TBA";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Date TBA";
  }
}

export function RegistrationCards({
  events,
  registeredEventIds,
  onRegister,
  registeringEventId,
  isEligible,
}: RegistrationCardsProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl bg-black/35 ring-1 ring-white/10 p-8 text-center">
        <p className="text-sm text-white/60">
          No active events available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, idx) => {
        const isRegistered = registeredEventIds.includes(event.id);
        const isRegistering = registeringEventId === event.id;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
            className={cx(
              "rounded-[20px] bg-[#111114] ring-1 ring-white/10",
              "shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl",
              "overflow-hidden group hover:ring-white/20 transition-all duration-300"
            )}
          >
            {/* Event Image */}
            {event.image_url && (
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={event.image_url}
                  alt={event.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {isRegistered && (
                  <div className="absolute inset-0 bg-purple-500/10 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      REGISTERED
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-white/90 leading-snug">
                    {event.name}
                  </h3>
                </div>
                <span
                  className={cx(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                    getCategoryColor(event.category)
                  )}
                >
                  {event.category}
                </span>
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-xs text-white/60 leading-relaxed mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              {/* Details */}
              <div className="space-y-2 mb-4">
                {event.date && (
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Calendar className="h-3.5 w-3.5 text-white/50" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <MapPin className="h-3.5 w-3.5 text-white/50" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Users className="h-3.5 w-3.5 text-white/50" />
                    <span>Max {event.max_participants} participants</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isRegistered ? (
                <button
                  disabled
                  className={cx(
                    "w-full rounded-full px-4 py-2.5 text-sm font-semibold",
                    "bg-green-600/20 text-green-300 ring-1 ring-green-600/30",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Registered
                </button>
              ) : (
                <button
                  onClick={() => onRegister(event.id)}
                  disabled={isRegistering || !isEligible}
                  className={cx(
                    "w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                    "flex items-center justify-center gap-2",
                    isEligible
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/10 text-white/40 ring-1 ring-white/10 cursor-not-allowed"
                  )}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Now"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
