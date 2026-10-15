import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils";
import { useLogout } from "./auth.hook";

// Areas that need a session; leaving them is the only time logout navigates
const PROTECTED_AREAS = ["/dashboard", "/owner", "/admin", "/payment"];

// Logout with feedback: calls the API, clears the cached session, and leaves protected pages for /login
export function useLogoutAction() {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate, isPending } = useLogout();

  const logout = (onDone?: () => void) => {
    mutate(undefined, {
      onSuccess: (res) => {
        toast.success(res.message);
        onDone?.();
        if (PROTECTED_AREAS.some((area) => pathname.startsWith(area))) {
          router.replace("/login");
        }
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return { logout, isLoggingOut: isPending };
}
