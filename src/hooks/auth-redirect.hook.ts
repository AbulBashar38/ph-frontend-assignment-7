import { useSearchParams } from "next/navigation";
import type { User } from "@/types";
import { getPostLoginPath } from "@/utils";

// After any successful sign-in (password, demo, Google, OTP), go to ?redirect or the user's dashboard.
// A full page load on purpose: Next's client router cache still holds what the signed-out visitor was served
// (for example a prefetched /owner that proxy.ts redirected to /login), and reusing it would leave the new
// user on the login page with the dashboard URL. Signing in is the one moment every cached page is stale.
export function useAuthRedirect() {
  const searchParams = useSearchParams();

  return (user: Pick<User, "role">) => {
    window.location.assign(
      getPostLoginPath(user.role, searchParams.get("redirect")),
    );
  };
}
