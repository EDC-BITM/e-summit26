import { SectionCards } from "./_components/section-cards";
import { AnalyticsCharts } from "./_components/analytics-charts";
import { AdditionalMetrics } from "./_components/metrics-cards";
import { fetchAnalyticsData } from "./_components/fetch-analytics";
import { requireAdminOrModerator } from "@/lib/admin/auth";
import { getAdminStats } from "@/lib/admin/queries";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function Page() {
  await connection();

  try {
    await requireAdminOrModerator();
  } catch (error) {
    console.error("Access denied:", error);
    redirect(`/auth/login?redirect=${encodeURIComponent("/admin/dashboard")}`);
  }

  const stats = await getAdminStats();
  const analyticsData = await fetchAnalyticsData();

  return (
    <div className="@container/main w-full space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to E-Summit 2026 Admin Panel
        </p>
      </div>
      <SectionCards stats={stats} />
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Key Metrics
        </h2>
        <AdditionalMetrics
          stats={analyticsData.stats}
          eventRegistrationsByEvent={analyticsData.eventRegistrationsByEvent}
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Analytics & Insights
        </h2>
        <AnalyticsCharts {...analyticsData} />
      </div>
    </div>
  );
}
