"use client";

import { m } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import EventTeamManager from "@/components/EventTeamManager";
import MDXRenderer from "@/components/MDXRenderer";

interface Event {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  doc: string | null;
  max_participants: number | null;
  max_score: number;
  is_active: boolean;
}

interface EventPageContentProps {
  event: Event;
}

export default function EventPageContent({ event }: EventPageContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Event Image */}
            {event.image_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-[#8F00AF]/20">
                <Image
                  src={event.image_url}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
                {event.is_active && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#8F00AF] text-white border-none px-3 py-1">
                      Registration Open
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Event Details */}
            <div
              className={
                event.image_url ? "" : "lg:col-span-2 max-w-4xl mx-auto"
              }
            >
              <Badge className="mb-4 capitalize bg-[#8F00AF]/10 text-[#8F00AF] border-[#8F00AF]/30 px-3 py-1">
                {event.category}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {event.name}
              </h1>

              {event.description && (
                <p className="text-base text-gray-400 mb-8 max-w-2xl">
                  {event.description}
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {event.date && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Date & Time
                        </p>
                        <p className="text-sm text-white">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Location
                        </p>
                        <p className="text-sm text-white">{event.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#8F00AF]" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Max Participants
                        </p>
                        <p className="text-sm text-white">
                          {event.max_participants} Teams
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-[#8F00AF]" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Prize Pool
                      </p>
                      <p className="text-sm text-white">
                        {event.max_score} Points
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {event.is_active ? (
                  <Button
                    size="lg"
                    asChild
                    className="bg-[#8F00AF] hover:bg-[#8F00AF]/90 text-white"
                  >
                    <Link href="#team-section">Form Team & Register</Link>
                  </Button>
                ) : (
                  <Button size="lg" disabled>
                    Registration Closed
                  </Button>
                )}
                {event.doc && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-[#8F00AF]/30 text-[#8F00AF] hover:bg-[#8F00AF]/10"
                  >
                    <a href="#event-info">
                      <FileText className="mr-2 h-4 w-4" />
                      View Event Info
                    </a>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Formation Section */}
      {event.is_active && (
        <section
          id="team-section"
          className="py-16 md:py-24 bg-black border-t border-white/5"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  Form Your Team
                </h2>
                <p className="text-gray-400">
                  Create or join a team of 2-4 members to compete in{" "}
                  {event.name}
                </p>
              </div>

              <EventTeamManager
                eventId={event.id}
                eventName={event.name}
                eventSlug={event.slug}
              />
            </div>
          </div>
        </section>
      )}

      {/* Event Documentation Section */}
      {event.doc && (
        <section
          id="event-info"
          className="py-16 md:py-24 bg-black border-t border-white/5"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[#8F00AF]" />
                  Event Information
                </h2>
                <p className="text-gray-400">
                  Everything you need to know about {event.name}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
                <MDXRenderer content={event.doc} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
