"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";

export type EventFormData = {
  name: string;
  slug: string;
  category: string;
  description: string | null;
  max_score: number;
  date: string | null;
  location: string | null;
  image_url: string | null;
  doc: string | null;
  max_participants: number | null;
  min_team_size: number | null;
  max_team_size: number | null;
  is_active: boolean;
  whatsapp_group_link: string | null;
};

export async function createEvent(data: EventFormData) {
  try {
    await requireAdmin();

    const supabase = await createServiceClient();

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert({
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description,
        max_score: data.max_score,
        date: data.date || null,
        location: data.location || null,
        image_url: data.image_url || null,
        doc: data.doc || null,
        max_participants: data.max_participants || null,
        min_team_size: data.min_team_size ?? 2,
        max_team_size: data.max_team_size ?? 4,
        is_active: data.is_active,
        whatsapp_group_link: data.whatsapp_group_link || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/dashboard/events");
    return { success: true, data: newEvent };
  } catch (error) {
    console.error("Error in createEvent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

export async function updateEvent(id: string, data: EventFormData) {
  try {
    await requireAdmin();

    const supabase = await createServiceClient();

    const { data: updatedEvent, error } = await supabase
      .from("events")
      .update({
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description,
        max_score: data.max_score,
        date: data.date || null,
        location: data.location || null,
        image_url: data.image_url || null,
        doc: data.doc || null,
        max_participants: data.max_participants || null,
        min_team_size: data.min_team_size ?? 2,
        max_team_size: data.max_team_size ?? 4,
        is_active: data.is_active,
        whatsapp_group_link: data.whatsapp_group_link || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/dashboard/events");
    revalidatePath(`/admin/dashboard/events/${id}`);
    return { success: true, data: updatedEvent };
  } catch (error) {
    console.error("Error in updateEvent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

export async function deleteEvent(id: string) {
  try {
    await requireAdmin();

    const supabase = await createServiceClient();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}
