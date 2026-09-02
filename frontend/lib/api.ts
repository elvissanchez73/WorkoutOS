import { headers } from "next/headers";

export async function getApiUrl(path: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const baseUrl = host ? `${protocol}://${host}` : "http://127.0.0.1:3000";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}/api${normalizedPath}`;
}