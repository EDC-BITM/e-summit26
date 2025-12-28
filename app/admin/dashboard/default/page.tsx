import { SectionCards } from "./_components/section-cards";
import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getAdminStats } from "@/lib/admin/queries";
import { redirect } from "next/navigation";

export default async function Page() {
  try {
    await requireAdminOrModerator();
  } catch (error) {
    redirect("/auth/login");
  }

  const stats = await getAdminStats();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to E-Summit 2026 Admin Panel
        </p>
      </div>
      <SectionCards stats={stats} />
    </div>
  );
}
