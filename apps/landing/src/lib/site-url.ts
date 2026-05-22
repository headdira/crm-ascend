export function getSiteUrl(): string {
  const fromMeta = import.meta.env.PUBLIC_APP_URL ?? import.meta.env.NEXT_PUBLIC_APP_URL;
  if (fromMeta) return fromMeta;
  if (typeof process !== "undefined") {
    return process.env.PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }
  return "http://localhost:3000";
}
