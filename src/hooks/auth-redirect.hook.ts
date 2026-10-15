import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@/types";
import { getPostLoginPath } from "@/utils";

// After any successful sign-in (password, demo, Google, OTP), go to ?redirect or the user's dashboard
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (user: Pick<User, "role">) => {
    router.replace(getPostLoginPath(user.role, searchParams.get("redirect")));
  };
}
