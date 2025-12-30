"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    const next = `${window.location.pathname}${window.location.search}`;
    router.push(`/auth/login?redirect=${encodeURIComponent(next)}`);
  };

  return <Button onClick={logout}>Logout</Button>;
}
