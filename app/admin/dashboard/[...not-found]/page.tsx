"use client";

export default function DashboardNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">404: Page Not Found</h1>
      <p className="text-muted-foreground">
        This page has disappeared, maybe it went on vacation! 🏖️
      </p>
      <p className="text-xs text-muted-foreground/60">
        404 means: 4 days passed, 0 found, 4 more days to search! 😄
      </p>
    </div>
  );
}
