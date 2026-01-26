import { requireAdminOrModerator } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ContactsDataTable } from "./_components/contacts-data-table";
import { createServiceClient } from "@/lib/supabase/server";

export default async function ContactsPage() {
  await connection();

  try {
    await requireAdminOrModerator();
  } catch (error) {
    console.error("Access denied:", error);
    redirect(
      `/auth/login?redirect=${encodeURIComponent("/admin/dashboard/contacts")}`,
    );
  }

  const supabase = await createServiceClient();

  const { data: contacts, error } = await supabase
    .from("contact_us")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts:", error);
    return (
      <div className="@container/main flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contact Submissions
          </h1>
          <p className="text-destructive mt-2">
            Error loading contacts: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contact Submissions
        </h1>
        <p className="text-muted-foreground mt-2">
          View all contact form submissions ({contacts?.length || 0} total)
        </p>
      </div>
      <ContactsDataTable contacts={contacts || []} />
    </div>
  );
}
