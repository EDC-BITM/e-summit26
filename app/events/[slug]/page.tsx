import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import EventPageContent from "@/components/EventPageContent";
import { domAnimation, LazyMotion } from "framer-motion";
import { ReactLenis } from "@/components/SmoothScrolling";

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

async function getEvent(slug: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Event;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.name} | E-Summit 2026`,
    description:
      event.description || `Join us for ${event.name} at E-Summit 2026`,
    openGraph: {
      type: "website",
      url: `/events/${slug}`,
      title: `${event.name} | E-Summit 2026`,
      description:
        event.description || `Join us for ${event.name} at E-Summit 2026`,
      images: event.image_url ? [event.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} | E-Summit 2026`,
      description:
        event.description || `Join us for ${event.name} at E-Summit 2026`,
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <ReactLenis
      options={{
        duration: 1.2,
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
      }}
      root
    >
      <div className="isolate bg-black text-white min-h-screen">
        <LazyMotion features={domAnimation}>
          <Navbar />

          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          </div>

          <main className="pt-20">
            <EventPageContent event={event} />
          </main>
          <FooterSection />
        </LazyMotion>
      </div>
    </ReactLenis>
  );
}
