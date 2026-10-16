import { FetchError, type FetchOptions, ofetch } from "ofetch";

// Browser calls go through the same-origin /api/v1 rewrite (see next.config.ts); the server calls the backend directly
const BASE_URL =
  typeof window === "undefined"
    ? `${process.env.API_URL ?? "http://localhost:5050"}/api/v1`
    : "/api/v1";

// A 401 from these means bad credentials or an expired session, not an expired access token
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/google",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
];

const client = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// One refresh at a time: the backend treats a reused refresh token as theft and logs the user out everywhere
let refreshPromise: Promise<boolean> | null = null;

function refreshSession() {
  refreshPromise ??= client("/auth/refresh-token", { method: "POST" })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// Runs a call; on an expired access token, refreshes once and runs it again
async function withRefresh<T>(request: string, call: () => Promise<T>) {
  try {
    return await call();
  } catch (error) {
    const canRefresh =
      error instanceof FetchError &&
      error.statusCode === 401 &&
      !NO_REFRESH_PATHS.some((path) => request.startsWith(path));

    if (!canRefresh || !(await refreshSession())) {
      throw error;
    }

    return call();
  }
}

async function apiClient<T>(
  request: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  return withRefresh(request, () => client<T>(request, options));
}

// Binary responses such as PDF receipts
export function apiBlob(request: string): Promise<Blob> {
  return withRefresh(request, () => client(request, { responseType: "blob" }));
}

export default apiClient;
