import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getAllRegistrations } from "@/lib/admin/data-queries";
import { redirect } from "next/navigation";
import { RegistrationsDataTable } from "./_components/registrations-data-table";

export default async function RegistrationsPage() {
  try {
    await requireAdminOrModerator();
  } catch {
    redirect("/auth/login");
  }

  const registrations = await getAllRegistrations();

  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Event Registrations
        </h1>
        <p className="text-muted-foreground mt-2">
          View all team registrations across all events
        </p>
      </div>

      <RegistrationsDataTable registrations={registrations} />
    </div>
  );
}
