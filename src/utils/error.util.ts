import { FetchError } from "ofetch";
import type { ApiErrorResponse } from "@/types";

// ofetch's own message is the URL and status text; the backend puts the readable reason in the body
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again",
) {
  if (error instanceof FetchError) {
    const data = error.data as Partial<ApiErrorResponse> | undefined;
    return data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

// HTTP status of a failed API call (undefined for network errors and non-HTTP errors)
export function getErrorStatus(error: unknown) {
  return error instanceof FetchError ? error.statusCode : undefined;
}
