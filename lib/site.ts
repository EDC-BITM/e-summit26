export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // fall through
    }
  }

  // Safe fallback for local/dev; set NEXT_PUBLIC_SITE_URL in production.
  return new URL("http://localhost:3000");
}
