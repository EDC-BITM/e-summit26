import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function  POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { event_id, team_id, presentation_url, product_photos_url, achievements } = body;

    if (!event_id || !team_id) {
      return NextResponse.json(
        { error: "Missing event_id or team_id" },
        { status: 400 }
      );
    }

    // Verify the team belongs to this event or is a general team (event_id is null)
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, event_id")
      .eq("id", team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // If the team has an event_id, it must match the event being registered for
    if (team.event_id && team.event_id !== event_id) {
      return NextResponse.json(
        { error: "This team is registered for a different event" },
        { status: 400 }
      );
    }

    // Verify the user is a member of the team
    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", team_id)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 403 }
      );
    }

    // Verify team has minimum required members (2-4)
    const { count } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("team_id", team_id)
      .eq("status", "accepted");

    if (!count || count < 2 || count > 4) {
      return NextResponse.json(
        { error: "Team must have 2-4 accepted members to register" },
        { status: 400 }
      );
    }

    // Insert the registration
    const { data, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id,
        team_id,
        user_id: user.id, // many schemas track who did the registration
        status: "confirmed", // default status
        registered_at: new Date().toISOString(),
        presentation_url,
        product_photos_url,
        achievements,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("[Registration] Insert Error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        payload: { event_id, team_id, user_id: user.id }
      });
      
      // Check for duplicate registration
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Team already registered for this event" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Registration failed: ${error.message}` },
        { status: 400 } // Use 400 if it's a DB constraint error
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[Registration] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
