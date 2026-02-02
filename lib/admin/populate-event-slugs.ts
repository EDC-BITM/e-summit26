import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/slug";

export async function populateEventSlugs() {
  const supabase = await createClient();

  // Fetch all events without a slug
  const { data: eventsWithoutSlug, error: fetchError } = await supabase
    .from("events")
    .select("id, name, slug")
    .is("slug", null);

  if (fetchError) {
    console.error("Error fetching events:", fetchError);
    return { success: false, error: fetchError.message };
  }

  if (!eventsWithoutSlug || eventsWithoutSlug.length === 0) {
    return { success: true, message: "All events already have slugs" };
  }

  const updates = [];
  const slugMap = new Map<string, number>();

  for (const event of eventsWithoutSlug) {
    let slug = generateSlug(event.name);
    
    // Handle duplicate slugs by appending a number
    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      slugMap.set(slug, 1);
    }

    updates.push(
      supabase
        .from("events")
        .update({ slug })
        .eq("id", event.id)
    );
  }

  // Execute all updates
  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Some updates failed:", errors);
    return {
      success: false,
      error: `${errors.length} updates failed`,
    };
  }

  return {
    success: true,
    message: `Successfully populated ${eventsWithoutSlug.length} event slugs`,
  };
}
