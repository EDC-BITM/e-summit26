import { requireAdminOrModerator } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { UsersDataTable } from "./_components/users-data-table";
import { getAllUsersWithDetails } from "./actions";
import { getCurrentUser } from "@/lib/admin/current-user";

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

  // Fetch users and current user role in parallel
  const [users, currentUser] = await Promise.all([
    getAllUsersWithDetails(),
    getCurrentUser(),
  ]);

  const currentUserRole = currentUser?.role || "user";

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
