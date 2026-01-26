import { requireAdminOrModerator } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { UsersDataTable } from "./_components/users-data-table";
import { getAllUsersWithDetails } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  await connection();

  try {
    await requireAdminOrModerator();
  } catch (error) {
    console.error("Access denied:", error);
    redirect(
      `/auth/login?redirect=${encodeURIComponent("/admin/dashboard/users")}`,
    );
  }

  const users = await getAllUsersWithDetails();

  // Get current user's role
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserRole = "user";
  if (user) {
    const { data: userRole } = await supabase
      .from("user_role")
      .select(
        `
        roles!inner (
          name
        )
      `,
      )
      .eq("user_id", user.id)
      .single();

    type Role = { name: string };
    currentUserRole =
      (userRole?.roles as unknown as Role | null)?.name || "user";
  }

  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users ({users.length} total)
        </p>
      </div>

      <UsersDataTable users={users} currentUserRole={currentUserRole} />
    </div>
  );
}
