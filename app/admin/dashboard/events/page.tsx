import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getAllEvents } from "@/lib/admin/queries";
import { redirect } from "next/navigation";
import { EventsDataTable } from "./_components/events-data-table";

export default async function EventsPage() {
  try {
    await requireAdminOrModerator();
  } catch (error) {
    redirect("/auth/login");
  }

  const events = await getAllEvents();

  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
        <p className="text-muted-foreground mt-2">
          View all events and manage team registrations and results
        </p>
      </div>

      <EventsDataTable events={events} />
    </div>
  );
}
