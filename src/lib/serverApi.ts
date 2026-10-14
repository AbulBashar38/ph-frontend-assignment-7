import { cookies } from "next/headers";
import { type FetchOptions, ofetch } from "ofetch";

const API_URL = process.env.API_URL ?? "http://localhost:5050";
const BASE_URL = `${API_URL}/api/v1`;

export async function serverApi<T>(
  endpoint: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  let cookieHeader = "";
  try {
    const cookieStore = await cookies();
    cookieHeader = cookieStore.toString();
  } catch {
    // cookies() might fail outside request context, ignore safely
  }

  return ofetch<T>(
    `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`,
    {
      ...options,
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...options?.headers,
      },
    },
  );
}

export default serverApi;
