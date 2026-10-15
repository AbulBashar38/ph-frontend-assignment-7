"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthRedirect, useGoogleOAuth } from "@/hooks";
import type { GoogleLoginPayload, RegisterRole } from "@/types";
import { getErrorMessage, getErrorStatus } from "@/utils";
import GoogleRoleDialog from "./google-role-dialog";

// The backend answers 428 when a first-time Google user hasn't chosen a role yet
const ROLE_REQUIRED_STATUS = 428;

// Google sign-in. On sign-up the selected `role` is sent up front; elsewhere a brand-new Google user is asked
// for their role in a dialog and the same Google credential is sent again. Existing users just log in.
export default function GoogleLoginButton({ role }: { role?: RegisterRole }) {
  const redirectAfterAuth = useAuthRedirect();
  const { mutate: googleLogin, isPending } = useGoogleOAuth();
  const [pendingCredential, setPendingCredential] = useState<string | null>(
    null,
  );

  // The Google provider is only mounted when a client ID is configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const signIn = (payload: GoogleLoginPayload) => {
    googleLogin(payload, {
      onSuccess: (res) => {
        setPendingCredential(null);
        toast.success(res.message);
        redirectAfterAuth(res.data.user);
      },
      onError: (error) => {
        if (getErrorStatus(error) === ROLE_REQUIRED_STATUS) {
          setPendingCredential(payload.idToken);
          return;
        }
        setPendingCredential(null);
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleSuccess = ({ credential }: { credential?: string }) => {
    if (!credential) {
      toast.error("Google sign-in failed. Please try again");
      return;
    }
    signIn({ idToken: credential, role });
  };

  return (
    <>
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

      <GoogleRoleDialog
        open={pendingCredential !== null}
        pending={isPending}
        onCancel={() => setPendingCredential(null)}
        onConfirm={(chosenRole) =>
          pendingCredential &&
          signIn({ idToken: pendingCredential, role: chosenRole })
        }
      />
    </>
  );
}
