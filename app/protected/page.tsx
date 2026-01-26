// app/protected/page.tsx
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

function deriveDisplayName(user: any) {
  const md = user?.user_metadata ?? {};
  const raw =
    md.full_name ||
    md.name ||
    md.user_name ||
    md.preferred_username ||
    md.email;

  if (typeof raw === "string" && raw.trim()) return raw.trim();

  const email = user?.email ?? "";
  if (email.includes("@")) return email.split("@")[0];
  return "Participant";
}

export default async function ProtectedPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) redirect("/auth/login?redirect=/protected");

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select(
      "id, roll_no, phone, branch, whatsapp_no, onboarding_completed, created_at, updated_at",
    )
    .eq("id", user.id)
    .single();

  if (profileErr || !profile || !profile.onboarding_completed) {
    redirect("/auth/onboarding?redirect=/protected");
  }

  const displayName = deriveDisplayName(user);

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email ?? "",
        displayName,
      }}
      profile={profile}
    />
  );
}
