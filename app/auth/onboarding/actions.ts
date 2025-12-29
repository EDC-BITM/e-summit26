"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkOnBoardingStatus(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return false;
    }

    const { data: onboardingData, error: onboardingError } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", data.user.id)
      .single();

    if (onboardingError) {
      console.error("Error fetching onboarding status:", onboardingError);
      return false;
    }

    return onboardingData?.onboarding_completed || false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
