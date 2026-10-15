"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuthRedirect, useGoogleOAuth } from "@/hooks";
import type { RegisterRole } from "@/types";
import { getErrorMessage } from "@/utils";

// Google sign-in. `role` only matters when this creates a new account (sign-up page); existing users keep theirs.
export default function GoogleLoginButton({ role }: { role?: RegisterRole }) {
  const redirectAfterAuth = useAuthRedirect();
  const { mutate: googleLogin } = useGoogleOAuth();

  // The Google provider is only mounted when a client ID is configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const handleSuccess = ({ credential }: { credential?: string }) => {
    if (!credential) {
      toast.error("Google sign-in failed. Please try again");
      return;
    }

    googleLogin(
      { idToken: credential, role },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          redirectAfterAuth(res.data.user);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <div className="flex justify-center [&_iframe]:mx-auto">
      <GoogleLogin
        theme="outline"
        shape="pill"
        size="large"
        width="320"
        text="continue_with"
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed. Please try again")}
      />
    </div>
  );
}
