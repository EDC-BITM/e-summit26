import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getAllUsers } from "@/lib/admin/data-queries";
import { redirect } from "next/navigation";
import { UsersDataTable } from "./_components/users-data-table";

export default async function UsersPage() {
  try {
    await requireAdminOrModerator();
  } catch (error) {
    redirect("/auth/login");
  }

  const users = await getAllUsers();
  
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users
        </p>
      </div>

      <UsersDataTable users={users} />
    </div>
  );
}
